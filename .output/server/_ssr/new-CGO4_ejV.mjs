import { r as __toESM } from "../_runtime.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as Zap } from "../_libs/lucide-react.mjs";
import { a as useServerFn, t as Button } from "./wallet-auth-Cjb9Ehvm.mjs";
import { n as Label, t as Input } from "./label-C5FLLBhf.mjs";
import { CATEGORIES, PACKAGES, formatMoney, quoteCents } from "./pricing-iHp73A5v.mjs";
import { t as SiteHeader } from "./site-header-BfayvmgK.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, o as Textarea, r as SelectItem, t as Select } from "./select-CGEwEmop.mjs";
import { l as uploadReferenceImages, r as getDailyFreeUsage, t as createRequest } from "./requests.functions-Cgry8E8p.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Route } from "./new-Dv5ZpeDH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-CGO4_ejV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/new.tsx?tsr-split=component";
function NewRequest() {
	const { pkg } = Route.useSearch();
	const navigate = useNavigate();
	const create = useServerFn(createRequest);
	const uploadRefs = useServerFn(uploadReferenceImages);
	const fetchUsage = useServerFn(getDailyFreeUsage);
	const { data: usage } = useQuery({
		queryKey: ["daily-free-usage"],
		queryFn: () => fetchUsage()
	});
	const freeRemaining = usage?.remainingToday ?? 2;
	const [title, setTitle] = (0, import_react.useState)("");
	const [brief, setBrief] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("architectural");
	const [dimensions, setDimensions] = (0, import_react.useState)("");
	const [units, setUnits] = (0, import_react.useState)("mm");
	const [style, setStyle] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(pkg ?? "standard");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [refs, setRefs] = (0, import_react.useState)([]);
	const estimate = quoteCents(selected, category, brief.length);
	async function onPickFiles(e) {
		const files = Array.from(e.target.files ?? []).slice(0, 5);
		const next = [];
		for (const f of files) {
			if (!f.type.startsWith("image/")) continue;
			if (f.size > 5 * 1024 * 1024) {
				toast.error(`${f.name} is over 5MB — pick a smaller image.`);
				continue;
			}
			const dataUrl = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(String(reader.result));
				reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read the file"));
				reader.readAsDataURL(f);
			});
			next.push({
				name: f.name,
				dataUrl
			});
		}
		setRefs(next);
	}
	async function submit(e) {
		e.preventDefault();
		if (brief.trim().length < 20) {
			toast.error("Give a bit more detail — at least 20 characters.");
			return;
		}
		setBusy(true);
		try {
			const res = await create({ data: {
				title: title.trim(),
				brief: brief.trim(),
				category,
				dimensions: dimensions.trim() || null,
				units,
				style: style.trim() || null,
				package: selected
			} });
			if (refs.length) try {
				await uploadRefs({ data: {
					id: res.id,
					files: refs
				} });
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Reference images could not be uploaded");
			}
			navigate({
				to: "/requests/$id",
				params: { id: res.id }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not submit the request");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SiteHeader, { signedIn: true }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 113,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "mx-auto max-w-5xl px-5 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "tech-label text-blueprint",
					children: "New request"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 115,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "mt-3 text-4xl font-semibold",
					children: "Describe your design"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 116,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 max-w-2xl text-muted-foreground",
					children: "The more specific the brief, the sharper the AI preview — and the closer the final AutoCAD drawing will be to what you pictured."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 117,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 flex items-center justify-between rounded-lg border border-blueprint/30 bg-blueprint/10 px-4 py-3 text-xs font-mono text-blueprint",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Zap, { className: "size-4 shrink-0 text-blueprint" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 125,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
							"Free Daily Test Experience: ",
							freeRemaining,
							" / 2 requests remaining today"
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 126,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 124,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-muted-foreground hidden sm:inline",
						children: "First 2 daily CAD requests are 100% free"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 130,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 123,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
					className: "mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.9fr]",
					onSubmit: submit,
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "panel space-y-6 p-7",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									htmlFor: "title",
									children: "Project title"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 138,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									id: "title",
									value: title,
									maxLength: 120,
									required: true,
									placeholder: "Garden studio, 6m x 3.6m",
									onChange: (e) => setTitle(e.target.value)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 139,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 137,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										htmlFor: "brief",
										children: "The brief"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 143,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
										id: "brief",
										value: brief,
										maxLength: 4e3,
										rows: 9,
										required: true,
										placeholder: "What is it, what is it made of, how is it used, what must it fit into? Include anything that matters — openings, clearances, fixings, finishes, standards.",
										onChange: (e) => setBrief(e.target.value)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 144,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "font-mono text-xs text-muted-foreground",
										children: [brief.length, "/4000"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 145,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 142,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Category" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 152,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
										value: category,
										onValueChange: setCategory,
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 155,
											columnNumber: 21
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 154,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: c.id,
											children: c.label
										}, c.id, false, {
											fileName: _jsxFileName,
											lineNumber: 158,
											columnNumber: 42
										}, this)) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 157,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 153,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 151,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Units" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 165,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
										value: units,
										onValueChange: setUnits,
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 168,
											columnNumber: 21
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 167,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
											"mm",
											"cm",
											"m",
											"in",
											"ft"
										].map((u) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: u,
											children: u
										}, u, false, {
											fileName: _jsxFileName,
											lineNumber: 171,
											columnNumber: 61
										}, this)) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 170,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 166,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 164,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 150,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									htmlFor: "dimensions",
									children: "Key dimensions"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 180,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									id: "dimensions",
									value: dimensions,
									maxLength: 200,
									placeholder: "6000 x 3600 x 2700",
									onChange: (e) => setDimensions(e.target.value)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 181,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 179,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									htmlFor: "style",
									children: "Style / references"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 185,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									id: "style",
									value: style,
									maxLength: 200,
									placeholder: "Scandinavian, cedar cladding, flat roof",
									onChange: (e) => setStyle(e.target.value)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 186,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 184,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										htmlFor: "refimages",
										children: "Example images (optional)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 190,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										id: "refimages",
										type: "file",
										accept: "image/*",
										multiple: true,
										onChange: onPickFiles,
										className: "file:mr-3 file:rounded file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-sm"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 191,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs text-muted-foreground",
										children: "Up to 5 images, 5MB each. Sketches, photos or references — the AI previews will be based on them."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 192,
										columnNumber: 15
									}, this),
									refs.length > 0 && /* @__PURE__ */ (void 0)("div", {
										className: "mt-3 flex flex-wrap gap-3",
										children: refs.map((r) => /* @__PURE__ */ (void 0)("img", {
											src: r.dataUrl,
											alt: `Reference ${r.name}`,
											className: "size-20 rounded border border-border object-cover"
										}, r.name, false, {
											fileName: _jsxFileName,
											lineNumber: 197,
											columnNumber: 34
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 196,
										columnNumber: 35
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 189,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 136,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-4",
						children: [PACKAGES.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: () => setSelected(p.id),
							className: `panel w-full p-5 text-left transition-colors ${selected === p.id ? "ring-1 ring-primary" : "hover:bg-surface-2"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-baseline justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-display font-semibold",
										children: p.name
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 205,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-mono text-primary",
										children: formatMoney(p.price * 100)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 206,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 204,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: p.blurb
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 210,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "tech-label mt-2 text-blueprint",
									children: p.turnaround
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 211,
									columnNumber: 17
								}, this)
							]
						}, p.id, true, {
							fileName: _jsxFileName,
							lineNumber: 203,
							columnNumber: 32
						}, this)), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "panel p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "tech-label text-muted-foreground",
									children: "Estimated quote"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 215,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-1 font-mono text-3xl text-primary",
									children: formatMoney(estimate)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 218,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: "Adjusted for category complexity and brief detail. Nothing is charged now — you only pay after you've seen your AI preview."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 221,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "hero",
									size: "lg",
									className: "mt-5 w-full",
									disabled: busy,
									type: "submit",
									children: busy ? "Submitting…" : "Submit — free preview first"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 225,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 214,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 202,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 135,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 114,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 112,
		columnNumber: 10
	}, this);
}
//#endregion
export { NewRequest as component };
