import Link from "next/link";
import { FilePlus2, ListOrdered, CreditCard, Trash2, ArrowRight } from "lucide-react";

const ACTIONS = [
  {
    href: "/orders/new",
    title: "Create order",
    description: "Register a new order for a user with an amount.",
    icon: FilePlus2,
    accent: "var(--blue-ink)",
    accentSoft: "var(--blue-soft)",
  },
  {
    href: "/orders",
    title: "View orders",
    description: "Browse every order, and edit or remove one inline.",
    icon: ListOrdered,
    accent: "var(--accent)",
    accentSoft: "var(--accent-soft)",
  },
  {
    href: "/payment",
    title: "Payment",
    description: "Look up an order and mark it as paid.",
    icon: CreditCard,
    accent: "var(--amber)",
    accentSoft: "var(--amber-soft)",
  },
  {
    href: "/orders/delete",
    title: "Delete order",
    description: "Remove an order by its ID.",
    icon: Trash2,
    accent: "var(--rust)",
    accentSoft: "var(--rust-soft)",
  },
] as const;

export default function HomePage() {
  return (
    <div>
      <p className="text-sm font-medium text-ink-faint">Welcome back</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        MINI-ORDERS 
      </h1>
      <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink-soft">
        CHOOSE...
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group flex flex-col gap-4 rounded-lg border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_6px_20px_-8px_rgba(20,23,28,0.15)]"
            >
              <span
                aria-hidden
                className="flex h-10 w-10 items-center justify-center rounded-md"
                style={{ background: action.accentSoft, color: action.accent }}
              >
                <Icon size={20} />
              </span>
              <div className="flex-1">
                <h2 className="text-base font-semibold text-ink">{action.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {action.description}
                </p>
              </div>
              <span className="flex items-center gap-1 text-sm font-semibold text-ink-soft group-hover:text-ink">
                Go <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
