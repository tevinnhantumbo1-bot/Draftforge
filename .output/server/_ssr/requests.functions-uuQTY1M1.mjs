import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { i as stringType, n as enumType, r as objectType, t as arrayType } from "../_libs/zod.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BazXO3nj.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/requests.functions-uuQTY1M1.js
var BUCKET = "design-previews";
var getDailyFreeUsage_createServerFn_handler = createServerRpc({
	id: "30e3218280c4e18d034e9f14bdf67ff9898538869d2def8924206a9ceef7e763",
	name: "getDailyFreeUsage",
	filename: "src/lib/requests.functions.ts"
}, (opts) => getDailyFreeUsage.__executeServer(opts));
var getDailyFreeUsage = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ activePlan: stringType().optional() }).optional().parse(input)).handler(getDailyFreeUsage_createServerFn_handler, async ({ data, context }) => {
	const startOfDay = /* @__PURE__ */ new Date();
	startOfDay.setUTCHours(0, 0, 0, 0);
	const { count, error } = await context.supabase.from("design_requests").select("id", {
		count: "exact",
		head: true
	}).eq("user_id", context.userId).gte("created_at", startOfDay.toISOString());
	if (error) console.warn("Could not query daily request count:", error);
	const usedToday = count ?? 0;
	const plan = data?.activePlan || "free";
	let maxFreePerDay = 2;
	if (plan === "weekly_boost") maxFreePerDay = 5;
	else if (plan === "pro") maxFreePerDay = 50;
	else if (plan === "studio") maxFreePerDay = 9999;
	const remainingToday = Math.max(0, maxFreePerDay - usedToday);
	return {
		usedToday,
		maxFreePerDay,
		remainingToday,
		isFreeAvailable: remainingToday > 0,
		activePlan: plan
	};
});
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
var createRequest_createServerFn_handler = createServerRpc({
	id: "57571f98c5b68b1f6eee0b076a7c89da8e1b94e17d7cbd14783b34d49d9135bc",
	name: "createRequest",
	filename: "src/lib/requests.functions.ts"
}, (opts) => createRequest.__executeServer(opts));
var createRequest = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => CreateInput.parse(input)).handler(createRequest_createServerFn_handler, async ({ data, context }) => {
	const { quoteCents } = await import("./pricing-iHp73A5v.mjs");
	const startOfDay = /* @__PURE__ */ new Date();
	startOfDay.setUTCHours(0, 0, 0, 0);
	const { count } = await context.supabase.from("design_requests").select("id", {
		count: "exact",
		head: true
	}).eq("user_id", context.userId).gte("created_at", startOfDay.toISOString());
	const usedToday = count ?? 0;
	const plan = data.activePlan || "free";
	let maxFreePerDay = 2;
	if (plan === "weekly_boost") maxFreePerDay = 5;
	else if (plan === "pro") maxFreePerDay = 50;
	else if (plan === "studio") maxFreePerDay = 9999;
	const isFreeTest = usedToday < maxFreePerDay;
	const quote = isFreeTest ? 0 : quoteCents(data.package, data.category, data.brief.length);
	const { data: row, error } = await context.supabase.from("design_requests").insert({
		user_id: context.userId,
		title: data.title,
		brief: data.brief,
		category: data.category,
		dimensions: data.dimensions ?? null,
		units: data.units,
		style: data.style ?? null,
		package: data.package,
		status: isFreeTest ? "free_test" : "submitted",
		quote_cents: quote
	}).select("id").single();
	if (error) throw new Error(error.message);
	return {
		id: row.id,
		isFreeTest,
		usedToday: usedToday + 1,
		maxFreePerDay,
		remainingToday: Math.max(0, maxFreePerDay - (usedToday + 1))
	};
});
var listMyRequests_createServerFn_handler = createServerRpc({
	id: "4b88c82fc0046a589bdb5580d2d2540f1499d5e2e36a6a47a5cdff6c0891f1f7",
	name: "listMyRequests",
	filename: "src/lib/requests.functions.ts"
}, (opts) => listMyRequests.__executeServer(opts));
var listMyRequests = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listMyRequests_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("design_requests").select("id,title,category,status,quote_cents,paid,created_at,package").order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var UploadInput = objectType({
	id: stringType().uuid(),
	files: arrayType(objectType({
		name: stringType().max(200),
		dataUrl: stringType().startsWith("data:image/").max(8e6)
	})).min(1).max(5)
});
var uploadReferenceImages_createServerFn_handler = createServerRpc({
	id: "7dd0941d9bbb9c40c460bb1a01a7c98948356e61326cfec658697a948b333e05",
	name: "uploadReferenceImages",
	filename: "src/lib/requests.functions.ts"
}, (opts) => uploadReferenceImages.__executeServer(opts));
var uploadReferenceImages = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => UploadInput.parse(input)).handler(uploadReferenceImages_createServerFn_handler, async ({ data, context }) => {
	const { data: request } = await context.supabase.from("design_requests").select("id").eq("id", data.id).maybeSingle();
	if (!request) throw new Error("Request not found");
	const cad = await import("./cad.server-BmI4TIKN.mjs");
	const { supabaseAdmin } = await import("./client.server-CxJTsU3s.mjs");
	for (const file of data.files) {
		const { bytes, contentType } = cad.dataUrlToBytes(file.dataUrl);
		const ext = contentType.includes("jpeg") ? "jpg" : contentType.includes("webp") ? "webp" : "png";
		const path = `${context.userId}/${data.id}/ref-${crypto.randomUUID()}.${ext}`;
		const up = await supabaseAdmin.storage.from(BUCKET).upload(path, bytes, { contentType });
		if (up.error) throw new Error(up.error.message);
		await supabaseAdmin.from("request_assets").insert({
			request_id: data.id,
			user_id: context.userId,
			kind: "reference",
			url: path,
			prompt: file.name
		});
	}
	return { count: data.files.length };
});
var payForRequest_createServerFn_handler = createServerRpc({
	id: "f87be253850d40315fc04f708ff4e4f61d70c91c222c435a92adb1f8eaafbe23",
	name: "payForRequest",
	filename: "src/lib/requests.functions.ts"
}, (opts) => payForRequest.__executeServer(opts));
var payForRequest = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(payForRequest_createServerFn_handler, async ({ data, context }) => {
	const { data: request } = await context.supabase.from("design_requests").select("id,paid").eq("id", data.id).maybeSingle();
	if (!request) throw new Error("Request not found");
	if (request.paid) return { paid: true };
	const { count } = await context.supabase.from("request_assets").select("id", {
		count: "exact",
		head: true
	}).eq("request_id", data.id).in("kind", ["image", "video"]);
	if (!count) throw new Error("Generate a preview first — you only pay once you've seen it.");
	const { error } = await context.supabase.from("design_requests").update({
		paid: true,
		status: "in_drafting"
	}).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { paid: true };
});
var getRequest_createServerFn_handler = createServerRpc({
	id: "741a6f58b805c40b71389559f050a6a5d3ba7c3b64860bebf189e7715e29169f",
	name: "getRequest",
	filename: "src/lib/requests.functions.ts"
}, (opts) => getRequest.__executeServer(opts));
var getRequest = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(getRequest_createServerFn_handler, async ({ data, context }) => {
	const { data: request, error } = await context.supabase.from("design_requests").select("*").eq("id", data.id).maybeSingle();
	if (error) throw new Error(error.message);
	if (!request) throw new Error("Request not found");
	const { data: assets } = await context.supabase.from("request_assets").select("id,kind,url,prompt,created_at").eq("request_id", data.id).order("created_at", { ascending: true });
	const { supabaseAdmin } = await import("./client.server-CxJTsU3s.mjs");
	return {
		request,
		assets: await Promise.all((assets ?? []).map(async (a) => {
			const signed = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(a.url, 3600);
			return {
				...a,
				signedUrl: signed.data?.signedUrl ?? null
			};
		}))
	};
});
var generatePreviewImages_createServerFn_handler = createServerRpc({
	id: "a92a1b1e490c2510e1a612ef2e4d51a1d57bb74f5abd8ade98451102ef0671e3",
	name: "generatePreviewImages",
	filename: "src/lib/requests.functions.ts"
}, (opts) => generatePreviewImages.__executeServer(opts));
var generatePreviewImages = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(generatePreviewImages_createServerFn_handler, async ({ data, context }) => {
	const { data: request, error } = await context.supabase.from("design_requests").select("*").eq("id", data.id).maybeSingle();
	if (error) throw new Error(error.message);
	if (!request) throw new Error("Request not found");
	const cad = await import("./cad.server-BmI4TIKN.mjs");
	const { supabaseAdmin } = await import("./client.server-CxJTsU3s.mjs");
	const { data: refs } = await context.supabase.from("request_assets").select("url").eq("request_id", request.id).eq("kind", "reference");
	const referenceUrls = [];
	for (const r of refs ?? []) {
		const signed = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(r.url, 3600);
		if (signed.data?.signedUrl) referenceUrls.push(signed.data.signedUrl);
	}
	const brief = {
		title: request.title,
		brief: request.brief,
		category: request.category,
		dimensions: request.dimensions,
		units: request.units,
		style: request.style
	};
	const created = [];
	for (const variant of cad.IMAGE_VARIANTS) {
		const prompt = cad.imagePrompt(brief, variant);
		const dataUrl = await cad.generateImage(referenceUrls.length ? `${prompt} Use the attached reference images as the visual starting point — match their form, materials and proportions.` : prompt, referenceUrls);
		const { bytes, contentType } = cad.dataUrlToBytes(dataUrl);
		const ext = contentType.includes("jpeg") ? "jpg" : "png";
		const path = `${context.userId}/${request.id}/${crypto.randomUUID()}.${ext}`;
		const up = await supabaseAdmin.storage.from(BUCKET).upload(path, bytes, { contentType });
		if (up.error) throw new Error(up.error.message);
		await supabaseAdmin.from("request_assets").insert({
			request_id: request.id,
			user_id: context.userId,
			kind: "image",
			url: path,
			prompt
		});
		created.push(path);
	}
	await supabaseAdmin.from("design_requests").update({ status: "preview_ready" }).eq("id", request.id);
	return { count: created.length };
});
var startPreviewVideo_createServerFn_handler = createServerRpc({
	id: "b1778de095c38a466781cefc0b5502144cac3a3a56730faee104767b0da53db2",
	name: "startPreviewVideo",
	filename: "src/lib/requests.functions.ts"
}, (opts) => startPreviewVideo.__executeServer(opts));
var startPreviewVideo = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(startPreviewVideo_createServerFn_handler, async ({ data, context }) => {
	const { data: request, error } = await context.supabase.from("design_requests").select("*").eq("id", data.id).maybeSingle();
	if (error) throw new Error(error.message);
	if (!request) throw new Error("Request not found");
	const cad = await import("./cad.server-BmI4TIKN.mjs");
	return { jobId: await cad.createVideoJob(cad.videoPrompt({
		title: request.title,
		brief: request.brief,
		category: request.category,
		dimensions: request.dimensions,
		units: request.units,
		style: request.style
	})) };
});
var pollPreviewVideo_createServerFn_handler = createServerRpc({
	id: "dc9fc0fde8697a6cf46f9a6083b7d652f68ed87f24a20e5f0f6b807ef4443ae7",
	name: "pollPreviewVideo",
	filename: "src/lib/requests.functions.ts"
}, (opts) => pollPreviewVideo.__executeServer(opts));
var pollPreviewVideo = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	id: stringType().uuid(),
	jobId: stringType().min(3).max(200)
}).parse(input)).handler(pollPreviewVideo_createServerFn_handler, async ({ data, context }) => {
	const { data: request } = await context.supabase.from("design_requests").select("id,user_id").eq("id", data.id).maybeSingle();
	if (!request) throw new Error("Request not found");
	const cad = await import("./cad.server-BmI4TIKN.mjs");
	const job = await cad.readVideoJob(data.jobId);
	if (job.status === "failed") throw new Error(job.error?.message ?? "Video generation failed. Try again.");
	if (job.status !== "completed") return {
		status: job.status,
		progress: job.progress ?? 0
	};
	const { supabaseAdmin } = await import("./client.server-CxJTsU3s.mjs");
	const path = `${context.userId}/${request.id}/${data.jobId}.mp4`;
	const { data: existing } = await supabaseAdmin.from("request_assets").select("id").eq("request_id", request.id).eq("url", path).maybeSingle();
	if (!existing) {
		const mp4 = await cad.downloadVideo(data.jobId);
		const up = await supabaseAdmin.storage.from(BUCKET).upload(path, mp4, {
			contentType: "video/mp4",
			upsert: true
		});
		if (up.error) throw new Error(up.error.message);
		await supabaseAdmin.from("request_assets").insert({
			request_id: request.id,
			user_id: context.userId,
			kind: "video",
			url: path
		});
	}
	return {
		status: "completed",
		progress: 100
	};
});
//#endregion
export { createRequest_createServerFn_handler, generatePreviewImages_createServerFn_handler, getDailyFreeUsage_createServerFn_handler, getRequest_createServerFn_handler, listMyRequests_createServerFn_handler, payForRequest_createServerFn_handler, pollPreviewVideo_createServerFn_handler, startPreviewVideo_createServerFn_handler, uploadReferenceImages_createServerFn_handler };
