// app/profile/page.tsx
import { redirect } from "next/navigation";
import { CheckCircle2, XCircle, Clock, Layers, Mail, Phone, User as UserIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/auth-actions";
const STATS = [
  { key: "completed", label: "Completed", icon: CheckCircle2, color: "var(--accent)", soft: "var(--accent-soft)" },
  { key: "failed", label: "Failed", icon: XCircle, color: "var(--rust)", soft: "var(--rust-soft)" },
  { key: "pending", label: "Pending", icon: Clock, color: "var(--amber)", soft: "var(--amber-soft)" },
  { key: "all", label: "All", icon: Layers, color: "var(--ink)", soft: "var(--paper)" },
] as const;

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

export default async function ProfilePage() {
  const profile = await getCurrentUser();
  if (!profile) redirect("/signin");

  const stats = profile.stats ?? { completed: 0, failed: 0, pending: 0, all: 0 };

  return (
    <div>
      <p className="text-sm text-ink-faint">Welcome…{profile.name}</p>
      <h1 className="ledger-heading text-2xl font-bold text-ink">Profile</h1>

      {/* Personal information card */}
      <section className="mt-10 rounded-lg border border-line bg-surface p-6">
        <div className="flex items-center gap-4">
          <span
            aria-hidden
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-soft text-lg font-bold text-accent-ink"
          >
            {initials(profile.name)}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-ink">{profile.name}</h2>
            <p className="text-sm text-ink-faint">Personal information</p>
          </div>
        </div>

        <dl className="mt-6 flex flex-col gap-4 border-t border-line pt-5">
          <div className="flex items-center gap-3">
            <Mail size={16} className="shrink-0 text-ink-faint" />
            <dt className="w-28 shrink-0 text-sm text-ink-soft">Email</dt>
            <dd className="ledger-mono text-sm text-ink">{profile.email}</dd>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={16} className="shrink-0 text-ink-faint" />
            <dt className="w-28 shrink-0 text-sm text-ink-soft">Phone</dt>
            <dd className="ledger-mono text-sm text-ink">{profile.phone ?? "—"}</dd>
          </div>
          <div className="flex items-center gap-3">
            <UserIcon size={16} className="shrink-0 text-ink-faint" />
            <dt className="w-28 shrink-0 text-sm text-ink-soft">Name</dt>
            <dd className="text-sm text-ink">{profile.name}</dd>
            
          </div>
        </dl>
      </section>

      {/* Orders information card */}
      <section className="mt-6 rounded-lg border border-line bg-surface p-6">
        <h2 className="text-sm font-semibold text-ink-soft">Orders information</h2>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map(({ key, label, icon: Icon, color, soft }) => (
            <div key={key} className="rounded-lg border border-line p-4" style={{ background: soft }}>
              <Icon size={18} style={{ color }} />
              <p className="ledger-mono mt-3 text-2xl font-bold" style={{ color }}>
                {stats[key]}
              </p>
              <p className="mt-0.5 text-xs font-medium text-ink-soft">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}