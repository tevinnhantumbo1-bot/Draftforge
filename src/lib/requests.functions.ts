import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const BUCKET = "design-previews";

export const getDailyFreeUsage = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ activePlan: z.string().optional() }).optional().parse(input),
  )
  .handler(async ({ data, context }) => {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const { count, error } = await context.supabase
      .from("design_requests")
      .select("id", { count: "exact", head: true })
      .eq("user_id", context.userId)
      .gte("created_at", startOfDay.toISOString());

    if (error) {
      console.warn("Could not query daily request count:", error);
    }

    const usedToday = count ?? 0;
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
});

export const createRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => CreateInput.parse(input))
  .handler(async ({ data, context }) => {
    const { quoteCents } = await import("@/lib/pricing");

    // Calculate daily request usage
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const { count } = await context.supabase
      .from("design_requests")
      .select("id", { count: "exact", head: true })
      .eq("user_id", context.userId)
      .gte("created_at", startOfDay.toISOString());

    const usedToday = count ?? 0;
    const plan = data.activePlan || "free";

    let maxFreePerDay = 2;
    if (plan === "weekly_boost") maxFreePerDay = 5;
    else if (plan === "pro") maxFreePerDay = 50;
    else if (plan === "studio") maxFreePerDay = 9999;

    const isFreeTest = usedToday < maxFreePerDay;

    // For free test / subscription quota, quote_cents is 0
    const quote = isFreeTest ? 0 : quoteCents(data.package, data.category, data.brief.length);

    const { data: row, error } = await context.supabase
      .from("design_requests")
      .insert({
        user_id: context.userId,
        title: data.title,
        brief: data.brief,
        category: data.category,
        dimensions: data.dimensions ?? null,
        units: data.units,
        style: data.style ?? null,
        package: data.package,
        status: isFreeTest ? "free_test" : "submitted",
        quote_cents: quote,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return {
      id: row.id as string,
      isFreeTest,
      usedToday: usedToday + 1,
      maxFreePerDay,
      remainingToday: Math.max(0, maxFreePerDay - (usedToday + 1)),
    };
  });

export const listMyRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("design_requests")
      .select("id,title,category,status,quote_cents,paid,created_at,package")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
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
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => UploadInput.parse(input))
  .handler(async ({ data, context }) => {
    const { data: request } = await context.supabase
      .from("design_requests")
      .select("id")
      .eq("id", data.id)
      .maybeSingle();
    if (!request) throw new Error("Request not found");

    const cad = await import("@/lib/cad.server");
    const { supabaseAdmin } =
      await import("@/integrations/supabase/client.server");

    for (const file of data.files) {
      const { bytes, contentType } = cad.dataUrlToBytes(file.dataUrl);
      const ext = contentType.includes("jpeg")
        ? "jpg"
        : contentType.includes("webp")
          ? "webp"
          : "png";
      const path = `${context.userId}/${data.id}/ref-${crypto.randomUUID()}.${ext}`;
      const up = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(path, bytes, { contentType });
      if (up.error) throw new Error(up.error.message);
      await supabaseAdmin.from("request_assets").insert({
        request_id: data.id,
        user_id: context.userId,
        kind: "reference",
        url: path,
        prompt: file.name,
      });
    }
    return { count: data.files.length };
  });

export const payForRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: request } = await context.supabase
      .from("design_requests")
      .select("id,paid")
      .eq("id", data.id)
      .maybeSingle();
    if (!request) throw new Error("Request not found");
    if (request.paid) return { paid: true };

    const { count } = await context.supabase
      .from("request_assets")
      .select("id", { count: "exact", head: true })
      .eq("request_id", data.id)
      .in("kind", ["image", "video"]);
    if (!count)
      throw new Error(
        "Generate a preview first — you only pay once you've seen it.",
      );

    const { error } = await context.supabase
      .from("design_requests")
      .update({ paid: true, status: "in_drafting" })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { paid: true };
  });

