import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  registerWithEmailPassword,
  loginWithEmailPassword,
  verifySessionToken,
} from "./auth.service";
import { getUserProfileByAddress } from "./user.service";
import { requireMongoAuth } from "./mongo-auth.middleware";

export const signUpWithEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().optional(),
        ip: z.string().optional(),
        userAgent: z.string().optional(),
        locationData: z
          .object({
            city: z.string().optional(),
            region: z.string().optional(),
            country: z.string().optional(),
          })
          .optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    return registerWithEmailPassword(data);
  });

export const signInWithEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        email: z.string().email(),
        password: z.string().min(1),
        ip: z.string().optional(),
        userAgent: z.string().optional(),
        locationData: z
          .object({
            city: z.string().optional(),
            region: z.string().optional(),
            country: z.string().optional(),
          })
          .optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    return loginWithEmailPassword(data);
  });

export const verifyCurrentSession = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ token: z.string().min(1) }).parse(input),
  )
  .handler(async ({ data }) => {
    const verified = verifySessionToken(data.token);
    if (!verified) return { valid: false, user: null };

    let profile = null;
    if (verified.address) {
      profile = await getUserProfileByAddress(verified.address);
    }

    return {
      valid: true,
      user: {
        id: verified.userId,
        email: verified.email,
        name: verified.name,
        address: verified.address,
        provider: verified.provider,
        profile,
      },
    };
  });

export const getCurrentAuthProfile = createServerFn({ method: "GET" })
  .middleware([requireMongoAuth])
  .handler(async ({ context }) => {
    let profile = null;
    if (context.address) {
      profile = await getUserProfileByAddress(context.address);
    }
    return {
      userId: context.userId,
      email: context.email,
      address: context.address,
      name: context.name,
      provider: context.provider,
      profile,
    };
  });
