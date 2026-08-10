export type NavLink = {
  href: string;
  label: string;
  dot: string; // css var name for the accent dot
};

export const NAV_LINKS: NavLink[] = [
  { href: "/orders/new", label: "Create order", dot: "var(--blue-ink)" },
  { href: "/orders", label: "View orders", dot: "var(--accent)" },
  { href: "/payment", label: "Payment", dot: "var(--amber)" },
  { href: "/orders/delete", label: "Delete order", dot: "var(--rust)" },
];
