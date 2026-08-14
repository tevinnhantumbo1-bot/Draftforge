import { createServerFn } from "@tanstack/react-start";
import { requireMongoAuth } from "./mongo-auth.middleware";
import { z } from "zod";
import {
  createDraftRequestMongo,
  getDraftRequestMongo,
  listDraftRequestsMongo,
  updateDraftRequestMongo,
  deleteDraftRequestMongo,
  addAssetToDraftMongo,
  getDashboardStatsMongo,
  type DraftRequestDoc,
  type DraftAsset,
} from "./drafts.service";
import { recordUserActivity } from "./user.service";

export const getDailyFreeUsage = createServerFn({ method: "GET" })
  .middleware([requireMongoAuth])
  .inputValidator((input: unknown) =>
    z.object({ activePlan: z.string().optional() }).optional().parse(input),
  )
  .handler(async ({ data, context }) => {
    const requests = await listDraftRequestsMongo(context.userId);
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const usedToday = requests.filter(
      (r) => new Date(r.created_at).getTime() >= startOfDay.getTime(),
    ).length;

    const plan = data?.activePlan || "free";

    let maxFreePerDay = 2;
    if (plan === "weekly_boost") maxFreePerDay = 5;
    else if (plan === "pro") maxFreePerDay = 50;
    else if (plan === "studio") maxFreePerDay = 9999;

    const remainingToday = Math.max(0, maxFreePerDay - usedToday);

    return {
      usedToday,
      maxFreePerDay,
      remainingToday,
      isFreeAvailable: remainingToday > 0,
      activePlan: plan,
    };
  });

const CreateInput = z.object({
  title: z.string().trim().min(3).max(120),
  brief: z.string().trim().min(20).max(4000),
  category: z.string().trim().min(2).max(40),
  dimensions: z.string().trim().max(200).optional().nullable(),
  units: z.string().trim().max(10).default("mm"),
  style: z.string().trim().max(200).optional().nullable(),
  package: z.enum(["concept", "standard", "pro"]),
  activePlan: z.string().optional(),
  jurisdiction: z.string().optional(),
  urgency: z.string().optional(),
  keyTerms: z.array(z.string()).optional(),
});

export const createRequest = createServerFn({ method: "POST" })
  .middleware([requireMongoAuth])
  .inputValidator((input: unknown) => CreateInput.parse(input))
  .handler(async ({ data, context }) => {
    const { quoteCents } = await import("@/lib/pricing");

    const requests = await listDraftRequestsMongo(context.userId);
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const usedToday = requests.filter(
      (r) => new Date(r.created_at).getTime() >= startOfDay.getTime(),
    ).length;

    const plan = data.activePlan || "free";

    let maxFreePerDay = 2;
    if (plan === "weekly_boost") maxFreePerDay = 5;
    else if (plan === "pro") maxFreePerDay = 50;
    else if (plan === "studio") maxFreePerDay = 9999;

    const isFreeTest = usedToday < maxFreePerDay;
    const quote = isFreeTest ? 0 : quoteCents(data.package, data.category, data.brief.length);

    const requestId = crypto.randomUUID();
    const now = new Date().toISOString();

    const doc: DraftRequestDoc = {
      id: requestId,
      title: data.title,
      document_type: data.category || "CAD Design Brief",
      category: data.category,
      jurisdiction: data.jurisdiction || "US-CA",
      urgency: data.urgency || "standard",
      description: data.brief,
      dimensions: data.dimensions ?? null,
      units: data.units,
      style: data.style ?? null,
      package: data.package,
      key_terms: data.keyTerms || [],
      attached_files: [],
      assets: [],
      status: isFreeTest ? "submitted" : "draft",
      price_usd: quote / 100,
      user_address: context.userId.toLowerCase(),
      created_at: now,
      updated_at: now,
    };

    await createDraftRequestMongo(doc);

    return {
      id: requestId,
      isFreeTest,
      usedToday: usedToday + 1,
      maxFreePerDay,
      remainingToday: Math.max(0, maxFreePerDay - (usedToday + 1)),
    };
  });

export const listMyRequests = createServerFn({ method: "GET" })
  .middleware([requireMongoAuth])
  .handler(async ({ context }) => {
    const mongoRequests = await listDraftRequestsMongo(context.userId);
    return mongoRequests.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category || r.document_type,
      status: r.status,
      quote_cents: Math.round(r.price_usd * 100),
      paid: r.status === "paid" || !!r.base_payment_tx,
      created_at: r.created_at,
      package: r.package || "standard",
    }));
  });

const UploadInput = z.object({
  id: z.string().uuid(),
  files: z
    .array(
      z.object({
        name: z.string().max(200),
        dataUrl: z.string().startsWith("data:image/").max(8_000_000),
      }),
    )
    .min(1)
    .max(5),
});

export const uploadReferenceImages = createServerFn({ method: "POST" })
  .middleware([requireMongoAuth])
  .inputValidator((input: unknown) => UploadInput.parse(input))
  .handler(async ({ data }) => {
    const request = await getDraftRequestMongo(data.id);
    if (!request) throw new Error("Request not found");

    for (const file of data.files) {
      const asset: DraftAsset = {
        id: crypto.randomUUID(),
        kind: "reference",
        url: file.dataUrl,
        prompt: file.name,
        created_at: new Date().toISOString(),
      };
      await addAssetToDraftMongo(data.id, asset);
    }
    return { count: data.files.length };
  });

