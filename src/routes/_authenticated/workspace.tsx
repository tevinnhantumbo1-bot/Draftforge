import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Sparkles,
  Ruler,
  Film,
  Zap,
  Layers,
  Box,
  PenTool,
  Maximize2,
  Check,
  RefreshCw,
  Wallet,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  type PackageId,
} from "@/lib/pricing";
import {
  createRequest,
  generatePreviewImages,
  getDailyFreeUsage,
  listMyRequests,
  getRequest,
  startPreviewVideo,
  pollPreviewVideo,
  uploadReferenceImages,
} from "@/lib/requests.functions";

export const Route = createFileRoute("/_authenticated/workspace")({
  head: () => ({
    meta: [
      { title: "CAD Workspace — DraftForge AI" },
      {
        name: "description",
        content:
          "Enter prompts to generate AutoCAD design previews, 3D models and technical blueprints instantly.",
      },
      { property: "og:title", content: "CAD Workspace — DraftForge AI" },
      {
        property: "og:description",
        content: "Generate CAD design concepts from text prompts.",
      },
    ],
  }),
  component: WorkspacePage,
});

const PRESET_PROMPTS = [
  {
    title: "Modern 2-Storey Villa",
    category: "architectural",
    dimensions: "14000 x 9000 x 6500",
    units: "mm",
    brief:
      "Modern 2-storey villa floor plan with cantilevered upper floor, cedar wood cladding, floor-to-ceiling double-glazed south windows, open-plan kitchen-living layout and flat green roof.",
  },
  {
    title: "Mechanical Spur Gear",
    category: "mechanical",
    dimensions: "80 x 80 x 15",
    units: "mm",
    brief:
      "Precision 24-tooth spur gear with 80mm pitch diameter, 15mm face width, 20-degree pressure angle, central keyway bore diameter 18mm, weight reduction recesses and chamfered tooth edges.",
  },
  {
    title: "Robotic Enclosure Box",
    category: "product",
    dimensions: "180 x 120 x 65",
    units: "mm",
    brief:
      "Anodized aluminum enclosure box for robotics controller board. Features 4 mounting flange ears, ventilated side slots, M3 standoff bosses inside, and recessed front panel I/O cutouts.",
  },
  {
    title: "Electrical Control Panel",
    category: "electrical",
    dimensions: "800 x 600 x 250",
    units: "mm",
    brief:
      "Industrial electrical distribution panel wiring schematic and layout diagram. Includes main circuit breaker, 8 DIN-rail breakers, cable gland entry plate and terminal block layout.",
  },
];

