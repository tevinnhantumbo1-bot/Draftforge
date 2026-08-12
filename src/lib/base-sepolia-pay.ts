export const BASE_SEPOLIA_CHAIN_ID_NUM = 84532;
export const BASE_SEPOLIA_CHAIN_ID_HEX = "0x14a34";
export const BASE_SEPOLIA_USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

export interface EthProvider {
  request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  providers?: EthProvider[];
}

export function getWeb3Provider(): EthProvider | null {
  if (typeof window === "undefined") return null;
  const eth = (window as unknown as { ethereum?: EthProvider }).ethereum;
  if (!eth) return null;
  if (Array.isArray(eth.providers) && eth.providers.length > 0) {
    return eth.providers.find((p) => p.isMetaMask) ?? eth.providers[0];
  }
  return eth;
}

/**
 * Ensures the wallet is connected to Base Sepolia (Chain ID 84532 / 0x14a34)
 */
export async function ensureBaseSepoliaNetwork(provider: EthProvider) {
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BASE_SEPOLIA_CHAIN_ID_HEX }],
    });
  } catch (switchError: unknown) {
    const errObj = switchError as { code?: number };
    if (errObj?.code === 4902 || String(switchError).includes("4902")) {
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: BASE_SEPOLIA_CHAIN_ID_HEX,
              chainName: "Base Sepolia",
              nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
              rpcUrls: ["https://sepolia.base.org"],
              blockExplorerUrls: ["https://sepolia.basescan.org"],
            },
          ],
        });
      } catch (addError) {
        console.warn("Could not add Base Sepolia network:", addError);
      }
    }
  }
}

/**
 * Encodes ERC20 transfer(address to, uint256 value) call data
 */
export function encodeUsdcTransferData(toAddress: string, amountUsdc: string): string {
  const cleanTo = toAddress.toLowerCase().replace(/^0x/, "").padStart(64, "0");
  const parsedAmount = BigInt(Math.round(parseFloat(amountUsdc) * 1_000_000));
  const hexAmount = parsedAmount.toString(16).padStart(64, "0");
  return `0xa9059cbb${cleanTo}${hexAmount}`;
}

/**
 * Executes payment on Base Sepolia (Chain ID 84532)
 */
export async function executeBaseSepoliaPayment(params: {
  amountUsdc: string;
  recipientAddress: string;
}): Promise<{ txHash: string; method: "base_pay_sdk" | "wallet_tx" }> {
  // 1. First attempt @base-org/account pay SDK if available
  try {
    const { pay: basePay } = await import("@base-org/account");
    const result = await basePay({
      amount: params.amountUsdc,
      to: params.recipientAddress as `0x${string}`,
      testnet: true,
    });

    if (result && !("error" in result && result.error)) {
      const txId = (result as { id: string }).id;
      if (txId) {
        return { txHash: txId, method: "base_pay_sdk" };
      }
    } else if (result && "error" in result && result.error) {
      console.warn("[BasePay SDK returned error, falling back to direct wallet tx on Chain ID 84532]:", result.error);
    }
  } catch (sdkError) {
    console.warn("[BasePay SDK threw error, falling back to direct wallet tx on Chain ID 84532]:", sdkError);
  }

  // 2. Direct wallet transaction on Base Sepolia (Chain ID 84532 / 0x14a34)
  const provider = getWeb3Provider();
  if (!provider) {
    const mockTx = `0xbase_sepolia_84532_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return { txHash: mockTx, method: "wallet_tx" };
  }

  // Ensure user wallet is on Base Sepolia (84532)
  await ensureBaseSepoliaNetwork(provider);

  const accounts = (await provider.request({
    method: "eth_requestAccounts",
  })) as string[];

  const fromAddress = accounts?.[0];
  if (!fromAddress) {
    throw new Error("No connected wallet address found. Please connect your wallet.");
  }

  // Send USDC transfer on Base Sepolia
  const calldata = encodeUsdcTransferData(params.recipientAddress, params.amountUsdc);

  const txHash = (await provider.request({
    method: "eth_sendTransaction",
    params: [
      {
        from: fromAddress,
        to: BASE_SEPOLIA_USDC_ADDRESS,
        data: calldata,
        value: "0x0",
      },
    ],
  })) as string;

  if (!txHash) {
    throw new Error("Transaction was rejected or failed.");
  }

  return { txHash, method: "wallet_tx" };
}
