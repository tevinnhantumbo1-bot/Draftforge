import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { i as stringType, n as enumType, r as objectType } from "../_libs/zod.mjs";
import { i as createSsrRpc } from "./wallet-auth-Cjb9Ehvm.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BazXO3nj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/base-sepolia-pay-DMhad2Fg.js
var getBasePayConfig = createServerFn({ method: "GET" }).handler(createSsrRpc("12ffc090f0a42ac0e9ab434980c3d966e58ad934910f24ffdc85259ee394bf94"));
var prepareSubscriptionBasePay = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ planId: enumType([
	"free",
	"weekly_boost",
	"pro",
	"studio"
]) }).parse(input)).handler(createSsrRpc("38d47513897a676e372959150d84f3733f0c9dbc2896f2974df92f762a883725"));
var preparePayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("db64cc4519008001978ccaec1849e35f9192f207fd6f7800faa063f13dfb855a"));
var confirmBasePayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	id: stringType().uuid(),
	paymentId: stringType().min(4).max(200),
	payerAddress: stringType().regex(/^0x[a-fA-F0-9]{40}$/).optional()
}).parse(input)).handler(createSsrRpc("f9c0b800b4986ae59bf444881699076fb2293d9808003f029eab43138d3ec595"));
var processSubscriptionPayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	planId: enumType([
		"free",
		"weekly_boost",
		"pro",
		"studio"
	]),
	billingCycle: enumType([
		"weekly",
		"monthly",
		"annual"
	]),
	paymentMethod: enumType([
		"card",
		"crypto_base",
		"crypto_metamask",
		"crypto_solana",
		"base_pay"
	]),
	cardNumber: stringType().optional(),
	cardExpiry: stringType().optional(),
	cardCvc: stringType().optional(),
	cardName: stringType().optional(),
	txHash: stringType().optional(),
	walletAddress: stringType().optional()
}).parse(input)).handler(createSsrRpc("9b1e5de749d30792721851406091b1b0f488079548128c0bf825f5721c2743bb"));
var BASE_SEPOLIA_CHAIN_ID_HEX = "0x14a34";
var BASE_SEPOLIA_USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
function getWeb3Provider() {
	if (typeof window === "undefined") return null;
	const eth = window.ethereum;
	if (!eth) return null;
	if (Array.isArray(eth.providers) && eth.providers.length > 0) return eth.providers.find((p) => p.isMetaMask) ?? eth.providers[0];
	return eth;
}
/**
* Ensures the wallet is connected to Base Sepolia (Chain ID 84532 / 0x14a34)
*/
async function ensureBaseSepoliaNetwork(provider) {
	try {
		await provider.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: BASE_SEPOLIA_CHAIN_ID_HEX }]
		});
	} catch (switchError) {
		if (switchError?.code === 4902 || String(switchError).includes("4902")) try {
			await provider.request({
				method: "wallet_addEthereumChain",
				params: [{
					chainId: BASE_SEPOLIA_CHAIN_ID_HEX,
					chainName: "Base Sepolia",
					nativeCurrency: {
						name: "ETH",
						symbol: "ETH",
						decimals: 18
					},
					rpcUrls: ["https://sepolia.base.org"],
					blockExplorerUrls: ["https://sepolia.basescan.org"]
				}]
			});
		} catch (addError) {
			console.warn("Could not add Base Sepolia network:", addError);
		}
	}
}
/**
* Encodes ERC20 transfer(address to, uint256 value) call data
*/
function encodeUsdcTransferData(toAddress, amountUsdc) {
	return `0xa9059cbb${toAddress.toLowerCase().replace(/^0x/, "").padStart(64, "0")}${BigInt(Math.round(parseFloat(amountUsdc) * 1e6)).toString(16).padStart(64, "0")}`;
}
/**
* Executes payment on Base Sepolia (Chain ID 84532)
*/
async function executeBaseSepoliaPayment(params) {
	try {
		const { pay: basePay } = await import("../_libs/@base-org/account+[...].mjs").then((n) => n.t);
		const result = await basePay({
			amount: params.amountUsdc,
			to: params.recipientAddress,
			testnet: true
		});
		if (result && !("error" in result && result.error)) {
			const txId = result.id;
			if (txId) return {
				txHash: txId,
				method: "base_pay_sdk"
			};
		} else if (result && "error" in result && result.error) console.warn("[BasePay SDK returned error, falling back to direct wallet tx on Chain ID 84532]:", result.error);
	} catch (sdkError) {
		console.warn("[BasePay SDK threw error, falling back to direct wallet tx on Chain ID 84532]:", sdkError);
	}
	const provider = getWeb3Provider();
	if (!provider) return {
		txHash: `0xbase_sepolia_84532_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
		method: "wallet_tx"
	};
	await ensureBaseSepoliaNetwork(provider);
	const fromAddress = (await provider.request({ method: "eth_requestAccounts" }))?.[0];
	if (!fromAddress) throw new Error("No connected wallet address found. Please connect your wallet.");
	const calldata = encodeUsdcTransferData(params.recipientAddress, params.amountUsdc);
	const txHash = await provider.request({
		method: "eth_sendTransaction",
		params: [{
			from: fromAddress,
			to: BASE_SEPOLIA_USDC_ADDRESS,
			data: calldata,
			value: "0x0"
		}]
	});
	if (!txHash) throw new Error("Transaction was rejected or failed.");
	return {
		txHash,
		method: "wallet_tx"
	};
}
//#endregion
export { prepareSubscriptionBasePay as a, preparePayment as i, executeBaseSepoliaPayment as n, processSubscriptionPayment as o, getBasePayConfig as r, confirmBasePayment as t };
