"use client";
import { signupAction,type AuthFormState } from '@/lib/server-actions';
import { Field } from '@/components/field';
import { useActionState } from 'react';
import { Button } from '@/components/button';
import Link from 'next/link';

const initialState: AuthFormState = undefined;

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signupAction, initialState);

  return (
    <div>
      <p className="text-sm text-ink-faint">Welcome…</p>
      <h1 className="ledger-heading text-2xl font-bold">Sign up</h1>

      <form action={formAction} className="mt-8 flex max-w-sm flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name" name="firstName" mono={false} required />
          <Field label="Second name" name="lastName" mono={false} required />
        </div>
        <Field label="Email" name="email" type="email" mono={false} required />
        <Field label="Phone number" name="phoneNumber" mono={false} required />
        <Field label="Password" name="password" type="password" mono={false} required />

        {state?.error && (
        <p role="alert" className="rounded-md bg-rust-soft px-3 py-2 text-sm text-rust-ink">
          {state.error}
        </p>
      )}

        <p className="text-sm text-ink-soft">
          Already have an account? <Link href="/signin" className="font-semibold text-accent-ink">Sign in</Link>
        </p>
        <Button type="submit" disabled={isPending}>
            {isPending?'Signing up':'Signup'}
            </Button>
      </form>
    </div>
  );
}