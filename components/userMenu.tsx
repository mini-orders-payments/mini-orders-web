// components/user-menu.tsx
"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/lib/server-actions";
import type { CurrentUser } from "@/lib/server-actions";

function initials(name: string) {
  return name.split("  ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

export function UserMenu({ user, compact = false }: { user: CurrentUser; compact?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 ${
        compact ? "" : "rounded-md border border-line bg-paper px-3 py-2.5"
      }`}
    >
      <Link href="/profile" className="group flex min-w-0 flex-1 items-center gap-2.5" aria-label={`View profile for ${user.name}`}>
        <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent-ink">
          {initials(user.name)}
        </span>
        {!compact && (
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-ink group-hover:text-accent-ink">{user.name.split(" ").at(0)}</span>
            <span className="block truncate text-xs text-ink-faint">{user.email}</span>
          </span>
        )}
      </Link>
      {!compact && (
        <form action={signOutAction}>
          <button type="submit" aria-label="Sign out" className="rounded-md p-1.5 text-ink-faint hover:bg-surface hover:text-rust">
            <LogOut size={15} />
          </button>
        </form>
      )}
    </div>
  );
}