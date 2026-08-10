import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "danger" | "ghost" | "outline";

const styles: Record<Variant, string> = {
  primary:
    "bg-ink text-white hover:bg-accent-ink focus-visible:outline-accent disabled:bg-ink-faint",
  danger:
    "bg-rust text-white hover:bg-rust-ink focus-visible:outline-rust disabled:bg-ink-faint",
  ghost:
    "bg-transparent text-ink-soft hover:bg-paper hover:text-ink",
  outline:
    "bg-surface text-ink border border-line-strong hover:border-ink disabled:opacity-50",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", className = "", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...props}
    />
  );
});
