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
		"etag": "\"917e-ld5OIYBPIk1hH3iwwZALWNNL/Uk\"",
		"mtime": "2026-08-13T12:11:41.030Z",
		"size": 37246,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-13T12:11:41.030Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/arrow-right-_8lg7wzf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a0-UzaqMUjZQmSS+RCYoU8oP1q1dXc\"",
		"mtime": "2026-08-13T12:11:39.615Z",
		"size": 160,
		"path": "../public/assets/arrow-right-_8lg7wzf.js"
	},
	"/assets/auth-BUYbUR4l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2669-gkmbfZXnrLntiBEupIs8bg5Rg+Q\"",
		"mtime": "2026-08-13T12:11:39.615Z",
		"size": 9833,
		"path": "../public/assets/auth-BUYbUR4l.js"
	},
	"/assets/auth-middleware-ArhmdblQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d-tRFt1d2qMh17qlegiPj6Qs/AlwI\"",
		"mtime": "2026-08-13T12:11:39.615Z",
		"size": 77,
		"path": "../public/assets/auth-middleware-ArhmdblQ.js"
	},
	"/assets/base-sepolia-pay-Ba5gqdga.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c54-0NijvdDjpH9nwTXS8FyrJQlPnUs\"",
		"mtime": "2026-08-13T12:11:39.615Z",
		"size": 3156,
		"path": "../public/assets/base-sepolia-pay-Ba5gqdga.js"
	},
	"/assets/ccip-QIdW_QI9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b2f-2YnSsskuwsoXe0kXAl4PAJYQeP4\"",
		"mtime": "2026-08-13T12:11:39.615Z",
		"size": 2863,
		"path": "../public/assets/ccip-QIdW_QI9.js"
	},
	"/assets/dashboard-C9WF0BRh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"72e1-n2s+G3U5EaiQUrv/KWtQba/dOJM\"",
		"mtime": "2026-08-13T12:11:39.615Z",
		"size": 29409,
		"path": "../public/assets/dashboard-C9WF0BRh.js"
	},
	"/assets/dist-DKZ33ETh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3d2e-Nb001yJcxChf/ivrrEMvymVBsGo\"",
		"mtime": "2026-08-13T12:11:39.615Z",
		"size": 15662,
		"path": "../public/assets/dist-DKZ33ETh.js"
	},
	"/assets/dist-DTZ3_Seh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6c35a-CVxqo6CIR8xV4BnQpxH0DN7ZfYQ\"",
		"mtime": "2026-08-13T12:11:39.615Z",
		"size": 443226,
		"path": "../public/assets/dist-DTZ3_Seh.js"
	},
	"/assets/film-BweSALsc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"192-CJbFe7ET4CG6geI8RUD7exMda2U\"",
		"mtime": "2026-08-13T12:11:39.616Z",
		"size": 402,
		"path": "../public/assets/film-BweSALsc.js"
	},
	"/assets/dist-zYXwGVli.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"46e68-CHDfWnUSIFHEatGJswN+Ym7uqto\"",
		"mtime": "2026-08-13T12:11:39.616Z",
		"size": 290408,
		"path": "../public/assets/dist-zYXwGVli.js"
	},
	"/assets/jsx-dev-runtime-CuvpMxSw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cd9e-p5cM5W6fGOcJoReN51Tglk8jl7o\"",
		"mtime": "2026-08-13T12:11:39.616Z",
		"size": 52638,
		"path": "../public/assets/jsx-dev-runtime-CuvpMxSw.js"
	},
	"/assets/label-Bdd0NcGd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7d0-FOLH6u/n4zTWO7ZEg7cdzSZTJtE\"",
		"mtime": "2026-08-13T12:11:39.616Z",
		"size": 2e3,
		"path": "../public/assets/label-Bdd0NcGd.js"
	},
	"/assets/matchContext-DA3pubeK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d2-190kHij/dfnhzRDLAEx7Qk9y7OA\"",
		"mtime": "2026-08-13T12:11:39.616Z",
		"size": 210,
		"path": "../public/assets/matchContext-DA3pubeK.js"
	},
	"/assets/new-a9NUtjBQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"293a-Cq9u+igmXaCfl+BFl7KmsHXyOvg\"",
		"mtime": "2026-08-13T12:11:39.616Z",
		"size": 10554,
		"path": "../public/assets/new-a9NUtjBQ.js"
	},
	"/assets/index-DaNPgw47.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"719b2-dVPx+1u9nIqeNgJ/m4qqj4Rq2D8\"",
		"mtime": "2026-08-13T12:11:39.615Z",
		"size": 465330,
		"path": "../public/assets/index-DaNPgw47.js"
	},
	"/assets/preload-helper-Czpn1I53.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ac-sE+5KsaRXTMfwOfrOATQajMSGV4\"",
		"mtime": "2026-08-13T12:11:39.616Z",
		"size": 1196,
		"path": "../public/assets/preload-helper-Czpn1I53.js"
	},
	"/assets/pricing-wu0naleJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19e1-ueAGYTHssLqfopa3QR3t0SKdX6E\"",
		"mtime": "2026-08-13T12:11:39.616Z",
		"size": 6625,
		"path": "../public/assets/pricing-wu0naleJ.js"
	},
	"/assets/refresh-cw-DaHiM9yL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23d-/vaBnKkZ+y8j7Mz6qEsCKiB0Mzk\"",
		"mtime": "2026-08-13T12:11:39.616Z",
		"size": 573,
		"path": "../public/assets/refresh-cw-DaHiM9yL.js"
	},
	"/assets/localBatchGatewayRequest-Bz7aeI3t.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a348-ckiqeOjvvYWtXgAA9d4gtTMQfq8\"",
		"mtime": "2026-08-13T12:11:39.616Z",
		"size": 107336,
		"path": "../public/assets/localBatchGatewayRequest-Bz7aeI3t.js"
	},
	"/assets/requests._id-CR1SU7-g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a03-TJf6OEe5czfIqJKCoUcUub9mc8w\"",
		"mtime": "2026-08-13T12:11:39.616Z",
		"size": 10755,
		"path": "../public/assets/requests._id-CR1SU7-g.js"
	},
	"/assets/pen-tool-DvnpTAAv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d2-JT0+v58ytOScHuTWsxPGurxx4zQ\"",
		"mtime": "2026-08-13T12:11:39.616Z",
		"size": 466,
		"path": "../public/assets/pen-tool-DvnpTAAv.js"
	},
	"/assets/lazyRouteComponent-C44M6mjA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13f5-Ok6RA1KcC+VcwPpQNMwcWcb4sQc\"",
		"mtime": "2026-08-13T12:11:39.616Z",
		"size": 5109,
		"path": "../public/assets/lazyRouteComponent-C44M6mjA.js"
	},
	"/assets/brotli_wasm_bg-NfWIZley.wasm": {
		"type": "application/wasm",
		"etag": "\"10205c-AEnUTsLl6E7cDcjeOYoRV2XAGuI\"",
		"mtime": "2026-08-13T12:11:39.617Z",
		"size": 1056860,
		"path": "../public/assets/brotli_wasm_bg-NfWIZley.wasm"
	},
	"/assets/requests.functions-CKsJUlIl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29d7-hDBTLuRez4ltnSjeGEx2xh4cyS4\"",
		"mtime": "2026-08-13T12:11:39.616Z",
		"size": 10711,
		"path": "../public/assets/requests.functions-CKsJUlIl.js"
	},
	"/assets/rolldown-runtime-QTnfLwEv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b6-wnqLLSlp3SaE+lbe74bKNe5Rpds\"",
		"mtime": "2026-08-13T12:11:39.616Z",
		"size": 694,
		"path": "../public/assets/rolldown-runtime-QTnfLwEv.js"
	},
	"/assets/route-BaURMUOM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"117-bE8PPUPOloupFZVAbzf/85nfZGY\"",
		"mtime": "2026-08-13T12:11:39.616Z",
		"size": 279,
		"path": "../public/assets/route-BaURMUOM.js"
	},
	"/assets/routes-DRckkdfy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2827-mmvmjKstfbKnc6+OED3qaK20wbM\"",
		"mtime": "2026-08-13T12:11:39.616Z",
		"size": 10279,
		"path": "../public/assets/routes-DRckkdfy.js"
	},
	"/assets/secp256k1-DML13Xwp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"866c-Upbq6asx5AscZplaeZisHtaRUcA\"",
		"mtime": "2026-08-13T12:11:39.616Z",
		"size": 34412,
		"path": "../public/assets/secp256k1-DML13Xwp.js"
	},
	"/assets/select-DnGGhxmx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"118a5-zgI2CSf6YgWI+AFVRQK11Q2CvLc\"",
		"mtime": "2026-08-13T12:11:39.617Z",
		"size": 71845,
		"path": "../public/assets/select-DnGGhxmx.js"
	},
	"/assets/sparkles-BZJVcxEE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e9-MNHL1hETL4bFRjwViFG3Ht/bz9U\"",
		"mtime": "2026-08-13T12:11:39.617Z",
		"size": 489,
		"path": "../public/assets/sparkles-BZJVcxEE.js"
	},
	"/assets/status-badge-DueoSSTP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"423-6YuQJTLP2B+c0yLk26/1ryleWGo\"",
		"mtime": "2026-08-13T12:11:39.617Z",
		"size": 1059,
		"path": "../public/assets/status-badge-DueoSSTP.js"
	},
	"/assets/styles-CI7jZ7uu.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"16a5b-xUJ5KiWFk6stoss4BBldso/2U3M\"",
		"mtime": "2026-08-13T12:11:39.618Z",
		"size": 92763,
		"path": "../public/assets/styles-CI7jZ7uu.css"
	},
	"/assets/subscription-CT-hmZuF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"910d-tWYM3Bo3xgg/XMCGvFkbHWjxZ7E\"",
		"mtime": "2026-08-13T12:11:39.617Z",
		"size": 37133,
		"path": "../public/assets/subscription-CT-hmZuF.js"
	},
	"/assets/types-Ck9BYy3q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc54-J55+T9uFaje4sy4JtecrD311nHI\"",
		"mtime": "2026-08-13T12:11:39.617Z",
		"size": 56404,
		"path": "../public/assets/types-Ck9BYy3q.js"
	},
	"/assets/utils-BXiNjgTj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c79-ionugoZtWW6O73RV71L8HZlJ6Hw\"",
		"mtime": "2026-08-13T12:11:39.617Z",
		"size": 3193,
		"path": "../public/assets/utils-BXiNjgTj.js"
	},
	"/assets/wallet-auth-B5wguDNr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ac9c-KQVJp1wgdHXgZrmyAKcauvJAh1k\"",
		"mtime": "2026-08-13T12:11:39.617Z",
		"size": 44188,
		"path": "../public/assets/wallet-auth-B5wguDNr.js"
	},
	"/assets/workspace-BWaFfJkP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7b69-uC4PLHKCZoix1JtUv+OZyXwP7/s\"",
		"mtime": "2026-08-13T12:11:39.617Z",
		"size": 31593,
		"path": "../public/assets/workspace-BWaFfJkP.js"
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
