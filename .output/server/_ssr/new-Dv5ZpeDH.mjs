import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as enumType, r as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-Dv5ZpeDH.js
var $$splitComponentImporter = () => import("./new-CGO4_ejV.mjs");
var Route = createFileRoute("/_authenticated/new")({
	head: () => ({ meta: [
		{ title: "New design request — DraftForge" },
		{
			name: "description",
			content: "Describe your AutoCAD design brief and get AI previews before drafting."
		},
		{
			property: "og:title",
			content: "New design request — DraftForge"
		},
		{
			property: "og:description",
			content: "Submit a CAD brief and preview it with AI before drafting."
		}
	] }),
	validateSearch: objectType({ pkg: enumType([
		"concept",
		"standard",
		"pro"
	]).optional() }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
