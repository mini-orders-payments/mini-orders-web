'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEST_API_URL; 

export type AuthFormState = { error?: string } | undefined;

export type CurrentUser = {
  name: string;
  email: string;
  phone?: string;
  stats?: { completed: number; failed: number; pending: number; all: number };
};

export async function signupAction(_prevState: AuthFormState,formData: FormData):Promise<AuthFormState> {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phoneNumber: formData.get('phoneNumber'),
      password: formData.get('password'),
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    return { error: err.message ?? 'Signup failed' };
  }

  const { accessToken } = await res.json();

  (await cookies()).set('session', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60, // matches your JWT expiry
  });

  redirect('/profile');
}

export async function signinAction(_prevState:AuthFormState,formData: FormData):Promise<AuthFormState> {
  const res =await fetch(`${API_URL}/auth/signin`,{
    method:'POST',
    headers:{ 'Content-Type': 'application/json' },
    body:JSON.stringify({
        email:formData.get('email'),
        password:formData.get('password'),
    }),
  });

  if(!res.ok){
    const err = await res.json();
    return { error: err.message ?? 'Signin failed' };
  }

  const { accessToken } = await res.json();

  (await cookies()).set('session', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60, // matches your JWT expiry
  });

  redirect('/profile');

}

export async function signOutAction() {
  (await cookies()).delete('session');
  redirect('/signin');
}

export async function getCurrentUser() {
  const token = (await cookies()).get('session')?.value;
  const res = await fetch(`${process.env.NEST_API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}