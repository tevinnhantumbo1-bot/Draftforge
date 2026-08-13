import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as getRequest } from "./request-response-BEPp1C2k.mjs";
import { t as createMiddleware } from "./createMiddleware-B_4t7rW1.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-middleware-BazXO3nj.js
function isNewSupabaseApiKey(value) {
	return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function createSupabaseFetch(supabaseKey) {
	return (input, init) => {
		const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
		if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
		if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) headers.delete("Authorization");
		headers.set("apikey", supabaseKey);
		return fetch(input, {
			...init,
			headers
		});
	};
}
var requireSupabaseAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
	const SUPABASE_URL = processModule.env["SUPABASE_URL"] || processModule.env["VITE_SUPABASE_URL"] || "https://placeholder.supabase.co";
	const SUPABASE_PUBLISHABLE_KEY = processModule.env["SUPABASE_PUBLISHABLE_KEY"] || processModule.env["VITE_SUPABASE_PUBLISHABLE_KEY"] || "placeholder-key";
	const SUPABASE_SERVICE_ROLE_KEY = processModule.env["SUPABASE_SERVICE_ROLE_KEY"] || processModule.env["VITE_SUPABASE_PUBLISHABLE_KEY"] || SUPABASE_PUBLISHABLE_KEY;
	const authHeader = getRequest()?.headers?.get("authorization");
	if (authHeader && authHeader.startsWith("Bearer ")) {
		const token = authHeader.replace("Bearer ", "");
		if (token && token.split(".").length === 3) {
			const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
				global: {
					fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
					headers: { Authorization: `Bearer ${token}` }
				},
				auth: {
					storage: void 0,
					persistSession: false,
					autoRefreshToken: false
				}
			});
			try {
				const { data, error } = await supabase.auth.getClaims(token);
				if (!error && data?.claims?.sub) return next({ context: {
					supabase,
					userId: data.claims.sub,
					claims: data.claims
				} });
			} catch (err) {
				console.warn("[AuthMiddleware] Token claim verification error:", err);
			}
		}
	}
	return next({ context: {
		supabase: createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
			global: { fetch: createSupabaseFetch(SUPABASE_SERVICE_ROLE_KEY) },
			auth: {
				storage: void 0,
				persistSession: false,
				autoRefreshToken: false
			}
		}),
		userId: "guest_user",
		claims: null
	} });
});
//#endregion
export { requireSupabaseAuth as t };
