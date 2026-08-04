import { type InputHTMLAttributes, useId } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  mono?: boolean;
};

export function Field({ label, hint, mono = true, className = "", ...props }: Props) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-md border border-line-strong bg-surface px-3.5 py-2.5 text-[0.95rem] text-ink placeholder:text-ink-faint focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
          mono ? "ledger-mono" : ""
        } ${className}`}
        {...props}
      />
      {hint && <p className="text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}
