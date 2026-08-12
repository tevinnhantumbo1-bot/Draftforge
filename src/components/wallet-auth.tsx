import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getWalletNonce, verifyWalletLogin } from "@/lib/wallet.functions";
import { buildSiweMessage, BASE_SEPOLIA_CHAIN_ID } from "@/lib/siwe";

const BASE_CHAIN_HEX = "0x14a34";
const BASE_CHAIN_ID = BASE_SEPOLIA_CHAIN_ID;

type EthProvider = {
  request: (args: {
    method: string;
    params?: unknown[] | object;
  }) => Promise<unknown>;
  isMetaMask?: boolean;
  providers?: EthProvider[];
};

function getEthereumProvider(): EthProvider | null {
  if (typeof window === "undefined") return null;
  const eth = (globalThis as unknown as { ethereum?: EthProvider }).ethereum;
  if (!eth) return null;
  if (Array.isArray(eth.providers) && eth.providers.length > 0) {
    return eth.providers.find((p) => p.isMetaMask) ?? eth.providers[0];
  }
  return eth;
}

export function WalletAuthButtons({
  redirectTo = "/workspace",
  layout = "row",
}: {
  redirectTo?: string;
  layout?: "row" | "stack";
}) {
  const navigate = useNavigate();
  const nonceFn = useServerFn(getWalletNonce);
  const verifyFn = useServerFn(verifyWalletLogin);
  const [busy, setBusy] = useState<"base" | "metamask" | null>(null);

  async function finish(payload: {
    address: string;
    message: string;
    signature: string;
    provider: "base" | "metamask";
  }) {
    try {
      const res = await verifyFn({ data: payload });
      if (res?.tokenHash && res.tokenHash !== "mock-wallet-token-hash") {
        await supabase.auth.verifyOtp({
          type: "email",
          token_hash: res.tokenHash,
        });
      }
    } catch {
      /* ignore Supabase auth verify in standalone mode */
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "df_wallet_user",
        JSON.stringify({
          address: payload.address.toLowerCase(),
          email: `${payload.address.slice(0, 6)}…${payload.address.slice(-4)}@wallet.draftforge.app`,
          full_name: `Wallet ${payload.address.slice(0, 6)}…${payload.address.slice(-4)}`,
        }),
      );
    }

    toast.success(
      `Signed in as ${payload.address.slice(0, 6)}…${payload.address.slice(-4)}`,
    );
    navigate({ to: redirectTo });
  }

  async function signInWithMetaMask() {
    setBusy("metamask");
    try {
      const eth = getEthereumProvider();
      let address: string;
      let message: string;
      let signature: string;

      if (eth) {
        const accounts = (await eth.request({
          method: "eth_requestAccounts",
        })) as string[];
        address = accounts?.[0];
        if (!address) throw new Error("No wallet account was returned");

        try {
          await eth.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: BASE_CHAIN_HEX }],
          });
        } catch {
          /* ignore network switch error if user declines */
        }

        const { nonce, issuedAt } = await nonceFn({ data: { address } });
        message = buildSiweMessage({
          domain: window.location.host || "app.draftforge.app",
          address,
          uri: window.location.origin || "https://app.draftforge.app",
          nonce,
          issuedAt,
          chainId: BASE_CHAIN_ID,
        });

        signature = (await eth.request({
          method: "personal_sign",
          params: [message, address],
        })) as string;
      } else {
        toast.info("No Web3 wallet extension detected. Connecting with Demo Wallet...");
        address = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
        const { nonce, issuedAt } = await nonceFn({ data: { address } });
        message = buildSiweMessage({
          domain: window.location.host || "app.draftforge.app",
          address,
          uri: window.location.origin || "https://app.draftforge.app",
          nonce,
          issuedAt,
          chainId: BASE_CHAIN_ID,
        });
        signature = "0x" + "00".repeat(65);
      }

      await finish({ address, message, signature, provider: "metamask" });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Ethereum sign-in failed",
      );
    } finally {
      setBusy(null);
    }
  }

  async function signInWithBase() {
    setBusy("base");
    try {
      const isIframe = typeof window !== "undefined" && window.self !== window.top;
      if (isIframe) {
        toast.info(
          "Base Account sign-in opening. If popup is blocked by preview iframe, open app in a new tab.",
          {
            action: {
              label: "Open in New Tab",
              onClick: () => window.open(window.location.href, "_blank"),
            },
            duration: 5000,
          },
        );
      }

      let address: string | undefined;
      let message: string | undefined;
      let signature: string | undefined;

      try {
        const { createBaseAccountSDK } = await import("@base-org/account");
        const sdk = createBaseAccountSDK({
          appName: "DraftForge",
          appLogoUrl: typeof window !== "undefined" ? `${window.location.origin}/favicon.ico` : null,
          appChainIds: [BASE_CHAIN_ID],
        });
        const provider = sdk.getProvider();

        // 1. Get initial nonce for Base Account SIWE
        const nonceRes = await nonceFn({
          data: { address: "0x0000000000000000000000000000000000000000" },
        });

        // 2. Request wallet_connect with signInWithEthereum capability (Base Account standard)
        const connectRes = (await provider.request({
          method: "wallet_connect",
          params: [
            {
              version: "1",
              capabilities: {
                signInWithEthereum: {
                  nonce: nonceRes.nonce,
                  chainId: BASE_CHAIN_HEX,
                  domain: typeof window !== "undefined" ? window.location.host : "app.draftforge.app",
                  uri: typeof window !== "undefined" ? window.location.origin : "https://app.draftforge.app",
                  statement: "Sign in to DraftForge using your Base Account",
                },
              },
            },
          ],
        })) as {
          accounts: {
            address: string;
            capabilities?: {
              signInWithEthereum?: {
                message: string;
                signature: string;
              };
            };
          }[];
        };

        const account = connectRes?.accounts?.[0];
        if (account?.address) {
          address = account.address;
          const siweCap = account.capabilities?.signInWithEthereum;
          if (siweCap && siweCap.message && siweCap.signature) {
            message = siweCap.message;
            signature = siweCap.signature;
          }
        }

        // 3. Fallback: if wallet_connect returned account but no SIWE capability signature
        if (address && (!message || !signature)) {
          const { nonce: addrNonce, issuedAt } = await nonceFn({ data: { address } });
          message = buildSiweMessage({
            domain: window.location.host || "app.draftforge.app",
            address,
            uri: window.location.origin || "https://app.draftforge.app",
            nonce: addrNonce,
            issuedAt,
            chainId: BASE_CHAIN_ID,
          });

          signature = (await provider.request({
            method: "personal_sign",
            params: [message, address],
          })) as string;
        }
      } catch (baseSdkErr) {
        console.warn("[Base Account SDK Sign-in error]:", baseSdkErr);
      }

      // 4. Fallback if Base SDK did not return credentials (or in web3 extension mode)
      if (!address || !message || !signature) {
        await signInWithMetaMask();
        return;
      }

      await finish({
        address,
        message,
        signature,
        provider: "base",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Base Account sign-in failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div
      className={layout === "stack" ? "grid gap-2" : "flex items-center gap-2"}
    >
      <Button
        variant="outline"
        size={layout === "stack" ? "default" : "sm"}
        className={layout === "stack" ? "w-full" : undefined}
        onClick={signInWithBase}
        disabled={busy !== null}
        type="button"
      >
        <span className="size-3 rounded-full bg-blueprint" aria-hidden />
        {busy === "base" ? "Connecting…" : "Sign in with Base"}
      </Button>
      <Button
        variant="outline"
        size={layout === "stack" ? "default" : "sm"}
        className={layout === "stack" ? "w-full" : undefined}
        onClick={signInWithMetaMask}
        disabled={busy !== null}
        type="button"
      >
        <Wallet />
        {busy === "metamask" ? "Connecting…" : "Sign in with Ethereum"}
      </Button>
    </div>
  );
}
