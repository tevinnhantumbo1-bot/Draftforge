const GATEWAY = "https://ai.gateway.lovable.dev/v1";

function key() {
  const k = process.env["LOVABLE_API_KEY"];
  if (!k) throw new Error("AI is not configured yet.");
  return k;
}

export type Brief = {
  title: string;
  brief: string;
  category: string;
  dimensions?: string | null;
  units?: string | null;
  style?: string | null;
};

export function imagePrompt(b: Brief, variant: string) {
  return [
    `Technical design visualisation for an AutoCAD drafting brief.`,
    `Project: ${b.title}.`,
    `Category: ${b.category}.`,
    `Brief: ${b.brief}`,
    b.dimensions ? `Key dimensions: ${b.dimensions} ${b.units ?? ""}.` : "",
    b.style ? `Style direction: ${b.style}.` : "",
    variant,
    "Clean, accurate, professional. No watermarks, no gibberish text, no logos.",
  ]
    .filter(Boolean)
    .join(" ");
}

export const IMAGE_VARIANTS = [
  "Render as a crisp blueprint-style orthographic drawing on dark navy paper with cyan line work, dimension lines and annotations.",
  "Render as a photorealistic 3/4 view visualisation of the finished object with soft studio lighting on a neutral background.",
  "Render as a clean white-model isometric view with subtle shadows, showing overall proportions and construction.",
];

export function videoPrompt(b: Brief) {
  return [
    `Smooth cinematic orbit around a ${b.category} design concept: ${b.title}.`,
    b.brief,
    b.dimensions
      ? `Approximate dimensions ${b.dimensions} ${b.units ?? ""}.`
      : "",
    "Starts as a glowing blueprint wireframe then resolves into a realistic material finish. Studio lighting, slow camera move, no text overlays.",
  ]
    .filter(Boolean)
    .join(" ");
}

/** Returns raw image bytes as a base64 data URL. */
export async function generateImage(
  prompt: string,
  referenceUrls: string[] = [],
): Promise<string> {
  const content = [
    { type: "text", text: prompt },
    ...referenceUrls.map((url) => ({ type: "image_url", image_url: { url } })),
  ];
  const res = await fetch(`${GATEWAY}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-pro-image",
      messages: [
        { role: "user", content: referenceUrls.length ? content : prompt },
      ],
      modalities: ["image", "text"],
    }),
  });
  if (!res.ok) throw new Error(await friendlyError(res));
  const json = (await res.json()) as {
    choices?: { message?: { images?: { image_url?: { url?: string } }[] } }[];
  };
  const url = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!url)
    throw new Error(
      "The image generator returned no image. Try rephrasing the brief.",
    );
  return url;
}

export async function createVideoJob(prompt: string): Promise<string> {
  const res = await fetch(`${GATEWAY}/videos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/veo-3.1-lite",
      prompt,
      seconds: "6",
      size: "1280x720",
    }),
  });
  if (!res.ok) throw new Error(await friendlyError(res));
  const job = (await res.json()) as { id: string };
  return job.id;
}

export async function readVideoJob(id: string) {
  const res = await fetch(`${GATEWAY}/videos/${id}`, {
    headers: { Authorization: `Bearer ${key()}` },
  });
  if (!res.ok) throw new Error(await friendlyError(res));
  return (await res.json()) as {
    id: string;
    status: string;
    progress?: number;
    error?: { code?: string; message?: string };
  };
}

export async function downloadVideo(id: string): Promise<ArrayBuffer> {
  const res = await fetch(`${GATEWAY}/videos/${id}/content`, {
    headers: { Authorization: `Bearer ${key()}` },
  });
  if (!res.ok) throw new Error(await friendlyError(res));
  return await res.arrayBuffer();
}

async function friendlyError(res: Response) {
  const text = await res.text().catch(() => "");
  if (res.status === 429)
    return "The AI preview service is busy right now. Try again in a minute.";
  if (res.status === 402)
    return "AI preview credits have run out. Top up to keep generating.";
  return `Preview generation failed (${res.status}). ${text.slice(0, 300)}`;
}

export function dataUrlToBytes(dataUrl: string) {
  const [meta, b64] = dataUrl.split(",");
  const contentType = /data:([^;]+)/.exec(meta ?? "")?.[1] ?? "image/png";
  const binary = atob(b64 ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { bytes, contentType };
}
