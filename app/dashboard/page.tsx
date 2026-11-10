'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import CivilverseShell from '@/components/CivilverseShell';
import {
  ArrowRight, ArrowUpRight, BookOpen, BrainCircuit, CalendarClock, CheckCircle2,
  Clock3, FileQuestion, Flame, GraduationCap, Library, LockKeyhole, Play,
  Plus, Sparkles, Target, TrendingUp, Trophy, Zap,
} from 'lucide-react';

type Quiz = { id: string; title: string; category?: string | null; description?: string | null; time_limit?: number | null };
type Attempt = { id: string; score?: number | null; correct?: number | null; wrong?: number | null; total?: number | null; completed_at?: string | null };

function Metric({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: React.ElementType }) {
  return <article className="cv-glass cv-card p-4 sm:p-5 min-w-0"><div className="flex items-center justify-between gap-2"><span className="text-[10px] font-semibold text-violet-100/55">{label}</span><span className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/[.05] text-violet-200"><Icon size={15}/></span></div><div className="mt-4 cv-stat-value">{value}</div><p className="mt-1 text-[10px] cv-muted">{detail}</p></article>;
}

export default function DashboardPage() {
  const [name, setName] = useState('Aspirant');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [resourceCount, setResourceCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(isSupabaseConfigured);
  const [dateLabel, setDateLabel] = useState('');

  useEffect(() => {
    setDateLabel(new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()));
    let active = true;
    async function load() {
      if (!isSupabaseConfigured) { setLoading(false); setConnected(false); return; }
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) { setLoading(false); return; }
        const [profile, quizResult, attemptResult, resourceResult] = await Promise.all([
          supabase.from('profiles').select('full_name,name').eq('id', session.user.id).maybeSingle(),
          supabase.from('quizzes').select('id,title,category,description,time_limit').eq('active', true).order('created_at', { ascending: false }).limit(6),
          supabase.from('attempts').select('id,score,correct,wrong,total,completed_at').eq('user_id', session.user.id).order('completed_at', { ascending: false }).limit(100),
          supabase.from('resources').select('id', { count: 'exact', head: true }),
        ]);
        if (!active) return;
        if (profile.data?.full_name || profile.data?.name || session.user.user_metadata?.full_name) setName(profile.data?.full_name || profile.data?.name || session.user.user_metadata.full_name);
        if (quizResult.data) setQuizzes(quizResult.data as Quiz[]);
        if (attemptResult.data) setAttempts(attemptResult.data as Attempt[]);
        if (!resourceResult.error && resourceResult.count !== null) setResourceCount(resourceResult.count);
        if (quizResult.error || attemptResult.error) setConnected(false);
      } catch { if (active) setConnected(false); }
      finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, []);

  const average = useMemo(() => attempts.length ? Math.round(attempts.reduce((sum, a) => sum + Number(a.score || 0), 0) / attempts.length) : null, [attempts]);
  const attemptedQuestions = useMemo(() => attempts.reduce((sum, a) => sum + Number(a.total || 0), 0), [attempts]);
  const accuracy = useMemo(() => {
    const correct = attempts.reduce((sum, a) => sum + Number(a.correct || 0), 0);
    const wrong = attempts.reduce((sum, a) => sum + Number(a.wrong || 0), 0);
    return correct + wrong ? Math.round(correct / (correct + wrong) * 100) : null;
  }, [attempts]);

  return <CivilverseShell>
    <section className="mx-auto max-w-[1440px]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><div className="cv-eyebrow mb-2">Your command centre · {dateLabel || 'Today'}</div><h1 className="font-display text-[clamp(28px,4vw,46px)] font-semibold leading-[1.08] tracking-[-.055em]">Welcome back, <span className="cv-gradient-text">{name.split(' ')[0]}.</span></h1><p className="mt-2 text-[12px] cv-muted">A focused day compounds into an exceptional result.</p></div>
        <Link href="/quizzes" className="cv-button"><Zap size={15}/> Start a daily drill <ArrowRight size={14}/></Link>
      </div>

      <div className="cv-glass cv-card relative mb-5 overflow-hidden p-5 sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-28 h-72 w-72 rounded-full bg-violet-500/20 blur-[75px]"/><div className="pointer-events-none absolute right-[20%] -bottom-40 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-[80px]"/>
        <div className="relative grid items-center gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1.5 text-[9px] font-bold tracking-[.12em] text-violet-200"><Sparkles size={12}/> THE CIVIL SERVICES LEARNING OS</div><h2 className="font-display max-w-2xl text-[clamp(25px,3.3vw,40px)] font-semibold leading-[1.12] tracking-[-.045em]">Prepare with <span className="cv-gradient-text">clarity.</span><br/>Progress with purpose.</h2><p className="mt-3 max-w-lg text-[11px] leading-6 cv-muted">Your syllabus, classroom, practice and revision—connected in one intelligent learning space.</p><div className="mt-5 flex flex-wrap gap-2"><Link href="/modules/courses" className="cv-button"><BookOpen size={14}/> Explore learning paths</Link><Link href="/modules/study-planner" className="cv-button cv-button-secondary"><CalendarClock size={14}/> Plan my study</Link></div></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="flex items-center gap-2 text-[10px] text-violet-100/60"><Target size={13}/> Exam focus</div><div className="mt-3 font-display text-xl font-semibold">UPSC CSE</div><div className="mt-1 text-[9px] cv-muted">Prelims · Mains · Interview</div></div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="flex items-center gap-2 text-[10px] text-violet-100/60"><Flame size={13}/> Consistency</div><div className="mt-3 font-display text-xl font-semibold">Build your streak</div><div className="mt-1 text-[9px] cv-muted">Log a focused session today</div></div>
            <div className="col-span-2 rounded-2xl border border-violet-300/15 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 p-4"><div className="flex items-center justify-between gap-3"><div><div className="text-[10px] font-semibold text-violet-100/70">Your preparation journey</div><p className="mt-1 text-[10px] cv-muted">Progress appears here as you complete lessons and assessments.</p></div><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[.06] text-violet-200"><TrendingUp size={18}/></div></div><div className="mt-3 cv-progress"><span style={{width: '0%'}}/></div><div className="mt-1.5 flex justify-between text-[9px] text-violet-100/45"><span>Not yet measured</span><span>Connect learning activity</span></div></div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Metric label="ASSESSMENTS ATTEMPTED" value={loading ? '—' : String(attempts.length)} detail="Recorded test attempts" icon={FileQuestion}/>
        <Metric label="AVERAGE SCORE" value={average === null ? '—' : `${average}%`} detail={average === null ? 'No assessment data yet' : 'Across recorded attempts'} icon={Trophy}/>
        <Metric label="QUESTION ACCURACY" value={accuracy === null ? '—' : `${accuracy}%`} detail={attemptedQuestions ? `${attemptedQuestions} questions attempted` : 'No question data yet'} icon={Target}/>
        <Metric label="LIBRARY RESOURCES" value={resourceCount === null ? '—' : String(resourceCount)} detail="Published resource records" icon={Library}/>
      </div>

      {!connected && <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/[.06] p-4"><LockKeyhole size={17} className="mt-0.5 shrink-0 text-amber-200"/><div><div className="text-[11px] font-bold text-amber-100">Connect your Supabase project</div><p className="mt-1 text-[10px] leading-relaxed text-amber-100/65">Dashboard analytics are intentionally not filled with demo numbers. Add the public Supabase URL and publishable key to your environment to load your real profile, assessments and library counts.</p></div></div>}

      <div className="mb-3 flex items-center justify-between"><div><div className="cv-eyebrow">Continue your journey</div><h3 className="mt-1 font-display text-xl font-semibold tracking-tight">Your learning spaces</h3></div><span className="text-[10px] cv-muted">Built for focused preparation</span></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Link href="/modules/classroom" className="cv-glass cv-card group p-5"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl border border-violet-300/15 bg-violet-400/10 text-violet-200"><GraduationCap size={19}/></span><ArrowUpRight size={16} className="text-violet-200/45 transition group-hover:-translate-y-1 group-hover:translate-x-1"/></div><h4 className="mt-4 text-sm font-bold">Live Classroom</h4><p className="mt-1 text-[10px] leading-relaxed cv-muted">Attend scheduled classes, revisit recordings and access faculty resources.</p><div className="mt-4 text-[9px] font-bold text-violet-200">OPEN CLASSROOM <ArrowRight size={11} className="inline"/></div></Link>
        <Link href="/modules/current-affairs" className="cv-glass cv-card group p-5"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl border border-fuchsia-300/15 bg-fuchsia-400/10 text-fuchsia-200"><NewspaperIcon/></span><ArrowUpRight size={16} className="text-violet-200/45 transition group-hover:-translate-y-1 group-hover:translate-x-1"/></div><h4 className="mt-4 text-sm font-bold">Current Affairs Intelligence</h4><p className="mt-1 text-[10px] leading-relaxed cv-muted">Explore news through twelve syllabus-aligned examination modules.</p><div className="mt-4 text-[9px] font-bold text-fuchsia-200">EXPLORE MODULES <ArrowRight size={11} className="inline"/></div></Link>
        <Link href="/quizzes" className="cv-glass cv-card group p-5"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl border border-rose-300/15 bg-rose-400/10 text-rose-200"><Zap size={19}/></span><ArrowUpRight size={16} className="text-violet-200/45 transition group-hover:-translate-y-1 group-hover:translate-x-1"/></div><h4 className="mt-4 text-sm font-bold">Daily Drill & Practice</h4><p className="mt-1 text-[10px] leading-relaxed cv-muted">Build accuracy through topic-wise practice and detailed explanations.</p><div className="mt-4 text-[9px] font-bold text-rose-200">START PRACTISING <ArrowRight size={11} className="inline"/></div></Link>
        <Link href="/resources" className="cv-glass cv-card group p-5"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl border border-indigo-300/15 bg-indigo-400/10 text-indigo-200"><Library size={19}/></span><ArrowUpRight size={16} className="text-violet-200/45 transition group-hover:-translate-y-1 group-hover:translate-x-1"/></div><h4 className="mt-4 text-sm font-bold">Digital Library</h4><p className="mt-1 text-[10px] leading-relaxed cv-muted">A structured home for reports, class notes, books and reference PDFs.</p><div className="mt-4 text-[9px] font-bold text-indigo-200">BROWSE LIBRARY <ArrowRight size={11} className="inline"/></div></Link>
        <Link href="/modules/pyq-explorer" className="cv-glass cv-card group p-5"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl border border-purple-300/15 bg-purple-400/10 text-purple-200"><BrainCircuit size={19}/></span><ArrowUpRight size={16} className="text-violet-200/45 transition group-hover:-translate-y-1 group-hover:translate-x-1"/></div><h4 className="mt-4 text-sm font-bold">PYQ Explorer</h4><p className="mt-1 text-[10px] leading-relaxed cv-muted">Study previous-year questions by exam, year, paper, subject and topic.</p><div className="mt-4 text-[9px] font-bold text-purple-200">EXPLORE PYQS <ArrowRight size={11} className="inline"/></div></Link>
        <Link href="/modules/study-planner" className="cv-glass cv-card group p-5"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl border border-pink-300/15 bg-pink-400/10 text-pink-200"><CalendarClock size={19}/></span><ArrowUpRight size={16} className="text-violet-200/45 transition group-hover:-translate-y-1 group-hover:translate-x-1"/></div><h4 className="mt-4 text-sm font-bold">Study Planner</h4><p className="mt-1 text-[10px] leading-relaxed cv-muted">Turn your syllabus into achievable daily and weekly study blocks.</p><div className="mt-4 text-[9px] font-bold text-pink-200">PLAN MY STUDY <ArrowRight size={11} className="inline"/></div></Link>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[1.2fr_.8fr]">
        <section className="cv-glass cv-card p-5"><div className="flex items-center justify-between"><div><div className="cv-eyebrow">Assessment activity</div><h3 className="mt-1 font-display text-lg font-semibold">Recent attempts</h3></div><Link href="/history" className="text-[10px] font-bold text-violet-200">View history <ArrowRight size={12} className="inline"/></Link></div>
          {loading ? <p className="py-8 text-center text-[10px] cv-muted">Loading assessment records…</p> : attempts.length ? <div className="mt-4 divide-y divide-white/[.06]">{attempts.slice(0,4).map((a,i)=><div key={a.id} className="flex items-center justify-between gap-3 py-3"><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-white/[.05] text-violet-200"><CheckCircle2 size={15}/></span><div><div className="text-[11px] font-semibold">Assessment {attempts.length-i}</div><div className="text-[9px] cv-muted">{a.completed_at ? new Date(a.completed_at).toLocaleDateString('en-IN') : 'Date unavailable'}</div></div></div><span className="font-display text-sm font-semibold">{a.score ?? '—'}%</span></div>)}</div> : <div className="py-8 text-center"><div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-white/[.05] text-violet-200"><FileQuestion size={18}/></div><p className="mt-3 text-[11px] font-semibold">Your first attempt starts here</p><p className="mt-1 text-[10px] cv-muted">Complete a quiz to see your performance history.</p><Link href="/quizzes" className="mt-4 inline-flex text-[10px] font-bold text-violet-200">Explore quizzes <ArrowRight size={12}/></Link></div>}
        </section>
        <section className="cv-glass cv-card p-5"><div className="cv-eyebrow">Quick access</div><h3 className="mt-1 font-display text-lg font-semibold">Pick up momentum</h3><div className="mt-4 space-y-2"><Link href="/quizzes" className="flex items-center gap-3 rounded-xl border border-white/[.07] bg-white/[.025] p-3 hover:bg-white/[.05]"><span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-400/10 text-violet-200"><Play size={14}/></span><span className="flex-1"><span className="block text-[10px] font-bold">Take a practice quiz</span><span className="block text-[9px] cv-muted">Test your understanding</span></span><ArrowRight size={13} className="text-violet-200/60"/></Link><Link href="/resources" className="flex items-center gap-3 rounded-xl border border-white/[.07] bg-white/[.025] p-3 hover:bg-white/[.05]"><span className="grid h-8 w-8 place-items-center rounded-lg bg-fuchsia-400/10 text-fuchsia-200"><BookOpen size={14}/></span><span className="flex-1"><span className="block text-[10px] font-bold">Open study resources</span><span className="block text-[9px] cv-muted">Read and revise</span></span><ArrowRight size={13} className="text-violet-200/60"/></Link><Link href="/modules/ai-assistant" className="flex items-center gap-3 rounded-xl border border-white/[.07] bg-white/[.025] p-3 hover:bg-white/[.05]"><span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-400/10 text-rose-200"><Sparkles size={14}/></span><span className="flex-1"><span className="block text-[10px] font-bold">Ask your study assistant</span><span className="block text-[9px] cv-muted">Concepts, frameworks and revision</span></span><ArrowRight size={13} className="text-violet-200/60"/></Link></div></section>
      </div>
      <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-white/[.06] pt-4 text-[9px] text-violet-100/35"><span>© {new Date().getFullYear()} CIVILVERSE · Built for serious preparation</span><span>Clarity · Consistency · Competence</span></footer>
    </section>
  </CivilverseShell>;
}

function NewspaperIcon() { return <BookOpen size={19}/>; }
