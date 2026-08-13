import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { C as ArrowRight, a as Ruler, d as Film, r as Sparkles, s as PenTool, x as Check } from "../_libs/lucide-react.mjs";
import { t as Button } from "./wallet-auth-Cjb9Ehvm.mjs";
import { PACKAGES, formatMoney } from "./pricing-iHp73A5v.mjs";
import { t as SiteHeader } from "./site-header-BfayvmgK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dd7TVjwM.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/index.tsx?tsr-split=component";
var STEPS = [
	{
		icon: PenTool,
		label: "01 / Brief",
		title: "Describe the design",
		body: "Plain words, dimensions, materials, references. No CAD knowledge required."
	},
	{
		icon: Sparkles,
		label: "02 / Preview",
		title: "AI renders the concept",
		body: "Three concept images — blueprint, realistic and isometric — generated from your brief."
	},
	{
		icon: Film,
		label: "03 / Motion",
		title: "See it move",
		body: "A short orbiting video preview so you can sign off on the form before drafting starts."
	},
	{
		icon: Ruler,
		label: "04 / Drafting",
		title: "I draft it in AutoCAD",
		body: "Approved concepts become dimensioned, layered, production-ready DWG and PDF files."
	}
];
function Index() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SiteHeader, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 29,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "grid-paper relative overflow-hidden border-b border-border/70",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-32",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "tech-label text-blueprint",
								children: "Text → preview → DWG"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 35,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
								className: "mt-5 text-5xl leading-[1.05] font-semibold sm:text-6xl",
								children: ["Describe your design.", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "block text-primary",
									children: "Get real AutoCAD drawings."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 38,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 36,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-6 max-w-xl text-lg text-muted-foreground",
								children: "AI turns your brief into concept images and a motion preview in minutes. Once you approve the look, a human draftsman produces the actual dimensioned DWG set."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 42,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-9 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									asChild: true,
									variant: "hero",
									size: "xl",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/new",
										children: ["Start a request ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, {}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 50,
											columnNumber: 37
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 49,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 48,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									asChild: true,
									variant: "blueprint",
									size: "xl",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
										href: "#pricing",
										children: "See pricing"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 54,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 53,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 47,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dl", {
								className: "mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border/70 pt-6",
								children: [
									["48h", "Fastest turnaround"],
									["3", "Concept images per brief"],
									["DWG", "Native AutoCAD files"]
								].map(([v, l]) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", {
									className: "font-mono text-2xl text-primary",
									children: v
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 59,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", {
									className: "tech-label mt-1 text-muted-foreground",
									children: l
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 60,
									columnNumber: 21
								}, this)] }, l, true, {
									fileName: _jsxFileName,
									lineNumber: 58,
									columnNumber: 134
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 57,
								columnNumber: 15
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 34,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "panel relative flex flex-col gap-4 p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "tech-label flex items-center justify-between text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "preview.dwg" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 69,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-blueprint",
										children: "live"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 70,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 68,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid-paper flex aspect-4/3 items-center justify-center rounded-md border border-blueprint/25 bg-background/60",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
										viewBox: "0 0 240 180",
										className: "h-full w-full p-6",
										role: "img",
										"aria-label": "Blueprint preview illustration",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("g", {
											fill: "none",
											stroke: "oklch(0.78 0.11 215)",
											strokeWidth: "1.2",
											strokeLinecap: "square",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("rect", {
													x: "30",
													y: "40",
													width: "180",
													height: "110"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 75,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M30 90h80V40M110 90h100M150 90v60" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 76,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
													cx: "70",
													cy: "120",
													r: "18"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 77,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M20 40v110M24 40h-8M24 150h-8" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 78,
													columnNumber: 21
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 74,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("g", {
											stroke: "oklch(0.79 0.152 78)",
											strokeWidth: "1.6",
											fill: "none",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M110 40v50M110 90h40" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 81,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 80,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 73,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 72,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "font-mono text-xs text-muted-foreground",
									children: "“Single-storey garden studio, 6000 × 3600, cedar cladding, full-height glazing to the south elevation.”"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 85,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 67,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 33,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 32,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "mx-auto max-w-6xl px-5 py-20",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "text-3xl font-semibold",
						children: "How it works"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 94,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4",
						children: STEPS.map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "panel p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(s.icon, { className: "size-5 text-primary" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 97,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "tech-label mt-4 text-blueprint",
									children: s.label
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 98,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
									className: "mt-2 text-lg font-semibold",
									children: s.title
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 99,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: s.body
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 100,
									columnNumber: 17
								}, this)
							]
						}, s.label, true, {
							fileName: _jsxFileName,
							lineNumber: 96,
							columnNumber: 29
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 95,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 93,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					id: "pricing",
					className: "border-t border-border/70 bg-surface/40",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mx-auto max-w-6xl px-5 py-20",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "text-3xl font-semibold",
								children: "Pricing"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 107,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-2 text-muted-foreground",
								children: "AI previews are included in every package. Final quote adjusts with complexity."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 108,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-10 grid gap-5 lg:grid-cols-3",
								children: PACKAGES.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: `panel flex flex-col p-7 ${p.id === "standard" ? "ring-1 ring-primary/50" : ""}`,
									children: [
										p.id === "standard" && /* @__PURE__ */ (void 0)("span", {
											className: "tech-label mb-3 w-fit rounded-sm bg-primary/15 px-2 py-1 text-primary",
											children: "Most popular"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 114,
											columnNumber: 43
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
											className: "text-xl font-semibold",
											children: p.name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 117,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "mt-1 text-sm text-muted-foreground",
											children: p.blurb
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 118,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "mt-5 font-mono text-4xl text-primary",
											children: formatMoney(p.price * 100)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 121,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "tech-label mt-1 text-muted-foreground",
											children: p.turnaround
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 124,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
											className: "mt-6 flex-1 space-y-2 text-sm",
											children: p.features.map((f) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
												className: "flex gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "mt-0.5 size-4 shrink-0 text-blueprint" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 129,
													columnNumber: 25
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-muted-foreground",
													children: f
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 130,
													columnNumber: 25
												}, this)]
											}, f, true, {
												fileName: _jsxFileName,
												lineNumber: 128,
												columnNumber: 42
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 127,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											asChild: true,
											variant: p.id === "standard" ? "hero" : "outline",
											className: "mt-7",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
												to: "/new",
												search: { pkg: p.id },
												children: ["Choose ", p.name]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 134,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 133,
											columnNumber: 19
										}, this)
									]
								}, p.id, true, {
									fileName: _jsxFileName,
									lineNumber: 113,
									columnNumber: 34
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 112,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 106,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 105,
					columnNumber: 9
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 31,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
				className: "border-t border-border/70",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mx-auto flex max-w-6xl flex-col gap-2 px-5 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" DraftForge. Drafted by hand, previewed by AI."
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 148,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "font-mono text-xs",
						children: "DWG · PDF · STEP"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 152,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 147,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 146,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 28,
		columnNumber: 10
	}, this);
}
//#endregion
export { Index as component };
