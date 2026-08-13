//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-CeX34BwK.js
var manifest = {
	"0786f1eb4de727c8fb3c9260b504c33b8954f23f70c56986640869e12a414724": {
		functionName: "verifyWalletLogin_createServerFn_handler",
		importer: () => import("./_ssr/wallet.functions-jCUS9zz_.mjs")
	},
	"12ffc090f0a42ac0e9ab434980c3d966e58ad934910f24ffdc85259ee394bf94": {
		functionName: "getBasePayConfig_createServerFn_handler",
		importer: () => import("./_ssr/payments.functions-D5siRrRx.mjs")
	},
	"30e3218280c4e18d034e9f14bdf67ff9898538869d2def8924206a9ceef7e763": {
		functionName: "getDailyFreeUsage_createServerFn_handler",
		importer: () => import("./_ssr/requests.functions-uuQTY1M1.mjs")
	},
	"38d47513897a676e372959150d84f3733f0c9dbc2896f2974df92f762a883725": {
		functionName: "prepareSubscriptionBasePay_createServerFn_handler",
		importer: () => import("./_ssr/payments.functions-D5siRrRx.mjs")
	},
	"4b88c82fc0046a589bdb5580d2d2540f1499d5e2e36a6a47a5cdff6c0891f1f7": {
		functionName: "listMyRequests_createServerFn_handler",
		importer: () => import("./_ssr/requests.functions-uuQTY1M1.mjs")
	},
	"57571f98c5b68b1f6eee0b076a7c89da8e1b94e17d7cbd14783b34d49d9135bc": {
		functionName: "createRequest_createServerFn_handler",
		importer: () => import("./_ssr/requests.functions-uuQTY1M1.mjs")
	},
	"741a6f58b805c40b71389559f050a6a5d3ba7c3b64860bebf189e7715e29169f": {
		functionName: "getRequest_createServerFn_handler",
		importer: () => import("./_ssr/requests.functions-uuQTY1M1.mjs")
	},
	"7dd0941d9bbb9c40c460bb1a01a7c98948356e61326cfec658697a948b333e05": {
		functionName: "uploadReferenceImages_createServerFn_handler",
		importer: () => import("./_ssr/requests.functions-uuQTY1M1.mjs")
	},
	"9b1e5de749d30792721851406091b1b0f488079548128c0bf825f5721c2743bb": {
		functionName: "processSubscriptionPayment_createServerFn_handler",
		importer: () => import("./_ssr/payments.functions-D5siRrRx.mjs")
	},
	"a92a1b1e490c2510e1a612ef2e4d51a1d57bb74f5abd8ade98451102ef0671e3": {
		functionName: "generatePreviewImages_createServerFn_handler",
		importer: () => import("./_ssr/requests.functions-uuQTY1M1.mjs")
	},
	"b1778de095c38a466781cefc0b5502144cac3a3a56730faee104767b0da53db2": {
		functionName: "startPreviewVideo_createServerFn_handler",
		importer: () => import("./_ssr/requests.functions-uuQTY1M1.mjs")
	},
	"db64cc4519008001978ccaec1849e35f9192f207fd6f7800faa063f13dfb855a": {
		functionName: "preparePayment_createServerFn_handler",
		importer: () => import("./_ssr/payments.functions-D5siRrRx.mjs")
	},
	"dc9fc0fde8697a6cf46f9a6083b7d652f68ed87f24a20e5f0f6b807ef4443ae7": {
		functionName: "pollPreviewVideo_createServerFn_handler",
		importer: () => import("./_ssr/requests.functions-uuQTY1M1.mjs")
	},
	"e98390e11ea8cc77a1eaa0ce72d5aca98bb4595ad6de924c498fa20072e0b22d": {
		functionName: "getWalletNonce_createServerFn_handler",
		importer: () => import("./_ssr/wallet.functions-jCUS9zz_.mjs")
	},
	"f87be253850d40315fc04f708ff4e4f61d70c91c222c435a92adb1f8eaafbe23": {
		functionName: "payForRequest_createServerFn_handler",
		importer: () => import("./_ssr/requests.functions-uuQTY1M1.mjs")
	},
	"f9c0b800b4986ae59bf444881699076fb2293d9808003f029eab43138d3ec595": {
		functionName: "confirmBasePayment_createServerFn_handler",
		importer: () => import("./_ssr/payments.functions-D5siRrRx.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
