import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    // Check if user has an active MongoDB session token or wallet authentication
    if (typeof window !== "undefined") {
      const authToken = localStorage.getItem("df_auth_token");
      const authUser = localStorage.getItem("df_auth_user");
      const walletUser = localStorage.getItem("df_wallet_user");

      if (authToken && authUser) {
        try {
          const parsed = JSON.parse(authUser);
          return {
            user: {
              id: parsed.id || parsed.email,
              email: parsed.email,
              user_metadata: { full_name: parsed.name || parsed.email.split("@")[0] },
            },
          };
        } catch {
          /* parse error fallback */
        }
      }

      if (walletUser) {
        try {
          const parsed = JSON.parse(walletUser);
          return {
            user: {
              id: parsed.address || "wallet-user",
              email: parsed.email || `${parsed.address}@wallet.draftforge.app`,
              user_metadata: { full_name: parsed.full_name || "Wallet User" },
            },
          };
        } catch {
          /* invalid JSON */
        }
      }
    }

    throw redirect({ to: "/auth", search: { redirect: location.href } });
  },
  component: () => <Outlet />,
});

