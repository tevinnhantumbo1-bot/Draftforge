import { r as __toESM } from "../_runtime.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { C as ArrowRight, S as Box, a as Ruler, c as Maximize2, d as Film, i as ShieldCheck, n as Wallet, o as RefreshCw, r as Sparkles, s as PenTool, t as Zap, u as Layers } from "../_libs/lucide-react.mjs";
import { a as useServerFn, t as Button } from "./wallet-auth-Cjb9Ehvm.mjs";
import { n as Label, t as Input } from "./label-C5FLLBhf.mjs";
import { CATEGORIES, formatMoney } from "./pricing-iHp73A5v.mjs";
import { t as SiteHeader } from "./site-header-BfayvmgK.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, o as Textarea, r as SelectItem, t as Select } from "./select-CGEwEmop.mjs";
import { a as listMyRequests, c as startPreviewVideo, i as getRequest, l as uploadReferenceImages, n as generatePreviewImages, r as getDailyFreeUsage, s as pollPreviewVideo, t as createRequest } from "./requests.functions-Cgry8E8p.mjs";
import { t as StatusBadge } from "./status-badge-BkTGMIn1.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workspace-CqQmSKdy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/workspace.tsx?tsr-split=component";
var PRESET_PROMPTS = [
	{
		title: "Modern 2-Storey Villa",
		category: "architectural",
		dimensions: "14000 x 9000 x 6500",
		units: "mm",
		brief: "Modern 2-storey villa floor plan with cantilevered upper floor, cedar wood cladding, floor-to-ceiling double-glazed south windows, open-plan kitchen-living layout and flat green roof."
	},
	{
		title: "Mechanical Spur Gear",
		category: "mechanical",
		dimensions: "80 x 80 x 15",
		units: "mm",
		brief: "Precision 24-tooth spur gear with 80mm pitch diameter, 15mm face width, 20-degree pressure angle, central keyway bore diameter 18mm, weight reduction recesses and chamfered tooth edges."
	},
	{
		title: "Robotic Enclosure Box",
		category: "product",
		dimensions: "180 x 120 x 65",
		units: "mm",
		brief: "Anodized aluminum enclosure box for robotics controller board. Features 4 mounting flange ears, ventilated side slots, M3 standoff bosses inside, and recessed front panel I/O cutouts."
	},
	{
		title: "Electrical Control Panel",
		category: "electrical",
		dimensions: "800 x 600 x 250",
		units: "mm",
		brief: "Industrial electrical distribution panel wiring schematic and layout diagram. Includes main circuit breaker, 8 DIN-rail breakers, cable gland entry plate and terminal block layout."
	}
];
function WorkspacePage() {
	useQueryClient();
	const fetchUsage = useServerFn(getDailyFreeUsage);
	const fetchMyRequests = useServerFn(listMyRequests);
	const createReq = useServerFn(createRequest);
	const genImages = useServerFn(generatePreviewImages);
	const uploadRefs = useServerFn(uploadReferenceImages);
	const fetchOneRequest = useServerFn(getRequest);
	const startVideo = useServerFn(startPreviewVideo);
	const pollVideo = useServerFn(pollPreviewVideo);
	const [title, setTitle] = (0, import_react.useState)("");
	const [brief, setBrief] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("architectural");
	const [dimensions, setDimensions] = (0, import_react.useState)("");
	const [units, setUnits] = (0, import_react.useState)("mm");
	const [style, setStyle] = (0, import_react.useState)("");
	const [selectedPackage, setSelectedPackage] = (0, import_react.useState)("standard");
	const [refs, setRefs] = (0, import_react.useState)([]);
	const [activeRequestId, setActiveRequestId] = (0, import_react.useState)(null);
	const [generating, setGenerating] = (0, import_react.useState)(false);
	const [generationStep, setGenerationStep] = (0, import_react.useState)("");
	const [lightboxImage, setLightboxImage] = (0, import_react.useState)(null);
	const [videoJob, setVideoJob] = (0, import_react.useState)(null);
	const [videoStatus, setVideoStatus] = (0, import_react.useState)(null);
	const [walletInfo, setWalletInfo] = (0, import_react.useState)(null);
	const [activeSub, setActiveSub] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem("df_wallet_user");
			if (stored) try {
				setWalletInfo(JSON.parse(stored));
			} catch {}
			const storedSub = localStorage.getItem("df_user_subscription");
			if (storedSub) try {
				setActiveSub(JSON.parse(storedSub));
			} catch {}
		}
	}, []);
	const activePlanId = activeSub?.planId || "free";
	const { data: usage, refetch: refetchUsage } = useQuery({
		queryKey: ["daily-free-usage", activePlanId],
		queryFn: () => fetchUsage({ data: { activePlan: activePlanId } })
	});
	const { data: requests, refetch: refetchRequests } = useQuery({
		queryKey: ["my-requests"],
		queryFn: () => fetchMyRequests()
	});
	const { data: activeRequestData, refetch: refetchActive } = useQuery({
		queryKey: ["request", activeRequestId],
		queryFn: () => activeRequestId ? fetchOneRequest({ data: { id: activeRequestId } }) : null,
		enabled: !!activeRequestId
	});
	(0, import_react.useEffect)(() => {
		if (!videoJob || !activeRequestId) return;
		let active = true;
		const timer = setInterval(async () => {
			try {
				const res = await pollVideo({ data: {
					id: activeRequestId,
					jobId: videoJob
				} });
				if (!active) return;
				if (res.status === "completed") {
					setVideoJob(null);
					setVideoStatus(null);
					toast.success("Motion CAD video ready");
					refetchActive();
				} else setVideoStatus(`${res.status} ${res.progress ?? 0}%`);
			} catch (err) {
				if (!active) return;
				setVideoJob(null);
				setVideoStatus(null);
				toast.error(err instanceof Error ? err.message : "Video generation failed");
			}
		}, 8e3);
		return () => {
			active = false;
			clearInterval(timer);
		};
	}, [
		videoJob,
		activeRequestId,
		pollVideo,
		refetchActive
	]);
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
				reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read file"));
				reader.readAsDataURL(f);
			});
			next.push({
				name: f.name,
				dataUrl
			});
		}
		setRefs(next);
	}
	function applyPreset(preset) {
		setTitle(preset.title);
		setBrief(preset.brief);
		setCategory(preset.category);
		setDimensions(preset.dimensions);
		setUnits(preset.units);
		toast.info(`Loaded preset: "${preset.title}"`);
	}
	async function handleGenerate(e) {
		e.preventDefault();
		if (!brief.trim() || brief.trim().length < 15) {
			toast.error("Please enter a brief prompt with at least 15 characters.");
			return;
		}
		setGenerating(true);
		setGenerationStep("1/3 Initializing CAD request & checking daily limit…");
		try {
			const reqTitle = title.trim() || brief.slice(0, 40) + "…";
			const created = await createReq({ data: {
				title: reqTitle,
				brief: brief.trim(),
				category,
				dimensions: dimensions.trim() || null,
				units,
				style: style.trim() || null,
				package: selectedPackage,
				activePlan: activePlanId
			} });
			setActiveRequestId(created.id);
			if (refs.length > 0) {
				setGenerationStep("Uploading reference images…");
				await uploadRefs({ data: {
					id: created.id,
					files: refs
				} });
			}
			setGenerationStep("2/3 Rendering technical blueprint & 3D CAD visualisations…");
			await genImages({ data: { id: created.id } });
			setGenerationStep("3/3 Finalizing CAD drawing assets…");
			toast.success(created.isFreeTest ? "CAD design generated! (Free test request used)" : "CAD design generated successfully!");
			await Promise.all([
				refetchUsage(),
				refetchRequests(),
				refetchActive()
			]);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "CAD generation failed. Try again.");
		} finally {
			setGenerating(false);
			setGenerationStep("");
		}
	}
	async function handleStartVideo() {
		if (!activeRequestId) return;
		try {
			const res = await startVideo({ data: { id: activeRequestId } });
			setVideoJob(res.jobId);
			setVideoStatus("queued");
			toast.info("Started 3D orbiting video render — takes ~1-2 mins.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not start video render");
		}
	}
	const activeAssets = activeRequestData?.assets ?? [];
	const conceptImages = activeAssets.filter((a) => a.kind === "image");
	const videoAssets = activeAssets.filter((a) => a.kind === "video");
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SiteHeader, { signedIn: true }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 284,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mb-8 grid gap-4 lg:grid-cols-[1fr_auto]",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "panel grid-paper flex flex-wrap items-center justify-between gap-4 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "flex size-10 items-center justify-center rounded-md bg-blueprint/20 text-blueprint border border-blueprint/30",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Ruler, { className: "size-5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 292,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 291,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
								className: "font-display text-2xl font-bold tracking-tight",
								children: "CAD Workspace"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 295,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: "Prompt-to-AutoCAD generator & 3D visualization workbench"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 298,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 294,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 290,
							columnNumber: 13
						}, this), walletInfo?.address && /* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-2 rounded-full border border-border bg-background/80 px-3.5 py-1.5 text-xs",
							children: [
								/* @__PURE__ */ (void 0)(Wallet, { className: "size-3.5 text-blueprint" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 305,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("span", {
									className: "font-mono text-foreground font-medium",
									children: [
										walletInfo.address.slice(0, 6),
										"…",
										walletInfo.address.slice(-4)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 306,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("span", {
									className: "rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[10px] text-emerald-400",
									children: "Wallet Connected"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 310,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 304,
							columnNumber: 37
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 289,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "panel flex flex-col justify-between border-emerald-500/30 bg-emerald-500/5 p-5 min-w-[300px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2 text-emerald-400 font-semibold text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Zap, { className: "size-4 fill-emerald-400" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 320,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Free Daily Test Experience" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 321,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 319,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-xs text-emerald-300",
									children: "2 / Day Free"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 323,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 318,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex justify-between text-xs mb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-muted-foreground",
										children: "Requests remaining today"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 330,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-mono font-bold text-foreground",
										children: [
											usage?.remainingToday ?? 2,
											" of ",
											usage?.maxFreePerDay ?? 2
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 333,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 329,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "h-2 w-full overflow-hidden rounded-full bg-surface",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "h-full bg-emerald-400 transition-all duration-500",
										style: { width: `${(usage?.remainingToday ?? 2) / (usage?.maxFreePerDay ?? 2) * 100}%` }
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 338,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 337,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 328,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-3 text-[11px] text-muted-foreground flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "size-3 text-emerald-400 shrink-0" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 345,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: usage?.remainingToday && usage.remainingToday > 0 ? `You have ${usage.remainingToday} free CAD prompt generations available today without payment.` : "Daily free test limit reached for today. You can still order full CAD packages." }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 346,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 344,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 317,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 288,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid gap-8 lg:grid-cols-[1.1fr_1.3fr]",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "panel space-y-6 p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between border-b border-border/60 pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
										className: "font-display text-lg font-semibold flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PenTool, { className: "size-4 text-blueprint" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 361,
											columnNumber: 21
										}, this), " Enter CAD Design Prompt"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 360,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: "Describe what you want to draw or build in AutoCAD"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 364,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 359,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "tech-label text-blueprint",
										children: "DraftForge AI"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 368,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 358,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs text-muted-foreground",
										children: "Quick Prompt Presets"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 373,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex flex-wrap gap-2",
										children: PRESET_PROMPTS.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											onClick: () => applyPreset(p),
											className: "rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs transition-colors hover:border-blueprint hover:bg-blueprint/10 hover:text-blueprint",
											children: ["+ ", p.title]
										}, p.title, true, {
											fileName: _jsxFileName,
											lineNumber: 377,
											columnNumber: 44
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 376,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 372,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
									onSubmit: handleGenerate,
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
												htmlFor: "ws-title",
												className: "text-xs",
												children: "Design Title / Headline"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 385,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
												id: "ws-title",
												value: title,
												onChange: (e) => setTitle(e.target.value),
												placeholder: "e.g. Garden Studio 6m x 3.6m or 3D Spur Gear",
												maxLength: 100
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 388,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 384,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex justify-between items-center",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
													htmlFor: "ws-brief",
													className: "text-xs font-medium",
													children: "Detailed Design Brief Prompt"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 393,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "font-mono text-[10px] text-muted-foreground",
													children: [brief.length, "/4000"]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 396,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 392,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
												id: "ws-brief",
												value: brief,
												onChange: (e) => setBrief(e.target.value),
												rows: 6,
												placeholder: "Describe geometry, materials, openings, dimensions, standards or specific features. e.g. '3D isometric view of a steel space truss structure with spherical node connectors and tubular members...'",
												required: true,
												minLength: 15,
												maxLength: 4e3,
												className: "font-mono text-xs leading-relaxed"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 400,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 391,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "grid grid-cols-2 gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
													className: "text-xs",
													children: "Category"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 405,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
													value: category,
													onValueChange: setCategory,
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
														className: "text-xs",
														children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 408,
															columnNumber: 25
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 407,
														columnNumber: 23
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
														value: c.id,
														className: "text-xs",
														children: c.label
													}, c.id, false, {
														fileName: _jsxFileName,
														lineNumber: 411,
														columnNumber: 46
													}, this)) }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 410,
														columnNumber: 23
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 406,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 404,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
													className: "text-xs",
													children: "Units"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 419,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
													value: units,
													onValueChange: setUnits,
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
														className: "text-xs",
														children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 422,
															columnNumber: 25
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 421,
														columnNumber: 23
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
														"mm",
														"cm",
														"m",
														"in",
														"ft"
													].map((u) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
														value: u,
														className: "text-xs",
														children: u
													}, u, false, {
														fileName: _jsxFileName,
														lineNumber: 425,
														columnNumber: 65
													}, this)) }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 424,
														columnNumber: 23
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 420,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 418,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 403,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "grid grid-cols-2 gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
													htmlFor: "ws-dims",
													className: "text-xs",
													children: "Key Dimensions (Optional)"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 435,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
													id: "ws-dims",
													value: dimensions,
													onChange: (e) => setDimensions(e.target.value),
													placeholder: "e.g. 6000 x 3600 x 2800",
													maxLength: 150
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 438,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 434,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
													htmlFor: "ws-style",
													className: "text-xs",
													children: "Style / Material Direction"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 442,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
													id: "ws-style",
													value: style,
													onChange: (e) => setStyle(e.target.value),
													placeholder: "e.g. Cedar cladding, anodized steel",
													maxLength: 150
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 445,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 441,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 433,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "space-y-1.5 pt-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
													htmlFor: "ws-files",
													className: "text-xs",
													children: "Reference Sketch or Photo (Optional)"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 451,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
													id: "ws-files",
													type: "file",
													accept: "image/*",
													multiple: true,
													onChange: onPickFiles,
													className: "file:mr-2 file:rounded file:border-0 file:bg-surface-2 file:px-2.5 file:py-0.5 file:text-xs"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 454,
													columnNumber: 19
												}, this),
												refs.length > 0 && /* @__PURE__ */ (void 0)("div", {
													className: "flex flex-wrap gap-2 pt-1",
													children: refs.map((r) => /* @__PURE__ */ (void 0)("img", {
														src: r.dataUrl,
														alt: r.name,
														className: "size-12 rounded border border-border object-cover"
													}, r.name, false, {
														fileName: _jsxFileName,
														lineNumber: 456,
														columnNumber: 38
													}, this))
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 455,
													columnNumber: 39
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 450,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "pt-3",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												type: "submit",
												variant: "hero",
												size: "lg",
												disabled: generating,
												className: "w-full text-sm font-semibold shadow-md",
												children: generating ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RefreshCw, { className: "mr-2 size-4 animate-spin" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 464,
													columnNumber: 25
												}, this), "Generating CAD Design…"] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 463,
													columnNumber: 35
												}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "mr-2 size-4" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 467,
														columnNumber: 25
													}, this),
													"Generate CAD Design",
													usage?.remainingToday && usage.remainingToday > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "ml-2 rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300",
														children: [
															"Free Test (",
															usage.remainingToday,
															" Left)"
														]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 469,
														columnNumber: 78
													}, this) : null
												] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 466,
													columnNumber: 29
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 462,
												columnNumber: 19
											}, this), generating && /* @__PURE__ */ (void 0)("p", {
												className: "mt-2 font-mono text-xs text-blueprint text-center animate-pulse",
												children: generationStep
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 474,
												columnNumber: 34
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 461,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 383,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 357,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 356,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "panel min-h-[500px] p-6 flex flex-col justify-between",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between border-b border-border/60 pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Box, { className: "size-5 text-blueprint" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 488,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
											className: "font-display text-lg font-semibold",
											children: "Generated CAD Output"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 489,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 487,
										columnNumber: 19
									}, this), activeRequestData && /* @__PURE__ */ (void 0)(StatusBadge, { status: activeRequestData.request.status }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 493,
										columnNumber: 41
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 486,
									columnNumber: 17
								}, this),
								!activeRequestId && !generating && /* @__PURE__ */ (void 0)("div", {
									className: "my-16 text-center space-y-4",
									children: [
										/* @__PURE__ */ (void 0)("div", {
											className: "mx-auto flex size-16 items-center justify-center rounded-full border border-blueprint/30 bg-blueprint/10 text-blueprint",
											children: /* @__PURE__ */ (void 0)(Layers, { className: "size-8" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 499,
												columnNumber: 23
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 498,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h3", {
											className: "text-base font-semibold",
											children: "Ready to Generate CAD Designs"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 502,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)("p", {
											className: "mt-1 max-w-md mx-auto text-xs text-muted-foreground",
											children: "Enter your prompt on the left or select a preset to generate technical blueprint, photorealistic 3D, and isometric CAD concept visualisations."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 505,
											columnNumber: 23
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 501,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "pt-2 flex justify-center gap-3",
											children: [/* @__PURE__ */ (void 0)(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => applyPreset(PRESET_PROMPTS[0]),
												children: "Try Preset 1"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 512,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => applyPreset(PRESET_PROMPTS[1]),
												children: "Try Preset 2"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 515,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 511,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 497,
									columnNumber: 53
								}, this),
								generating && /* @__PURE__ */ (void 0)("div", {
									className: "my-16 text-center space-y-6",
									children: /* @__PURE__ */ (void 0)("div", {
										className: "grid-paper mx-auto flex aspect-video max-w-md items-center justify-center rounded-lg border border-blueprint/40 bg-background/80 p-8 shadow-inner",
										children: /* @__PURE__ */ (void 0)("div", {
											className: "space-y-4 text-center",
											children: [
												/* @__PURE__ */ (void 0)(RefreshCw, { className: "mx-auto size-10 animate-spin text-blueprint" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 524,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("p", {
													className: "font-mono text-sm text-foreground",
													children: generationStep || "Processing prompt..."
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 525,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("p", {
													className: "text-xs text-muted-foreground",
													children: "AI is rendering orthographic blueprints and 3D CAD proportions"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 528,
													columnNumber: 25
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 523,
											columnNumber: 23
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 522,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 521,
									columnNumber: 32
								}, this),
								activeRequestData && !generating && /* @__PURE__ */ (void 0)("div", {
									className: "mt-6 space-y-6",
									children: [
										/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h3", {
											className: "font-display font-semibold text-lg text-primary",
											children: activeRequestData.request.title
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 539,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)("p", {
											className: "font-mono text-xs text-muted-foreground mt-1",
											children: [
												"Category: ",
												activeRequestData.request.category,
												" · Dimensions:",
												" ",
												activeRequestData.request.dimensions || "N/A",
												" ",
												activeRequestData.request.units
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 542,
											columnNumber: 23
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 538,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "space-y-3",
											children: [/* @__PURE__ */ (void 0)("h4", {
												className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
												children: [
													"Generated Concept Drawings (",
													conceptImages.length,
													")"
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 552,
												columnNumber: 23
											}, this), conceptImages.length === 0 ? /* @__PURE__ */ (void 0)("p", {
												className: "text-xs text-muted-foreground italic",
												children: "No images generated yet for this request. Click \"Generate CAD Design\" above."
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 556,
												columnNumber: 53
											}, this) : /* @__PURE__ */ (void 0)("div", {
												className: "grid gap-4 sm:grid-cols-3",
												children: conceptImages.map((img, idx) => /* @__PURE__ */ (void 0)("div", {
													className: "group panel relative overflow-hidden border border-border/80 transition-all hover:border-blueprint",
													children: img.signedUrl ? /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)("img", {
														src: img.signedUrl,
														alt: `CAD Concept ${idx + 1}`,
														className: "aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer",
														onClick: () => setLightboxImage(img.signedUrl)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 562,
														columnNumber: 35
													}, this), /* @__PURE__ */ (void 0)("div", {
														className: "absolute inset-x-0 bottom-0 flex items-center justify-between bg-background/90 p-2 text-[10px] font-mono",
														children: [/* @__PURE__ */ (void 0)("span", { children: idx === 0 ? "Blueprint" : idx === 1 ? "3D Render" : "Isometric" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 564,
															columnNumber: 37
														}, this), /* @__PURE__ */ (void 0)("button", {
															type: "button",
															onClick: () => setLightboxImage(img.signedUrl),
															className: "text-blueprint hover:underline flex items-center gap-1",
															children: [/* @__PURE__ */ (void 0)(Maximize2, { className: "size-3" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 568,
																columnNumber: 39
															}, this), " View"]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 567,
															columnNumber: 37
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 563,
														columnNumber: 35
													}, this)] }, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 561,
														columnNumber: 48
													}, this) : null
												}, img.id, false, {
													fileName: _jsxFileName,
													lineNumber: 560,
													columnNumber: 60
												}, this))
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 559,
												columnNumber: 32
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 551,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "space-y-3 pt-4 border-t border-border/60",
											children: [/* @__PURE__ */ (void 0)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (void 0)("h4", {
													className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5",
													children: [/* @__PURE__ */ (void 0)(Film, { className: "size-3.5 text-blueprint" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 580,
														columnNumber: 27
													}, this), " 3D Orbiting Motion Preview"]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 579,
													columnNumber: 25
												}, this), /* @__PURE__ */ (void 0)(Button, {
													variant: "blueprint",
													size: "xs",
													onClick: handleStartVideo,
													disabled: !!videoJob,
													children: [/* @__PURE__ */ (void 0)(Film, { className: "mr-1 size-3" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 584,
														columnNumber: 27
													}, this), videoJob ? `Rendering… ${videoStatus ?? ""}` : "Generate 3D Video"]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 583,
													columnNumber: 25
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 578,
												columnNumber: 23
											}, this), videoAssets.length > 0 ? /* @__PURE__ */ (void 0)("div", {
												className: "grid gap-4 sm:grid-cols-2",
												children: videoAssets.map((v) => v.signedUrl ? /* @__PURE__ */ (void 0)("video", {
													src: v.signedUrl,
													controls: true,
													playsInline: true,
													className: "panel w-full rounded border border-border"
												}, v.id, false, {
													fileName: _jsxFileName,
													lineNumber: 590,
													columnNumber: 63
												}, this) : null)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 589,
												columnNumber: 49
											}, this) : /* @__PURE__ */ (void 0)("p", {
												className: "text-xs text-muted-foreground",
												children: "Generate a 360° motion video preview of this design to inspect form before production drafting."
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 591,
												columnNumber: 34
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 577,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "pt-4 flex justify-end",
											children: /* @__PURE__ */ (void 0)(Button, {
												asChild: true,
												variant: "outline",
												size: "sm",
												children: /* @__PURE__ */ (void 0)(Link, {
													to: "/requests/$id",
													params: { id: activeRequestId },
													children: ["Request Production DWG Files ", /* @__PURE__ */ (void 0)(ArrowRight, { className: "ml-1 size-3.5" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 603,
														columnNumber: 56
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 600,
													columnNumber: 25
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 599,
												columnNumber: 23
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 598,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 537,
									columnNumber: 54
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 485,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 484,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 483,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 354,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "mt-12 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
							className: "font-display text-xl font-semibold",
							children: "Your Workspace CAD History"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 617,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: "All previously created CAD briefs and generated designs"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 620,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 616,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => refetchRequests(),
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RefreshCw, { className: "mr-1.5 size-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 625,
								columnNumber: 15
							}, this), " Refresh"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 624,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 615,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: [requests?.slice(0, 6).map((req) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: `panel p-4 flex flex-col justify-between transition-colors hover:border-blueprint/50 cursor-pointer ${activeRequestId === req.id ? "ring-1 ring-blueprint" : ""}`,
							onClick: () => setActiveRequestId(req.id),
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
									className: "font-display font-semibold text-sm line-clamp-1",
									children: req.title
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 633,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusBadge, { status: req.status }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 636,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 632,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "tech-label mt-1 text-muted-foreground text-[11px]",
								children: [
									req.category,
									" ·",
									" ",
									new Date(req.created_at).toLocaleDateString()
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 638,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 631,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-4 flex items-center justify-between text-xs pt-3 border-t border-border/50",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-mono text-primary font-medium",
									children: req.quote_cents === 0 ? "Free Test" : formatMoney(req.quote_cents)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 645,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-blueprint flex items-center gap-1 font-medium",
									children: ["Inspect ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "size-3" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 649,
										columnNumber: 29
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 648,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 644,
								columnNumber: 17
							}, this)]
						}, req.id, true, {
							fileName: _jsxFileName,
							lineNumber: 630,
							columnNumber: 47
						}, this)), (!requests || requests.length === 0) && /* @__PURE__ */ (void 0)("p", {
							className: "text-xs text-muted-foreground col-span-full py-6 text-center",
							children: "No past CAD generations yet. Enter your first prompt above!"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 654,
							columnNumber: 54
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 629,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 614,
					columnNumber: 9
				}, this),
				lightboxImage && /* @__PURE__ */ (void 0)("div", {
					className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4",
					onClick: () => setLightboxImage(null),
					children: /* @__PURE__ */ (void 0)("div", {
						className: "relative max-w-5xl max-h-[90vh] overflow-hidden rounded-lg bg-background p-2 border border-border shadow-2xl",
						onClick: (e) => e.stopPropagation(),
						children: [/* @__PURE__ */ (void 0)("img", {
							src: lightboxImage,
							alt: "CAD Design Enlarged View",
							className: "max-h-[82vh] w-auto object-contain rounded"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 663,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "mt-3 flex items-center justify-between px-2 text-xs",
							children: [/* @__PURE__ */ (void 0)("span", {
								className: "font-mono text-muted-foreground",
								children: "High-Resolution CAD Design Visualisation"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 665,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (void 0)("a", {
									href: lightboxImage,
									download: "cad-design-preview.png",
									target: "_blank",
									rel: "noreferrer",
									className: "inline-flex items-center gap-1 text-blueprint hover:underline",
									children: "Download Image"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 669,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)(Button, {
									variant: "ghost",
									size: "xs",
									onClick: () => setLightboxImage(null),
									children: "Close"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 672,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 668,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 664,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 662,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 661,
					columnNumber: 27
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 286,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 283,
		columnNumber: 10
	}, this);
}
//#endregion
export { WorkspacePage as component };
