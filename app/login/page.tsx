'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function LoginPage() {
  const s = supabaseBrowser();
  const [email, setEmail] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await s.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/auth/callback` } });
    if (error) alert(error.message);
    else alert('Check your email for a magic link!');
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-xl font-semibold mb-4">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded border px-3 py-2" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        <button className="rounded bg-black text-white px-3 py-2">Send magic link</button>
      </form>
    </main>
  );
}
