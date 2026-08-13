import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { i as stringType, n as enumType, r as objectType, t as arrayType } from "../_libs/zod.mjs";
import { i as createSsrRpc } from "./wallet-auth-Cjb9Ehvm.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BazXO3nj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/requests.functions-Cgry8E8p.js
var getDailyFreeUsage = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ activePlan: stringType().optional() }).optional().parse(input)).handler(createSsrRpc("30e3218280c4e18d034e9f14bdf67ff9898538869d2def8924206a9ceef7e763"));
var CreateInput = objectType({
	title: stringType().trim().min(3).max(120),
	brief: stringType().trim().min(20).max(4e3),
	category: stringType().trim().min(2).max(40),
	dimensions: stringType().trim().max(200).optional().nullable(),
	units: stringType().trim().max(10).default("mm"),
	style: stringType().trim().max(200).optional().nullable(),
	package: enumType([
		"concept",
		"standard",
		"pro"
	]),
	activePlan: stringType().optional()
});
var createRequest = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => CreateInput.parse(input)).handler(createSsrRpc("57571f98c5b68b1f6eee0b076a7c89da8e1b94e17d7cbd14783b34d49d9135bc"));
var listMyRequests = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("4b88c82fc0046a589bdb5580d2d2540f1499d5e2e36a6a47a5cdff6c0891f1f7"));
var UploadInput = objectType({
	id: stringType().uuid(),
	files: arrayType(objectType({
		name: stringType().max(200),
		dataUrl: stringType().startsWith("data:image/").max(8e6)
	})).min(1).max(5)
});
var uploadReferenceImages = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => UploadInput.parse(input)).handler(createSsrRpc("7dd0941d9bbb9c40c460bb1a01a7c98948356e61326cfec658697a948b333e05"));
var payForRequest = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("f87be253850d40315fc04f708ff4e4f61d70c91c222c435a92adb1f8eaafbe23"));
var getRequest = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("741a6f58b805c40b71389559f050a6a5d3ba7c3b64860bebf189e7715e29169f"));
var generatePreviewImages = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("a92a1b1e490c2510e1a612ef2e4d51a1d57bb74f5abd8ade98451102ef0671e3"));
var startPreviewVideo = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("b1778de095c38a466781cefc0b5502144cac3a3a56730faee104767b0da53db2"));
var pollPreviewVideo = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	id: stringType().uuid(),
	jobId: stringType().min(3).max(200)
}).parse(input)).handler(createSsrRpc("dc9fc0fde8697a6cf46f9a6083b7d652f68ed87f24a20e5f0f6b807ef4443ae7"));
//#endregion
export { listMyRequests as a, startPreviewVideo as c, getRequest as i, uploadReferenceImages as l, generatePreviewImages as n, payForRequest as o, getDailyFreeUsage as r, pollPreviewVideo as s, createRequest as t };
