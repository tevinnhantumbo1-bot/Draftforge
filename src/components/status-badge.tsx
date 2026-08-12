const LABELS: Record<string, { label: string; className: string }> = {
  free_test: {
    label: "Free Test",
    className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  submitted: {
    label: "Submitted",
    className: "bg-blueprint/15 text-blueprint",
  },
  generating: {
    label: "Generating",
    className: "bg-blueprint/15 text-blueprint",
  },
  preview_ready: {
    label: "Preview ready",
    className: "bg-primary/15 text-primary",
  },
  approved: { label: "Approved", className: "bg-primary/15 text-primary" },
  drafting: { label: "Drafting", className: "bg-primary/15 text-primary" },
  delivered: {
    label: "Delivered",
    className: "bg-blueprint/20 text-blueprint",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/15 text-destructive",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const s = LABELS[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`tech-label rounded-sm px-2.5 py-1 ${s.className}`}>
      {s.label}
    </span>
  );
}
