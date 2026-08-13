import { r as __toESM } from "../_runtime.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-C5xPL8Eg.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { a as Ruler } from "../_libs/lucide-react.mjs";
import { n as WalletAuthButtons, t as Button } from "./wallet-auth-Cjb9Ehvm.mjs";
import { t as Route } from "./auth-DDLaEkRy.mjs";
import { n as Label, t as Input } from "./label-C5FLLBhf.mjs";
import { t as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BT_pRzsu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var lovableAuth = createLovableAuth();
var lovable = { auth: { signInWithOAuth: async (provider, opts) => {
	const result = await lovableAuth.signInWithOAuth(provider, {
		...opts,
		extraParams: { ...opts?.extraParams }
	});
	if (result.redirected) return result;
	if (result.error) return result;
	try {
		await supabase.auth.setSession(result.tokens);
	} catch (e) {
		return { error: e instanceof Error ? e : new Error(String(e)) };
	}
	return result;
} } };
var _jsxFileName = "/app/applet/src/routes/auth.tsx?tsr-split=component";
function safePath(value) {
	return value && value.startsWith("/") && !value.startsWith("//") ? value : "/workspace";
}
function AuthPage() {
	const { redirect } = Route.useSearch();
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [sent, setSent] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) navigate({ to: safePath(redirect) });
		});
	}, [navigate, redirect]);
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			if (mode === "signup") {
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: window.location.origin + safePath(redirect),
						data: { full_name: name }
					}
				});
				if (error) throw error;
				if (!data.session) {
					setSent(true);
					return;
				}
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
			}
			navigate({ to: safePath(redirect) });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setBusy(false);
		}
	}
	async function google() {
		const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth?redirect=" + encodeURIComponent(safePath(redirect)) });
		if (result.error) {
			toast.error("Google sign-in failed. Try again.");
			return;
		}
		if (result.redirected) return;
		navigate({ to: safePath(redirect) });
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid-paper flex min-h-screen items-center justify-center px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "panel w-full max-w-md p-8",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
				to: "/",
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "flex size-8 items-center justify-center rounded-sm bg-[image:var(--gradient-amber)] text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Ruler, { className: "size-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 93,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 92,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "font-display text-lg font-semibold",
					children: "DraftForge"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 95,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 91,
				columnNumber: 9
			}, this), sent ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-2xl font-semibold",
					children: "Check your email"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 99,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: [
						"We sent a confirmation link to ",
						email,
						". Click it to activate your account."
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 100,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 98,
				columnNumber: 17
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "mt-8 text-2xl font-semibold",
					children: mode === "signin" ? "Sign in" : "Create your account"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 105,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Track your design requests, previews and drawings."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 108,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					variant: "outline",
					className: "mt-6 w-full",
					onClick: google,
					type: "button",
					children: "Continue with Google"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 112,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(WalletAuthButtons, {
						redirectTo: safePath(redirect),
						layout: "stack"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 117,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 116,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "my-6 flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-px flex-1 bg-border" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 121,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "tech-label text-muted-foreground",
							children: "or"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 122,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-px flex-1 bg-border" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 123,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 120,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
					className: "space-y-4",
					onSubmit: submit,
					children: [
						mode === "signup" && /* @__PURE__ */ (void 0)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (void 0)(Label, {
								htmlFor: "name",
								children: "Full name"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 128,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)(Input, {
								id: "name",
								value: name,
								maxLength: 100,
								onChange: (e) => setName(e.target.value),
								required: true
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 129,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 127,
							columnNumber: 37
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
								htmlFor: "email",
								children: "Email"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 132,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								id: "email",
								type: "email",
								value: email,
								maxLength: 255,
								onChange: (e) => setEmail(e.target.value),
								required: true
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 133,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 131,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
								htmlFor: "password",
								children: "Password"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 136,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								id: "password",
								type: "password",
								value: password,
								minLength: 6,
								maxLength: 72,
								onChange: (e) => setPassword(e.target.value),
								required: true
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 137,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 135,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "hero",
							className: "w-full",
							disabled: busy,
							type: "submit",
							children: busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 139,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 126,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					className: "mt-5 w-full text-sm text-muted-foreground hover:text-foreground",
					onClick: () => setMode(mode === "signin" ? "signup" : "signin"),
					children: mode === "signin" ? "No account? Create one" : "Already have an account? Sign in"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 144,
					columnNumber: 13
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 104,
				columnNumber: 20
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 90,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 89,
		columnNumber: 10
	}, this);
}
//#endregion
export { AuthPage as component };
