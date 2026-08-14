import { createMiddleware } from "@tanstack/react-start";

// Registered as global functionMiddleware in src/start.ts to attach MongoDB auth token & headers to server functions
export const attachMongoAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const headers: Record<string, string> = {};

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("df_auth_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const walletUser = localStorage.getItem("df_wallet_user");
      if (walletUser) {
        try {
          const parsed = JSON.parse(walletUser);
          if (parsed.address) {
            headers["x-user-address"] = parsed.address.toLowerCase();
          }
        } catch {
          /* ignore parse error */
        }
      }
    }

    return next({
      headers,
    });
  },
);
