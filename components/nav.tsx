"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "./navLinks";

function isActive(pathname: string, href: string) {
  if (href === "/orders") return pathname === "/orders";
  return pathname === href;
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:shrink-0 md:flex-col md:border-r md:border-line md:bg-surface md:px-5 md:py-8">
        <Wordmark />
        <nav className="mt-10 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-[0.95rem] transition-colors ${
                isActive(pathname, link.href)
                  ? "bg-accent-soft text-accent-ink font-semibold"
                  : "text-ink-soft hover:bg-paper hover:text-ink"
              }`}
            >
              <span
                aria-hidden
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: link.dot }}
              />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-8 text-xs text-ink-faint">
          <p className="ledger-mono">v1.0.0 — local store</p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-4 md:hidden">
        <Wordmark compact />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {open && (
        <nav className="border-b border-line bg-surface px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-3 text-[0.95rem] ${
                  isActive(pathname, link.href)
                    ? "bg-accent-soft text-accent-ink font-semibold"
                    : "text-ink-soft"
                }`}
              >
                <span
                  aria-hidden
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: link.dot }}
                />
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}

function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span
        aria-hidden
        className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-[0.7rem] font-bold text-white"
      >
        M
      </span>
      <span className={`font-semibold tracking-tight text-ink ${compact ? "text-base" : "text-lg"}`}>
        MINI-ORDERS
      </span>
    </Link>
  );
}
