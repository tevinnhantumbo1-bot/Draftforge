import { Link } from "@tanstack/react-router";
import { Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalletAuthButtons } from "@/components/wallet-auth";

export function SiteHeader({ signedIn }: { signedIn?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-sm bg-[image:var(--gradient-amber)] text-primary-foreground">
            <Ruler className="size-4" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            DraftForge
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          {signedIn ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/workspace">Workspace</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/subscription">Subscription</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard">Requests</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/subscription">Subscriptions</Link>
              </Button>
              <div className="hidden sm:block">
                <WalletAuthButtons />
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">Sign in</Link>
              </Button>
            </>
          )}
          <Button
            asChild
            variant="hero"
            size="sm"
            className="hidden md:inline-flex"
          >
            <Link to="/new">Start a request</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
