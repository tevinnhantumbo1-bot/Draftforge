import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIES,
  PACKAGES,
  formatMoney,
  quoteCents,
  type PackageId,
} from "@/lib/pricing";
import { useQuery } from "@tanstack/react-query";
import { Zap } from "lucide-react";
import { createRequest, uploadReferenceImages, getDailyFreeUsage } from "@/lib/requests.functions";

export const Route = createFileRoute("/_authenticated/new")({
  head: () => ({
    meta: [
      { title: "New design request — DraftForge" },
      {
        name: "description",
        content:
          "Describe your AutoCAD design brief and get AI previews before drafting.",
      },
      { property: "og:title", content: "New design request — DraftForge" },
      {
        property: "og:description",
        content: "Submit a CAD brief and preview it with AI before drafting.",
      },
    ],
  }),
  validateSearch: z.object({
    pkg: z.enum(["concept", "standard", "pro"]).optional(),
  }),
  component: NewRequest,
});

function NewRequest() {
  const { pkg } = Route.useSearch();
  const navigate = useNavigate();
  const create = useServerFn(createRequest);
  const uploadRefs = useServerFn(uploadReferenceImages);
  const fetchUsage = useServerFn(getDailyFreeUsage);

  const { data: usage } = useQuery({
    queryKey: ["daily-free-usage"],
    queryFn: () => fetchUsage(),
  });

  const freeRemaining = usage?.remainingToday ?? 2;

  const [title, setTitle] = useState("");
  const [brief, setBrief] = useState("");
  const [category, setCategory] = useState("architectural");
  const [dimensions, setDimensions] = useState("");
  const [units, setUnits] = useState("mm");
  const [style, setStyle] = useState("");
  const [selected, setSelected] = useState<PackageId>(pkg ?? "standard");
  const [busy, setBusy] = useState(false);
  const [refs, setRefs] = useState<{ name: string; dataUrl: string }[]>([]);

  const estimate = quoteCents(selected, category, brief.length);

  async function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 5);
    const next: { name: string; dataUrl: string }[] = [];
    for (const f of files) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name} is over 5MB — pick a smaller image.`);
        continue;
      }
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Could not read the file"));
        reader.readAsDataURL(f);
      });
      next.push({ name: f.name, dataUrl });
    }
    setRefs(next);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (brief.trim().length < 20) {
      toast.error("Give a bit more detail — at least 20 characters.");
      return;
    }
    setBusy(true);
    try {
      const res = await create({
        data: {
          title: title.trim(),
          brief: brief.trim(),
          category,
          dimensions: dimensions.trim() || null,
          units,
          style: style.trim() || null,
          package: selected,
        },
      });
      if (refs.length) {
        try {
          await uploadRefs({ data: { id: res.id, files: refs } });
        } catch (err) {
          toast.error(
            err instanceof Error
              ? err.message
              : "Reference images could not be uploaded",
          );
        }
      }
      navigate({ to: "/requests/$id", params: { id: res.id } });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not submit the request",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader signedIn />
      <main className="mx-auto max-w-5xl px-5 py-12">
        <p className="tech-label text-blueprint">New request</p>
        <h1 className="mt-3 text-4xl font-semibold">Describe your design</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          The more specific the brief, the sharper the AI preview — and the
          closer the final AutoCAD drawing will be to what you pictured.
        </p>

        {/* Daily Free Test Experience Banner */}
        <div className="mt-6 flex items-center justify-between rounded-lg border border-blueprint/30 bg-blueprint/10 px-4 py-3 text-xs font-mono text-blueprint">
          <div className="flex items-center gap-2">
            <Zap className="size-4 shrink-0 text-blueprint" />
            <span>
              Free Daily Test Experience: {freeRemaining} / 2 requests remaining today
            </span>
          </div>
          <span className="text-muted-foreground hidden sm:inline">
            First 2 daily CAD requests are 100% free
          </span>
        </div>

        <form
          className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.9fr]"
          onSubmit={submit}
        >
          <div className="panel space-y-6 p-7">
            <div className="space-y-2">
              <Label htmlFor="title">Project title</Label>
              <Input
                id="title"
                value={title}
                maxLength={120}
                required
                placeholder="Garden studio, 6m x 3.6m"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brief">The brief</Label>
              <Textarea
                id="brief"
                value={brief}
                maxLength={4000}
                rows={9}
                required
                placeholder="What is it, what is it made of, how is it used, what must it fit into? Include anything that matters — openings, clearances, fixings, finishes, standards."
                onChange={(e) => setBrief(e.target.value)}
              />
              <p className="font-mono text-xs text-muted-foreground">
                {brief.length}/4000
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Units</Label>
                <Select value={units} onValueChange={setUnits}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["mm", "cm", "m", "in", "ft"].map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dimensions">Key dimensions</Label>
              <Input
                id="dimensions"
                value={dimensions}
                maxLength={200}
                placeholder="6000 x 3600 x 2700"
                onChange={(e) => setDimensions(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">Style / references</Label>
              <Input
                id="style"
                value={style}
                maxLength={200}
                placeholder="Scandinavian, cedar cladding, flat roof"
                onChange={(e) => setStyle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="refimages">Example images (optional)</Label>
              <Input
                id="refimages"
                type="file"
                accept="image/*"
                multiple
                onChange={onPickFiles}
                className="file:mr-3 file:rounded file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Up to 5 images, 5MB each. Sketches, photos or references — the
                AI previews will be based on them.
              </p>
              {refs.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {refs.map((r) => (
                    <img
                      key={r.name}
                      src={r.dataUrl}
                      alt={`Reference ${r.name}`}
                      className="size-20 rounded border border-border object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {PACKAGES.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`panel w-full p-5 text-left transition-colors ${
                  selected === p.id
                    ? "ring-1 ring-primary"
                    : "hover:bg-surface-2"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display font-semibold">{p.name}</span>
                  <span className="font-mono text-primary">
                    {formatMoney(p.price * 100)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
                <p className="tech-label mt-2 text-blueprint">{p.turnaround}</p>
              </button>
            ))}

            <div className="panel p-5">
              <p className="tech-label text-muted-foreground">
                Estimated quote
              </p>
              <p className="mt-1 font-mono text-3xl text-primary">
                {formatMoney(estimate)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Adjusted for category complexity and brief detail. Nothing is
                charged now — you only pay after you've seen your AI preview.
              </p>
              <Button
                variant="hero"
                size="lg"
                className="mt-5 w-full"
                disabled={busy}
                type="submit"
              >
                {busy ? "Submitting…" : "Submit — free preview first"}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
