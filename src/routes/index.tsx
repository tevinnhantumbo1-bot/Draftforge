import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Film,
  PenTool,
  Sparkles,
  Ruler,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { PACKAGES, formatMoney } from "@/lib/pricing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "DraftForge — Describe it, preview it, get real AutoCAD drawings",
      },
      {
        name: "description",
        content:
          "Write your design brief, watch AI turn it into concept images and a motion preview, then receive production AutoCAD drawings drafted by hand.",
      },
      {
        property: "og:title",
        content: "DraftForge — Text to AutoCAD drawings",
      },
      {
        property: "og:description",
        content:
          "AI concept previews in minutes. Real AutoCAD drawings drafted by a human draftsman.",
      },
    ],
  }),
  component: Index,
});

const STEPS = [
  {
    icon: PenTool,
    label: "01 / Brief",
    title: "Describe the design",
    body: "Plain words, dimensions, materials, references. No CAD knowledge required.",
  },
  {
    icon: Sparkles,
    label: "02 / Preview",
    title: "AI renders the concept",
    body: "Three concept images — blueprint, realistic and isometric — generated from your brief.",
  },
  {
    icon: Film,
    label: "03 / Motion",
    title: "See it move",
    body: "A short orbiting video preview so you can sign off on the form before drafting starts.",
  },
  {
    icon: Ruler,
    label: "04 / Drafting",
    title: "I draft it in AutoCAD",
    body: "Approved concepts become dimensioned, layered, production-ready DWG and PDF files.",
  },
];

function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="grid-paper relative overflow-hidden border-b border-border/70">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-32">
            <div>
              <p className="tech-label text-blueprint">Text → preview → DWG</p>
              <h1 className="mt-5 text-5xl leading-[1.05] font-semibold sm:text-6xl">
                Describe your design.
                <span className="block text-primary">
                  Get real AutoCAD drawings.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                AI turns your brief into concept images and a motion preview in
                minutes. Once you approve the look, a human draftsman produces
                the actual dimensioned DWG set.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild variant="hero" size="xl">
                  <Link to="/new">
                    Start a request <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="blueprint" size="xl">
                  <a href="#pricing">See pricing</a>
                </Button>
              </div>
              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border/70 pt-6">
                {[
                  ["48h", "Fastest turnaround"],
                  ["3", "Concept images per brief"],
                  ["DWG", "Native AutoCAD files"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dt className="font-mono text-2xl text-primary">{v}</dt>
                    <dd className="tech-label mt-1 text-muted-foreground">
                      {l}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="panel relative flex flex-col gap-4 p-6">
              <div className="tech-label flex items-center justify-between text-muted-foreground">
                <span>preview.dwg</span>
                <span className="text-blueprint">live</span>
              </div>
              <div className="grid-paper flex aspect-4/3 items-center justify-center rounded-md border border-blueprint/25 bg-background/60">
                <svg
                  viewBox="0 0 240 180"
                  className="h-full w-full p-6"
                  role="img"
                  aria-label="Blueprint preview illustration"
                >
                  <g
                    fill="none"
                    stroke="oklch(0.78 0.11 215)"
                    strokeWidth="1.2"
                    strokeLinecap="square"
                  >
                    <rect x="30" y="40" width="180" height="110" />
                    <path d="M30 90h80V40M110 90h100M150 90v60" />
                    <circle cx="70" cy="120" r="18" />
                    <path d="M20 40v110M24 40h-8M24 150h-8" />
                  </g>
                  <g
                    stroke="oklch(0.79 0.152 78)"
                    strokeWidth="1.6"
                    fill="none"
                  >
                    <path d="M110 40v50M110 90h40" />
                  </g>
                </svg>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                “Single-storey garden studio, 6000 × 3600, cedar cladding,
                full-height glazing to the south elevation.”
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-3xl font-semibold">How it works</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.label} className="panel p-6">
                <s.icon className="size-5 text-primary" />
                <p className="tech-label mt-4 text-blueprint">{s.label}</p>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="pricing"
          className="border-t border-border/70 bg-surface/40"
        >
          <div className="mx-auto max-w-6xl px-5 py-20">
            <h2 className="text-3xl font-semibold">Pricing</h2>
            <p className="mt-2 text-muted-foreground">
              AI previews are included in every package. Final quote adjusts
              with complexity.
            </p>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {PACKAGES.map((p) => (
                <div
                  key={p.id}
                  className={`panel flex flex-col p-7 ${p.id === "standard" ? "ring-1 ring-primary/50" : ""}`}
                >
                  {p.id === "standard" && (
                    <span className="tech-label mb-3 w-fit rounded-sm bg-primary/15 px-2 py-1 text-primary">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-xl font-semibold">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {p.blurb}
                  </p>
                  <p className="mt-5 font-mono text-4xl text-primary">
                    {formatMoney(p.price * 100)}
                  </p>
                  <p className="tech-label mt-1 text-muted-foreground">
                    {p.turnaround}
                  </p>
                  <ul className="mt-6 flex-1 space-y-2 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-blueprint" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={p.id === "standard" ? "hero" : "outline"}
                    className="mt-7"
                  >
                    <Link to="/new" search={{ pkg: p.id }}>
                      Choose {p.name}
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} DraftForge. Drafted by hand, previewed
            by AI.
          </p>
          <p className="font-mono text-xs">DWG · PDF · STEP</p>
        </div>
      </footer>
    </div>
  );
}
