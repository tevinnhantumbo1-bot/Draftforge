import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { i as stringType, n as enumType, r as objectType } from "../_libs/zod.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BazXO3nj.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/payments.functions-D5siRrRx.js
var DEFAULT_RECIPIENT = "0x316522d36C3AB060836df6331751ebDAaE25FAC6";
var getBasePayConfig_createServerFn_handler = createServerRpc({
	id: "12ffc090f0a42ac0e9ab434980c3d966e58ad934910f24ffdc85259ee394bf94",
	name: "getBasePayConfig",
	filename: "src/lib/payments.functions.ts"
}, (opts) => getBasePayConfig.__executeServer(opts));
var getBasePayConfig = createServerFn({ method: "GET" }).handler(getBasePayConfig_createServerFn_handler, async () => {
	const recipient = processModule.env["BASE_PAY_RECIPIENT"] || DEFAULT_RECIPIENT;
	const testnet = processModule.env["BASE_PAY_TESTNET"] !== "false";
	return {
		configured: /^0x[a-fA-F0-9]{40}$/.test(recipient),
		recipient,
		testnet
	};
});
var prepareSubscriptionBasePay_createServerFn_handler = createServerRpc({
	id: "38d47513897a676e372959150d84f3733f0c9dbc2896f2974df92f762a883725",
	name: "prepareSubscriptionBasePay",
	filename: "src/lib/payments.functions.ts"
}, (opts) => prepareSubscriptionBasePay.__executeServer(opts));
var prepareSubscriptionBasePay = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ planId: enumType([
	"free",
	"weekly_boost",
	"pro",
	"studio"
]) }).parse(input)).handler(prepareSubscriptionBasePay_createServerFn_handler, async ({ data }) => {
	return {
		to: processModule.env["BASE_PAY_RECIPIENT"] || DEFAULT_RECIPIENT,
		testnet: processModule.env["BASE_PAY_TESTNET"] !== "false",
		amount: {
			free: "0.00",
			weekly_boost: "5.00",
			pro: "29.00",
			studio: "89.00"
		}[data.planId] ?? "5.00"
	};
});
var preparePayment_createServerFn_handler = createServerRpc({
	id: "db64cc4519008001978ccaec1849e35f9192f207fd6f7800faa063f13dfb855a",
	name: "preparePayment",
	filename: "src/lib/payments.functions.ts"
}, (opts) => preparePayment.__executeServer(opts));
var preparePayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(preparePayment_createServerFn_handler, async ({ data, context }) => {
	const recipient = processModule.env["BASE_PAY_RECIPIENT"] || DEFAULT_RECIPIENT;
	const testnet = processModule.env["BASE_PAY_TESTNET"] !== "false";
	const { data: request } = await context.supabase.from("design_requests").select("id,paid,quote_cents").eq("id", data.id).maybeSingle();
	if (!request) throw new Error("Request not found");
	if (request.paid) throw new Error("This request is already paid");
	const { count } = await context.supabase.from("request_assets").select("id", {
		count: "exact",
		head: true
	}).eq("request_id", data.id).in("kind", ["image", "video"]);
	if (!count) throw new Error("Generate a preview first — you only pay once you've seen it.");
	return {
		to: recipient,
		testnet,
		amount: (request.quote_cents / 100).toFixed(2)
	};
});
var confirmBasePayment_createServerFn_handler = createServerRpc({
	id: "f9c0b800b4986ae59bf444881699076fb2293d9808003f029eab43138d3ec595",
	name: "confirmBasePayment",
	filename: "src/lib/payments.functions.ts"
}, (opts) => confirmBasePayment.__executeServer(opts));
var confirmBasePayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	id: stringType().uuid(),
	paymentId: stringType().min(4).max(200),
	payerAddress: stringType().regex(/^0x[a-fA-F0-9]{40}$/).optional()
}).parse(input)).handler(confirmBasePayment_createServerFn_handler, async ({ data, context }) => {
	const testnet = processModule.env["BASE_PAY_TESTNET"] !== "false";
	const recipient = (processModule.env["BASE_PAY_RECIPIENT"] || DEFAULT_RECIPIENT).toLowerCase();
	const { data: request } = await context.supabase.from("design_requests").select("id,paid,quote_cents").eq("id", data.id).maybeSingle();
	if (!request) throw new Error("Request not found");
	if (request.paid) return { status: "completed" };
	const { getPaymentStatus } = await import("../_libs/@base-org/account+[...].mjs").then((n) => n.t);
	const result = await getPaymentStatus({
		id: data.paymentId,
		testnet
	});
	if (result.status === "failed") throw new Error(result.reason ?? "The Base payment failed");
	if (result.status !== "completed") return { status: result.status };
	if (recipient && result.recipient && result.recipient.toLowerCase() !== recipient) throw new Error("Payment was sent to a different address");
	const expected = request.quote_cents / 100;
	const received = Number(result.amount ?? expected);
	if (Number.isFinite(received) && received + .01 < expected) throw new Error("Payment amount is lower than the quoted price");
	const { error } = await context.supabase.from("design_requests").update({
		paid: true,
		status: "in_drafting",
		payment_id: data.paymentId,
		payment_tx: data.paymentId,
		payer_address: (result.sender ?? data.payerAddress)?.toLowerCase() ?? null,
		payment_network: testnet ? "base-sepolia" : "base",
		paid_amount_usdc: Number.isFinite(received) ? received : expected
	}).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { status: "completed" };
});
var processSubscriptionPayment_createServerFn_handler = createServerRpc({
	id: "9b1e5de749d30792721851406091b1b0f488079548128c0bf825f5721c2743bb",
	name: "processSubscriptionPayment",
	filename: "src/lib/payments.functions.ts"
}, (opts) => processSubscriptionPayment.__executeServer(opts));
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
}).parse(input)).handler(processSubscriptionPayment_createServerFn_handler, async ({ data }) => {
	const amountUsd = {
		free: {
			weekly: 0,
			monthly: 0,
			annual: 0
		},
		weekly_boost: {
			weekly: 5,
			monthly: 20,
			annual: 20
		},
		pro: {
			weekly: 10,
			monthly: 29,
			annual: 288
		},
		studio: {
			weekly: 30,
			monthly: 89,
			annual: 900
		}
	}[data.planId]?.[data.billingCycle] ?? 5;
	if (data.paymentMethod === "card" && data.planId !== "free") {
		if (!data.cardNumber || data.cardNumber.replace(/\s/g, "").length < 15) throw new Error("Invalid card number. Please check your card details.");
	}
	let durationDays = 30;
	if (data.planId === "weekly_boost" || data.billingCycle === "weekly") durationDays = 7;
	else if (data.billingCycle === "annual") durationDays = 365;
	return {
		planId: data.planId,
		billingCycle: data.billingCycle,
		paymentMethod: data.paymentMethod,
		amountUsd,
		txHash: data.txHash || `sub_${Math.random().toString(36).substring(2, 10)}`,
		walletAddress: data.walletAddress || null,
		receivingAddress: DEFAULT_RECIPIENT,
		status: "active",
		subscribedAt: (/* @__PURE__ */ new Date()).toISOString(),
		expiresAt: new Date(Date.now() + durationDays * 864e5).toISOString(),
		dailyQuota: data.planId === "weekly_boost" ? 5 : data.planId === "pro" ? 50 : data.planId === "studio" ? "Unlimited" : 2
	};
});
//#endregion
export { confirmBasePayment_createServerFn_handler, getBasePayConfig_createServerFn_handler, preparePayment_createServerFn_handler, prepareSubscriptionBasePay_createServerFn_handler, processSubscriptionPayment_createServerFn_handler };
