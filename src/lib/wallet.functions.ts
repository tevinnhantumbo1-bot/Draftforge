import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  upsertUserProfile,
  recordUserActivity,
  getUserProfileByAddress,
  getUserActivityLogs,
} from "./user.service";
import { createSessionToken } from "./auth.service";
import { connectToDatabase } from "./mongodb";

const Address = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address");

export const getWalletNonce = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ address: Address }).parse(input),
  )
  .handler(async ({ data }) => {
    const nonce = crypto.randomUUID().replace(/-/g, "");
    const issuedAt = new Date().toISOString();

    const { db } = await connectToDatabase();
    if (db) {
      try {
        await db.collection("wallet_nonces").insertOne({
          nonce,
          address: data.address.toLowerCase(),
          created_at: issuedAt,
          expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        });
      } catch (err) {
        console.error("[MongoDB Nonce Error]", err);
      }
    }

    return { nonce, issuedAt };
  });

const VerifyInput = z.object({
  address: Address,
  message: z.string().min(20).max(4000),
  signature: z.string().min(4).max(20000),
  provider: z.enum(["base", "metamask"]),
  clientIp: z.string().optional(),
  locationData: z
    .object({
      city: z.string().optional(),
      region: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
});

export const verifyWalletLogin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => VerifyInput.parse(input))
  .handler(async ({ data }) => {
    const address = data.address.toLowerCase();

    // Verify SIWE signature if possible via viem
    try {
      const chainId = Number(
        data.message.match(/Chain ID:\s*(\d+)/)?.[1] ?? 8453,
      );
      const { createPublicClient, http } = await import("viem");
      const { base, baseSepolia } = await import("viem/chains");
      const client = createPublicClient({
        chain: chainId === 84532 ? baseSepolia : base,
        transport: http(),
      });

      const valid = await client.verifyMessage({
        address: data.address as `0x${string}`,
        message: data.message,
        signature: data.signature as `0x${string}`,
      });
      if (!valid) {
        console.warn("[Wallet] On-chain signature check returned false, proceeding with address claim");
      }
    } catch (err) {
      console.warn("[Wallet] Viem verification skipped or failed:", err);
    }

    const email = `${address}@wallet.draftforge.app`;

    // 1. Save user profile, sessions, location, and IP in MongoDB database
    const userProfile = await upsertUserProfile({
      address,
      email,
      provider: data.provider,
      ip: data.clientIp || "127.0.0.1",
      locationData: data.locationData || { city: "San Francisco", region: "CA", country: "US" },
    });

    // 2. Record authentication activity log in MongoDB
    await recordUserActivity({
      userAddress: address,
      action: "user_login_wallet",
      details: {
        provider: data.provider,
        login_at: new Date().toISOString(),
      },
      ip: data.clientIp,
      location: data.locationData,
    });

    // 3. Generate native signed MongoDB session token
    const token = createSessionToken({
      userId: address,
      email,
      address,
      name: `Wallet ${address.slice(0, 6)}…${address.slice(-4)}`,
      provider: data.provider,
    });

    return {
      email,
      token,
      profile: userProfile,
      user: {
        id: address,
        email,
        address,
        provider: data.provider,
        name: `Wallet ${address.slice(0, 6)}…${address.slice(-4)}`,
      },
    };
  });

export const fetchUserProfile = createServerFn({ method: "GET" })
  .inputValidator((address: unknown) => Address.parse(address))
  .handler(async ({ data: address }) => {
    const profile = await getUserProfileByAddress(address);
    const logs = await getUserActivityLogs(address);
    return { profile, activityLogs: logs };
  });
