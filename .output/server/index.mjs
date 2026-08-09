globalThis.__nitro_main__ = import.meta.url;
import { a as FastResponse, n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
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
	"/assets/activate-B7HczVDj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"73e-NZHH1PMCWTqqH1V+i23Kr943F48\"",
		"mtime": "2026-08-09T07:02:21.961Z",
		"size": 1854,
		"path": "../public/assets/activate-B7HczVDj.js"
	},
	"/assets/admin-sNUKcRGF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d74-ev2N8yqMLFzT0MqYLTWsx+SDGWM\"",
		"mtime": "2026-08-09T07:02:21.961Z",
		"size": 7540,
		"path": "../public/assets/admin-sNUKcRGF.js"
	},
	"/assets/bookmark-D-AJcAo6.png": {
		"type": "image/png",
		"etag": "\"21a5-HbxtDqkgzHoRsuz1IPdHZOHjccs\"",
		"mtime": "2026-08-09T07:02:21.966Z",
		"size": 8613,
		"path": "../public/assets/bookmark-D-AJcAo6.png"
	},
	"/assets/comment-DFv7chMC.png": {
		"type": "image/png",
		"etag": "\"30a0-81SxTSZSHytTg63PY6uztXsaCZ8\"",
		"mtime": "2026-08-09T07:02:21.966Z",
		"size": 12448,
		"path": "../public/assets/comment-DFv7chMC.png"
	},
	"/assets/heart-BayXRS8Q.png": {
		"type": "image/png",
		"etag": "\"3051-A0ZRawubMwDRszzUzb+S51cIe0I\"",
		"mtime": "2026-08-09T07:02:21.966Z",
		"size": 12369,
		"path": "../public/assets/heart-BayXRS8Q.png"
	},
	"/assets/license-B_y0Nb2-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3ea-6mdKEk5SjpEUphpWJrcHJDnD4UA\"",
		"mtime": "2026-08-09T07:02:21.961Z",
		"size": 1002,
		"path": "../public/assets/license-B_y0Nb2-.js"
	},
	"/assets/repost-2ZMzA8ZP.png": {
		"type": "image/png",
		"etag": "\"25bd-lB3WS82FdC5YhYih1TRzicIXhpU\"",
		"mtime": "2026-08-09T07:02:21.966Z",
		"size": 9661,
		"path": "../public/assets/repost-2ZMzA8ZP.png"
	},
	"/assets/reel-thumb-tRQHh08Z.jpg": {
		"type": "image/jpeg",
		"etag": "\"ed0f-iwEZGZY6kfEOodsJ9cEufh/HSBs\"",
		"mtime": "2026-08-09T07:02:21.966Z",
		"size": 60687,
		"path": "../public/assets/reel-thumb-tRQHh08Z.jpg"
	},
	"/assets/routes-CA3l1SLY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"925d-M/iXFPRT/PXzupxOBMeI+EmZqug\"",
		"mtime": "2026-08-09T07:02:21.961Z",
		"size": 37469,
		"path": "../public/assets/routes-CA3l1SLY.js"
	},
	"/assets/share-0H-pAryc.png": {
		"type": "image/png",
		"etag": "\"293e-c2oF+rzWfzGfeCxiyjFRG4UEzPI\"",
		"mtime": "2026-08-09T07:02:21.966Z",
		"size": 10558,
		"path": "../public/assets/share-0H-pAryc.png"
	},
	"/assets/styles-D6k7Xz_k.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"147a6-T955BoddvYB5CYtnc6RyeUxlP0I\"",
		"mtime": "2026-08-09T07:02:21.966Z",
		"size": 83878,
		"path": "../public/assets/styles-D6k7Xz_k.css"
	},
	"/assets/index-D_c4bx56.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"54395-lSPQJBXyXQKJVZUjIsg4Aw7xgmQ\"",
		"mtime": "2026-08-09T07:02:21.958Z",
		"size": 344981,
		"path": "../public/assets/index-D_c4bx56.js"
	},
	"/assets/timer-C9hxXrwb.png": {
		"type": "image/png",
		"etag": "\"13d11-vkHLM1ZESbfBmivJ1JSMBK8d17Q\"",
		"mtime": "2026-08-09T07:02:21.974Z",
		"size": 81169,
		"path": "../public/assets/timer-C9hxXrwb.png"
	},
	"/assets/supabase-BLE-w3F9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31f63-L3XhgJCe3QXIUYK6UYl9SKo5bWI\"",
		"mtime": "2026-08-09T07:02:21.966Z",
		"size": 204643,
		"path": "../public/assets/supabase-BLE-w3F9.js"
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
var _lazy_PwCN9k = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_PwCN9k
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
