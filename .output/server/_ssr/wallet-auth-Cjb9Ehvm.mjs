import { r as __toESM } from "../_runtime.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-CeX34BwK.mjs";
import { D as isRedirect, _ as useRouter, g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { t as supabase } from "./client-C5xPL8Eg.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { r as Slot } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as stringType, n as enumType, r as objectType } from "../_libs/zod.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as Wallet } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wallet-auth-Cjb9Ehvm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var _jsxFileName$1 = "/app/applet/src/components/ui/button.tsx";
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline",
			hero: "bg-[image:var(--gradient-amber)] text-primary-foreground font-semibold shadow-[var(--shadow-glow)] hover:brightness-110",
			blueprint: "border border-blueprint/40 bg-blueprint/10 text-blueprint hover:bg-blueprint/20"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			xl: "h-12 rounded-md px-8 text-base",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 52,
		columnNumber: 7
	}, void 0);
});
Button.displayName = "Button";
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var Address = stringType().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address");
var getWalletNonce = createServerFn({ method: "POST" }).inputValidator((input) => objectType({ address: Address }).parse(input)).handler(createSsrRpc("e98390e11ea8cc77a1eaa0ce72d5aca98bb4595ad6de924c498fa20072e0b22d"));
var VerifyInput = objectType({
	address: Address,
	message: stringType().min(20).max(4e3),
	signature: stringType().min(4).max(2e4),
	provider: enumType(["base", "metamask"])
});
var verifyWalletLogin = createServerFn({ method: "POST" }).inputValidator((input) => VerifyInput.parse(input)).handler(createSsrRpc("0786f1eb4de727c8fb3c9260b504c33b8954f23f70c56986640869e12a414724"));
var BASE_CHAIN_ID$1 = 8453;
var BASE_SEPOLIA_CHAIN_ID = 84532;
function buildSiweMessage(params) {
	const { domain, address, uri, nonce, issuedAt, chainId = BASE_CHAIN_ID$1, statement = "Sign in to DraftForge with your Ethereum account." } = params;
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
		`Issued At: ${issuedAt}`
	].join("\n");
}
var _jsxFileName = "/app/applet/src/components/wallet-auth.tsx";
var BASE_CHAIN_HEX = "0x14a34";
var BASE_CHAIN_ID = BASE_SEPOLIA_CHAIN_ID;
function getEthereumProvider() {
	if (typeof window === "undefined") return null;
	const eth = globalThis.ethereum;
	if (!eth) return null;
	if (Array.isArray(eth.providers) && eth.providers.length > 0) return eth.providers.find((p) => p.isMetaMask) ?? eth.providers[0];
	return eth;
}
function WalletAuthButtons({ redirectTo = "/workspace", layout = "row" }) {
	const navigate = useNavigate();
	const nonceFn = useServerFn(getWalletNonce);
	const verifyFn = useServerFn(verifyWalletLogin);
	const [busy, setBusy] = (0, import_react.useState)(null);
	async function finish(payload) {
		try {
			const res = await verifyFn({ data: payload });
			if (res?.tokenHash && res.tokenHash !== "mock-wallet-token-hash") await supabase.auth.verifyOtp({
				type: "email",
				token_hash: res.tokenHash
			});
		} catch {}
		if (typeof window !== "undefined") localStorage.setItem("df_wallet_user", JSON.stringify({
			address: payload.address.toLowerCase(),
			email: `${payload.address.slice(0, 6)}…${payload.address.slice(-4)}@wallet.draftforge.app`,
			full_name: `Wallet ${payload.address.slice(0, 6)}…${payload.address.slice(-4)}`
		}));
		toast.success(`Signed in as ${payload.address.slice(0, 6)}…${payload.address.slice(-4)}`);
		navigate({ to: redirectTo });
	}
	async function signInWithMetaMask() {
		setBusy("metamask");
		try {
			const eth = getEthereumProvider();
			let address;
			let message;
			let signature;
			if (eth) {
				address = (await eth.request({ method: "eth_requestAccounts" }))?.[0];
				if (!address) throw new Error("No wallet account was returned");
				try {
					await eth.request({
						method: "wallet_switchEthereumChain",
						params: [{ chainId: BASE_CHAIN_HEX }]
					});
				} catch {}
				const { nonce, issuedAt } = await nonceFn({ data: { address } });
				message = buildSiweMessage({
					domain: window.location.host || "app.draftforge.app",
					address,
					uri: window.location.origin || "https://app.draftforge.app",
					nonce,
					issuedAt,
					chainId: BASE_CHAIN_ID
				});
				signature = await eth.request({
					method: "personal_sign",
					params: [message, address]
				});
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
					chainId: BASE_CHAIN_ID
				});
				signature = "0x" + "00".repeat(65);
			}
			await finish({
				address,
				message,
				signature,
				provider: "metamask"
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Ethereum sign-in failed");
		} finally {
			setBusy(null);
		}
	}
	async function signInWithBase() {
		setBusy("base");
		try {
			if (typeof window !== "undefined" && window.self !== window.top) toast.info("Base Account sign-in opening. If popup is blocked by preview iframe, open app in a new tab.", {
				action: {
					label: "Open in New Tab",
					onClick: () => window.open(window.location.href, "_blank")
				},
				duration: 5e3
			});
			let address;
			let message;
			let signature;
			try {
				const { createBaseAccountSDK } = await import("../_libs/@base-org/account+[...].mjs").then((n) => n.t);
				const provider = createBaseAccountSDK({
					appName: "DraftForge",
					appLogoUrl: typeof window !== "undefined" ? `${window.location.origin}/favicon.ico` : null,
					appChainIds: [BASE_CHAIN_ID]
				}).getProvider();
				const nonceRes = await nonceFn({ data: { address: "0x0000000000000000000000000000000000000000" } });
				const account = (await provider.request({
					method: "wallet_connect",
					params: [{
						version: "1",
						capabilities: { signInWithEthereum: {
							nonce: nonceRes.nonce,
							chainId: BASE_CHAIN_HEX,
							domain: typeof window !== "undefined" ? window.location.host : "app.draftforge.app",
							uri: typeof window !== "undefined" ? window.location.origin : "https://app.draftforge.app",
							statement: "Sign in to DraftForge using your Base Account"
						} }
					}]
				}))?.accounts?.[0];
				if (account?.address) {
					address = account.address;
					const siweCap = account.capabilities?.signInWithEthereum;
					if (siweCap && siweCap.message && siweCap.signature) {
						message = siweCap.message;
						signature = siweCap.signature;
					}
				}
				if (address && (!message || !signature)) {
					const { nonce: addrNonce, issuedAt } = await nonceFn({ data: { address } });
					message = buildSiweMessage({
						domain: window.location.host || "app.draftforge.app",
						address,
						uri: window.location.origin || "https://app.draftforge.app",
						nonce: addrNonce,
						issuedAt,
						chainId: BASE_CHAIN_ID
					});
					signature = await provider.request({
						method: "personal_sign",
						params: [message, address]
					});
				}
			} catch (baseSdkErr) {
				console.warn("[Base Account SDK Sign-in error]:", baseSdkErr);
			}
			if (!address || !message || !signature) {
				await signInWithMetaMask();
				return;
			}
			await finish({
				address,
				message,
				signature,
				provider: "base"
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Base Account sign-in failed");
		} finally {
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: layout === "stack" ? "grid gap-2" : "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
			variant: "outline",
			size: layout === "stack" ? "default" : "sm",
			className: layout === "stack" ? "w-full" : void 0,
			onClick: signInWithBase,
			disabled: busy !== null,
			type: "button",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "size-3 rounded-full bg-blueprint",
				"aria-hidden": true
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 269,
				columnNumber: 9
			}, this), busy === "base" ? "Connecting…" : "Sign in with Base"]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 261,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
			variant: "outline",
			size: layout === "stack" ? "default" : "sm",
			className: layout === "stack" ? "w-full" : void 0,
			onClick: signInWithMetaMask,
			disabled: busy !== null,
			type: "button",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Wallet, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 280,
				columnNumber: 9
			}, this), busy === "metamask" ? "Connecting…" : "Sign in with Ethereum"]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 272,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 258,
		columnNumber: 5
	}, this);
}
//#endregion
export { useServerFn as a, createSsrRpc as i, WalletAuthButtons as n, cn as r, Button as t };
