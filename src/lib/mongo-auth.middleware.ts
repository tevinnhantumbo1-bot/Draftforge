import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { verifySessionToken } from "./auth.service";

export interface MongoAuthContext {
  userId: string;
  email?: string;
  address?: string;
  name?: string;
  provider: string;
  claims?: Record<string, unknown> | null;
}

export const requireMongoAuth = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  const request = getRequest();
  const authHeader = request?.headers?.get("authorization");

  let authUser: {
    userId: string;
    email?: string;
    address?: string;
    name?: string;
    provider: string;
  } | null = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "").trim();
    if (token) {
      authUser = verifySessionToken(token);
    }
  }

  // Also check custom headers for web3 wallet address or guest identifiers
  if (!authUser && request?.headers?.get("x-user-address")) {
    const address = request.headers.get("x-user-address")!.toLowerCase();
    authUser = {
      userId: address,
      address,
      email: `${address}@wallet.draftforge.app`,
      provider: "wallet",
    };
  }

  if (authUser) {
    return next({
      context: {
        userId: authUser.userId || authUser.address || authUser.email || "authenticated_user",
        email: authUser.email,
        address: authUser.address,
        name: authUser.name,
        provider: authUser.provider,
        claims: {
          sub: authUser.userId,
          email: authUser.email,
          address: authUser.address,
        },
      },
    });
  }

  // Default guest session for open CAD generation & preview tests
  return next({
    context: {
      userId: "guest_user",
      email: "guest@draftforge.app",
      address: undefined,
      name: "Guest User",
      provider: "guest",
      claims: null,
    },
  });
});

export const requireStrictMongoAuth = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  const request = getRequest();
  const authHeader = request?.headers?.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authentication required. Please sign in to perform this action.");
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const authUser = verifySessionToken(token);

  if (!authUser) {
    throw new Error("Session expired or invalid. Please sign in again.");
  }

  return next({
    context: {
      userId: authUser.userId,
      email: authUser.email,
      address: authUser.address,
      name: authUser.name,
      provider: authUser.provider,
      claims: {
        sub: authUser.userId,
        email: authUser.email,
      },
    },
  });
});
