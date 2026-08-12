import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const DEFAULT_RECIPIENT = "0x316522d36C3AB060836df6331751ebDAaE25FAC6";

export const getBasePayConfig = createServerFn({ method: "GET" }).handler(
  async () => {
    const recipient = process.env["BASE_PAY_RECIPIENT"] || DEFAULT_RECIPIENT;
    const testnet = process.env["BASE_PAY_TESTNET"] !== "false";
    return { configured: /^0x[a-fA-F0-9]{40}$/.test(recipient), recipient, testnet };
  },
);

export const prepareSubscriptionBasePay = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ planId: z.enum(["free", "weekly_boost", "pro", "studio"]) }).parse(input),
  )
  .handler(async ({ data }) => {
    const recipient = process.env["BASE_PAY_RECIPIENT"] || DEFAULT_RECIPIENT;
    const testnet = process.env["BASE_PAY_TESTNET"] !== "false";

    const priceMap: Record<string, string> = {
      free: "0.00",
      weekly_boost: "5.00",
      pro: "29.00",
      studio: "89.00",
    };

    return {
      to: recipient,
      testnet,
      amount: priceMap[data.planId] ?? "5.00",
    };
  });

export const preparePayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const recipient = process.env["BASE_PAY_RECIPIENT"] || DEFAULT_RECIPIENT;
    const testnet = process.env["BASE_PAY_TESTNET"] !== "false";

    const { data: request } = await context.supabase
      .from("design_requests")
      .select("id,paid,quote_cents")
      .eq("id", data.id)
      .maybeSingle();
    if (!request) throw new Error("Request not found");
    if (request.paid) throw new Error("This request is already paid");

    const { count } = await context.supabase
      .from("request_assets")
      .select("id", { count: "exact", head: true })
      .eq("request_id", data.id)
      .in("kind", ["image", "video"]);
    if (!count)
      throw new Error(
        "Generate a preview first — you only pay once you've seen it.",
      );

    return {
      to: recipient,
      testnet,
      amount: (request.quote_cents / 100).toFixed(2),
    };
  });

export const confirmBasePayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        paymentId: z.string().min(4).max(200),
        payerAddress: z
          .string()
          .regex(/^0x[a-fA-F0-9]{40}$/)
          .optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const testnet = process.env["BASE_PAY_TESTNET"] !== "false";
    const recipient = (process.env["BASE_PAY_RECIPIENT"] || DEFAULT_RECIPIENT).toLowerCase();

    const { data: request } = await context.supabase
      .from("design_requests")
      .select("id,paid,quote_cents")
      .eq("id", data.id)
      .maybeSingle();
    if (!request) throw new Error("Request not found");
    if (request.paid) return { status: "completed" as const };

    const { getPaymentStatus } = await import("@base-org/account");
    const result = await getPaymentStatus({ id: data.paymentId, testnet });

    if (result.status === "failed") {
      throw new Error(result.reason ?? "The Base payment failed");
    }
    if (result.status !== "completed") {
      return { status: result.status };
    }

    if (
      recipient &&
      result.recipient &&
      result.recipient.toLowerCase() !== recipient
    ) {
      throw new Error("Payment was sent to a different address");
    }
    const expected = request.quote_cents / 100;
    const received = Number(result.amount ?? expected);
    if (Number.isFinite(received) && received + 0.01 < expected) {
      throw new Error("Payment amount is lower than the quoted price");
    }

    const { error } = await context.supabase
      .from("design_requests")
      .update({
        paid: true,
        status: "in_drafting",
        payment_id: data.paymentId,
        payment_tx: data.paymentId,
        payer_address:
          (result.sender ?? data.payerAddress)?.toLowerCase() ?? null,
        payment_network: testnet ? "base-sepolia" : "base",
        paid_amount_usdc: Number.isFinite(received) ? received : expected,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);

    return { status: "completed" as const };
  });

export const processSubscriptionPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        planId: z.enum(["free", "weekly_boost", "pro", "studio"]),
        billingCycle: z.enum(["weekly", "monthly", "annual"]),
        paymentMethod: z.enum([
          "card",
          "crypto_base",
          "crypto_metamask",
          "crypto_solana",
          "base_pay",
        ]),
        cardNumber: z.string().optional(),
        cardExpiry: z.string().optional(),
        cardCvc: z.string().optional(),
        cardName: z.string().optional(),
        txHash: z.string().optional(),
        walletAddress: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    // Determine plan details
    const priceMap: Record<string, Record<string, number>> = {
      free: { weekly: 0, monthly: 0, annual: 0 },
      weekly_boost: { weekly: 5, monthly: 20, annual: 20 },
      pro: { weekly: 10, monthly: 29, annual: 288 },
      studio: { weekly: 30, monthly: 89, annual: 900 },
    };

    const amountUsd = priceMap[data.planId]?.[data.billingCycle] ?? 5;

    // Standard validation
    if (data.paymentMethod === "card" && data.planId !== "free") {
      if (!data.cardNumber || data.cardNumber.replace(/\s/g, "").length < 15) {
        throw new Error("Invalid card number. Please check your card details.");
      }
    }

    let durationDays = 30;
    if (data.planId === "weekly_boost" || data.billingCycle === "weekly") {
      durationDays = 7;
    } else if (data.billingCycle === "annual") {
      durationDays = 365;
    }

    // Return receipt
    const subscriptionRecord = {
      planId: data.planId,
      billingCycle: data.billingCycle,
      paymentMethod: data.paymentMethod,
      amountUsd,
      txHash: data.txHash || `sub_${Math.random().toString(36).substring(2, 10)}`,
      walletAddress: data.walletAddress || null,
      receivingAddress: DEFAULT_RECIPIENT,
      status: "active" as const,
      subscribedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + durationDays * 86400000).toISOString(),
      dailyQuota:
        data.planId === "weekly_boost"
          ? 5
          : data.planId === "pro"
            ? 50
            : data.planId === "studio"
              ? "Unlimited"
              : 2,
    };

    return subscriptionRecord;
  });

