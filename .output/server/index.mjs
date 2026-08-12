globalThis.__nitro_main__ = import.meta.url;
import { i as defineLazyEventHandler, n as HTTPError, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-08-11T14:20:08.007Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/assets/auth-CYVNlkgC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ebc-oUTse+hL9hAYJb1m7foyI7+21cU\"",
		"mtime": "2026-08-11T14:20:07.194Z",
		"size": 7868,
		"path": "../public/assets/auth-CYVNlkgC.js"
	},
	"/assets/check-DrbA_jy8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"77-/N4Mf65QKvd51reuzAOd+YocHCU\"",
		"mtime": "2026-08-11T14:20:07.194Z",
		"size": 119,
		"path": "../public/assets/check-DrbA_jy8.js"
	},
	"/assets/dashboard-WFcnjndE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"870-mFUnQMcS7vmUbUF8BNkabm0dfzA\"",
		"mtime": "2026-08-11T14:20:07.194Z",
		"size": 2160,
		"path": "../public/assets/dashboard-WFcnjndE.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-11T14:20:08.007Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/ccip-QIdW_QI9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b2f-2YnSsskuwsoXe0kXAl4PAJYQeP4\"",
		"mtime": "2026-08-11T14:20:07.194Z",
		"size": 2863,
		"path": "../public/assets/ccip-QIdW_QI9.js"
	},
	"/assets/dist-BwLMs6hN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"44cf1-Fv0RMlxB1GxuG3PyzcXXxmAX9jA\"",
		"mtime": "2026-08-11T14:20:07.194Z",
		"size": 281841,
		"path": "../public/assets/dist-BwLMs6hN.js"
	},
	"/assets/dist-DTZ3_Seh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6c35a-CVxqo6CIR8xV4BnQpxH0DN7ZfYQ\"",
		"mtime": "2026-08-11T14:20:07.195Z",
		"size": 443226,
		"path": "../public/assets/dist-DTZ3_Seh.js"
	},
	"/assets/index-D8dkHXLV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"43c3e-vlDtGoFtt8dL5n7mjd+yif1YJjU\"",
		"mtime": "2026-08-11T14:20:07.194Z",
		"size": 277566,
		"path": "../public/assets/index-D8dkHXLV.js"
	},
	"/assets/label-CC1v3MI8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6ee-jsJYUTNXu8JJjJloTwRPiKTVXTE\"",
		"mtime": "2026-08-11T14:20:07.195Z",
		"size": 1774,
		"path": "../public/assets/label-CC1v3MI8.js"
	},
	"/assets/lazyRouteComponent-odr2hZWm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"117c-2ECBuvX+GjMakFdO7kXN5SDjqo4\"",
		"mtime": "2026-08-11T14:20:07.195Z",
		"size": 4476,
		"path": "../public/assets/lazyRouteComponent-odr2hZWm.js"
	},
	"/assets/localBatchGatewayRequest-Bz7aeI3t.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a348-ckiqeOjvvYWtXgAA9d4gtTMQfq8\"",
		"mtime": "2026-08-11T14:20:07.195Z",
		"size": 107336,
		"path": "../public/assets/localBatchGatewayRequest-Bz7aeI3t.js"
	},
	"/assets/pricing-DeYh_zjQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"aa1-IU1dm8jvb6IIudtq0MEXEn07rag\"",
		"mtime": "2026-08-11T14:20:07.195Z",
		"size": 2721,
		"path": "../public/assets/pricing-DeYh_zjQ.js"
	},
	"/assets/requests._id-DeqjpBR_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20f7-uLPDChR6Rr1BkJ3Q0qVwxo053qo\"",
		"mtime": "2026-08-11T14:20:07.195Z",
		"size": 8439,
		"path": "../public/assets/requests._id-DeqjpBR_.js"
	},
	"/assets/requests.functions-C8BXPyZV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"47e-9f1iTiw0VKmwjc33Q/Oo+cg2Snw\"",
		"mtime": "2026-08-11T14:20:07.195Z",
		"size": 1150,
		"path": "../public/assets/requests.functions-C8BXPyZV.js"
	},
	"/assets/rolldown-runtime-QTnfLwEv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b6-wnqLLSlp3SaE+lbe74bKNe5Rpds\"",
		"mtime": "2026-08-11T14:20:07.195Z",
		"size": 694,
		"path": "../public/assets/rolldown-runtime-QTnfLwEv.js"
	},
	"/assets/route-B2HqDfiF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a-07BS68NkDKnOJ+lKJhSFuLIZmsI\"",
		"mtime": "2026-08-11T14:20:07.195Z",
		"size": 138,
		"path": "../public/assets/route-B2HqDfiF.js"
	},
	"/assets/routes-C4gM7Fq1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1aad-TEd09tKqOSkP82ZJE5GCnmN6Fqo\"",
		"mtime": "2026-08-11T14:20:07.195Z",
		"size": 6829,
		"path": "../public/assets/routes-C4gM7Fq1.js"
	},
	"/assets/new-D6xLFOAk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1631b-JtIPvmtTG6NiuKWPndNY/6zf5CY\"",
		"mtime": "2026-08-11T14:20:07.195Z",
		"size": 90907,
		"path": "../public/assets/new-D6xLFOAk.js"
	},
	"/assets/preload-helper-Czpn1I53.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ac-sE+5KsaRXTMfwOfrOATQajMSGV4\"",
		"mtime": "2026-08-11T14:20:07.195Z",
		"size": 1196,
		"path": "../public/assets/preload-helper-Czpn1I53.js"
	},
	"/assets/matchContext-2AXZsDtv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cb-BkpY3BlxQS1ZFMWkb0yW31OEWoY\"",
		"mtime": "2026-08-11T14:20:07.195Z",
		"size": 203,
		"path": "../public/assets/matchContext-2AXZsDtv.js"
	},
	"/assets/secp256k1-DML13Xwp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"866c-Upbq6asx5AscZplaeZisHtaRUcA\"",
		"mtime": "2026-08-11T14:20:07.195Z",
		"size": 34412,
		"path": "../public/assets/secp256k1-DML13Xwp.js"
	},
	"/assets/sparkles-C-oZq1-o.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34b-kxHjf7AcuEq9ZZCu+Lzl9vqEzNE\"",
		"mtime": "2026-08-11T14:20:07.195Z",
		"size": 843,
		"path": "../public/assets/sparkles-C-oZq1-o.js"
	},
	"/assets/status-badge-MMUuav3Z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2592-vEnPCwXdQbbdG+PmL1zFTvJ6hLg\"",
		"mtime": "2026-08-11T14:20:07.195Z",
		"size": 9618,
		"path": "../public/assets/status-badge-MMUuav3Z.js"
	},
	"/assets/brotli_wasm_bg-NfWIZley.wasm": {
		"type": "application/wasm",
		"etag": "\"10205c-AEnUTsLl6E7cDcjeOYoRV2XAGuI\"",
		"mtime": "2026-08-11T14:20:07.196Z",
		"size": 1056860,
		"path": "../public/assets/brotli_wasm_bg-NfWIZley.wasm"
	},
	"/assets/styles-CTRZks0r.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"13862-G5p8JiSEOBajmV2VTY00sz6/yOE\"",
		"mtime": "2026-08-11T14:20:07.197Z",
		"size": 79970,
		"path": "../public/assets/styles-CTRZks0r.css"
	},
	"/assets/types-Ck9BYy3q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc54-J55+T9uFaje4sy4JtecrD311nHI\"",
		"mtime": "2026-08-11T14:20:07.195Z",
		"size": 56404,
		"path": "../public/assets/types-Ck9BYy3q.js"
	},
	"/assets/useStore-DH0JLZyX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6d4c-u9juaDHPFnx7z4oFbIMpIvIlUsc\"",
		"mtime": "2026-08-11T14:20:07.195Z",
		"size": 27980,
		"path": "../public/assets/useStore-DH0JLZyX.js"
	},
	"/assets/utils-BXiNjgTj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c79-ionugoZtWW6O73RV71L8HZlJ6Hw\"",
		"mtime": "2026-08-11T14:20:07.195Z",
		"size": 3193,
		"path": "../public/assets/utils-BXiNjgTj.js"
	},
	"/assets/wallet-auth-Dn3VNDqY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5b1-FU9Cr+kouPonKF7b2UHA2qciwDk\"",
		"mtime": "2026-08-11T14:20:07.196Z",
		"size": 42417,
		"path": "../public/assets/wallet-auth-Dn3VNDqY.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_6qWkqV = defineLazyEventHandler(() => import("./_chunks/renderer-template.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_6qWkqV
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
