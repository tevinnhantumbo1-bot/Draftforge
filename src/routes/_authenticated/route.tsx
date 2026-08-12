import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (data?.user) {
      return { user: data.user };
    }

    // Fallback: check if local wallet authentication token or session is active
    if (typeof window !== "undefined") {
      const walletUser = localStorage.getItem("df_wallet_user");
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
