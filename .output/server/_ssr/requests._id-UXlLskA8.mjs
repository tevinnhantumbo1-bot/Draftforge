import { r as __toESM } from "../_runtime.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { d as Film, p as CreditCard, r as Sparkles, w as ArrowLeft, x as Check } from "../_libs/lucide-react.mjs";
import { a as useServerFn, t as Button } from "./wallet-auth-Cjb9Ehvm.mjs";
import { formatMoney } from "./pricing-iHp73A5v.mjs";
import { t as SiteHeader } from "./site-header-BfayvmgK.mjs";
import { c as startPreviewVideo, i as getRequest, n as generatePreviewImages, o as payForRequest, s as pollPreviewVideo } from "./requests.functions-Cgry8E8p.mjs";
import { t as StatusBadge } from "./status-badge-BkTGMIn1.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Route } from "./requests._id-CE261ATt.mjs";
import { i as preparePayment, n as executeBaseSepoliaPayment, r as getBasePayConfig, t as confirmBasePayment } from "./base-sepolia-pay-DMhad2Fg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/requests._id-UXlLskA8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/requests.$id.tsx?tsr-split=component";
function RequestDetail() {
	const { id } = Route.useParams();
	const qc = useQueryClient();
	const fetchRequest = useServerFn(getRequest);
	const genImages = useServerFn(generatePreviewImages);
	const startVideo = useServerFn(startPreviewVideo);
	const pollVideo = useServerFn(pollPreviewVideo);
	const pay = useServerFn(payForRequest);
	const prepare = useServerFn(preparePayment);
	useServerFn(confirmBasePayment);
	const payConfig = useServerFn(getBasePayConfig);
	const { data: baseConfig } = useQuery({
		queryKey: ["base-pay-config"],
		queryFn: () => payConfig({})
	});
	const { data, isLoading } = useQuery({
		queryKey: ["request", id],
		queryFn: () => fetchRequest({ data: { id } })
	});
	const [imgBusy, setImgBusy] = (0, import_react.useState)(false);
	const [videoJob, setVideoJob] = (0, import_react.useState)(null);
	const [videoStatus, setVideoStatus] = (0, import_react.useState)(null);
	const [payBusy, setPayBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!videoJob) return;
		let active = true;
		const timer = setInterval(async () => {
			try {
				const res = await pollVideo({ data: {
					id,
					jobId: videoJob
				} });
				if (!active) return;
				if (res.status === "completed") {
					setVideoJob(null);
					setVideoStatus(null);
					toast.success("Motion preview ready");
					qc.invalidateQueries({ queryKey: ["request", id] });
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
		id,
		pollVideo,
		qc
	]);
	async function onGenerateImages() {
		setImgBusy(true);
		try {
			await genImages({ data: { id } });
			toast.success("Concept images ready");
			qc.invalidateQueries({ queryKey: ["request", id] });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Image generation failed");
		} finally {
			setImgBusy(false);
		}
	}
	async function onGenerateVideo() {
		try {
			const res = await startVideo({ data: { id } });
			setVideoJob(res.jobId);
			setVideoStatus("queued");
			toast.info("Motion preview started — this takes a couple of minutes.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not start the video");
		}
	}
	async function onPay() {
		setPayBusy(true);
		try {
			await pay({ data: { id } });
			toast.success("Payment confirmed — drafting starts now.");
			qc.invalidateQueries({ queryKey: ["request", id] });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Payment could not be completed");
		} finally {
			setPayBusy(false);
		}
	}
	async function onBasePay() {
		setPayBusy(true);
		try {
			const quote = await prepare({ data: { id } });
			toast.info("Triggering Base Sepolia payment (Chain ID: 84532)...");
			const paymentId = (await executeBaseSepoliaPayment({
				amountUsdc: quote.amount,
				recipientAddress: quote.to
			})).txHash;
			toast.info("Payment sent — confirming on Base Sepolia…");
			for (let attempt = 0; attempt < 20; attempt++) {
				if ((await confirmBasePayment({ data: {
					id,
					paymentId
				} })).status === "completed") {
					toast.success("Payment confirmed on Base Sepolia — drafting starts now.");
					qc.invalidateQueries({ queryKey: ["request", id] });
					return;
				}
				await new Promise((r) => setTimeout(r, 3e3));
			}
			toast.info("Still confirming on Base Sepolia — refresh in a moment.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Base Sepolia payment could not be completed");
		} finally {
			setPayBusy(false);
		}
	}
	const images = data?.assets.filter((a) => a.kind === "image") ?? [];
	const videos = data?.assets.filter((a) => a.kind === "video") ?? [];
	const references = data?.assets.filter((a) => a.kind === "reference") ?? [];
	const hasPreview = images.length > 0 || videos.length > 0;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SiteHeader, { signedIn: true }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 176,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "mx-auto max-w-6xl px-5 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
					to: "/dashboard",
					className: "tech-label inline-flex items-center gap-2 text-muted-foreground hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { className: "size-3.5" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 179,
						columnNumber: 11
					}, this), " All requests"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 178,
					columnNumber: 9
				}, this),
				isLoading && /* @__PURE__ */ (void 0)("p", {
					className: "mt-8 text-muted-foreground",
					children: "Loading…"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 182,
					columnNumber: 23
				}, this),
				data && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [
					/* @__PURE__ */ (void 0)("div", {
						className: "mt-5 flex flex-wrap items-start justify-between gap-4",
						children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h1", {
							className: "text-4xl font-semibold",
							children: data.request.title
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 187,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)("p", {
							className: "tech-label mt-2 text-muted-foreground",
							children: [
								data.request.category,
								" · ",
								data.request.package,
								" ·",
								" ",
								data.request.dimensions ?? "no dimensions given",
								" ",
								data.request.units
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 188,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 186,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (void 0)("span", {
								className: "font-mono text-2xl text-primary",
								children: formatMoney(data.request.quote_cents)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 195,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)(StatusBadge, { status: data.request.status }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 198,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 194,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 185,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "panel mt-8 p-6",
						children: [/* @__PURE__ */ (void 0)("p", {
							className: "tech-label text-blueprint",
							children: "Brief"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 203,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("p", {
							className: "mt-3 whitespace-pre-wrap text-muted-foreground",
							children: data.request.brief
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 204,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 202,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (void 0)(Button, {
							variant: "hero",
							onClick: onGenerateImages,
							disabled: imgBusy,
							children: [
								/* @__PURE__ */ (void 0)(Sparkles, {}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 211,
									columnNumber: 17
								}, this),
								" ",
								imgBusy ? "Rendering concepts…" : "Generate concept images"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 210,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)(Button, {
							variant: "blueprint",
							onClick: onGenerateVideo,
							disabled: !!videoJob,
							children: [
								/* @__PURE__ */ (void 0)(Film, {}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 215,
									columnNumber: 17
								}, this),
								" ",
								videoJob ? `Rendering video… ${videoStatus ?? ""}` : "Generate motion preview"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 214,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 209,
						columnNumber: 13
					}, this),
					references.length > 0 && /* @__PURE__ */ (void 0)("section", {
						className: "mt-10",
						children: [/* @__PURE__ */ (void 0)("h2", {
							className: "text-xl font-semibold",
							children: "Your example images"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 221,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "mt-4 flex flex-wrap gap-4",
							children: references.map((a) => a.signedUrl ? /* @__PURE__ */ (void 0)("img", {
								src: a.signedUrl,
								alt: `Reference supplied for ${data.request.title}`,
								className: "size-28 rounded border border-border object-cover",
								loading: "lazy"
							}, a.id, false, {
								fileName: _jsxFileName,
								lineNumber: 223,
								columnNumber: 54
							}, this) : null)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 222,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 220,
						columnNumber: 39
					}, this),
					/* @__PURE__ */ (void 0)("section", {
						className: "mt-10",
						children: [/* @__PURE__ */ (void 0)("h2", {
							className: "text-xl font-semibold",
							children: "Concept images"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 228,
							columnNumber: 15
						}, this), images.length === 0 ? /* @__PURE__ */ (void 0)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "No images yet — generate concepts to see blueprint, realistic and isometric views."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 229,
							columnNumber: 38
						}, this) : /* @__PURE__ */ (void 0)("div", {
							className: "mt-5 grid gap-5 md:grid-cols-3",
							children: images.map((a) => a.signedUrl ? /* @__PURE__ */ (void 0)("figure", {
								className: "panel overflow-hidden",
								children: /* @__PURE__ */ (void 0)("img", {
									src: a.signedUrl,
									alt: `Concept preview for ${data.request.title}`,
									className: "aspect-square w-full object-cover",
									loading: "lazy"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 234,
									columnNumber: 25
								}, this)
							}, a.id, false, {
								fileName: _jsxFileName,
								lineNumber: 233,
								columnNumber: 50
							}, this) : null)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 232,
							columnNumber: 24
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 227,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("section", {
						className: "mt-12",
						children: [/* @__PURE__ */ (void 0)("h2", {
							className: "text-xl font-semibold",
							children: "Motion preview"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 240,
							columnNumber: 15
						}, this), videos.length === 0 ? /* @__PURE__ */ (void 0)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "No video yet — generate a short orbiting preview of the design."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 241,
							columnNumber: 38
						}, this) : /* @__PURE__ */ (void 0)("div", {
							className: "mt-5 grid gap-5 md:grid-cols-2",
							children: videos.map((a) => a.signedUrl ? /* @__PURE__ */ (void 0)("video", {
								src: a.signedUrl,
								controls: true,
								playsInline: true,
								className: "panel w-full"
							}, a.id, false, {
								fileName: _jsxFileName,
								lineNumber: 245,
								columnNumber: 50
							}, this) : null)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 244,
							columnNumber: 24
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 239,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("section", {
						className: "panel mt-12 p-6",
						children: [/* @__PURE__ */ (void 0)("p", {
							className: "tech-label text-blueprint",
							children: "Payment"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 250,
							columnNumber: 15
						}, this), data.request.paid ? /* @__PURE__ */ (void 0)("p", {
							className: "mt-3 flex items-center gap-2 text-muted-foreground",
							children: [
								/* @__PURE__ */ (void 0)(Check, { className: "size-4 text-primary" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 252,
									columnNumber: 19
								}, this),
								" Paid",
								" ",
								formatMoney(data.request.quote_cents),
								" — your AutoCAD drawings are in progress."
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 251,
							columnNumber: 36
						}, this) : /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [
							/* @__PURE__ */ (void 0)("p", {
								className: "mt-3 text-muted-foreground",
								children: hasPreview ? `Happy with the preview? Pay ${formatMoney(data.request.quote_cents)} and drafting in AutoCAD begins.` : "You're not charged until your preview is generated and you're happy with it."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 256,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "mt-5 flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ (void 0)(Button, {
									variant: "hero",
									disabled: !hasPreview || payBusy || !baseConfig?.configured,
									onClick: onBasePay,
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "size-3 rounded-full bg-blueprint",
										"aria-hidden": true
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 261,
										columnNumber: 23
									}, this), payBusy ? "Confirming…" : hasPreview ? `Pay ${formatMoney(data.request.quote_cents)} with Base Pay (USDC)` : "Generate a preview first"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 260,
									columnNumber: 21
								}, this), /* @__PURE__ */ (void 0)(Button, {
									variant: "outline",
									disabled: !hasPreview || payBusy,
									onClick: onPay,
									children: [/* @__PURE__ */ (void 0)(CreditCard, {}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 265,
										columnNumber: 23
									}, this), " Mark as paid manually"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 264,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 259,
								columnNumber: 19
							}, this),
							hasPreview && !baseConfig?.configured && /* @__PURE__ */ (void 0)("p", {
								className: "mt-3 text-xs text-muted-foreground",
								children: "Base Pay is waiting on the studio's payout wallet address."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 268,
								columnNumber: 61
							}, this),
							baseConfig?.testnet && /* @__PURE__ */ (void 0)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: "Running on Base Sepolia testnet — no real funds are moved."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 271,
								columnNumber: 43
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 255,
							columnNumber: 24
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 249,
						columnNumber: 13
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 184,
					columnNumber: 18
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 177,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 175,
		columnNumber: 10
	}, this);
}
//#endregion
export { RequestDetail as component };