export const payForRequest = createServerFn({ method: "POST" })
  .middleware([requireMongoAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const request = await getDraftRequestMongo(data.id);
    if (!request) throw new Error("Request not found");
    if (request.status === "paid" || request.base_payment_tx) return { paid: true };

    const assets = request.assets || [];
    const hasVisuals = assets.some((a) => a.kind === "image" || a.kind === "video");
    if (!hasVisuals) {
      throw new Error(
        "Generate a preview first — you only pay once you've seen it.",
      );
    }

    await updateDraftRequestMongo(data.id, {
      status: "drafting",
    });

    return { paid: true };
  });

export const getRequest = createServerFn({ method: "POST" })
  .middleware([requireMongoAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const mongoReq = await getDraftRequestMongo(data.id);
    if (!mongoReq) throw new Error("Request not found");

    const assets = (mongoReq.assets || []).map((a) => ({
      ...a,
      signedUrl: a.url, // Data URL or cloud URL
    }));

    return {
      request: {
        id: mongoReq.id,
        title: mongoReq.title,
        brief: mongoReq.description,
        category: mongoReq.category || mongoReq.document_type,
        dimensions: mongoReq.dimensions,
        units: mongoReq.units,
        style: mongoReq.style,
        status: mongoReq.status,
        quote_cents: Math.round(mongoReq.price_usd * 100),
        paid: mongoReq.status === "paid" || !!mongoReq.base_payment_tx,
        created_at: mongoReq.created_at,
        draft_output: mongoReq.draft_output,
        ai_analysis: mongoReq.ai_analysis,
        jurisdiction: mongoReq.jurisdiction,
        package: mongoReq.package || "standard",
      },
      assets,
    };
  });

export const generatePreviewImages = createServerFn({ method: "POST" })
  .middleware([requireMongoAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const request = await getDraftRequestMongo(data.id);
    if (!request) throw new Error("Request not found");

    const cad = await import("@/lib/cad.server");

    const refs = (request.assets || []).filter((a) => a.kind === "reference");
    const referenceUrls = refs.map((r) => r.url);

    const brief = {
      title: request.title,
      brief: request.description,
      category: request.category || request.document_type,
      dimensions: request.dimensions,
      units: request.units,
      style: request.style,
    };

    let count = 0;
    for (const variant of cad.IMAGE_VARIANTS) {
      const prompt = cad.imagePrompt(brief, variant);
      const dataUrl = await cad.generateImage(
        referenceUrls.length
          ? `${prompt} Use the attached reference images as the visual starting point — match their form, materials and proportions.`
          : prompt,
        referenceUrls,
      );

      const asset: DraftAsset = {
        id: crypto.randomUUID(),
        kind: "image",
        url: dataUrl,
        prompt,
        created_at: new Date().toISOString(),
      };

      await addAssetToDraftMongo(request.id, asset);
      count++;
    }

    await updateDraftRequestMongo(request.id, {
      status: "review_ready",
    });

    return { count };
  });

export const startPreviewVideo = createServerFn({ method: "POST" })
  .middleware([requireMongoAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const request = await getDraftRequestMongo(data.id);
    if (!request) throw new Error("Request not found");

    const cad = await import("@/lib/cad.server");
    const jobId = await cad.createVideoJob(
      cad.videoPrompt({
        title: request.title,
        brief: request.description,
        category: request.category || request.document_type,
        dimensions: request.dimensions,
        units: request.units,
        style: request.style,
      }),
    );
    return { jobId };
  });

export const pollPreviewVideo = createServerFn({ method: "POST" })
  .middleware([requireMongoAuth])
  .inputValidator((input: unknown) =>
    z
      .object({ id: z.string().uuid(), jobId: z.string().min(3).max(200) })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const request = await getDraftRequestMongo(data.id);
    if (!request) throw new Error("Request not found");

    const cad = await import("@/lib/cad.server");
    const job = await cad.readVideoJob(data.jobId);
    if (job.status === "failed") {
      throw new Error(
        job.error?.message ?? "Video generation failed. Try again.",
      );
    }
    if (job.status !== "completed") {
      return { status: job.status, progress: job.progress ?? 0 };
    }

    const videoBuffer = await cad.downloadVideo(data.jobId);
    const b64 = Buffer.from(videoBuffer).toString("base64");
    const dataUrl = `data:video/mp4;base64,${b64}`;

    const asset: DraftAsset = {
      id: crypto.randomUUID(),
      kind: "video",
      url: dataUrl,
      prompt: `Motion orbit animation for ${request.title}`,
      created_at: new Date().toISOString(),
    };

    await addAssetToDraftMongo(request.id, asset);

    return { status: "completed", progress: 100 };
  });

export const getDashboardSummary = createServerFn({ method: "GET" })
  .middleware([requireMongoAuth])
  .handler(async ({ context }) => {
    const stats = await getDashboardStatsMongo(context.userId);
    return stats;
  });