function WorkspacePage() {
  const qc = useQueryClient();
  const fetchUsage = useServerFn(getDailyFreeUsage);
  const fetchMyRequests = useServerFn(listMyRequests);
  const createReq = useServerFn(createRequest);
  const genImages = useServerFn(generatePreviewImages);
  const uploadRefs = useServerFn(uploadReferenceImages);
  const fetchOneRequest = useServerFn(getRequest);
  const startVideo = useServerFn(startPreviewVideo);
  const pollVideo = useServerFn(pollPreviewVideo);

  // Form state
  const [title, setTitle] = useState("");
  const [brief, setBrief] = useState("");
  const [category, setCategory] = useState("architectural");
  const [dimensions, setDimensions] = useState("");
  const [units, setUnits] = useState("mm");
  const [style, setStyle] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<PackageId>("standard");
  const [refs, setRefs] = useState<{ name: string; dataUrl: string }[]>([]);

  // Generation state
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Video generation state
  const [videoJob, setVideoJob] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string | null>(null);

  // Wallet user details & subscription from localStorage
  const [walletInfo, setWalletInfo] = useState<{
    address?: string;
    email?: string;
    full_name?: string;
  } | null>(null);

  const [activeSub, setActiveSub] = useState<{
    planId: string;
    billingCycle: string;
    expiresAt?: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("df_wallet_user");
      if (stored) {
        try {
          setWalletInfo(JSON.parse(stored));
        } catch {
          /* ignore */
        }
      }

      const storedSub = localStorage.getItem("df_user_subscription");
      if (storedSub) {
        try {
          setActiveSub(JSON.parse(storedSub));
        } catch {
          /* ignore */
        }
      }
    }
  }, []);

  const activePlanId = activeSub?.planId || "free";

  // Usage query
  const { data: usage, refetch: refetchUsage } = useQuery({
    queryKey: ["daily-free-usage", activePlanId],
    queryFn: () => fetchUsage({ data: { activePlan: activePlanId } }),
  });

  // Recent requests query
  const { data: requests, refetch: refetchRequests } = useQuery({
    queryKey: ["my-requests"],
    queryFn: () => fetchMyRequests(),
  });

  // Active request query
  const { data: activeRequestData, refetch: refetchActive } = useQuery({
    queryKey: ["request", activeRequestId],
    queryFn: () =>
      activeRequestId
        ? fetchOneRequest({ data: { id: activeRequestId } })
        : null,
    enabled: !!activeRequestId,
  });

  // Poll for video generation if active
  useEffect(() => {
    if (!videoJob || !activeRequestId) return;
    let active = true;
    const timer = setInterval(async () => {
      try {
        const res = await pollVideo({
          data: { id: activeRequestId, jobId: videoJob },
        });
        if (!active) return;
        if (res.status === "completed") {
          setVideoJob(null);
          setVideoStatus(null);
          toast.success("Motion CAD video ready");
          refetchActive();
        } else {
          setVideoStatus(`${res.status} ${res.progress ?? 0}%`);
        }
      } catch (err) {
        if (!active) return;
        setVideoJob(null);
        setVideoStatus(null);
        toast.error(
          err instanceof Error ? err.message : "Video generation failed",
        );
      }
    }, 8000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [videoJob, activeRequestId, pollVideo, refetchActive]);

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
        reader.onerror = () => reject(new Error("Could not read file"));
        reader.readAsDataURL(f);
      });
      next.push({ name: f.name, dataUrl });
    }
    setRefs(next);
  }

  function applyPreset(preset: (typeof PRESET_PROMPTS)[0]) {
    setTitle(preset.title);
    setBrief(preset.brief);
    setCategory(preset.category);
    setDimensions(preset.dimensions);
    setUnits(preset.units);
    toast.info(`Loaded preset: "${preset.title}"`);
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!brief.trim() || brief.trim().length < 15) {
      toast.error("Please enter a brief prompt with at least 15 characters.");
      return;
    }

    setGenerating(true);
    setGenerationStep("1/3 Initializing CAD request & checking daily limit…");

    try {
      // 1. Create request
      const reqTitle = title.trim() || brief.slice(0, 40) + "…";
      const created = await createReq({
        data: {
          title: reqTitle,
          brief: brief.trim(),
          category,
          dimensions: dimensions.trim() || null,
          units,
          style: style.trim() || null,
          package: selectedPackage,
          activePlan: activePlanId,
        },
      });

      setActiveRequestId(created.id);

      // Upload reference images if attached
      if (refs.length > 0) {
        setGenerationStep("Uploading reference images…");
        await uploadRefs({ data: { id: created.id, files: refs } });
      }

      // 2. Generate concept images
      setGenerationStep(
        "2/3 Rendering technical blueprint & 3D CAD visualisations…",
      );
      await genImages({ data: { id: created.id } });

      setGenerationStep("3/3 Finalizing CAD drawing assets…");
      toast.success(
        created.isFreeTest
          ? "CAD design generated! (Free test request used)"
          : "CAD design generated successfully!",
      );

      // Refresh data
      await Promise.all([refetchUsage(), refetchRequests(), refetchActive()]);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "CAD generation failed. Try again.",
      );
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
      toast.error(
        err instanceof Error ? err.message : "Could not start video render",
      );
    }
  }

  const activeAssets = activeRequestData?.assets ?? [];
  const conceptImages = activeAssets.filter((a) => a.kind === "image");
  const videoAssets = activeAssets.filter((a) => a.kind === "video");

  return (
    <div className="min-h-screen pb-16">
      <SiteHeader signedIn />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* TOP STATUS BANNER: Wallet & Daily Free Requests Counter */}
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="panel grid-paper flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-md bg-blueprint/20 text-blueprint border border-blueprint/30">
                <Ruler className="size-5" />
              </span>
              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight">
                  CAD Workspace
                </h1>
                <p className="text-xs text-muted-foreground">
                  Prompt-to-AutoCAD generator & 3D visualization workbench
                </p>
              </div>
            </div>

            {walletInfo?.address && (
              <div className="flex items-center gap-2 rounded-full border border-border bg-background/80 px-3.5 py-1.5 text-xs">
                <Wallet className="size-3.5 text-blueprint" />
                <span className="font-mono text-foreground font-medium">
                  {walletInfo.address.slice(0, 6)}…
                  {walletInfo.address.slice(-4)}
                </span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[10px] text-emerald-400">
                  Wallet Connected
                </span>
              </div>
            )}
          </div>

          {/* Daily Free Test Experience Card */}
          <div className="panel flex flex-col justify-between border-emerald-500/30 bg-emerald-500/5 p-5 min-w-[300px]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <Zap className="size-4 fill-emerald-400" />
                <span>Free Daily Test Experience</span>
              </div>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-xs text-emerald-300">
                2 / Day Free
              </span>
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">
                  Requests remaining today
                </span>
                <span className="font-mono font-bold text-foreground">
                  {usage?.remainingToday ?? 2} of {usage?.maxFreePerDay ?? 2}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full bg-emerald-400 transition-all duration-500"
                  style={{
                    width: `${((usage?.remainingToday ?? 2) / (usage?.maxFreePerDay ?? 2)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <p className="mt-3 text-[11px] text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="size-3 text-emerald-400 shrink-0" />
              <span>
                {usage?.remainingToday && usage.remainingToday > 0
                  ? `You have ${usage.remainingToday} free CAD prompt generations available today without payment.`
                  : "Daily free test limit reached for today. You can still order full CAD packages."}
              </span>
            </p>
          </div>
        </div>

        {/* WORKSPACE MAIN GRID */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1.3fr]">
          {/* LEFT: PROMPT INPUT FORM */}
          <section className="space-y-6">
            <div className="panel space-y-6 p-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                    <PenTool className="size-4 text-blueprint" /> Enter CAD
                    Design Prompt
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Describe what you want to draw or build in AutoCAD
                  </p>
                </div>
                <span className="tech-label text-blueprint">DraftForge AI</span>
              </div>

              {/* Preset Chips */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Quick Prompt Presets
                </Label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_PROMPTS.map((p) => (
                    <button
                      key={p.title}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className="rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs transition-colors hover:border-blueprint hover:bg-blueprint/10 hover:text-blueprint"
                    >
                      + {p.title}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="ws-title" className="text-xs">
                    Design Title / Headline
                  </Label>
                  <Input
                    id="ws-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Garden Studio 6m x 3.6m or 3D Spur Gear"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="ws-brief" className="text-xs font-medium">
                      Detailed Design Brief Prompt
                    </Label>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {brief.length}/4000
                    </span>
                  </div>
                  <Textarea
                    id="ws-brief"
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    rows={6}
                    placeholder="Describe geometry, materials, openings, dimensions, standards or specific features. e.g. '3D isometric view of a steel space truss structure with spherical node connectors and tubular members...'"
                    required
                    minLength={15}
                    maxLength={4000}
                    className="font-mono text-xs leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem
                            key={c.id}
                            value={c.id}
                            className="text-xs"
                          >
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Units</Label>
                    <Select value={units} onValueChange={setUnits}>
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["mm", "cm", "m", "in", "ft"].map((u) => (
                          <SelectItem key={u} value={u} className="text-xs">
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="ws-dims" className="text-xs">
                      Key Dimensions (Optional)
                    </Label>
                    <Input
                      id="ws-dims"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      placeholder="e.g. 6000 x 3600 x 2800"
                      maxLength={150}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="ws-style" className="text-xs">
                      Style / Material Direction
                    </Label>
                    <Input
                      id="ws-style"
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      placeholder="e.g. Cedar cladding, anodized steel"
                      maxLength={150}
                    />
                  </div>
                </div>

                {/* Reference Images */}
                <div className="space-y-1.5 pt-1">
                  <Label htmlFor="ws-files" className="text-xs">
                    Reference Sketch or Photo (Optional)
                  </Label>
                  <Input
                    id="ws-files"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onPickFiles}
                    className="file:mr-2 file:rounded file:border-0 file:bg-surface-2 file:px-2.5 file:py-0.5 file:text-xs"
                  />
                  {refs.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {refs.map((r) => (
                        <img
                          key={r.name}
                          src={r.dataUrl}
                          alt={r.name}
                          className="size-12 rounded border border-border object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-3">
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    disabled={generating}
                    className="w-full text-sm font-semibold shadow-md"
                  >
                    {generating ? (
                      <>
                        <RefreshCw className="mr-2 size-4 animate-spin" />
                        Generating CAD Design…
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 size-4" />
                        Generate CAD Design
                        {usage?.remainingToday && usage.remainingToday > 0 ? (
                          <span className="ml-2 rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">
                            Free Test ({usage.remainingToday} Left)
                          </span>
                        ) : null}
                      </>
                    )}
                  </Button>
                  {generating && (
                    <p className="mt-2 font-mono text-xs text-blueprint text-center animate-pulse">
                      {generationStep}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </section>

          {/* RIGHT: GENERATED CAD OUTPUT CANVAS */}
          <section className="space-y-6">
            <div className="panel min-h-[500px] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div className="flex items-center gap-2">
                    <Box className="size-5 text-blueprint" />
                    <h2 className="font-display text-lg font-semibold">
                      Generated CAD Output
                    </h2>
                  </div>
                  {activeRequestData && (
                    <StatusBadge status={activeRequestData.request.status} />
                  )}
                </div>

                {/* Content area */}
                {!activeRequestId && !generating && (
                  <div className="my-16 text-center space-y-4">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-blueprint/30 bg-blueprint/10 text-blueprint">
                      <Layers className="size-8" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">
                        Ready to Generate CAD Designs
                      </h3>
                      <p className="mt-1 max-w-md mx-auto text-xs text-muted-foreground">
                        Enter your prompt on the left or select a preset to
                        generate technical blueprint, photorealistic 3D, and
                        isometric CAD concept visualisations.
                      </p>
                    </div>
                    <div className="pt-2 flex justify-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applyPreset(PRESET_PROMPTS[0])}
                      >
                        Try Preset 1
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applyPreset(PRESET_PROMPTS[1])}
                      >
                        Try Preset 2
                      </Button>
                    </div>
                  </div>
                )}

                {generating && (
                  <div className="my-16 text-center space-y-6">
                    <div className="grid-paper mx-auto flex aspect-video max-w-md items-center justify-center rounded-lg border border-blueprint/40 bg-background/80 p-8 shadow-inner">
                      <div className="space-y-4 text-center">
                        <RefreshCw className="mx-auto size-10 animate-spin text-blueprint" />
                        <p className="font-mono text-sm text-foreground">
                          {generationStep || "Processing prompt..."}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          AI is rendering orthographic blueprints and 3D CAD
                          proportions
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Display generated results when active requestId exists */}
                {activeRequestData && !generating && (
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="font-display font-semibold text-lg text-primary">
                        {activeRequestData.request.title}
                      </h3>
                      <p className="font-mono text-xs text-muted-foreground mt-1">
                        Category: {activeRequestData.request.category} ·
                        Dimensions:{" "}
                        {activeRequestData.request.dimensions || "N/A"}{" "}
                        {activeRequestData.request.units}
                      </p>
                    </div>

                    {/* Image Cards Grid */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Generated Concept Drawings ({conceptImages.length})
                      </h4>

                      {conceptImages.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">
                          No images generated yet for this request. Click
                          "Generate CAD Design" above.
                        </p>
                      ) : (
                        <div className="grid gap-4 sm:grid-cols-3">
                          {conceptImages.map((img, idx) => (
                            <div
                              key={img.id}
                              className="group panel relative overflow-hidden border border-border/80 transition-all hover:border-blueprint"
                            >
                              {img.signedUrl ? (
                                <>
                                  <img
                                    src={img.signedUrl}
                                    alt={`CAD Concept ${idx + 1}`}
                                    className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                                    onClick={() =>
                                      setLightboxImage(img.signedUrl!)
                                    }
                                  />
                                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-background/90 p-2 text-[10px] font-mono">
                                    <span>
                                      {idx === 0
                                        ? "Blueprint"
                                        : idx === 1
                                          ? "3D Render"
                                          : "Isometric"}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setLightboxImage(img.signedUrl!)
                                      }
                                      className="text-blueprint hover:underline flex items-center gap-1"
                                    >
                                      <Maximize2 className="size-3" /> View
                                    </button>
                                  </div>
                                </>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Video preview section */}
                    <div className="space-y-3 pt-4 border-t border-border/60">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Film className="size-3.5 text-blueprint" /> 3D
                          Orbiting Motion Preview
                        </h4>
                        <Button
                          variant="blueprint"
                          size="xs"
                          onClick={handleStartVideo}
                          disabled={!!videoJob}
                        >
                          <Film className="mr-1 size-3" />
                          {videoJob
                            ? `Rendering… ${videoStatus ?? ""}`
                            : "Generate 3D Video"}
                        </Button>
                      </div>

                      {videoAssets.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                          {videoAssets.map((v) =>
                            v.signedUrl ? (
                              <video
                                key={v.id}
                                src={v.signedUrl}
                                controls
                                playsInline
                                className="panel w-full rounded border border-border"
                              />
                            ) : null,
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Generate a 360° motion video preview of this design
                          to inspect form before production drafting.
                        </p>
                      )}
                    </div>

                    {/* Action link to detailed request page */}
                    <div className="pt-4 flex justify-end">
                      <Button asChild variant="outline" size="sm">
                        <Link
                          to="/requests/$id"
                          params={{ id: activeRequestId }}
                        >
                          Request Production DWG Files <ArrowRight className="ml-1 size-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* RECENT GENERATION HISTORY SECTION */}
        <section className="mt-12 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl font-semibold">
                Your Workspace CAD History
              </h3>
              <p className="text-xs text-muted-foreground">
                All previously created CAD briefs and generated designs
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetchRequests()}
            >
              <RefreshCw className="mr-1.5 size-3.5" /> Refresh
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {requests?.slice(0, 6).map((req) => (
              <div
                key={req.id}
                className={`panel p-4 flex flex-col justify-between transition-colors hover:border-blueprint/50 cursor-pointer ${
                  activeRequestId === req.id ? "ring-1 ring-blueprint" : ""
                }`}
                onClick={() => setActiveRequestId(req.id)}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-display font-semibold text-sm line-clamp-1">
                      {req.title}
                    </h4>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="tech-label mt-1 text-muted-foreground text-[11px]">
                    {req.category} ·{" "}
                    {new Date(req.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-border/50">
                  <span className="font-mono text-primary font-medium">
                    {req.quote_cents === 0 ? "Free Test" : formatMoney(req.quote_cents)}
                  </span>
                  <span className="text-blueprint flex items-center gap-1 font-medium">
                    Inspect <ArrowRight className="size-3" />
                  </span>
                </div>
              </div>
            ))}

            {(!requests || requests.length === 0) && (
              <p className="text-xs text-muted-foreground col-span-full py-6 text-center">
                No past CAD generations yet. Enter your first prompt above!
              </p>
            )}
          </div>
        </section>

        {/* LIGHTBOX MODAL FOR FULLSCREEN CAD DRAWING VIEW */}
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setLightboxImage(null)}
          >
            <div
              className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-lg bg-background p-2 border border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage}
                alt="CAD Design Enlarged View"
                className="max-h-[82vh] w-auto object-contain rounded"
              />
              <div className="mt-3 flex items-center justify-between px-2 text-xs">
                <span className="font-mono text-muted-foreground">
                  High-Resolution CAD Design Visualisation
                </span>
                <div className="flex gap-2">
                  <a
                    href={lightboxImage}
                    download="cad-design-preview.png"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blueprint hover:underline"
                  >
                    Download Image
                  </a>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setLightboxImage(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
