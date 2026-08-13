import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as stringType, r as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DDLaEkRy.js
var $$splitComponentImporter = () => import("./auth-BT_pRzsu.mjs");
var Route = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Sign in — DraftForge" },
		{
			name: "description",
			content: "Sign in to submit AutoCAD design requests and track previews."
		},
		{
			property: "og:title",
			content: "Sign in — DraftForge"
		},
		{
			property: "og:description",
			content: "Access your DraftForge design requests and previews."
		}
	] }),
	validateSearch: objectType({ redirect: stringType().optional() }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
