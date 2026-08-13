import { r as __toESM } from "../_runtime.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { C as ArrowRight, S as Box, _ as CircleCheck, g as CircleQuestionMark, l as Lock, m as Copy, n as Wallet, o as RefreshCw, p as CreditCard, r as Sparkles, t as Zap, x as Check } from "../_libs/lucide-react.mjs";
import { a as useServerFn, r as cn, t as Button } from "./wallet-auth-Cjb9Ehvm.mjs";
import { n as Label, t as Input } from "./label-C5FLLBhf.mjs";
import { SUBSCRIPTION_PLANS } from "./pricing-iHp73A5v.mjs";
import { t as SiteHeader } from "./site-header-BfayvmgK.mjs";
import { a as prepareSubscriptionBasePay, n as executeBaseSepoliaPayment, o as processSubscriptionPayment } from "./base-sepolia-pay-DMhad2Fg.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/subscription-C_uKztEW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/ui/tabs.tsx";
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 12,
	columnNumber: 3
}, void 0));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 27,
	columnNumber: 3
}, void 0));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 42,
	columnNumber: 3
}, void 0));
TabsContent.displayName = Content.displayName;
var _jsxFileName = "/app/applet/src/routes/subscription.tsx?tsr-split=component";
function SubscriptionPage() {
	useNavigate();
	const processPayment = useServerFn(processSubscriptionPayment);
	const prepSubBasePay = useServerFn(prepareSubscriptionBasePay);
	const MERCHANT_RECEIVING_ADDRESS = "0x316522d36C3AB060836df6331751ebDAaE25FAC6";
	const [billingCycle, setBillingCycle] = (0, import_react.useState)("weekly");
	const [activeSub, setActiveSub] = (0, import_react.useState)(null);
	const [walletAddress, setWalletAddress] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") {
			const storedSub = localStorage.getItem("df_user_subscription");
			if (storedSub) try {
				setActiveSub(JSON.parse(storedSub));
			} catch {}
			const storedWallet = localStorage.getItem("df_wallet_user");
			if (storedWallet) try {
				const w = JSON.parse(storedWallet);
				if (w.address) setWalletAddress(w.address);
			} catch {}
		}
	}, []);
	const [selectedPlan, setSelectedPlan] = (0, import_react.useState)(null);
	const [paymentType, setPaymentType] = (0, import_react.useState)("crypto");
	const [cryptoNetwork, setCryptoNetwork] = (0, import_react.useState)("base_sepolia_usdc");
	const [cardNumber, setCardNumber] = (0, import_react.useState)("");
	const [cardExpiry, setCardExpiry] = (0, import_react.useState)("");
	const [cardCvc, setCardCvc] = (0, import_react.useState)("");
	const [cardName, setCardName] = (0, import_react.useState)("");
	const [isProcessing, setIsProcessing] = (0, import_react.useState)(false);
	const [copiedAddress, setCopiedAddress] = (0, import_react.useState)(false);
	function handleOpenCheckout(plan) {
		if (plan.id === "free") {
			toast.info("You are currently on the Free Test plan (2 daily prompts).");
			return;
		}
		setSelectedPlan(plan);
	}
	async function handleBasePayCheckout() {
		if (!selectedPlan) return;
		setIsProcessing(true);
		toast.info("Triggering Base Sepolia payment (Chain ID: 84532)...");
		try {
			const quote = await prepSubBasePay({ data: { planId: selectedPlan.id } });
			const paymentTxId = (await executeBaseSepoliaPayment({
				amountUsdc: quote.amount,
				recipientAddress: quote.to
			})).txHash;
			const cycle = selectedPlan.interval === "week" ? "weekly" : billingCycle;
			const result = await processPayment({ data: {
				planId: selectedPlan.id,
				billingCycle: cycle,
				paymentMethod: "base_pay",
				txHash: paymentTxId,
				walletAddress: walletAddress || MERCHANT_RECEIVING_ADDRESS
			} });
			const subInfo = {
				planId: selectedPlan.id,
				billingCycle: cycle,
				paymentMethod: "base_pay",
				expiresAt: result.expiresAt,
				txHash: paymentTxId,
				subscribedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			if (typeof window !== "undefined") localStorage.setItem("df_user_subscription", JSON.stringify(subInfo));
			setActiveSub(subInfo);
			toast.success(`Subscription activated! Paid $${quote.amount} USDC on Base Sepolia. You now have 5 daily CAD requests for 1 week.`);
			setSelectedPlan(null);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Base Sepolia payment failed. Please try again.");
		} finally {
			setIsProcessing(false);
		}
	}
	async function handleConfirmSubscription(e) {
		e.preventDefault();
		if (!selectedPlan) return;
		if (paymentType === "crypto" && cryptoNetwork === "base_sepolia_usdc") return handleBasePayCheckout();
		setIsProcessing(true);
		try {
			const pMethod = paymentType === "card" ? "card" : cryptoNetwork === "solana_usdc" ? "crypto_solana" : "crypto_base";
			const cycle = selectedPlan.interval === "week" ? "weekly" : billingCycle;
			const result = await processPayment({ data: {
				planId: selectedPlan.id,
				billingCycle: cycle,
				paymentMethod: pMethod,
				cardNumber: cardNumber || void 0,
				cardExpiry: cardExpiry || void 0,
				cardCvc: cardCvc || void 0,
				cardName: cardName || void 0,
				walletAddress: walletAddress || void 0
			} });
			const subInfo = {
				planId: selectedPlan.id,
				billingCycle: cycle,
				paymentMethod: pMethod,
				expiresAt: result.expiresAt,
				txHash: result.txHash,
				subscribedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			if (typeof window !== "undefined") localStorage.setItem("df_user_subscription", JSON.stringify(subInfo));
			setActiveSub(subInfo);
			toast.success(`Successfully subscribed to ${selectedPlan.name}!`);
			setSelectedPlan(null);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Payment failed. Please try again.");
		} finally {
			setIsProcessing(false);
		}
	}
	function handleCopyMerchantAddress() {
		navigator.clipboard.writeText(MERCHANT_RECEIVING_ADDRESS);
		setCopiedAddress(true);
		toast.success("Payments receiving address copied!");
		setTimeout(() => setCopiedAddress(false), 2e3);
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen pb-20",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SiteHeader, { signedIn: !!walletAddress || !!activeSub }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 178,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-center max-w-3xl mx-auto space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-blueprint/30 bg-blueprint/10 px-3 py-1 text-xs font-mono text-blueprint",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "size-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 184,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "DraftForge Subscriptions & Base Sepolia BasePay" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 185,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 183,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "text-3xl sm:text-5xl font-bold tracking-tight",
							children: "Flexible CAD Plans & Weekly Pass"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 187,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-sm sm:text-base text-muted-foreground leading-relaxed",
							children: [
								"Need more than 2 free daily prompts? Subscribe for",
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-blueprint font-semibold",
									children: "5 USDC / week"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 192,
									columnNumber: 13
								}, this),
								" on",
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-foreground font-semibold",
									children: "Base Sepolia"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 193,
									columnNumber: 13
								}, this),
								" via",
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-blueprint font-semibold",
									children: "Base Wallet / BasePay"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 194,
									columnNumber: 13
								}, this),
								" or Credit Card for 3 extra daily requests (total 5 requests/day)!"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 190,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "pt-2 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "inline-flex items-center gap-2 rounded-lg border border-blueprint/30 bg-surface-2/90 px-3 py-1.5 font-mono text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-muted-foreground",
										children: "Receiving Wallet (Base Sepolia):"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 200,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-bold text-foreground",
										children: [
											MERCHANT_RECEIVING_ADDRESS.slice(0, 8),
											"…",
											MERCHANT_RECEIVING_ADDRESS.slice(-6)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 201,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: handleCopyMerchantAddress,
										className: "text-blueprint hover:underline ml-1 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Copy, { className: "size-3" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 203,
											columnNumber: 17
										}, this), copiedAddress ? "Copied" : "Copy"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 202,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 199,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 198,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "pt-4 flex items-center justify-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									onClick: () => setBillingCycle("weekly"),
									className: `rounded-lg px-3 py-1 text-xs font-medium transition-colors ${billingCycle === "weekly" ? "bg-blueprint text-blueprint-foreground font-bold shadow" : "bg-surface-2 text-muted-foreground"}`,
									children: "Weekly ($5/wk Pass)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 211,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									onClick: () => setBillingCycle("monthly"),
									className: `rounded-lg px-3 py-1 text-xs font-medium transition-colors ${billingCycle === "monthly" ? "bg-blueprint text-blueprint-foreground font-bold shadow" : "bg-surface-2 text-muted-foreground"}`,
									children: "Monthly Billing"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 214,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									onClick: () => setBillingCycle("annual"),
									className: `rounded-lg px-3 py-1 text-xs font-medium transition-colors flex items-center gap-1.5 ${billingCycle === "annual" ? "bg-blueprint text-blueprint-foreground font-bold shadow" : "bg-surface-2 text-muted-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Annual Billing" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 218,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-mono text-emerald-400",
										children: "Save 20%"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 219,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 217,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 210,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 182,
					columnNumber: 9
				}, this),
				activeSub && activeSub.planId !== "free" && /* @__PURE__ */ (void 0)("div", {
					className: "mt-8 mx-auto max-w-2xl panel grid-paper p-4 border border-emerald-500/40 bg-emerald-500/5 text-center sm:text-left sm:flex items-center justify-between gap-4",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400",
							children: /* @__PURE__ */ (void 0)(CircleCheck, { className: "size-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 230,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 229,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("div", { children: [
							/* @__PURE__ */ (void 0)("p", {
								className: "text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold",
								children: "Active Subscription"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 233,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)("h4", {
								className: "font-bold text-base capitalize",
								children: activeSub.planId === "weekly_boost" ? "Weekly Pass (5 USDC/wk — 5 Daily Requests)" : `${activeSub.planId} Plan (${activeSub.billingCycle})`
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 236,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Valid through ",
									new Date(activeSub.expiresAt).toLocaleDateString(),
									" · Paid via ",
									activeSub.paymentMethod
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 239,
								columnNumber: 17
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 232,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 228,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)(Button, {
						asChild: true,
						variant: "outline",
						size: "sm",
						className: "mt-3 sm:mt-0 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20",
						children: /* @__PURE__ */ (void 0)(Link, {
							to: "/workspace",
							children: ["Go to Workspace (5 Daily Prompts) ", /* @__PURE__ */ (void 0)(ArrowRight, { className: "ml-1 size-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 245,
								columnNumber: 71
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 245,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 244,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 227,
					columnNumber: 54
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto",
					children: SUBSCRIPTION_PLANS.map((plan) => {
						const isCurrent = (activeSub?.planId || "free") === plan.id;
						const isWeeklyPass = plan.id === "weekly_boost";
						const priceDisplay = isWeeklyPass ? "$5" : billingCycle === "annual" ? `$${plan.priceAnnual}` : `$${plan.priceMonthly}`;
						const periodDisplay = isWeeklyPass ? "/ week" : "/ month";
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: `panel relative p-5 flex flex-col justify-between transition-all duration-200 ${isWeeklyPass ? "border-blueprint/90 ring-2 ring-blueprint bg-surface/90 shadow-2xl" : plan.popular ? "border-blueprint/80 ring-1 ring-blueprint bg-surface/90 shadow-xl" : "border-border/80 hover:border-border"}`,
							children: [
								plan.badge && /* @__PURE__ */ (void 0)("span", {
									className: `absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider ${isWeeklyPass ? "bg-blueprint text-blueprint-foreground shadow-md font-bold" : plan.popular ? "bg-blueprint text-blueprint-foreground shadow-md" : "bg-surface-2 border border-border text-muted-foreground"}`,
									children: plan.badge
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 257,
									columnNumber: 32
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
											className: "font-display font-bold text-lg",
											children: plan.name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 263,
											columnNumber: 21
										}, this), isCurrent && /* @__PURE__ */ (void 0)("span", {
											className: "rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/30",
											children: "Active"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 266,
											columnNumber: 35
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 262,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "mt-2 text-xs text-muted-foreground min-h-[36px] leading-relaxed",
										children: plan.description
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 271,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "mt-4 flex items-baseline gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-display text-3xl font-bold tracking-tight",
											children: priceDisplay
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 276,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-xs text-muted-foreground",
											children: periodDisplay
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 279,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 275,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "mt-4 rounded-lg bg-surface-2/90 p-2.5 border border-border/60",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-2 text-xs font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Zap, { className: "size-4 text-blueprint fill-blueprint shrink-0" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 287,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Daily CAD Quota:" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 288,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 286,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "mt-1 font-mono text-xs font-bold text-foreground",
											children: isWeeklyPass ? "5 Prompts / Day (2 free + 3 extra)" : typeof plan.cadQuotaPerDay === "number" ? `${plan.cadQuotaPerDay} Prompts / Day` : `${plan.cadQuotaPerDay} Prompts / Day`
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 290,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 285,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
										className: "mt-5 space-y-2 text-xs",
										children: plan.features.map((f) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
											className: "flex items-start gap-2 text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "size-3.5 shrink-0 text-blueprint mt-0.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 298,
												columnNumber: 25
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: f }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 299,
												columnNumber: 25
											}, this)]
										}, f, true, {
											fileName: _jsxFileName,
											lineNumber: 297,
											columnNumber: 45
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 296,
										columnNumber: 19
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 261,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-6 pt-4 border-t border-border/60",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										variant: isWeeklyPass || plan.popular ? "hero" : "outline",
										size: "default",
										className: "w-full text-xs font-semibold",
										disabled: isCurrent,
										onClick: () => handleOpenCheckout(plan),
										children: isCurrent ? "Current Plan" : plan.ctaText
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 305,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 304,
									columnNumber: 17
								}, this)
							]
						}, plan.id, true, {
							fileName: _jsxFileName,
							lineNumber: 256,
							columnNumber: 18
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 250,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-16 max-w-4xl mx-auto panel p-6 border border-border/80 bg-surface/50 text-center space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
							className: "font-display font-semibold text-base",
							children: "Instant Base Wallet & Multi-Chain Payment Options"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 315,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground max-w-2xl mx-auto",
							children: "Pay for your $5 weekly pass or monthly subscription using Base Wallet (BasePay) on Base Sepolia testnet, USDC, ETH, Phantom Solana, or Credit Cards."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 318,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-mono text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2 rounded-lg border border-blueprint/40 bg-blueprint/15 px-3 py-1.5 text-blueprint font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Wallet, { className: "size-4 text-blueprint" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 324,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Base Wallet & BasePay (Base Sepolia Testnet)" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 325,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 323,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CreditCard, { className: "size-4 text-primary" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 328,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Credit & Debit Cards" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 329,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 327,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Box, { className: "size-4 text-emerald-400" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 332,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Solana & MetaMaSK" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 333,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 331,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 322,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 314,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "mt-16 max-w-4xl mx-auto space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-center space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
							className: "font-display font-bold text-2xl",
							children: "Frequently Asked Questions"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 341,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: "Everything you need to know about the $5 Weekly Pass and subscription tiers"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 344,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 340,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "panel p-5 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
									className: "font-semibold text-sm flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleQuestionMark, { className: "size-4 text-blueprint" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 352,
										columnNumber: 17
									}, this), " How does the 5 USDC/week pass work?"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 351,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-muted-foreground leading-relaxed",
									children: "When you subscribe for $5/week, 3 extra daily requests are added on top of your 2 free requests, giving you 5 total CAD prompt requests per day for 7 full days."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 354,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 350,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "panel p-5 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
									className: "font-semibold text-sm flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleQuestionMark, { className: "size-4 text-blueprint" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 361,
										columnNumber: 17
									}, this), " Which wallet address receives payments?"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 360,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-muted-foreground leading-relaxed",
									children: [
										"All Base Sepolia USDC subscription payments are routed to receiving address ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-mono font-bold text-foreground",
											children: "0x316522d36C3AB060836df6331751ebDAaE25FAC6"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 364,
											columnNumber: 93
										}, this),
										"."
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 363,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 359,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "panel p-5 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
									className: "font-semibold text-sm flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleQuestionMark, { className: "size-4 text-blueprint" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 370,
										columnNumber: 17
									}, this), " What formats are generated?"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 369,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-muted-foreground leading-relaxed",
									children: "All subscriptions include 2D orthographic blueprints, photorealistic 3D concept renders, and 3D orbiting motion videos."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 372,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 368,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "panel p-5 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
									className: "font-semibold text-sm flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleQuestionMark, { className: "size-4 text-blueprint" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 379,
										columnNumber: 17
									}, this), " Can I pay with a Credit Card for the weekly pass?"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 378,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-muted-foreground leading-relaxed",
									children: "Yes! Both Credit Cards (Visa, Mastercard, Amex) and Crypto (Base Sepolia USDC via Base Wallet) are accepted for all plans."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 381,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 377,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 349,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 339,
					columnNumber: 9
				}, this),
				selectedPlan && /* @__PURE__ */ (void 0)("div", {
					className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto",
					onClick: () => setSelectedPlan(null),
					children: /* @__PURE__ */ (void 0)("div", {
						className: "relative w-full max-w-xl rounded-xl border border-border bg-background p-6 shadow-2xl space-y-6 my-8",
						onClick: (e) => e.stopPropagation(),
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center justify-between border-b border-border/70 pb-4",
							children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h3", {
								className: "font-display text-xl font-bold",
								children: ["Subscribe to ", selectedPlan.name]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 394,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)("p", {
								className: "text-xs text-muted-foreground",
								children: ["Selected plan: $", selectedPlan.id === "weekly_boost" ? "5 USDC / week (7 days access)" : `${selectedPlan.priceMonthly} / month`]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 397,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 393,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: () => setSelectedPlan(null),
								className: "rounded-lg border border-border p-1 text-muted-foreground hover:bg-surface-2",
								children: "✕"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 401,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 392,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)(Tabs, {
							value: paymentType,
							onValueChange: (v) => setPaymentType(v),
							className: "w-full",
							children: [
								/* @__PURE__ */ (void 0)(TabsList, {
									className: "grid w-full grid-cols-2",
									children: [/* @__PURE__ */ (void 0)(TabsTrigger, {
										value: "crypto",
										className: "flex items-center gap-2 text-xs",
										children: [/* @__PURE__ */ (void 0)(Wallet, { className: "size-3.5 text-blueprint" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 410,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("span", { children: "Pay with Base Wallet (Crypto)" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 411,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 409,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)(TabsTrigger, {
										value: "card",
										className: "flex items-center gap-2 text-xs",
										children: [/* @__PURE__ */ (void 0)(CreditCard, { className: "size-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 414,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("span", { children: "Pay with Card" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 415,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 413,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 408,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)(TabsContent, {
									value: "crypto",
									className: "pt-4 space-y-4",
									children: /* @__PURE__ */ (void 0)("div", {
										className: "space-y-3",
										children: [
											/* @__PURE__ */ (void 0)(Label, {
												className: "text-xs font-semibold",
												children: "Select Network & Payment Wallet"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 422,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "grid grid-cols-3 gap-2",
												children: [
													/* @__PURE__ */ (void 0)("button", {
														type: "button",
														onClick: () => setCryptoNetwork("base_sepolia_usdc"),
														className: `rounded-lg border p-2.5 text-center text-xs font-mono transition-all ${cryptoNetwork === "base_sepolia_usdc" ? "border-blueprint bg-blueprint/15 text-blueprint font-bold shadow" : "border-border bg-surface-2 text-muted-foreground"}`,
														children: "Base Sepolia USDC"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 424,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (void 0)("button", {
														type: "button",
														onClick: () => setCryptoNetwork("base_eth"),
														className: `rounded-lg border p-2.5 text-center text-xs font-mono transition-all ${cryptoNetwork === "base_eth" ? "border-blueprint bg-blueprint/15 text-blueprint font-bold" : "border-border bg-surface-2 text-muted-foreground"}`,
														children: "Base ETH"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 427,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (void 0)("button", {
														type: "button",
														onClick: () => setCryptoNetwork("solana_usdc"),
														className: `rounded-lg border p-2.5 text-center text-xs font-mono transition-all ${cryptoNetwork === "solana_usdc" ? "border-emerald-500 bg-emerald-500/15 text-emerald-400 font-bold" : "border-border bg-surface-2 text-muted-foreground"}`,
														children: "Solana USDC"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 430,
														columnNumber: 23
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 423,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "panel p-4 bg-surface-2/90 space-y-3 text-xs border border-border/80",
												children: [
													/* @__PURE__ */ (void 0)("div", {
														className: "flex justify-between items-center font-mono",
														children: [/* @__PURE__ */ (void 0)("span", {
															className: "text-muted-foreground",
															children: "Amount Due:"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 437,
															columnNumber: 25
														}, this), /* @__PURE__ */ (void 0)("span", {
															className: "font-bold text-foreground",
															children: [
																"$",
																selectedPlan.id === "weekly_boost" ? "5.00" : selectedPlan.priceMonthly,
																".00 USDC"
															]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 438,
															columnNumber: 25
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 436,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "space-y-1",
														children: [/* @__PURE__ */ (void 0)("span", {
															className: "text-[11px] text-muted-foreground",
															children: "Receiving Address (Base Sepolia):"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 444,
															columnNumber: 25
														}, this), /* @__PURE__ */ (void 0)("div", {
															className: "flex items-center justify-between rounded border border-border bg-background p-2 font-mono text-[11px]",
															children: [/* @__PURE__ */ (void 0)("span", {
																className: "truncate",
																children: MERCHANT_RECEIVING_ADDRESS
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 448,
																columnNumber: 27
															}, this), /* @__PURE__ */ (void 0)("button", {
																type: "button",
																onClick: handleCopyMerchantAddress,
																className: "text-blueprint hover:underline ml-2 flex items-center gap-1 shrink-0",
																children: [/* @__PURE__ */ (void 0)(Copy, { className: "size-3" }, void 0, false, {
																	fileName: _jsxFileName,
																	lineNumber: 450,
																	columnNumber: 29
																}, this), copiedAddress ? "Copied" : "Copy"]
															}, void 0, true, {
																fileName: _jsxFileName,
																lineNumber: 449,
																columnNumber: 27
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 447,
															columnNumber: 25
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 443,
														columnNumber: 23
													}, this),
													walletAddress && /* @__PURE__ */ (void 0)("p", {
														className: "text-[11px] font-mono text-emerald-400",
														children: [
															"Connected Wallet: ",
															walletAddress.slice(0, 6),
															"…",
															walletAddress.slice(-4)
														]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 456,
														columnNumber: 41
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 435,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("form", {
												onSubmit: handleConfirmSubscription,
												children: /* @__PURE__ */ (void 0)(Button, {
													type: "submit",
													variant: "hero",
													size: "lg",
													disabled: isProcessing,
													className: "w-full text-xs font-semibold",
													children: isProcessing ? /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(RefreshCw, { className: "mr-2 size-4 animate-spin" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 465,
														columnNumber: 29
													}, this), "Processing Base Wallet Payment…"] }, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 464,
														columnNumber: 41
													}, this) : `Pay $${selectedPlan.id === "weekly_boost" ? "5.00" : selectedPlan.priceMonthly} USDC via Base Wallet (BasePay)`
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 463,
													columnNumber: 23
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 462,
												columnNumber: 21
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 421,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 420,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)(TabsContent, {
									value: "card",
									className: "pt-4 space-y-4",
									children: /* @__PURE__ */ (void 0)("form", {
										onSubmit: handleConfirmSubscription,
										className: "space-y-4",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (void 0)(Label, {
													htmlFor: "card-name",
													className: "text-xs",
													children: "Cardholder Name"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 477,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)(Input, {
													id: "card-name",
													placeholder: "e.g. Alex Morgan",
													value: cardName,
													onChange: (e) => setCardName(e.target.value),
													required: true,
													className: "h-9 text-xs"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 480,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 476,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (void 0)(Label, {
													htmlFor: "card-number",
													className: "text-xs",
													children: "Card Number"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 484,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)(Input, {
													id: "card-number",
													placeholder: "4532 •••• •••• 8892",
													value: cardNumber,
													onChange: (e) => setCardNumber(e.target.value),
													required: true,
													maxLength: 19,
													className: "h-9 text-xs font-mono"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 487,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 483,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "grid grid-cols-2 gap-3",
												children: [/* @__PURE__ */ (void 0)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (void 0)(Label, {
														htmlFor: "card-exp",
														className: "text-xs",
														children: "Expiry Date"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 492,
														columnNumber: 25
													}, this), /* @__PURE__ */ (void 0)(Input, {
														id: "card-exp",
														placeholder: "MM/YY",
														value: cardExpiry,
														onChange: (e) => setCardExpiry(e.target.value),
														required: true,
														maxLength: 5,
														className: "h-9 text-xs font-mono"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 495,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 491,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (void 0)(Label, {
														htmlFor: "card-cvc",
														className: "text-xs",
														children: "CVC / CVV"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 499,
														columnNumber: 25
													}, this), /* @__PURE__ */ (void 0)(Input, {
														id: "card-cvc",
														placeholder: "123",
														value: cardCvc,
														onChange: (e) => setCardCvc(e.target.value),
														required: true,
														maxLength: 4,
														className: "h-9 text-xs font-mono"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 502,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 498,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 490,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-lg bg-surface-2 p-3 text-[11px] text-muted-foreground flex items-center gap-2",
												children: [/* @__PURE__ */ (void 0)(Lock, { className: "size-3.5 text-blueprint shrink-0" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 507,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("span", { children: ["256-Bit SSL Encrypted Checkout. Billed as $", selectedPlan.id === "weekly_boost" ? "5.00 / week" : `${selectedPlan.priceMonthly}.00 / month`] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 508,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 506,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)(Button, {
												type: "submit",
												variant: "hero",
												size: "lg",
												disabled: isProcessing,
												className: "w-full text-xs font-semibold",
												children: isProcessing ? /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(RefreshCw, { className: "mr-2 size-4 animate-spin" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 516,
													columnNumber: 27
												}, this), "Processing Card Payment…"] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 515,
													columnNumber: 39
												}, this) : `Confirm & Pay $${selectedPlan.id === "weekly_boost" ? "5.00" : selectedPlan.priceMonthly}`
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 514,
												columnNumber: 21
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 475,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 474,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 407,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 390,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 389,
					columnNumber: 26
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 180,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 177,
		columnNumber: 10
	}, this);
}
//#endregion
export { SubscriptionPage as component };
