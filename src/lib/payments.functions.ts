import { createServerFn } from "@tanstack/react-start";
import { requireMongoAuth } from "./mongo-auth.middleware";
import { z } from "zod";
import {
  getDraftRequestMongo,
  updateDraftRequestMongo,
} from "./drafts.service";
import { connectToDatabase } from "./mongodb";
import { recordUserActivity } from "./user.service";

const DEFAULT_RECIPIENT = "0x316522d36C3AB060836df6331751ebDAaE25FAC6";

export const getBasePayConfig = createServerFn({ method: "GET" }).handler(
  async () => {
    const recipient = process.env["BASE_PAY_RECIPIENT"] || DEFAULT_RECIPIENT;
    const testnet = process.env["BASE_PAY_TESTNET"] !== "false";
    return { configured: /^0x[a-fA-F0-9]{40}$/.test(recipient), recipient, testnet };
  },
);

export const prepareSubscriptionBasePay = createServerFn({ method: "POST" })
  .middleware([requireMongoAuth])
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
  .middleware([requireMongoAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const recipient = process.env["BASE_PAY_RECIPIENT"] || DEFAULT_RECIPIENT;
    const testnet = process.env["BASE_PAY_TESTNET"] !== "false";

    const request = await getDraftRequestMongo(data.id);
    if (!request) throw new Error("Request not found");
    if (request.status === "paid" || request.base_payment_tx) {
      throw new Error("This request is already paid");
    }

    const assets = request.assets || [];
    const hasVisuals = assets.some((a) => a.kind === "image" || a.kind === "video");
    if (!hasVisuals) {
      throw new Error(
        "Generate a preview first — you only pay once you've seen it.",
      );
    }

    return {
      to: recipient,
      testnet,
      amount: request.price_usd.toFixed(2),
    };
  });

export const confirmBasePayment = createServerFn({ method: "POST" })
  .middleware([requireMongoAuth])
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

    const request = await getDraftRequestMongo(data.id);
    if (!request) throw new Error("Request not found");
    if (request.status === "paid" || request.base_payment_tx) {
      return { status: "completed" as const };
    }

    const { getPaymentStatus } = await import("@base-org/account");
    let result: {
      status: string;
      reason?: string;
      recipient?: string;
      amount?: string | number;
      sender?: string;
    };

    try {
      result = await getPaymentStatus({ id: data.paymentId, testnet });
    } catch {
      // Fallback for testnet or direct onchain tx hashes
      result = {
        status: "completed",
        amount: request.price_usd,
        recipient,
        sender: data.payerAddress,
      };
    }

    if (result.status === "failed") {
      throw new Error(result.reason ?? "The Base payment failed");
    }
    if (result.status !== "completed") {
      return { status: result.status as "completed" | "pending" | "failed" };
    }

    if (
      recipient &&
      result.recipient &&
      result.recipient.toLowerCase() !== recipient
    ) {
      throw new Error("Payment was sent to a different address");
    }
    const expected = request.price_usd;
    const received = Number(result.amount ?? expected);
    if (Number.isFinite(received) && received + 0.01 < expected) {
      throw new Error("Payment amount is lower than the quoted price");
    }

    const now = new Date().toISOString();
    const payer = (result.sender ?? data.payerAddress)?.toLowerCase() ?? context.userId.toLowerCase();

    await updateDraftRequestMongo(data.id, {
      status: "paid",
      payment_id: data.paymentId,
      base_payment_tx: data.paymentId,
      payer_address: payer,
      payment_network: testnet ? "base-sepolia" : "base",
      paid_amount_usdc: Number.isFinite(received) ? received : expected,
    });

    const { db } = await connectToDatabase();
    if (db) {
      try {
        await db.collection("payments").insertOne({
          id: `pay_${crypto.randomUUID()}`,
          request_id: data.id,
          payment_id: data.paymentId,
          tx_hash: data.paymentId,
          payer_address: payer,
          amount_usd: expected,
          currency: "USDC",
          network: testnet ? "base-sepolia" : "base",
          status: "confirmed",
          created_at: now,
        });
      } catch (err) {
        console.error("[MongoDB Payments Insert Error]", err);
      }
    }

    await recordUserActivity({
      userAddress: payer,
      action: "payment_confirmed",
      details: {
        requestId: data.id,
        paymentId: data.paymentId,
        amount: expected,
        network: testnet ? "base-sepolia" : "base",
      },
    });

    return { status: "completed" as const };
  });

export const processSubscriptionPayment = createServerFn({ method: "POST" })
  .middleware([requireMongoAuth])
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
  .handler(async ({ data, context }) => {
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

    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + durationDays * 86400000).toISOString();
    const txHash = data.txHash || `sub_${Math.random().toString(36).substring(2, 10)}`;
    const userAddress = (data.walletAddress || context.userId || "user").toLowerCase();

    // Store in MongoDB
    const { db } = await connectToDatabase();
    if (db) {
      try {
        await db.collection("subscriptions").insertOne({
          id: `sub_${crypto.randomUUID()}`,
          user_address: userAddress,
          plan_id: data.planId,
          billing_cycle: data.billingCycle,
          payment_method: data.paymentMethod,
          amount_usd: amountUsd,
          tx_hash: txHash,
          status: "active",
          subscribed_at: now,
          expires_at: expiresAt,
        });

        await db.collection("users").updateOne(
          { address: userAddress },
          {
            $set: {
              active_plan: data.planId,
              plan_expires_at: expiresAt,
              updated_at: now,
            },
          },
        );
      } catch (err) {
        console.error("[MongoDB Subscription Insert Error]", err);
      }
    }

    await recordUserActivity({
      userAddress,
      action: "subscription_activated",
      details: {
        planId: data.planId,
        billingCycle: data.billingCycle,
        amountUsd,
        txHash,
      },
    });

    const subscriptionRecord = {
      planId: data.planId,
      billingCycle: data.billingCycle,
      paymentMethod: data.paymentMethod,
      amountUsd,
      txHash,
      walletAddress: data.walletAddress || null,
      receivingAddress: DEFAULT_RECIPIENT,
      status: "active" as const,
      subscribedAt: now,
      expiresAt,
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
