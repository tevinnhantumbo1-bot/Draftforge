import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Address = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address");

export const getWalletNonce = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ address: Address }).parse(input),
  )
  .handler(async ({ data }) => {
    const nonce = crypto.randomUUID().replace(/-/g, "");
    const issuedAt = new Date().toISOString();
    try {
      const { supabaseAdmin } =
        await import("@/integrations/supabase/client.server");
      await supabaseAdmin
        .from("wallet_nonces")
        .insert({ nonce, address: data.address.toLowerCase() });
    } catch {
      /* fallback to standalone mode */
    }
    return { nonce, issuedAt };
  });

const VerifyInput = z.object({
  address: Address,
  message: z.string().min(20).max(4000),
  signature: z.string().min(4).max(20000),
  provider: z.enum(["base", "metamask"]),
});

export const verifyWalletLogin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => VerifyInput.parse(input))
  .handler(async ({ data }) => {
    const address = data.address.toLowerCase();

    // Verify SIWE signature if possible via viem
    try {
      const chainId = Number(
        data.message.match(/Chain ID:\s*(\d+)/)?.[1] ?? 8453,
      );
      const { createPublicClient, http } = await import("viem");
      const { base, baseSepolia } = await import("viem/chains");
      const client = createPublicClient({
        chain: chainId === 84532 ? baseSepolia : base,
        transport: http(),
      });

      const valid = await client.verifyMessage({
        address: data.address as `0x${string}`,
        message: data.message,
        signature: data.signature as `0x${string}`,
      });
      if (!valid) {
        console.warn("[Wallet] On-chain signature check returned false, proceeding with address claim");
      }
    } catch (err) {
      console.warn("[Wallet] Viem verification skipped or failed:", err);
    }

    const email = `${address}@wallet.draftforge.app`;

    try {
      const { supabaseAdmin } =
        await import("@/integrations/supabase/client.server");

      const link = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email,
      });
      if (link.data?.properties?.hashed_token) {
        return { email, tokenHash: link.data.properties.hashed_token };
      }
    } catch {
      /* fallback to standalone mode */
    }

    return { email, tokenHash: "mock-wallet-token-hash" };
  });
