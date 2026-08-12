import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/cad.server-BmI4TIKN.js
var GATEWAY = "https://ai.gateway.lovable.dev/v1";
function key() {
  const k = processModule.env["LOVABLE_API_KEY"];
  if (!k) throw new Error("AI is not configured yet.");
  return k;
}
function imagePrompt(b, variant) {
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
var IMAGE_VARIANTS = [
  "Render as a crisp blueprint-style orthographic drawing on dark navy paper with cyan line work, dimension lines and annotations.",
  "Render as a photorealistic 3/4 view visualisation of the finished object with soft studio lighting on a neutral background.",
  "Render as a clean white-model isometric view with subtle shadows, showing overall proportions and construction.",
];
function videoPrompt(b) {
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
async function generateImage(prompt, referenceUrls = []) {
  const content = [
    {
      type: "text",
      text: prompt,
    },
    ...referenceUrls.map((url) => ({
      type: "image_url",
      image_url: { url },
    })),
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
        {
          role: "user",
          content: referenceUrls.length ? content : prompt,
        },
      ],
      modalities: ["image", "text"],
    }),
  });
  if (!res.ok) throw new Error(await friendlyError(res));
  const url = (await res.json()).choices?.[0]?.message?.images?.[0]?.image_url
    ?.url;
  if (!url)
    throw new Error(
      "The image generator returned no image. Try rephrasing the brief.",
    );
  return url;
}
async function createVideoJob(prompt) {
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
  return (await res.json()).id;
}
async function readVideoJob(id) {
  const res = await fetch(`${GATEWAY}/videos/${id}`, {
    headers: { Authorization: `Bearer ${key()}` },
  });
  if (!res.ok) throw new Error(await friendlyError(res));
  return await res.json();
}
async function downloadVideo(id) {
  const res = await fetch(`${GATEWAY}/videos/${id}/content`, {
    headers: { Authorization: `Bearer ${key()}` },
  });
  if (!res.ok) throw new Error(await friendlyError(res));
  return await res.arrayBuffer();
}
async function friendlyError(res) {
  const text = await res.text().catch(() => "");
  if (res.status === 429)
    return "The AI preview service is busy right now. Try again in a minute.";
  if (res.status === 402)
    return "AI preview credits have run out. Top up to keep generating.";
  return `Preview generation failed (${res.status}). ${text.slice(0, 300)}`;
}
function dataUrlToBytes(dataUrl) {
  const [meta, b64] = dataUrl.split(",");
  const contentType = /data:([^;]+)/.exec(meta ?? "")?.[1] ?? "image/png";
  const binary = atob(b64 ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return {
    bytes,
    contentType,
  };
}
//#endregion
export {
  IMAGE_VARIANTS,
  createVideoJob,
  dataUrlToBytes,
  downloadVideo,
  generateImage,
  imagePrompt,
  readVideoJob,
  videoPrompt,
};
