import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-BkTGMIn1.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/status-badge.tsx";
var LABELS = {
	free_test: {
		label: "Free Test",
		className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
	},
	draft: {
		label: "Draft",
		className: "bg-muted text-muted-foreground"
	},
	submitted: {
		label: "Submitted",
		className: "bg-blueprint/15 text-blueprint"
	},
	generating: {
		label: "Generating",
		className: "bg-blueprint/15 text-blueprint"
	},
	preview_ready: {
		label: "Preview ready",
		className: "bg-primary/15 text-primary"
	},
	approved: {
		label: "Approved",
		className: "bg-primary/15 text-primary"
	},
	drafting: {
		label: "Drafting",
		className: "bg-primary/15 text-primary"
	},
	delivered: {
		label: "Delivered",
		className: "bg-blueprint/20 text-blueprint"
	},
	cancelled: {
		label: "Cancelled",
		className: "bg-destructive/15 text-destructive"
	}
};
function StatusBadge({ status }) {
	const s = LABELS[status] ?? {
		label: status,
		className: "bg-muted text-muted-foreground"
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: `tech-label rounded-sm px-2.5 py-1 ${s.className}`,
		children: s.label
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 37,
		columnNumber: 5
	}, this);
}
//#endregion
export { StatusBadge as t };
