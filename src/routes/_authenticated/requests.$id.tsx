import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Film, Sparkles, CreditCard, Check } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/pricing";
import {
  getRequest,
  generatePreviewImages,
  startPreviewVideo,
  pollPreviewVideo,
  payForRequest,
} from "@/lib/requests.functions";
import {
  preparePayment,
  confirmBasePayment,
  getBasePayConfig,
} from "@/lib/payments.functions";
import { executeBaseSepoliaPayment } from "@/lib/base-sepolia-pay";

export const Route = createFileRoute("/_authenticated/requests/$id")({
  head: () => ({
    meta: [
      { title: "Design request — DraftForge" },
      {
        name: "description",
        content:
          "Review AI concept images and the motion preview for your CAD brief.",
      },
      { property: "og:title", content: "Design request — DraftForge" },
      {
        property: "og:description",
        content: "Review AI previews before drafting begins.",
      },
    ],
  }),
  component: RequestDetail,
});

function RequestDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const fetchRequest = useServerFn(getRequest);
  const genImages = useServerFn(generatePreviewImages);
  const startVideo = useServerFn(startPreviewVideo);
  const pollVideo = useServerFn(pollPreviewVideo);
  const pay = useServerFn(payForRequest);
  const prepare = useServerFn(preparePayment);
  const confirmPay = useServerFn(confirmBasePayment);
  const payConfig = useServerFn(getBasePayConfig);

  const { data: baseConfig } = useQuery({
    queryKey: ["base-pay-config"],
    queryFn: () => payConfig({}),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["request", id],
    queryFn: () => fetchRequest({ data: { id } }),
  });

  const [imgBusy, setImgBusy] = useState(false);
  const [videoJob, setVideoJob] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string | null>(null);
  const [payBusy, setPayBusy] = useState(false);

  useEffect(() => {
    if (!videoJob) return;
    let active = true;
    const timer = setInterval(async () => {
      try {
        const res = await pollVideo({ data: { id, jobId: videoJob } });
        if (!active) return;
        if (res.status === "completed") {
          setVideoJob(null);
          setVideoStatus(null);
          toast.success("Motion preview ready");
          qc.invalidateQueries({ queryKey: ["request", id] });
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
  }, [videoJob, id, pollVideo, qc]);

  async function onGenerateImages() {
    setImgBusy(true);
    try {
      await genImages({ data: { id } });
      toast.success("Concept images ready");
      qc.invalidateQueries({ queryKey: ["request", id] });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Image generation failed",
      );
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
      toast.error(
        err instanceof Error ? err.message : "Could not start the video",
      );
    }
  }

  async function onPay() {
    setPayBusy(true);
    try {
      await pay({ data: { id } });
      toast.success("Payment confirmed — drafting starts now.");
      qc.invalidateQueries({ queryKey: ["request", id] });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Payment could not be completed",
      );
    } finally {
      setPayBusy(false);
    }
  }

  async function onBasePay() {
    setPayBusy(true);
    try {
      const quote = await prepare({ data: { id } });
      toast.info("Triggering Base Sepolia payment (Chain ID: 84532)...");
      const payRes = await executeBaseSepoliaPayment({
        amountUsdc: quote.amount,
        recipientAddress: quote.to,
      });
      const paymentId = payRes.txHash;
      toast.info("Payment sent — confirming on Base Sepolia…");

      for (let attempt = 0; attempt < 20; attempt++) {
        const status = await confirmBasePayment({ data: { id, paymentId } });
        if (status.status === "completed") {
          toast.success("Payment confirmed on Base Sepolia — drafting starts now.");
          qc.invalidateQueries({ queryKey: ["request", id] });
          return;
        }
        await new Promise((r) => setTimeout(r, 3000));
      }
      toast.info("Still confirming on Base Sepolia — refresh in a moment.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Base Sepolia payment could not be completed",
      );
    } finally {
      setPayBusy(false);
    }
  }

  const images = data?.assets.filter((a) => a.kind === "image") ?? [];
  const videos = data?.assets.filter((a) => a.kind === "video") ?? [];
  const references = data?.assets.filter((a) => a.kind === "reference") ?? [];
  const hasPreview = images.length > 0 || videos.length > 0;

  return (
    <div className="min-h-screen">
      <SiteHeader signedIn />
      <main className="mx-auto max-w-6xl px-5 py-12">
        <Link
          to="/dashboard"
          className="tech-label inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> All requests
        </Link>

        {isLoading && <p className="mt-8 text-muted-foreground">Loading…</p>}

        {data && (
          <>
            <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-semibold">{data.request.title}</h1>
                <p className="tech-label mt-2 text-muted-foreground">
                  {data.request.category} · {data.request.package} ·{" "}
                  {data.request.dimensions ?? "no dimensions given"}{" "}
                  {data.request.units}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-2xl text-primary">
                  {formatMoney(data.request.quote_cents)}
                </span>
                <StatusBadge status={data.request.status} />
              </div>
            </div>

            <div className="panel mt-8 p-6">
              <p className="tech-label text-blueprint">Brief</p>
              <p className="mt-3 whitespace-pre-wrap text-muted-foreground">
                {data.request.brief}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                variant="hero"
                onClick={onGenerateImages}
                disabled={imgBusy}
              >
                <Sparkles />{" "}
                {imgBusy ? "Rendering concepts…" : "Generate concept images"}
              </Button>
              <Button
                variant="blueprint"
                onClick={onGenerateVideo}
                disabled={!!videoJob}
              >
                <Film />{" "}
                {videoJob
                  ? `Rendering video… ${videoStatus ?? ""}`
                  : "Generate motion preview"}
              </Button>
            </div>

            {references.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-semibold">Your example images</h2>
                <div className="mt-4 flex flex-wrap gap-4">
                  {references.map((a) =>
                    a.signedUrl ? (
                      <img
                        key={a.id}
                        src={a.signedUrl}
                        alt={`Reference supplied for ${data.request.title}`}
                        className="size-28 rounded border border-border object-cover"
                        loading="lazy"
                      />
                    ) : null,
                  )}
                </div>
              </section>
            )}

            <section className="mt-10">
              <h2 className="text-xl font-semibold">Concept images</h2>
              {images.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  No images yet — generate concepts to see blueprint, realistic
                  and isometric views.
                </p>
              ) : (
                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  {images.map((a) =>
                    a.signedUrl ? (
                      <figure key={a.id} className="panel overflow-hidden">
                        <img
                          src={a.signedUrl}
                          alt={`Concept preview for ${data.request.title}`}
                          className="aspect-square w-full object-cover"
                          loading="lazy"
                        />
                      </figure>
                    ) : null,
                  )}
                </div>
              )}
            </section>

            <section className="mt-12">
              <h2 className="text-xl font-semibold">Motion preview</h2>
              {videos.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  No video yet — generate a short orbiting preview of the
                  design.
                </p>
              ) : (
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {videos.map((a) =>
                    a.signedUrl ? (
                      <video
                        key={a.id}
                        src={a.signedUrl}
                        controls
                        playsInline
                        className="panel w-full"
                      />
                    ) : null,
                  )}
                </div>
              )}
            </section>

            <section className="panel mt-12 p-6">
              <p className="tech-label text-blueprint">Payment</p>
              {data.request.paid ? (
                <p className="mt-3 flex items-center gap-2 text-muted-foreground">
                  <Check className="size-4 text-primary" /> Paid{" "}
                  {formatMoney(data.request.quote_cents)} — your AutoCAD
                  drawings are in progress.
                </p>
              ) : (
                <>
                  <p className="mt-3 text-muted-foreground">
                    {hasPreview
                      ? `Happy with the preview? Pay ${formatMoney(data.request.quote_cents)} and drafting in AutoCAD begins.`
                      : "You're not charged until your preview is generated and you're happy with it."}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Button
                      variant="hero"
                      disabled={
                        !hasPreview || payBusy || !baseConfig?.configured
                      }
                      onClick={onBasePay}
                    >
                      <span
                        className="size-3 rounded-full bg-blueprint"
                        aria-hidden
                      />
                      {payBusy
                        ? "Confirming…"
                        : hasPreview
                          ? `Pay ${formatMoney(data.request.quote_cents)} with Base Pay (USDC)`
                          : "Generate a preview first"}
                    </Button>
                    <Button
                      variant="outline"
                      disabled={!hasPreview || payBusy}
                      onClick={onPay}
                    >
                      <CreditCard /> Mark as paid manually
                    </Button>
                  </div>
                  {hasPreview && !baseConfig?.configured && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Base Pay is waiting on the studio's payout wallet address.
                    </p>
                  )}
                  {baseConfig?.testnet && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Running on Base Sepolia testnet — no real funds are moved.
                    </p>
                  )}
                </>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
