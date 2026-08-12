export const BASE_CHAIN_ID = 8453;
export const BASE_SEPOLIA_CHAIN_ID = 84532;

export function buildSiweMessage(params: {
  domain: string;
  address: string;
  uri: string;
  nonce: string;
  issuedAt: string;
  chainId?: number;
  statement?: string;
}) {
  const {
    domain,
    address,
    uri,
    nonce,
    issuedAt,
    chainId = BASE_CHAIN_ID,
    statement = "Sign in to DraftForge with your Ethereum account.",
  } = params;
  return [
    `${domain} wants you to sign in with your Ethereum account:`,
    address,
    "",
    statement,
    "",
    `URI: ${uri}`,
    "Version: 1",
    `Chain ID: ${chainId}`,
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
  ].join("\n");
}
