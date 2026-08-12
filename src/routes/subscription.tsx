import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Check,
  CreditCard,
  Wallet,
  Zap,
  Sparkles,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Copy,
  CheckCircle2,
  Lock,
  Box,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  SUBSCRIPTION_PLANS,
  type SubscriptionPlan,
  type SubscriptionTier,
} from "@/lib/pricing";
import {
  processSubscriptionPayment,
  prepareSubscriptionBasePay,
} from "@/lib/payments.functions";
import { executeBaseSepoliaPayment } from "@/lib/base-sepolia-pay";

export const Route = createFileRoute("/subscription")({
  head: () => ({
    meta: [
      { title: "Subscription Plans & Pricing — DraftForge AI" },
      {
        name: "description",
        content:
          "Choose a subscription plan for DraftForge AI CAD Generator. Pay $5/week in USDC on Base Sepolia or Card for 5 daily requests.",
      },
      {
        property: "og:title",
        content: "DraftForge AI Subscriptions — Pay with Crypto or Card",
      },
      {
        property: "og:description",
        content:
          "Subscribe for $5 USDC/week on Base Sepolia for 5 daily CAD prompt requests, DWG & 3D STEP exports.",
      },
    ],
  }),
  component: SubscriptionPage,
});

function SubscriptionPage() {
  const navigate = useNavigate();
  const processPayment = useServerFn(processSubscriptionPayment);
  const prepSubBasePay = useServerFn(prepareSubscriptionBasePay);

  const MERCHANT_RECEIVING_ADDRESS = "0x316522d36C3AB060836df6331751ebDAaE25FAC6";

  // Billing cycle state
  const [billingCycle, setBillingCycle] = useState<"weekly" | "monthly" | "annual">(
    "weekly",
  );

  // Active user subscription stored in localStorage
  const [activeSub, setActiveSub] = useState<{
    planId: SubscriptionTier;
    billingCycle: string;
    paymentMethod: string;
    expiresAt: string;
    txHash?: string;
  } | null>(null);

  // Connected wallet address if available
  const [walletAddress, setWalletAddress] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSub = localStorage.getItem("df_user_subscription");
      if (storedSub) {
        try {
          setActiveSub(JSON.parse(storedSub));
        } catch {
          /* ignore */
        }
      }

      const storedWallet = localStorage.getItem("df_wallet_user");
      if (storedWallet) {
        try {
          const w = JSON.parse(storedWallet);
          if (w.address) setWalletAddress(w.address);
        } catch {
          /* ignore */
        }
      }
    }
  }, []);

  // Checkout modal state
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null,
  );
  const [paymentType, setPaymentType] = useState<"crypto" | "card">("crypto");
  const [cryptoNetwork, setCryptoNetwork] = useState<
    "base_sepolia_usdc" | "base_eth" | "solana_usdc"
  >("base_sepolia_usdc");

  // Card Form State
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  function handleOpenCheckout(plan: SubscriptionPlan) {
    if (plan.id === "free") {
      toast.info("You are currently on the Free Test plan (2 daily prompts).");
      return;
    }
    setSelectedPlan(plan);
  }

  async function handleBasePayCheckout() {
    if (!selectedPlan) return;
    setIsProcessing(true);
    toast.info("Triggering Base Sepolia payment (Chain ID: 84532)...");

    try {
      // 1. Prepare BasePay quote details
      const quote = await prepSubBasePay({ data: { planId: selectedPlan.id } });

      // 2. Execute Base Sepolia payment (Chain ID 84532)
      const payRes = await executeBaseSepoliaPayment({
        amountUsdc: quote.amount,
        recipientAddress: quote.to,
      });

      const paymentTxId = payRes.txHash;

      // 3. Process subscription record
      const cycle = selectedPlan.interval === "week" ? "weekly" : billingCycle;
      const result = await processPayment({
        data: {
          planId: selectedPlan.id,
          billingCycle: cycle,
          paymentMethod: "base_pay",
          txHash: paymentTxId,
          walletAddress: walletAddress || MERCHANT_RECEIVING_ADDRESS,
        },
      });

      const subInfo = {
        planId: selectedPlan.id,
        billingCycle: cycle,
        paymentMethod: "base_pay",
        expiresAt: result.expiresAt,
        txHash: paymentTxId,
        subscribedAt: new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("df_user_subscription", JSON.stringify(subInfo));
      }

      setActiveSub(subInfo);
      toast.success(
        `Subscription activated! Paid $${quote.amount} USDC on Base Sepolia. You now have 5 daily CAD requests for 1 week.`,
      );
      setSelectedPlan(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Base Sepolia payment failed. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleConfirmSubscription(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPlan) return;

    if (paymentType === "crypto" && cryptoNetwork === "base_sepolia_usdc") {
      return handleBasePayCheckout();
    }

    setIsProcessing(true);
    try {
      const pMethod =
        paymentType === "card"
          ? "card"
          : cryptoNetwork === "solana_usdc"
            ? "crypto_solana"
            : "crypto_base";

      const cycle = selectedPlan.interval === "week" ? "weekly" : billingCycle;

      const result = await processPayment({
        data: {
          planId: selectedPlan.id,
          billingCycle: cycle,
          paymentMethod: pMethod,
          cardNumber: cardNumber || undefined,
          cardExpiry: cardExpiry || undefined,
          cardCvc: cardCvc || undefined,
          cardName: cardName || undefined,
          walletAddress: walletAddress || undefined,
        },
      });

      // Save to local storage
      const subInfo = {
        planId: selectedPlan.id,
        billingCycle: cycle,
        paymentMethod: pMethod,
        expiresAt: result.expiresAt,
        txHash: result.txHash,
        subscribedAt: new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("df_user_subscription", JSON.stringify(subInfo));
      }

      setActiveSub(subInfo);
      toast.success(
        `Successfully subscribed to ${selectedPlan.name}!`,
      );
      setSelectedPlan(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Payment failed. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  }

  function handleCopyMerchantAddress() {
    navigator.clipboard.writeText(MERCHANT_RECEIVING_ADDRESS);
    setCopiedAddress(true);
    toast.success("Payments receiving address copied!");
    setTimeout(() => setCopiedAddress(false), 2000);
  }

  return (
    <div className="min-h-screen pb-20">
      <SiteHeader signedIn={!!walletAddress || !!activeSub} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* TOP HERO HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blueprint/30 bg-blueprint/10 px-3 py-1 text-xs font-mono text-blueprint">
            <Sparkles className="size-3.5" />
            <span>DraftForge Subscriptions & Base Sepolia BasePay</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Flexible CAD Plans & Weekly Pass
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Need more than 2 free daily prompts? Subscribe for{" "}
            <span className="text-blueprint font-semibold">5 USDC / week</span> on{" "}
            <span className="text-foreground font-semibold">Base Sepolia</span> via{" "}
            <span className="text-blueprint font-semibold">Base Wallet / BasePay</span> or Credit Card for 3 extra daily requests (total 5 requests/day)!
          </p>

          {/* Receiving Address Display */}
          <div className="pt-2 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-lg border border-blueprint/30 bg-surface-2/90 px-3 py-1.5 font-mono text-xs">
              <span className="text-muted-foreground">Receiving Wallet (Base Sepolia):</span>
              <span className="font-bold text-foreground">{MERCHANT_RECEIVING_ADDRESS.slice(0, 8)}…{MERCHANT_RECEIVING_ADDRESS.slice(-6)}</span>
              <button
                type="button"
                onClick={handleCopyMerchantAddress}
                className="text-blueprint hover:underline ml-1 flex items-center gap-1"
              >
                <Copy className="size-3" />
                {copiedAddress ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setBillingCycle("weekly")}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                billingCycle === "weekly"
                  ? "bg-blueprint text-blueprint-foreground font-bold shadow"
                  : "bg-surface-2 text-muted-foreground"
              }`}
            >
              Weekly ($5/wk Pass)
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-blueprint text-blueprint-foreground font-bold shadow"
                  : "bg-surface-2 text-muted-foreground"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-blueprint text-blueprint-foreground font-bold shadow"
                  : "bg-surface-2 text-muted-foreground"
              }`}
            >
              <span>Annual Billing</span>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-mono text-emerald-400">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* ACTIVE SUBSCRIPTION BADGE IF SUBSCRIBED */}
        {activeSub && activeSub.planId !== "free" && (
          <div className="mt-8 mx-auto max-w-2xl panel grid-paper p-4 border border-emerald-500/40 bg-emerald-500/5 text-center sm:text-left sm:flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <p className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                  Active Subscription
                </p>
                <h4 className="font-bold text-base capitalize">
                  {activeSub.planId === "weekly_boost"
                    ? "Weekly Pass (5 USDC/wk — 5 Daily Requests)"
                    : `${activeSub.planId} Plan (${activeSub.billingCycle})`}
                </h4>
                <p className="text-xs text-muted-foreground">
                  Valid through {new Date(activeSub.expiresAt).toLocaleDateString()} · Paid via {activeSub.paymentMethod}
                </p>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="mt-3 sm:mt-0 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20"
            >
              <Link to="/workspace">Go to Workspace (5 Daily Prompts) <ArrowRight className="ml-1 size-3.5" /></Link>
            </Button>
          </div>
        )}

        {/* PRICING CARDS GRID (4 TIERS) */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = (activeSub?.planId || "free") === plan.id;
            const isWeeklyPass = plan.id === "weekly_boost";

            const priceDisplay = isWeeklyPass
              ? "$5"
              : billingCycle === "annual"
                ? `$${plan.priceAnnual}`
                : `$${plan.priceMonthly}`;

            const periodDisplay = isWeeklyPass
              ? "/ week"
              : "/ month";

            return (
              <div
                key={plan.id}
                className={`panel relative p-5 flex flex-col justify-between transition-all duration-200 ${
                  isWeeklyPass
                    ? "border-blueprint/90 ring-2 ring-blueprint bg-surface/90 shadow-2xl"
                    : plan.popular
                      ? "border-blueprint/80 ring-1 ring-blueprint bg-surface/90 shadow-xl"
                      : "border-border/80 hover:border-border"
                }`}
              >
                {plan.badge && (
                  <span
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider ${
                      isWeeklyPass
                        ? "bg-blueprint text-blueprint-foreground shadow-md font-bold"
                        : plan.popular
                          ? "bg-blueprint text-blueprint-foreground shadow-md"
                          : "bg-surface-2 border border-border text-muted-foreground"
                    }`}
                  >
                    {plan.badge}
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-lg">
                      {plan.name}
                    </h3>
                    {isCurrent && (
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground min-h-[36px] leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-display text-3xl font-bold tracking-tight">
                      {priceDisplay}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {periodDisplay}
                    </span>
                  </div>

                  {/* Daily Quota Highlight */}
                  <div className="mt-4 rounded-lg bg-surface-2/90 p-2.5 border border-border/60">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <Zap className="size-4 text-blueprint fill-blueprint shrink-0" />
                      <span>Daily CAD Quota:</span>
                    </div>
                    <p className="mt-1 font-mono text-xs font-bold text-foreground">
                      {isWeeklyPass
                        ? "5 Prompts / Day (2 free + 3 extra)"
                        : typeof plan.cadQuotaPerDay === "number"
                          ? `${plan.cadQuotaPerDay} Prompts / Day`
                          : `${plan.cadQuotaPerDay} Prompts / Day`}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="mt-5 space-y-2 text-xs">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-muted-foreground">
                        <Check className="size-3.5 shrink-0 text-blueprint mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60">
                  <Button
                    variant={isWeeklyPass || plan.popular ? "hero" : "outline"}
                    size="default"
                    className="w-full text-xs font-semibold"
                    disabled={isCurrent}
                    onClick={() => handleOpenCheckout(plan)}
                  >
                    {isCurrent ? "Current Plan" : plan.ctaText}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* PAYMENT METHODS ACCEPTED BANNER */}
        <div className="mt-16 max-w-4xl mx-auto panel p-6 border border-border/80 bg-surface/50 text-center space-y-4">
          <h3 className="font-display font-semibold text-base">
            Instant Base Wallet & Multi-Chain Payment Options
          </h3>
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            Pay for your $5 weekly pass or monthly subscription using Base Wallet (BasePay) on Base Sepolia testnet, USDC, ETH, Phantom Solana, or Credit Cards.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-2 rounded-lg border border-blueprint/40 bg-blueprint/15 px-3 py-1.5 text-blueprint font-semibold">
              <Wallet className="size-4 text-blueprint" />
              <span>Base Wallet & BasePay (Base Sepolia Testnet)</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5">
              <CreditCard className="size-4 text-primary" />
              <span>Credit & Debit Cards</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5">
              <Box className="size-4 text-emerald-400" />
              <span>Solana & MetaMaSK</span>
            </div>
          </div>
        </div>

        {/* FAQ SECTION */}
        <section className="mt-16 max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h3 className="font-display font-bold text-2xl">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-muted-foreground">
              Everything you need to know about the $5 Weekly Pass and subscription tiers
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="panel p-5 space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <HelpCircle className="size-4 text-blueprint" /> How does the 5 USDC/week pass work?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When you subscribe for $5/week, 3 extra daily requests are added on top of your 2 free requests, giving you 5 total CAD prompt requests per day for 7 full days.
              </p>
            </div>

            <div className="panel p-5 space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <HelpCircle className="size-4 text-blueprint" /> Which wallet address receives payments?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All Base Sepolia USDC subscription payments are routed to receiving address <span className="font-mono font-bold text-foreground">0x316522d36C3AB060836df6331751ebDAaE25FAC6</span>.
              </p>
            </div>

            <div className="panel p-5 space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <HelpCircle className="size-4 text-blueprint" /> What formats are generated?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All subscriptions include 2D orthographic blueprints, photorealistic 3D concept renders, and 3D orbiting motion videos.
              </p>
            </div>

            <div className="panel p-5 space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <HelpCircle className="size-4 text-blueprint" /> Can I pay with a Credit Card for the weekly pass?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Yes! Both Credit Cards (Visa, Mastercard, Amex) and Crypto (Base Sepolia USDC via Base Wallet) are accepted for all plans.
              </p>
            </div>
          </div>
        </section>

        {/* CHECKOUT MODAL / DRAWER */}
        {selectedPlan && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={() => setSelectedPlan(null)}
          >
            <div
              className="relative w-full max-w-xl rounded-xl border border-border bg-background p-6 shadow-2xl space-y-6 my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border/70 pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold">
                    Subscribe to {selectedPlan.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Selected plan: ${selectedPlan.id === "weekly_boost" ? "5 USDC / week (7 days access)" : `${selectedPlan.priceMonthly} / month`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="rounded-lg border border-border p-1 text-muted-foreground hover:bg-surface-2"
                >
                  ✕
                </button>
              </div>

              {/* Payment Method Selector Tabs: Crypto (Base Wallet) vs Card */}
              <Tabs
                value={paymentType}
                onValueChange={(v) => setPaymentType(v as "crypto" | "card")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="crypto"
                    className="flex items-center gap-2 text-xs"
                  >
                    <Wallet className="size-3.5 text-blueprint" />
                    <span>Pay with Base Wallet (Crypto)</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="card"
                    className="flex items-center gap-2 text-xs"
                  >
                    <CreditCard className="size-3.5" />
                    <span>Pay with Card</span>
                  </TabsTrigger>
                </TabsList>

                {/* CRYPTO / BASE WALLET TAB */}
                <TabsContent value="crypto" className="pt-4 space-y-4">
                  <div className="space-y-3">
                    <Label className="text-xs font-semibold">Select Network & Payment Wallet</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setCryptoNetwork("base_sepolia_usdc")}
                        className={`rounded-lg border p-2.5 text-center text-xs font-mono transition-all ${
                          cryptoNetwork === "base_sepolia_usdc"
                            ? "border-blueprint bg-blueprint/15 text-blueprint font-bold shadow"
                            : "border-border bg-surface-2 text-muted-foreground"
                        }`}
                      >
                        Base Sepolia USDC
                      </button>
                      <button
                        type="button"
                        onClick={() => setCryptoNetwork("base_eth")}
                        className={`rounded-lg border p-2.5 text-center text-xs font-mono transition-all ${
                          cryptoNetwork === "base_eth"
                            ? "border-blueprint bg-blueprint/15 text-blueprint font-bold"
                            : "border-border bg-surface-2 text-muted-foreground"
                        }`}
                      >
                        Base ETH
                      </button>
                      <button
                        type="button"
                        onClick={() => setCryptoNetwork("solana_usdc")}
                        className={`rounded-lg border p-2.5 text-center text-xs font-mono transition-all ${
                          cryptoNetwork === "solana_usdc"
                            ? "border-emerald-500 bg-emerald-500/15 text-emerald-400 font-bold"
                            : "border-border bg-surface-2 text-muted-foreground"
                        }`}
                      >
                        Solana USDC
                      </button>
                    </div>

                    <div className="panel p-4 bg-surface-2/90 space-y-3 text-xs border border-border/80">
                      <div className="flex justify-between items-center font-mono">
                        <span className="text-muted-foreground">Amount Due:</span>
                        <span className="font-bold text-foreground">
                          ${selectedPlan.id === "weekly_boost" ? "5.00" : selectedPlan.priceMonthly}.00 USDC
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] text-muted-foreground">
                          Receiving Address (Base Sepolia):
                        </span>
                        <div className="flex items-center justify-between rounded border border-border bg-background p-2 font-mono text-[11px]">
                          <span className="truncate">{MERCHANT_RECEIVING_ADDRESS}</span>
                          <button
                            type="button"
                            onClick={handleCopyMerchantAddress}
                            className="text-blueprint hover:underline ml-2 flex items-center gap-1 shrink-0"
                          >
                            <Copy className="size-3" />
                            {copiedAddress ? "Copied" : "Copy"}
                          </button>
                        </div>
                      </div>

                      {walletAddress && (
                        <p className="text-[11px] font-mono text-emerald-400">
                          Connected Wallet: {walletAddress.slice(0, 6)}…
                          {walletAddress.slice(-4)}
                        </p>
                      )}
                    </div>

                    <form onSubmit={handleConfirmSubscription}>
                      <Button
                        type="submit"
                        variant="hero"
                        size="lg"
                        disabled={isProcessing}
                        className="w-full text-xs font-semibold"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="mr-2 size-4 animate-spin" />
                            Processing Base Wallet Payment…
                          </>
                        ) : (
                          `Pay $${selectedPlan.id === "weekly_boost" ? "5.00" : selectedPlan.priceMonthly} USDC via Base Wallet (BasePay)`
                        )}
                      </Button>
                    </form>
                  </div>
                </TabsContent>

                {/* CARD PAYMENT TAB */}
                <TabsContent value="card" className="pt-4 space-y-4">
                  <form onSubmit={handleConfirmSubscription} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="card-name" className="text-xs">
                        Cardholder Name
                      </Label>
                      <Input
                        id="card-name"
                        placeholder="e.g. Alex Morgan"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="card-number" className="text-xs">
                        Card Number
                      </Label>
                      <Input
                        id="card-number"
                        placeholder="4532 •••• •••• 8892"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                        maxLength={19}
                        className="h-9 text-xs font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="card-exp" className="text-xs">
                          Expiry Date
                        </Label>
                        <Input
                          id="card-exp"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          required
                          maxLength={5}
                          className="h-9 text-xs font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="card-cvc" className="text-xs">
                          CVC / CVV
                        </Label>
                        <Input
                          id="card-cvc"
                          placeholder="123"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          required
                          maxLength={4}
                          className="h-9 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="rounded-lg bg-surface-2 p-3 text-[11px] text-muted-foreground flex items-center gap-2">
                      <Lock className="size-3.5 text-blueprint shrink-0" />
                      <span>
                        256-Bit SSL Encrypted Checkout. Billed as $
                        {selectedPlan.id === "weekly_boost"
                          ? "5.00 / week"
                          : `${selectedPlan.priceMonthly}.00 / month`}
                      </span>
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      disabled={isProcessing}
                      className="w-full text-xs font-semibold"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="mr-2 size-4 animate-spin" />
                          Processing Card Payment…
                        </>
                      ) : (
                        `Confirm & Pay $${
                          selectedPlan.id === "weekly_boost"
                            ? "5.00"
                            : selectedPlan.priceMonthly
                        }`
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
