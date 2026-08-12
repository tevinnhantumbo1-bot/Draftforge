import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Sparkles,
  Zap,
  Wallet,
  CheckCircle2,
  Clock,
  ArrowRight,
  Ruler,
  Film,
  Box,
  Layers,
  RefreshCw,
  Sliders,
  ChevronRight,
  FileText,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
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
  listMyRequests,
  getDailyFreeUsage,
  createRequest,
  generatePreviewImages,
  startPreviewVideo,
  pollPreviewVideo,
  getRequest,
} from "@/lib/requests.functions";
import { CATEGORIES, formatMoney, type PackageId } from "@/lib/pricing";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "CAD AI Workspace — DraftForge" },
      {
        name: "description",
        content:
          "Enter prompts to generate instant 3D CAD design concept previews and motion animations.",
      },
      { property: "og:title", content: "CAD AI Workspace — DraftForge" },
      {
        property: "og:description",
        content:
          "Text to AutoCAD design generation workspace with 2 daily free test requests.",
      },
    ],
  }),
  component: DashboardWorkspace,
});

const PRESETS = [
  {
    icon: "🏛️",
    label: "Garden Pavilion",
    title: "6m x 3.6m Timber Pavilion Studio",
    category: "architectural",
    dimensions: "6000 x 3600 x 2800",
    units: "mm",
    style: "Nordic cedar cladding, floor-to-ceiling glass",
    brief:
      "Modern single-storey garden studio, 6000mm x 3600mm footprint, standing seam zinc roof, vertical cedar cladding, full-height double glazed panels to south elevation, concealed guttering.",
  },
  {
    icon: "⚙️",
    label: "CNC Bracket",
    title: "150mm x 60mm Heavy-Duty Mounting Bracket",
    category: "mechanical",
    dimensions: "150 x 60 x 25",
    units: "mm",
    style: "Anodized 6061-T6 aluminum, chamfered edges",
    brief:
      "Precision CNC machined L-bracket for motor mount. Overall 150mm length, 60mm height, 25mm thickness. Four M8 countersunk mounting holes, dual rib reinforcement gussets, weight reduction cutouts.",
  },
  {
    icon: "📦",
    label: "IP67 Enclosure",
    title: "Waterproof Electronics Enclosure",
    category: "industrial",
    dimensions: "200 x 120 x 80",
    units: "mm",
    style: "Rugged polycarbonate with silicone gasket",
    brief:
      "IP67 outdoor electronics enclosure with hinged transparent lid, dual M16 cable gland knockouts on bottom face, internal PCB mounting bosses, and side wall heat dissipation fins.",
  },
  {
    icon: "🪑",
    label: "Steel Desk Frame",
    title: "1600x800mm Modular Workstation Frame",
    category: "furniture",
    dimensions: "1600 x 800 x 720",
    units: "mm",
    style: "Matte black powder-coated steel tube",
    brief:
      "Modern industrial workstation desk frame constructed from 40x40mm square steel tubing, integrated under-desk cable management tray, leveling foot inserts, and hidden leg assembly bolts.",
  },
];

