'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Aperture, ArrowRight, BookOpen, GraduationCap, LockKeyhole, Sparkles } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient';

export default function EntryPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function signIn() {
    if (!isSupabaseConfigured) { setError('Authentication is not configured yet. Add the Supabase environment variables to enable sign-in.'); return; }
    setBusy(true); setError('');
    const { error: authError } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/dashboard` } });
    if (authError) { setError(authError.message); setBusy(false); }
  }
  return <main className="cv-app relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
    <div className="cv-orb cv-orb-one"/><div className="cv-orb cv-orb-two"/>
    <div className="relative z-10 grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
      <section><div className="mb-7 flex items-center gap-3"><span className="cv-brand-mark"><Aperture size={22}/></span><span><span className="font-display block text-lg font-bold tracking-[.16em]">CIVILVERSE</span><span className="text-[9px] tracking-[.2em] text-violet-200/55">THE CIVIL SERVICES LEARNING OS</span></span></div>
        <div className="cv-eyebrow">UPSC · STATE PCS · SSC</div><h1 className="font-display mt-4 text-[clamp(40px,6vw,68px)] font-semibold leading-[.99] tracking-[-.065em]">Serious learning.<br/><span className="cv-gradient-text">Smarter outcomes.</span></h1><p className="mt-6 max-w-xl text-sm leading-7 cv-muted">A connected preparation ecosystem bringing your classroom, current affairs, practice, PYQs and study intelligence into one focused space.</p>
        <div className="mt-8 grid max-w-xl grid-cols-3 gap-3"><div className="cv-glass rounded-2xl p-3"><GraduationCap size={17} className="text-violet-200"/><div className="mt-3 text-[10px] font-bold">Classroom</div><div className="mt-1 text-[9px] cv-muted">Learn</div></div><div className="cv-glass rounded-2xl p-3"><BookOpen size={17} className="text-fuchsia-200"/><div className="mt-3 text-[10px] font-bold">Knowledge</div><div className="mt-1 text-[9px] cv-muted">Understand</div></div><div className="cv-glass rounded-2xl p-3"><Sparkles size={17} className="text-rose-200"/><div className="mt-3 text-[10px] font-bold">Intelligence</div><div className="mt-1 text-[9px] cv-muted">Improve</div></div></div>
      </section>
      <section className="cv-glass cv-card p-6 sm:p-8"><div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl border border-violet-300/20 bg-violet-400/10 text-violet-200"><LockKeyhole size={21}/></div><div className="cv-eyebrow">Your learning space awaits</div><h2 className="font-display mt-2 text-2xl font-semibold tracking-tight">Welcome to CIVILVERSE</h2><p className="mt-2 text-xs leading-6 cv-muted">Sign in to access your personalized learning dashboard and saved progress.</p>
        {error && <div role="alert" className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/[.06] p-3 text-[10px] leading-5 text-amber-100">{error}</div>}
        <button onClick={signIn} disabled={busy} className="cv-button mt-6 w-full py-3.5">{busy ? 'Connecting…' : 'Continue with Google'} <ArrowRight size={15}/></button>
        <div className="my-5 flex items-center gap-3 text-[9px] uppercase tracking-[.16em] text-violet-100/35"><span className="h-px flex-1 bg-white/10"/>Preview access<span className="h-px flex-1 bg-white/10"/></div>
        <button onClick={()=>router.push('/dashboard')} className="cv-button cv-button-secondary w-full py-3.5">Explore student dashboard <ArrowRight size={15}/></button>
        <p className="mt-5 text-center text-[9px] leading-5 text-violet-100/35">Preview access does not create an account or save progress. Configure Supabase authentication for persistent student access.</p>
      </section>
    </div>
  </main>;
}
