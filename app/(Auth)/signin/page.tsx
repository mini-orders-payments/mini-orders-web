"use client";
import { signinAction,type AuthFormState } from '@/lib/server-actions';
import { Field } from '@/components/field';
import { Button } from '@/components/button';
import { useActionState } from 'react';
import Link from 'next/link';

const initialState:AuthFormState=undefined;


export default function SigninPage() {

  const[state,formAction,isPending]=useActionState(signinAction,initialState)

  return (
    <div>
      <p className="text-sm text-ink-faint">Welcome…</p>
      <h1 className="ledger-heading text-2xl font-bold">Sign in</h1>

      <form action={formAction} className="mt-8 flex max-w-sm flex-col gap-5">
        <Field label="Email" name="email" type="email" mono={false} required />
        

        <Field label="Password" name="password" type="password" mono={false} required />

        {state?.error && (
        <p role="alert" className="rounded-md bg-rust-soft px-3 py-2 text-sm text-rust-ink">
          {state.error}
        </p>
      )}

        <p className="text-sm text-ink-soft">
          Don't have an account? <Link href="/signup" className="font-semibold text-accent-ink">Sign up</Link>
        </p>
        <Button type="submit" disabled={isPending}>
            {isPending?'Signing in...':'Sign in'}
            </Button>
      </form>
    </div>
  );
}