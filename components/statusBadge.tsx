import type { Order,OrderStatus } from "@/types/orders";

const STATUS_MAP: Record<OrderStatus, { label: string; dot: string; text: string; bg: string }> = {
  pending: { label: "Pending", dot: "var(--amber)", text: "text-[color:var(--amber)]", bg: "bg-amber-soft" },
  completed: { label: "Completed", dot: "var(--accent)", text: "text-accent-ink", bg: "bg-accent-soft" },
  failed: { label: "Failed", dot: "var(--rust)", text: "text-rust-ink", bg: "bg-rust-soft" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const s = STATUS_MAP[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.text} ${s.bg}`}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}
