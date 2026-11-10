'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import CivilverseShell from '@/components/CivilverseShell';
import {
  ArrowRight, ArrowUpRight, BookOpen, BrainCircuit, CalendarDays, CheckCircle2,
  FileQuestion, GraduationCap, Library, LockKeyhole, Play, Sparkles, Trophy,
  Zap, FileText,
} from 'lucide-react';

type Attempt = { id: string; score?: number | null; correct?: number | null; wrong?: number | null; total?: number | null; completed_at?: string | null };

const learningSpaces = [
  { title: 'Live Classroom', description: 'Attend & revise lectures', href: '/modules/classroom', icon: GraduationCap, image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1000&q=85', tone: 'from-violet-700/35 via-fuchsia-950/25' },
  { title: 'Digital Library', description: 'Notes, books, reports & PDFs', href: '/resources', icon: Library, image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1000&q=85', tone: 'from-blue-700/35 via-indigo-950/35' },
  { title: 'PYQ Explorer', description: 'Previous year questions with filters', href: '/modules/pyq-explorer', icon: FileText, image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1000&q=85', tone: 'from-violet-700/40 via-purple-950/35' },
  { title: 'Study Planner', description: 'Daily & weekly study schedule', href: '/modules/study-planner', icon: CalendarDays, image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1000&q=85', tone: 'from-rose-700/40 via-fuchsia-950/35' },
];

function LearningCard({ item }: { item: typeof learningSpaces[number] }) {
  const Icon = item.icon;
  return <Link href={item.href} className="group relative isolate flex min-h-[178px] flex-col overflow-hidden rounded-[22px] border border-white/[.13] bg-[#21132f] p-4 shadow-[0_12px_35px_rgba(0,0,0,.28)] transition duration-300 hover:-translate-y-1 hover:border-fuchsia-200/35 sm:min-h-[220px] sm:p-5">
    <div className="absolute inset-0 -z-20 bg-cover bg-center transition duration-700 group-hover:scale-105" style={{backgroundImage: `url("${item.image}")`}}/>
    <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${item.tone} to-[#11091e]/95`}/>
    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#10091d]/95 via-[#10091d]/40 to-[#10091d]/10"/>
    <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-violet-950/45 text-violet-50 shadow-lg backdrop-blur-md"><Icon size={22} strokeWidth={1.8}/></span>
    <div className="mt-auto pt-6"><h3 className="font-display text-[17px] font-bold leading-tight text-white sm:text-xl">{item.title}</h3><p className="mt-1.5 max-w-[170px] text-[11px] leading-[1.45] text-white/75 sm:text-xs">{item.description}</p></div>
    <ArrowUpRight className="absolute bottom-4 right-4 h-4 w-4 text-white/75 opacity-0 transition group-hover:opacity-100"/>
  </Link>;
}

export default function DashboardPage() {
  const [name, setName] = useState('Aspirant');
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(isSupabaseConfigured);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!isSupabaseConfigured) { setLoading(false); setConnected(false); return; }
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) { setLoading(false); return; }
        const [profile, attemptResult] = await Promise.all([
          supabase.from('profiles').select('full_name,name').eq('id', session.user.id).maybeSingle(),
          supabase.from('attempts').select('id,score,correct,wrong,total,completed_at').eq('user_id', session.user.id).order('completed_at', { ascending: false }).limit(100),
        ]);
        if (!active) return;
        const displayName = profile.data?.full_name || profile.data?.name || session.user.user_metadata?.full_name;
        if (displayName) setName(displayName);
        if (attemptResult.data) setAttempts(attemptResult.data as Attempt[]);
        if (attemptResult.error) setConnected(false);
      } catch { if (active) setConnected(false); }
      finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, []);

  const average = useMemo(() => attempts.length ? Math.round(attempts.reduce((sum, a) => sum + Number(a.score || 0), 0) / attempts.length) : null, [attempts]);

  return <CivilverseShell>
    <section className="mx-auto max-w-[1120px] pb-5">
      <header className="mb-5 px-1">
        <div className="cv-eyebrow mb-2">YOUR LEARNING SPACE</div>
        <h1 className="font-display text-[clamp(26px,4vw,38px)] font-bold leading-[1.08] tracking-[-.045em]">Continue Your Journey</h1>
        <p className="mt-1.5 text-[12px] text-violet-100/65 sm:text-sm">Access all key learning spaces in one place.</p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {learningSpaces.map((item) => <LearningCard key={item.title} item={item}/>)}
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="font-display text-xl font-bold tracking-tight">Assessment Activity</h2>
          <Link href="/history" className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-200">View history <ArrowRight size={14}/></Link>
        </div>
        <div className="relative overflow-hidden rounded-[23px] border border-fuchsia-200/15 bg-gradient-to-br from-violet-900/35 via-[#21112f] to-fuchsia-950/35 px-4 py-5 text-center shadow-[0_14px_40px_rgba(0,0,0,.24)] sm:py-7">
          <div className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-fuchsia-500/15 blur-[65px]"/>
          {loading ? <p className="py-6 text-xs text-violet-100/55">Loading your assessment history…</p> : attempts.length ? <>
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-fuchsia-200/20 bg-fuchsia-500/15 text-fuchsia-200"><Trophy size={23}/></div>
            <h3 className="mt-3 font-display text-lg font-bold">{attempts.length} assessment{attempts.length === 1 ? '' : 's'} completed</h3>
            <p className="mt-1 text-[11px] text-violet-100/65">Your average recorded score is {average ?? '—'}%.</p>
            <Link href="/history" className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-fuchsia-950/30">Review performance <ArrowRight size={14}/></Link>
          </> : <>
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-fuchsia-200/20 bg-gradient-to-br from-violet-500/25 to-fuchsia-500/25 text-fuchsia-200 shadow-[0_0_30px_rgba(217,70,239,.14)]"><FileQuestion size={25}/></div>
            <h3 className="mt-3 font-display text-lg font-bold">Your first attempt starts here</h3>
            <p className="mt-1 text-[11px] text-violet-100/65">Complete a quiz to see your performance history.</p>
            <Link href="/quizzes" className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-7 py-2.5 text-xs font-bold text-white shadow-[0_7px_25px_rgba(217,70,239,.25)]">Explore Quizzes <ArrowRight size={14}/></Link>
          </>}
        </div>
      </section>

      <section className="mt-6">
        <div className="px-1"><h2 className="font-display text-xl font-bold tracking-tight">Quick Access</h2><p className="text-[12px] text-violet-100/65">Pick up momentum</p></div>
        <div className="mt-3 space-y-2.5">
          <Link href="/quizzes" className="group flex items-center gap-3 rounded-[18px] border border-white/[.09] bg-gradient-to-r from-white/[.055] to-fuchsia-500/[.07] p-3 shadow-[0_8px_25px_rgba(0,0,0,.16)] transition hover:border-violet-200/25">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-fuchsia-200/15 bg-gradient-to-br from-violet-500/25 to-fuchsia-500/20 text-fuchsia-200"><Play size={21}/></span><span className="min-w-0 flex-1"><strong className="block text-[12px] font-bold">Take a practice quiz</strong><span className="mt-0.5 block text-[10px] text-violet-100/60">Test your understanding</span></span><ArrowRight size={19} className="text-white/80 transition group-hover:translate-x-1"/>
          </Link>
          <Link href="/resources" className="group flex items-center gap-3 rounded-[18px] border border-white/[.09] bg-gradient-to-r from-white/[.055] to-fuchsia-500/[.07] p-3 shadow-[0_8px_25px_rgba(0,0,0,.16)] transition hover:border-violet-200/25">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-fuchsia-200/15 bg-gradient-to-br from-violet-500/25 to-fuchsia-500/20 text-fuchsia-200"><BookOpen size={21}/></span><span className="min-w-0 flex-1"><strong className="block text-[12px] font-bold">Open study resources</strong><span className="mt-0.5 block text-[10px] text-violet-100/60">Read and revise</span></span><ArrowRight size={19} className="text-white/80 transition group-hover:translate-x-1"/>
          </Link>
          <Link href="/modules/ai-assistant" className="group flex items-center gap-3 rounded-[18px] border border-white/[.09] bg-gradient-to-r from-white/[.055] to-fuchsia-500/[.07] p-3 shadow-[0_8px_25px_rgba(0,0,0,.16)] transition hover:border-violet-200/25">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-fuchsia-200/15 bg-gradient-to-br from-violet-500/25 to-fuchsia-500/20 text-fuchsia-200"><Sparkles size={21}/></span><span className="min-w-0 flex-1"><strong className="block text-[12px] font-bold">Ask your study assistant</strong><span className="mt-0.5 block text-[10px] text-violet-100/60">Concepts, frameworks and revision</span></span><ArrowRight size={19} className="text-white/80 transition group-hover:translate-x-1"/>
          </Link>
        </div>
      </section>

      <Link href="/modules/current-affairs" className="group relative mt-7 flex min-h-[180px] items-center overflow-hidden rounded-[24px] border border-fuchsia-200/15 bg-[#170c25] px-4 py-5 shadow-[0_15px_45px_rgba(0,0,0,.32)] sm:min-h-[220px] sm:px-7">
        <div className="absolute inset-0 bg-cover bg-[center_55%] transition duration-700 group-hover:scale-[1.03]" style={{backgroundImage:'url("https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1400&q=85")'}}/>
        <div className="absolute inset-0 bg-gradient-to-r from-[#170b25] via-[#170b25]/75 to-transparent"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#170b25]/35 to-transparent"/>
        <div className="relative max-w-[240px]"><h2 className="font-display text-xl font-bold leading-[1.25] tracking-tight sm:text-2xl">Plan. Practice.<br/>Revise. Improve.<br/>Repeat. <span className="text-fuchsia-300">✓</span></h2><span className="mt-3 inline-flex items-center gap-1 text-[9px] font-bold tracking-[.12em] text-fuchsia-200">EXPLORE CURRENT AFFAIRS <ArrowRight size={12}/></span></div>
      </Link>

      {!connected && <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-300/15 bg-amber-300/[.05] p-3 text-[10px] text-amber-100/70"><LockKeyhole size={14} className="mt-0.5 shrink-0"/> Connect Supabase to load your personal profile and assessment history. No demo performance figures are shown.</div>}
      <footer className="mt-6 border-t border-white/[.06] pt-4 text-center text-[9px] tracking-[.12em] text-violet-100/25">CIVILVERSE · CLARITY · CONSISTENCY · COMPETENCE</footer>
    </section>
  </CivilverseShell>;
}
