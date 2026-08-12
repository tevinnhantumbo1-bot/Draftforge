export type PackageId = "concept" | "standard" | "pro";

export type SubscriptionTier = "free" | "weekly_boost" | "pro" | "studio";

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  badge?: string;
  priceWeekly?: number;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  cadQuotaPerDay: number | string;
  popular?: boolean;
  features: string[];
  ctaText: string;
  cryptoPriceUsdc: number;
  interval?: "week" | "month" | "year";
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free Test Tier",
    badge: "Default",
    priceMonthly: 0,
    priceAnnual: 0,
    description:
      "Great for testing AI CAD prompts and viewing 2D/3D concept renders.",
    cadQuotaPerDay: 2,
    features: [
      "2 AI CAD prompt requests per day",
      "Orthographic blueprint drawings",
      "Photorealistic 3D concept previews",
      "3D Isometric model renders",
      "Standard queue priority",
    ],
    ctaText: "Current Plan",
    cryptoPriceUsdc: 0,
    interval: "month",
  },
  {
    id: "weekly_boost",
    name: "Weekly Pass ($5/wk)",
    badge: "5 USDC / Week",
    popular: true,
    priceWeekly: 5,
    priceMonthly: 20,
    priceAnnual: 20,
    description:
      "Get 3 extra daily requests (total 5 requests/day) for 1 full week via Base Wallet & USDC.",
    cadQuotaPerDay: 5,
    features: [
      "5 AI CAD prompt requests per day (2 free + 3 extra)",
      "7 days full access on Base Sepolia testnet",
      "Fast Base Wallet & BasePay 1-click checkout",
      "Orthographic blueprints & 3D renders",
      "3D Orbiting Motion Videos",
      "Priority AI queue processing",
    ],
    ctaText: "Subscribe for $5 / Week",
    cryptoPriceUsdc: 5,
    interval: "week",
  },
  {
    id: "pro",
    name: "Pro CAD Creator",
    badge: "50 Prompts/Day",
    priceMonthly: 29,
    priceAnnual: 24,
    description:
      "For architects, engineers & designers who draft regular CAD concepts.",
    cadQuotaPerDay: 50,
    features: [
      "50 AI CAD prompt requests per day",
      "High-Res 4K Blueprint & 3D Renders",
      "3D Orbiting Motion Video Generation",
      "3 Free Production DWG/PDF file downloads/mo",
      "Priority AI queue processing",
      "Custom dimension & material constraints",
    ],
    ctaText: "Subscribe to Pro",
    cryptoPriceUsdc: 29,
    interval: "month",
  },
  {
    id: "studio",
    name: "Studio & Enterprise",
    badge: "Unlimited",
    priceMonthly: 89,
    priceAnnual: 75,
    description:
      "For teams, engineering shops & agencies needing full CAD output.",
    cadQuotaPerDay: "Unlimited",
    features: [
      "Unlimited AI CAD prompt requests",
      "Unlimited Production DWG, STEP & PDF exports",
      "3D Solid Model files (.step / .stl)",
      "Custom layer naming & title block templates",
      "Dedicated account manager & 1-hr SLA",
      "Multi-user workspace & API access",
    ],
    ctaText: "Upgrade to Studio",
    cryptoPriceUsdc: 89,
    interval: "month",
  },
];

export const PACKAGES: {
  id: PackageId;
  name: string;
  price: number;
  turnaround: string;
  blurb: string;
  features: string[];
}[] = [
  {
    id: "concept",
    name: "Concept",
    price: 79,
    turnaround: "48 hours",
    blurb: "A single 2D drawing, drafted from your brief.",
    features: [
      "AI concept images + motion preview",
      "1 x 2D AutoCAD drawing (.dwg + .pdf)",
      "1 revision round",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: 199,
    turnaround: "3 working days",
    blurb: "Full drawing set with dimensions and annotations.",
    features: [
      "AI concept images + motion preview",
      "Up to 4 drawing sheets (.dwg + .pdf)",
      "Dimensioned & annotated to scale",
      "3 revision rounds",
    ],
  },
  {
    id: "pro",
    name: "Production",
    price: 449,
    turnaround: "5 working days",
    blurb: "Fabrication-ready documentation and 3D model.",
    features: [
      "AI concept images + motion preview",
      "Unlimited sheets (.dwg + .pdf + .step)",
      "3D model & isometric views",
      "Tolerances, BOM and title blocks",
      "Unlimited revisions for 30 days",
    ],
  },
];

export const COMPLEXITY_MULTIPLIER: Record<string, number> = {
  architectural: 1,
  mechanical: 1.2,
  electrical: 1.1,
  interior: 1,
  landscape: 0.9,
  other: 1,
};

export function quoteCents(pkg: string, category: string, briefLength: number) {
  const base = PACKAGES.find((p) => p.id === pkg)?.price ?? 199;
  const mult = COMPLEXITY_MULTIPLIER[category] ?? 1;
  const detailUplift = briefLength > 600 ? 1.15 : 1;
  return Math.round(base * mult * detailUplift) * 100;
}

export function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(cents / 100);
}

export const CATEGORIES = [
  { id: "architectural", label: "Architectural / floor plan" },
  { id: "mechanical", label: "Mechanical part" },
  { id: "electrical", label: "Electrical / schematic" },
  { id: "interior", label: "Interior fit-out" },
  { id: "landscape", label: "Landscape / site plan" },
  { id: "other", label: "Something else" },
];