export const getRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: request, error } = await context.supabase
      .from("design_requests")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!request) throw new Error("Request not found");

    const { data: assets } = await context.supabase
      .from("request_assets")
      .select("id,kind,url,prompt,created_at")
      .eq("request_id", data.id)
      .order("created_at", { ascending: true });

    const { supabaseAdmin } =
      await import("@/integrations/supabase/client.server");
    const withUrls = await Promise.all(
      (assets ?? []).map(async (a) => {
        const signed = await supabaseAdmin.storage
          .from(BUCKET)
          .createSignedUrl(a.url, 3600);
        return { ...a, signedUrl: signed.data?.signedUrl ?? null };
      }),
    );
    return { request, assets: withUrls };
  });

export const generatePreviewImages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: request, error } = await context.supabase
      .from("design_requests")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!request) throw new Error("Request not found");

    const cad = await import("@/lib/cad.server");
    const { supabaseAdmin } =
      await import("@/integrations/supabase/client.server");

    const { data: refs } = await context.supabase
      .from("request_assets")
      .select("url")
      .eq("request_id", request.id)
      .eq("kind", "reference");
    const referenceUrls: string[] = [];
    for (const r of refs ?? []) {
      const signed = await supabaseAdmin.storage
        .from(BUCKET)
        .createSignedUrl(r.url, 3600);
      if (signed.data?.signedUrl) referenceUrls.push(signed.data.signedUrl);
    }

    const brief = {
      title: request.title,
      brief: request.brief,
      category: request.category,
      dimensions: request.dimensions,
      units: request.units,
      style: request.style,
    };

    const created: string[] = [];
    for (const variant of cad.IMAGE_VARIANTS) {
      const prompt = cad.imagePrompt(brief, variant);
      const dataUrl = await cad.generateImage(
        referenceUrls.length
          ? `${prompt} Use the attached reference images as the visual starting point — match their form, materials and proportions.`
          : prompt,
        referenceUrls,
      );
      const { bytes, contentType } = cad.dataUrlToBytes(dataUrl);
      const ext = contentType.includes("jpeg") ? "jpg" : "png";
      const path = `${context.userId}/${request.id}/${crypto.randomUUID()}.${ext}`;
      const up = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(path, bytes, { contentType });
      if (up.error) throw new Error(up.error.message);
      await supabaseAdmin.from("request_assets").insert({
        request_id: request.id,
        user_id: context.userId,
        kind: "image",
        url: path,
        prompt,
      });
      created.push(path);
    }

    await supabaseAdmin
      .from("design_requests")
      .update({ status: "preview_ready" })
      .eq("id", request.id);

    return { count: created.length };
  });

export const startPreviewVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: request, error } = await context.supabase
      .from("design_requests")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!request) throw new Error("Request not found");

    const cad = await import("@/lib/cad.server");
    const jobId = await cad.createVideoJob(
      cad.videoPrompt({
        title: request.title,
        brief: request.brief,
        category: request.category,
        dimensions: request.dimensions,
        units: request.units,
        style: request.style,
      }),
    );
    return { jobId };
  });

export const pollPreviewVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({ id: z.string().uuid(), jobId: z.string().min(3).max(200) })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: request } = await context.supabase
      .from("design_requests")
      .select("id,user_id")
      .eq("id", data.id)
      .maybeSingle();
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

    const { supabaseAdmin } =
      await import("@/integrations/supabase/client.server");
    const path = `${context.userId}/${request.id}/${data.jobId}.mp4`;
    const { data: existing } = await supabaseAdmin
      .from("request_assets")
      .select("id")
      .eq("request_id", request.id)
      .eq("url", path)
      .maybeSingle();
    if (!existing) {
      const mp4 = await cad.downloadVideo(data.jobId);
      const up = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(path, mp4, { contentType: "video/mp4", upsert: true });
      if (up.error) throw new Error(up.error.message);
      await supabaseAdmin.from("request_assets").insert({
        request_id: request.id,
        user_id: context.userId,
        kind: "video",
        url: path,
      });
    }
    return { status: "completed", progress: 100 };
  });