function DashboardWorkspace() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const fetchList = useServerFn(listMyRequests);
  const fetchUsage = useServerFn(getDailyFreeUsage);
  const createReq = useServerFn(createRequest);
  const genImages = useServerFn(generatePreviewImages);
  const startVideo = useServerFn(startPreviewVideo);
  const pollVideo = useServerFn(pollPreviewVideo);
  const fetchSingleRequest = useServerFn(getRequest);

  const { data: requests, isLoading: isListLoading } = useQuery({
    queryKey: ["my-requests"],
    queryFn: () => fetchList(),
  });

  const { data: usage, refetch: refetchUsage } = useQuery({
    queryKey: ["daily-free-usage"],
    queryFn: () => fetchUsage(),
  });

  // Wallet user info from localStorage if present
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("df_wallet_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.address) setWalletAddress(parsed.address);
        } catch {
          /* ignore */
        }
      }
    }
  }, []);

  // Workspace CAD Generator Form State
  const [promptTitle, setPromptTitle] = useState("");
  const [brief, setBrief] = useState("");
  const [category, setCategory] = useState("architectural");
  const [dimensions, setDimensions] = useState("");
  const [units, setUnits] = useState("mm");
  const [style, setStyle] = useState("");
  const [selectedPkg, setSelectedPkg] = useState<PackageId>("standard");

  // Generation Active State
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState<string>("");
  const [activeCanvasId, setActiveCanvasId] = useState<string | null>(null);

  const { data: activeCanvasData, refetch: refetchActiveCanvas } = useQuery({
    queryKey: ["request", activeCanvasId],
    queryFn: () =>
      activeCanvasId
        ? fetchSingleRequest({ data: { id: activeCanvasId } })
        : null,
    enabled: !!activeCanvasId,
  });

  // Video generation polling state
  const [videoJob, setVideoJob] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!videoJob || !activeCanvasId) return;
    let active = true;
    const timer = setInterval(async () => {
      try {
        const res = await pollVideo({
          data: { id: activeCanvasId, jobId: videoJob },
        });
        if (!active) return;
        if (res.status === "completed") {
          setVideoJob(null);
          setVideoStatus(null);
          toast.success("3D Motion orbit preview ready!");
          refetchActiveCanvas();
        } else {
          setVideoStatus(`${res.status} ${res.progress ?? 0}%`);
        }
      } catch (err) {
        if (!active) return;
        setVideoJob(null);
        setVideoStatus(null);
        toast.error(
          err instanceof Error ? err.message : "Video rendering failed",
        );
      }
    }, 8000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [videoJob, activeCanvasId, pollVideo, refetchActiveCanvas]);

  function applyPreset(p: (typeof PRESETS)[number]) {
    setPromptTitle(p.title);
    setBrief(p.brief);
    setCategory(p.category);
    setDimensions(p.dimensions);
    setUnits(p.units);
    setStyle(p.style);
    toast.info(`Loaded "${p.label}" template`);
  }

  async function handleGenerateCAD(e: React.FormEvent) {
    e.preventDefault();
    if (!brief.trim() || brief.trim().length < 15) {
      toast.error(
        "Please provide a design brief with at least 15 characters.",
      );
      return;
    }

    const titleToUse =
      promptTitle.trim() ||
      `${category.charAt(0).toUpperCase() + category.slice(1)} CAD Design`;

    setGenerating(true);
    setGenStep("1/3 Initializing CAD request...");

    try {
      // Step 1: Create Request
      const newReq = await createReq({
        data: {
          title: titleToUse,
          brief: brief.trim(),
          category,
          dimensions: dimensions.trim() || null,
          units,
          style: style.trim() || null,
          package: selectedPkg,
        },
      });

      setActiveCanvasId(newReq.id);
      refetchUsage();
      qc.invalidateQueries({ queryKey: ["my-requests"] });

      // Step 2: Render CAD Concept Previews
      setGenStep(
        "2/3 AI rendering Blueprint, Photorealistic & Isometric views...",
      );
      toast.info("Generating CAD concept previews...");
      await genImages({ data: { id: newReq.id } });

      setGenStep("3/3 Previews ready!");
      toast.success("CAD concept previews generated successfully!");

      qc.invalidateQueries({ queryKey: ["my-requests"] });
      refetchActiveCanvas();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "CAD generation failed. Try rephrasing prompt.",
      );
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
      toast.error(
        err instanceof Error ? err.message : "Could not start video render",
      );
    }
  }

  const freeRemaining = usage?.remainingToday ?? 2;
  const isFreeTestAvailable = freeRemaining > 0;

  const canvasImages =
    activeCanvasData?.assets.filter((a) => a.kind === "image") ?? [];
  const canvasVideos =
    activeCanvasData?.assets.filter((a) => a.kind === "video") ?? [];

  return (
    <div className="min-h-screen pb-16">
      <SiteHeader signedIn />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Workspace Header & Connected Wallet Badge */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <p className="tech-label text-blueprint">CAD AI Workspace</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-mono text-emerald-400 border border-emerald-500/20">
                <Zap className="size-3" /> Live Studio
              </span>
            </div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              CAD Design Generator
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {walletAddress ? (
              <div className="flex items-center gap-2 rounded-lg border border-blueprint/30 bg-blueprint/10 px-3 py-1.5 text-xs font-mono">
                <Wallet className="size-3.5 text-blueprint" />
                <span className="text-foreground">
                  {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
                </span>
                <span className="text-muted-foreground">(Connected)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-surface/80 px-3 py-1.5 text-xs font-mono text-muted-foreground">
                <Wallet className="size-3.5 text-muted-foreground" />
                <span>Signed in</span>
              </div>
            )}
          </div>
        </div>

        {/* Daily Free Test Experience Banner / Meter */}
        <div className="mt-6 panel grid-paper relative overflow-hidden p-5 border border-blueprint/30 bg-surface/60">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blueprint/20 text-blueprint border border-blueprint/30">
                <Zap className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base">
                    Free Test Experience
                  </h3>
                  <span className="rounded bg-primary/20 px-2 py-0.5 text-xs font-mono text-primary font-medium">
                    2 Requests / Day Included
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground max-w-xl">
                  Test prompt-to-CAD generation for free without payment! You
                  get 2 complimentary daily CAD requests with blueprint,
                  realistic 3/4, and 3D isometric previews.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0 border-t md:border-t-0 border-border/60 pt-3 md:pt-0">
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-muted-foreground">Daily Allowance:</span>
                <span className="text-primary font-bold">
                  {freeRemaining} / 2 Free Left
                </span>
              </div>

              {/* Visual Progress Bar */}
              <div className="mt-2 h-2 w-44 rounded-full bg-surface-2 overflow-hidden border border-border">
                <div
                  className="h-full bg-gradient-to-r from-blueprint to-primary transition-all duration-300"
                  style={{ width: `${((2 - freeRemaining) / 2) * 100}%` }}
                />
              </div>

              <span className="mt-1 font-mono text-[11px] text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" /> Resets daily at 00:00 UTC
              </span>
            </div>
          </div>
        </div>

        {/* Main Workspace Layout: Prompt Entry Form + Live CAD Canvas */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1.1fr]">
          {/* LEFT: Interactive CAD Prompt Input Box */}
          <div className="panel p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="cad-brief" className="text-base font-semibold">
                  Enter CAD Prompt
                </Label>
                <span className="tech-label text-blueprint">Prompt → DWG</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Describe dimensions, materials, geometric features, or spatial
                requirements.
              </p>

              {/* Sample Preset Chips */}
              <div className="mt-4">
                <p className="text-[11px] font-mono text-muted-foreground mb-2">
                  Quick Prompt Templates:
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2/80 px-2.5 py-1 text-xs hover:border-blueprint/50 hover:bg-blueprint/10 transition-colors"
                    >
                      <span>{p.icon}</span>
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleGenerateCAD} className="mt-5 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title-input" className="text-xs">
                    Design Title / Ref (Optional)
                  </Label>
                  <Input
                    id="title-input"
                    value={promptTitle}
                    placeholder="e.g. Aluminum Motor Mount Bracket"
                    onChange={(e) => setPromptTitle(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cad-brief" className="text-xs">
                    Design Brief & Specifications *
                  </Label>
                  <Textarea
                    id="cad-brief"
                    value={brief}
                    rows={5}
                    required
                    placeholder="e.g., L-bracket for motor mount, 150mm length x 60mm width x 25mm height. 4 M8 countersunk mounting holes, chamfered edges, 6061-T6 aluminum finish."
                    onChange={(e) => setBrief(e.target.value)}
                    className="text-sm resize-y"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                    <span>{brief.length} characters</span>
                    <span>No CAD experience needed</span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="h-9 text-xs">
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

                  <div className="space-y-1.5">
                    <Label className="text-xs">Units</Label>
                    <Select value={units} onValueChange={setUnits}>
                      <SelectTrigger className="h-9 text-xs">
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

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="dim-input" className="text-xs">
                      Key Dimensions
                    </Label>
                    <Input
                      id="dim-input"
                      value={dimensions}
                      placeholder="e.g. 150 x 60 x 25"
                      onChange={(e) => setDimensions(e.target.value)}
                      className="h-9 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="style-input" className="text-xs">
                      Style / Material
                    </Label>
                    <Input
                      id="style-input"
                      value={style}
                      placeholder="e.g. Anodized aluminum"
                      onChange={(e) => setStyle(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-border/70">
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    disabled={generating}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {generating ? (
                      <>
                        <RefreshCw className="size-4 animate-spin" />
                        <span>Generating CAD Concept...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        <span>
                          {isFreeTestAvailable
                            ? "Generate CAD Design (Free Test)"
                            : "Generate CAD Design"}
                        </span>
                      </>
                    )}
                  </Button>

                  {generating && genStep && (
                    <p className="mt-2 text-center font-mono text-xs text-blueprint animate-pulse">
                      {genStep}
                    </p>
                  )}

                  {!generating && (
                    <p className="mt-2 text-center font-mono text-[11px] text-muted-foreground">
                      {isFreeTestAvailable
                        ? `⚡ Free daily test request (${freeRemaining}/2 remaining today)`
                        : "Daily free requests used — standard package applies."}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT: Live CAD Generation Preview Canvas */}
          <div className="panel p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <div className="flex items-center gap-2">
                  <Box className="size-4 text-blueprint" />
                  <h3 className="font-semibold text-base">
                    CAD Preview Canvas
                  </h3>
                </div>
                {activeCanvasData && (
                  <StatusBadge status={activeCanvasData.request.status} />
                )}
              </div>

              {!activeCanvasId && (
                <div className="mt-12 flex flex-col items-center justify-center text-center p-8 border border-dashed border-border/80 rounded-lg bg-surface/30">
                  <div className="flex size-12 items-center justify-center rounded-full bg-blueprint/15 text-blueprint mb-3">
                    <Ruler className="size-6" />
                  </div>
                  <h4 className="font-semibold text-sm">No Active CAD Preview</h4>
                  <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                    Type a prompt on the left and click "Generate CAD Design" to
                    see 2D orthographic blueprints & 3D renders.
                  </p>
                </div>
              )}

              {activeCanvasData && (
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">
                      {activeCanvasData.request.title}
                    </h4>
                    <p className="tech-label mt-1 text-muted-foreground">
                      {activeCanvasData.request.category} ·{" "}
                      {activeCanvasData.request.dimensions || "custom size"}{" "}
                      {activeCanvasData.request.units}
                    </p>
                  </div>

                  {/* Rendered CAD Concept Images */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                      <span>Concept Renders ({canvasImages.length}/3)</span>
                      {canvasImages.length === 0 && generating && (
                        <span className="text-blueprint animate-pulse">
                          Rendering...
                        </span>
                      )}
                    </div>

                    {canvasImages.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-3">
                        {canvasImages.map((img, idx) => (
                          <div
                            key={img.id}
                            className="group relative panel overflow-hidden border border-border/80 bg-background"
                          >
                            <img
                              src={img.signedUrl || ""}
                              alt={`CAD Concept View ${idx + 1}`}
                              className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                              loading="lazy"
                            />
                            <span className="absolute bottom-1 left-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-mono text-white">
                              {idx === 0
                                ? "Blueprint"
                                : idx === 1
                                  ? "Realistic"
                                  : "Isometric"}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid-paper aspect-video flex items-center justify-center rounded-md border border-border/70 bg-surface/40 p-6 text-center text-xs text-muted-foreground">
                        {generating ? (
                          <div className="space-y-2">
                            <RefreshCw className="size-6 animate-spin mx-auto text-blueprint" />
                            <p>Generating CAD drawings...</p>
                          </div>
                        ) : (
                          <p>Click "Generate concept images" to render.</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 3D Motion Preview Section */}
                  <div className="pt-3 border-t border-border/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-muted-foreground">
                        3D Motion Orbit Preview
                      </span>
                      {canvasVideos.length > 0 && (
                        <span className="text-xs font-mono text-emerald-400">
                          Video Ready
                        </span>
                      )}
                    </div>

                    {canvasVideos.length > 0 ? (
                      <video
                        src={canvasVideos[0].signedUrl || ""}
                        controls
                        playsInline
                        className="panel w-full aspect-video rounded border border-border"
                      />
                    ) : (
                      <Button
                        variant="blueprint"
                        size="sm"
                        disabled={!!videoJob || generating}
                        onClick={handleTriggerVideo}
                        className="w-full text-xs flex items-center justify-center gap-2"
                      >
                        <Film className="size-3.5" />
                        <span>
                          {videoJob
                            ? `Rendering 3D Motion... ${videoStatus || ""}`
                            : "Generate Orbiting 3D Motion Video"}
                        </span>
                      </Button>
                    )}
                  </div>

                  {/* Link to Full Details & DWG Drafting Order */}
                  <div className="pt-3 border-t border-border/70 flex items-center justify-between">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <Link
                        to="/requests/$id"
                        params={{ id: activeCanvasId }}
                        className="flex items-center gap-1.5"
                      >
                        <FileText className="size-3.5" />
                        <span>View Full Specs & DWG Order</span>
                        <ChevronRight className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM: Recent Requests Table / List */}
        <div className="mt-12 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Your CAD Requests</h2>
              <p className="text-xs text-muted-foreground">
                All submitted CAD briefs, AI previews, and production drafting
                status.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/new">New Custom Brief</Link>
            </Button>
          </div>

          <div className="space-y-3">
            {isListLoading && (
              <p className="text-sm text-muted-foreground font-mono">
                Loading requests…
              </p>
            )}

            {!isListLoading && (requests?.length ?? 0) === 0 && (
              <div className="panel grid-paper p-10 text-center">
                <h3 className="text-base font-semibold">No CAD requests yet</h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                  Type your first brief in the workspace prompt generator above
                  to test 2 daily free requests!
                </p>
              </div>
            )}

            {requests?.map((r) => (
              <div
                key={r.id}
                onClick={() => setActiveCanvasId(r.id)}
                className={`panel flex flex-wrap items-center justify-between gap-4 p-4 transition-all cursor-pointer hover:border-blueprint/50 ${
                  activeCanvasId === r.id
                    ? "ring-1 ring-blueprint bg-blueprint/5"
                    : "hover:bg-surface-2"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded bg-surface-2 text-blueprint">
                    <Ruler className="size-4" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm">
                      {r.title}
                    </p>
                    <p className="tech-label mt-0.5 text-muted-foreground text-[11px]">
                      {r.category} · {r.package} ·{" "}
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-primary">
                    {r.quote_cents === 0
                      ? "Free Test"
                      : formatMoney(r.quote_cents)}
                  </span>
                  <StatusBadge status={r.status} />
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                  >
                    <Link to="/requests/$id" params={{ id: r.id }}>
                      <span>Details</span>
                      <ArrowRight className="size-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
