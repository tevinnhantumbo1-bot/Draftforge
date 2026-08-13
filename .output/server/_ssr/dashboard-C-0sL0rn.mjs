import { r as __toESM } from "../_runtime.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { C as ArrowRight, S as Box, a as Ruler, d as Film, f as FileText, h as Clock, n as Wallet, o as RefreshCw, r as Sparkles, t as Zap, y as ChevronRight } from "../_libs/lucide-react.mjs";
import { a as useServerFn, t as Button } from "./wallet-auth-Cjb9Ehvm.mjs";
import { n as Label, t as Input } from "./label-C5FLLBhf.mjs";
import { CATEGORIES, formatMoney } from "./pricing-iHp73A5v.mjs";
import { t as SiteHeader } from "./site-header-BfayvmgK.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, o as Textarea, r as SelectItem, t as Select } from "./select-CGEwEmop.mjs";
import { a as listMyRequests, c as startPreviewVideo, i as getRequest, n as generatePreviewImages, r as getDailyFreeUsage, s as pollPreviewVideo, t as createRequest } from "./requests.functions-Cgry8E8p.mjs";
import { t as StatusBadge } from "./status-badge-BkTGMIn1.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-C-0sL0rn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/dashboard.tsx?tsr-split=component";
var PRESETS = [
	{
		icon: "🏛️",
		label: "Garden Pavilion",
		title: "6m x 3.6m Timber Pavilion Studio",
		category: "architectural",
		dimensions: "6000 x 3600 x 2800",
		units: "mm",
		style: "Nordic cedar cladding, floor-to-ceiling glass",
		brief: "Modern single-storey garden studio, 6000mm x 3600mm footprint, standing seam zinc roof, vertical cedar cladding, full-height double glazed panels to south elevation, concealed guttering."
	},
	{
		icon: "⚙️",
		label: "CNC Bracket",
		title: "150mm x 60mm Heavy-Duty Mounting Bracket",
		category: "mechanical",
		dimensions: "150 x 60 x 25",
		units: "mm",
		style: "Anodized 6061-T6 aluminum, chamfered edges",
		brief: "Precision CNC machined L-bracket for motor mount. Overall 150mm length, 60mm height, 25mm thickness. Four M8 countersunk mounting holes, dual rib reinforcement gussets, weight reduction cutouts."
	},
	{
		icon: "📦",
		label: "IP67 Enclosure",
		title: "Waterproof Electronics Enclosure",
		category: "industrial",
		dimensions: "200 x 120 x 80",
		units: "mm",
		style: "Rugged polycarbonate with silicone gasket",
		brief: "IP67 outdoor electronics enclosure with hinged transparent lid, dual M16 cable gland knockouts on bottom face, internal PCB mounting bosses, and side wall heat dissipation fins."
	},
	{
		icon: "🪑",
		label: "Steel Desk Frame",
		title: "1600x800mm Modular Workstation Frame",
		category: "furniture",
		dimensions: "1600 x 800 x 720",
		units: "mm",
		style: "Matte black powder-coated steel tube",
		brief: "Modern industrial workstation desk frame constructed from 40x40mm square steel tubing, integrated under-desk cable management tray, leveling foot inserts, and hidden leg assembly bolts."
	}
];
function DashboardWorkspace() {
	const qc = useQueryClient();
	useNavigate();
	const fetchList = useServerFn(listMyRequests);
	const fetchUsage = useServerFn(getDailyFreeUsage);
	const createReq = useServerFn(createRequest);
	const genImages = useServerFn(generatePreviewImages);
	const startVideo = useServerFn(startPreviewVideo);
	const pollVideo = useServerFn(pollPreviewVideo);
	const fetchSingleRequest = useServerFn(getRequest);
	const { data: requests, isLoading: isListLoading } = useQuery({
		queryKey: ["my-requests"],
		queryFn: () => fetchList()
	});
	const { data: usage, refetch: refetchUsage } = useQuery({
		queryKey: ["daily-free-usage"],
		queryFn: () => fetchUsage()
	});
	const [walletAddress, setWalletAddress] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem("df_wallet_user");
			if (stored) try {
				const parsed = JSON.parse(stored);
				if (parsed.address) setWalletAddress(parsed.address);
			} catch {}
		}
	}, []);
	const [promptTitle, setPromptTitle] = (0, import_react.useState)("");
	const [brief, setBrief] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("architectural");
	const [dimensions, setDimensions] = (0, import_react.useState)("");
	const [units, setUnits] = (0, import_react.useState)("mm");
	const [style, setStyle] = (0, import_react.useState)("");
	const [selectedPkg, setSelectedPkg] = (0, import_react.useState)("standard");
	const [generating, setGenerating] = (0, import_react.useState)(false);
	const [genStep, setGenStep] = (0, import_react.useState)("");
	const [activeCanvasId, setActiveCanvasId] = (0, import_react.useState)(null);
	const { data: activeCanvasData, refetch: refetchActiveCanvas } = useQuery({
		queryKey: ["request", activeCanvasId],
		queryFn: () => activeCanvasId ? fetchSingleRequest({ data: { id: activeCanvasId } }) : null,
		enabled: !!activeCanvasId
	});
	const [videoJob, setVideoJob] = (0, import_react.useState)(null);
	const [videoStatus, setVideoStatus] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!videoJob || !activeCanvasId) return;
		let active = true;
		const timer = setInterval(async () => {
			try {
				const res = await pollVideo({ data: {
					id: activeCanvasId,
					jobId: videoJob
				} });
				if (!active) return;
				if (res.status === "completed") {
					setVideoJob(null);
					setVideoStatus(null);
					toast.success("3D Motion orbit preview ready!");
					refetchActiveCanvas();
				} else setVideoStatus(`${res.status} ${res.progress ?? 0}%`);
			} catch (err) {
				if (!active) return;
				setVideoJob(null);
				setVideoStatus(null);
				toast.error(err instanceof Error ? err.message : "Video rendering failed");
			}
		}, 8e3);
		return () => {
			active = false;
			clearInterval(timer);
		};
	}, [
		videoJob,
		activeCanvasId,
		pollVideo,
		refetchActiveCanvas
	]);
	function applyPreset(p) {
		setPromptTitle(p.title);
		setBrief(p.brief);
		setCategory(p.category);
		setDimensions(p.dimensions);
		setUnits(p.units);
		setStyle(p.style);
		toast.info(`Loaded "${p.label}" template`);
	}
	async function handleGenerateCAD(e) {
		e.preventDefault();
		if (!brief.trim() || brief.trim().length < 15) {
			toast.error("Please provide a design brief with at least 15 characters.");
			return;
		}
		const titleToUse = promptTitle.trim() || `${category.charAt(0).toUpperCase() + category.slice(1)} CAD Design`;
		setGenerating(true);
		setGenStep("1/3 Initializing CAD request...");
		try {
			const newReq = await createReq({ data: {
				title: titleToUse,
				brief: brief.trim(),
				category,
				dimensions: dimensions.trim() || null,
				units,
				style: style.trim() || null,
				package: selectedPkg
			} });
			setActiveCanvasId(newReq.id);
			refetchUsage();
			qc.invalidateQueries({ queryKey: ["my-requests"] });
			setGenStep("2/3 AI rendering Blueprint, Photorealistic & Isometric views...");
			toast.info("Generating CAD concept previews...");
			await genImages({ data: { id: newReq.id } });
			setGenStep("3/3 Previews ready!");
			toast.success("CAD concept previews generated successfully!");
			qc.invalidateQueries({ queryKey: ["my-requests"] });
			refetchActiveCanvas();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "CAD generation failed. Try rephrasing prompt.");
		} finally {
			setGenerating(false);
			setGenStep("");
		}
	}
	async function handleTriggerVideo() {
		if (!activeCanvasId) return;
		try {
			const res = await startVideo({ data: { id: activeCanvasId } });
			setVideoJob(res.jobId);
			setVideoStatus("queued");
			toast.info("Rendering 3D orbiting video... takes ~2 minutes.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not start video render");
		}
	}
	const freeRemaining = usage?.remainingToday ?? 2;
	const isFreeTestAvailable = freeRemaining > 0;
	const canvasImages = activeCanvasData?.assets.filter((a) => a.kind === "image") ?? [];
	const canvasVideos = activeCanvasData?.assets.filter((a) => a.kind === "video") ?? [];
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SiteHeader, { signedIn: true }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 233,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-6",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "tech-label text-blueprint",
							children: "CAD AI Workspace"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 240,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-mono text-emerald-400 border border-emerald-500/20",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Zap, { className: "size-3" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 242,
								columnNumber: 17
							}, this), " Live Studio"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 241,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 239,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
						className: "mt-1 text-3xl font-bold tracking-tight sm:text-4xl",
						children: "CAD Design Generator"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 245,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 238,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: walletAddress ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2 rounded-lg border border-blueprint/30 bg-blueprint/10 px-3 py-1.5 text-xs font-mono",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Wallet, { className: "size-3.5 text-blueprint" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 252,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-foreground",
									children: [
										walletAddress.slice(0, 6),
										"…",
										walletAddress.slice(-4)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 253,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-muted-foreground",
									children: "(Connected)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 256,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 251,
							columnNumber: 30
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2 rounded-lg border border-border bg-surface/80 px-3 py-1.5 text-xs font-mono text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Wallet, { className: "size-3.5 text-muted-foreground" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 258,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Signed in" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 259,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 257,
							columnNumber: 24
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 250,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 237,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 panel grid-paper relative overflow-hidden p-5 border border-blueprint/30 bg-surface/60",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-blueprint/20 text-blueprint border border-blueprint/30",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Zap, { className: "size-5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 269,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 268,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
									className: "font-semibold text-base",
									children: "Free Test Experience"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 273,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "rounded bg-primary/20 px-2 py-0.5 text-xs font-mono text-primary font-medium",
									children: "2 Requests / Day Included"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 276,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 272,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-1 text-xs text-muted-foreground max-w-xl",
								children: "Test prompt-to-CAD generation for free without payment! You get 2 complimentary daily CAD requests with blueprint, realistic 3/4, and 3D isometric previews."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 280,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 271,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 267,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col items-end shrink-0 border-t md:border-t-0 border-border/60 pt-3 md:pt-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2 font-mono text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-muted-foreground",
										children: "Daily Allowance:"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 290,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-primary font-bold",
										children: [freeRemaining, " / 2 Free Left"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 291,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 289,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-2 h-2 w-44 rounded-full bg-surface-2 overflow-hidden border border-border",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "h-full bg-gradient-to-r from-blueprint to-primary transition-all duration-300",
										style: { width: `${(2 - freeRemaining) / 2 * 100}%` }
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 298,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 297,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "mt-1 font-mono text-[11px] text-muted-foreground flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Clock, { className: "size-3" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 304,
										columnNumber: 17
									}, this), " Resets daily at 00:00 UTC"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 303,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 288,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 266,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 265,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-8 grid gap-8 lg:grid-cols-[1.2fr_1.1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "panel p-6 flex flex-col justify-between space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									htmlFor: "cad-brief",
									className: "text-base font-semibold",
									children: "Enter CAD Prompt"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 316,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "tech-label text-blueprint",
									children: "Prompt → DWG"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 319,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 315,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Describe dimensions, materials, geometric features, or spatial requirements."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 321,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-[11px] font-mono text-muted-foreground mb-2",
									children: "Quick Prompt Templates:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 328,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex flex-wrap gap-2",
									children: PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => applyPreset(p),
										className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2/80 px-2.5 py-1 text-xs hover:border-blueprint/50 hover:bg-blueprint/10 transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: p.icon }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 333,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: p.label }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 334,
											columnNumber: 23
										}, this)]
									}, p.label, true, {
										fileName: _jsxFileName,
										lineNumber: 332,
										columnNumber: 37
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 331,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 327,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
								onSubmit: handleGenerateCAD,
								className: "mt-5 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											htmlFor: "title-input",
											className: "text-xs",
											children: "Design Title / Ref (Optional)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 341,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
											id: "title-input",
											value: promptTitle,
											placeholder: "e.g. Aluminum Motor Mount Bracket",
											onChange: (e) => setPromptTitle(e.target.value),
											className: "h-9 text-sm"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 344,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 340,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
												htmlFor: "cad-brief",
												className: "text-xs",
												children: "Design Brief & Specifications *"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 348,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
												id: "cad-brief",
												value: brief,
												rows: 5,
												required: true,
												placeholder: "e.g., L-bracket for motor mount, 150mm length x 60mm width x 25mm height. 4 M8 countersunk mounting holes, chamfered edges, 6061-T6 aluminum finish.",
												onChange: (e) => setBrief(e.target.value),
												className: "text-sm resize-y"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 351,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex justify-between text-[11px] font-mono text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [brief.length, " characters"] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 353,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "No CAD experience needed" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 354,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 352,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 347,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid gap-3 sm:grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
												className: "text-xs",
												children: "Category"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 360,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
												value: category,
												onValueChange: setCategory,
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
													className: "h-9 text-xs",
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 363,
														columnNumber: 25
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 362,
													columnNumber: 23
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: c.id,
													children: c.label
												}, c.id, false, {
													fileName: _jsxFileName,
													lineNumber: 366,
													columnNumber: 46
												}, this)) }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 365,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 361,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 359,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
												className: "text-xs",
												children: "Units"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 374,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
												value: units,
												onValueChange: setUnits,
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
													className: "h-9 text-xs",
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 377,
														columnNumber: 25
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 376,
													columnNumber: 23
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
													lineNumber: 380,
													columnNumber: 65
												}, this)) }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 379,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 375,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 373,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 358,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid gap-3 sm:grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
												htmlFor: "dim-input",
												className: "text-xs",
												children: "Key Dimensions"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 390,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
												id: "dim-input",
												value: dimensions,
												placeholder: "e.g. 150 x 60 x 25",
												onChange: (e) => setDimensions(e.target.value),
												className: "h-9 text-xs font-mono"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 393,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 389,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
												htmlFor: "style-input",
												className: "text-xs",
												children: "Style / Material"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 397,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
												id: "style-input",
												value: style,
												placeholder: "e.g. Anodized aluminum",
												onChange: (e) => setStyle(e.target.value),
												className: "h-9 text-xs"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 400,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 396,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 388,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "pt-2 border-t border-border/70",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												type: "submit",
												variant: "hero",
												size: "lg",
												disabled: generating,
												className: "w-full flex items-center justify-center gap-2",
												children: generating ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RefreshCw, { className: "size-4 animate-spin" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 407,
													columnNumber: 25
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Generating CAD Concept..." }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 408,
													columnNumber: 25
												}, this)] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 406,
													columnNumber: 35
												}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "size-4" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 410,
													columnNumber: 25
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: isFreeTestAvailable ? "Generate CAD Design (Free Test)" : "Generate CAD Design" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 411,
													columnNumber: 25
												}, this)] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 409,
													columnNumber: 29
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 405,
												columnNumber: 19
											}, this),
											generating && genStep && /* @__PURE__ */ (void 0)("p", {
												className: "mt-2 text-center font-mono text-xs text-blueprint animate-pulse",
												children: genStep
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 417,
												columnNumber: 45
											}, this),
											!generating && /* @__PURE__ */ (void 0)("p", {
												className: "mt-2 text-center font-mono text-[11px] text-muted-foreground",
												children: isFreeTestAvailable ? `⚡ Free daily test request (${freeRemaining}/2 remaining today)` : "Daily free requests used — standard package applies."
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 421,
												columnNumber: 35
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 404,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 339,
								columnNumber: 15
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 314,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 313,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "panel p-6 flex flex-col justify-between",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between border-b border-border/70 pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Box, { className: "size-4 text-blueprint" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 434,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "font-semibold text-base",
										children: "CAD Preview Canvas"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 435,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 433,
									columnNumber: 17
								}, this), activeCanvasData && /* @__PURE__ */ (void 0)(StatusBadge, { status: activeCanvasData.request.status }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 439,
									columnNumber: 38
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 432,
								columnNumber: 15
							}, this),
							!activeCanvasId && /* @__PURE__ */ (void 0)("div", {
								className: "mt-12 flex flex-col items-center justify-center text-center p-8 border border-dashed border-border/80 rounded-lg bg-surface/30",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "flex size-12 items-center justify-center rounded-full bg-blueprint/15 text-blueprint mb-3",
										children: /* @__PURE__ */ (void 0)(Ruler, { className: "size-6" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 444,
											columnNumber: 21
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 443,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("h4", {
										className: "font-semibold text-sm",
										children: "No Active CAD Preview"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 446,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("p", {
										className: "mt-1 text-xs text-muted-foreground max-w-xs",
										children: "Type a prompt on the left and click \"Generate CAD Design\" to see 2D orthographic blueprints & 3D renders."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 447,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 442,
								columnNumber: 35
							}, this),
							activeCanvasData && /* @__PURE__ */ (void 0)("div", {
								className: "mt-4 space-y-4",
								children: [
									/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h4", {
										className: "font-semibold text-lg",
										children: activeCanvasData.request.title
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 455,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)("p", {
										className: "tech-label mt-1 text-muted-foreground",
										children: [
											activeCanvasData.request.category,
											" ·",
											" ",
											activeCanvasData.request.dimensions || "custom size",
											" ",
											activeCanvasData.request.units
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 458,
										columnNumber: 21
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 454,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "space-y-3",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "flex items-center justify-between text-xs font-mono text-muted-foreground",
											children: [/* @__PURE__ */ (void 0)("span", { children: [
												"Concept Renders (",
												canvasImages.length,
												"/3)"
											] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 468,
												columnNumber: 23
											}, this), canvasImages.length === 0 && generating && /* @__PURE__ */ (void 0)("span", {
												className: "text-blueprint animate-pulse",
												children: "Rendering..."
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 469,
												columnNumber: 67
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 467,
											columnNumber: 21
										}, this), canvasImages.length > 0 ? /* @__PURE__ */ (void 0)("div", {
											className: "grid gap-3 sm:grid-cols-3",
											children: canvasImages.map((img, idx) => /* @__PURE__ */ (void 0)("div", {
												className: "group relative panel overflow-hidden border border-border/80 bg-background",
												children: [/* @__PURE__ */ (void 0)("img", {
													src: img.signedUrl || "",
													alt: `CAD Concept View ${idx + 1}`,
													className: "aspect-square w-full object-cover transition-transform group-hover:scale-105",
													loading: "lazy"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 476,
													columnNumber: 29
												}, this), /* @__PURE__ */ (void 0)("span", {
													className: "absolute bottom-1 left-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-mono text-white",
													children: idx === 0 ? "Blueprint" : idx === 1 ? "Realistic" : "Isometric"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 477,
													columnNumber: 29
												}, this)]
											}, img.id, true, {
												fileName: _jsxFileName,
												lineNumber: 475,
												columnNumber: 57
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 474,
											columnNumber: 48
										}, this) : /* @__PURE__ */ (void 0)("div", {
											className: "grid-paper aspect-video flex items-center justify-center rounded-md border border-border/70 bg-surface/40 p-6 text-center text-xs text-muted-foreground",
											children: generating ? /* @__PURE__ */ (void 0)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (void 0)(RefreshCw, { className: "size-6 animate-spin mx-auto text-blueprint" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 483,
													columnNumber: 29
												}, this), /* @__PURE__ */ (void 0)("p", { children: "Generating CAD drawings..." }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 484,
													columnNumber: 29
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 482,
												columnNumber: 39
											}, this) : /* @__PURE__ */ (void 0)("p", { children: "Click \"Generate concept images\" to render." }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 485,
												columnNumber: 36
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 481,
											columnNumber: 32
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 466,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "pt-3 border-t border-border/70 space-y-3",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "text-xs font-mono text-muted-foreground",
												children: "3D Motion Orbit Preview"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 492,
												columnNumber: 23
											}, this), canvasVideos.length > 0 && /* @__PURE__ */ (void 0)("span", {
												className: "text-xs font-mono text-emerald-400",
												children: "Video Ready"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 495,
												columnNumber: 51
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 491,
											columnNumber: 21
										}, this), canvasVideos.length > 0 ? /* @__PURE__ */ (void 0)("video", {
											src: canvasVideos[0].signedUrl || "",
											controls: true,
											playsInline: true,
											className: "panel w-full aspect-video rounded border border-border"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 500,
											columnNumber: 48
										}, this) : /* @__PURE__ */ (void 0)(Button, {
											variant: "blueprint",
											size: "sm",
											disabled: !!videoJob || generating,
											onClick: handleTriggerVideo,
											className: "w-full text-xs flex items-center justify-center gap-2",
											children: [/* @__PURE__ */ (void 0)(Film, { className: "size-3.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 501,
												columnNumber: 25
											}, this), /* @__PURE__ */ (void 0)("span", { children: videoJob ? `Rendering 3D Motion... ${videoStatus || ""}` : "Generate Orbiting 3D Motion Video" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 502,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 500,
											columnNumber: 186
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 490,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "pt-3 border-t border-border/70 flex items-center justify-between",
										children: /* @__PURE__ */ (void 0)(Button, {
											asChild: true,
											variant: "outline",
											size: "sm",
											className: "text-xs",
											children: /* @__PURE__ */ (void 0)(Link, {
												to: "/requests/$id",
												params: { id: activeCanvasId },
												className: "flex items-center gap-1.5",
												children: [
													/* @__PURE__ */ (void 0)(FileText, { className: "size-3.5" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 514,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ (void 0)("span", { children: "View Full Specs & DWG Order" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 515,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ (void 0)(ChevronRight, { className: "size-3.5" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 516,
														columnNumber: 25
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 511,
												columnNumber: 23
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 510,
											columnNumber: 21
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 509,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 453,
								columnNumber: 36
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 431,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 430,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 311,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-12 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "text-xl font-bold",
							children: "Your CAD Requests"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 529,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: "All submitted CAD briefs, AI previews, and production drafting status."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 530,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 528,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/new",
								children: "New Custom Brief"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 536,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 535,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 527,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-3",
						children: [
							isListLoading && /* @__PURE__ */ (void 0)("p", {
								className: "text-sm text-muted-foreground font-mono",
								children: "Loading requests…"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 541,
								columnNumber: 31
							}, this),
							!isListLoading && (requests?.length ?? 0) === 0 && /* @__PURE__ */ (void 0)("div", {
								className: "panel grid-paper p-10 text-center",
								children: [/* @__PURE__ */ (void 0)("h3", {
									className: "text-base font-semibold",
									children: "No CAD requests yet"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 546,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("p", {
									className: "mt-1 text-xs text-muted-foreground max-w-sm mx-auto",
									children: "Type your first brief in the workspace prompt generator above to test 2 daily free requests!"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 547,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 545,
								columnNumber: 65
							}, this),
							requests?.map((r) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								onClick: () => setActiveCanvasId(r.id),
								className: `panel flex flex-wrap items-center justify-between gap-4 p-4 transition-all cursor-pointer hover:border-blueprint/50 ${activeCanvasId === r.id ? "ring-1 ring-blueprint bg-blueprint/5" : "hover:bg-surface-2"}`,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex size-9 shrink-0 items-center justify-center rounded bg-surface-2 text-blueprint",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Ruler, { className: "size-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 556,
											columnNumber: 21
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 555,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "font-display font-semibold text-sm",
										children: r.title
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 559,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "tech-label mt-0.5 text-muted-foreground text-[11px]",
										children: [
											r.category,
											" · ",
											r.package,
											" ·",
											" ",
											new Date(r.created_at).toLocaleDateString()
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 562,
										columnNumber: 21
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 558,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 554,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-mono text-xs text-primary",
											children: r.quote_cents === 0 ? "Free Test" : formatMoney(r.quote_cents)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 570,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusBadge, { status: r.status }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 573,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											asChild: true,
											variant: "ghost",
											size: "sm",
											className: "h-8 px-2 text-xs",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
												to: "/requests/$id",
												params: { id: r.id },
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Details" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 578,
													columnNumber: 23
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "size-3.5 ml-1" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 579,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 575,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 574,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 569,
									columnNumber: 17
								}, this)]
							}, r.id, true, {
								fileName: _jsxFileName,
								lineNumber: 553,
								columnNumber: 33
							}, this))
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 540,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 526,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 235,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 232,
		columnNumber: 10
	}, this);
}
//#endregion
export { DashboardWorkspace as component };
