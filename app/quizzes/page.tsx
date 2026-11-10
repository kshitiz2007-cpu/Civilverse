'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import CivilverseShell from '@/components/CivilverseShell';
import { supabase } from '@/lib/supabaseClient';
import { FALLBACK_QUIZZES } from '@/lib/mockData';
import { openWatermarkStudio } from '@/lib/pdfExporter';
import {
  ArrowLeft, ArrowRight, ChevronDown, Clock3, FileText, Landmark, Layers, Leaf,
  Loader2, Microscope, Newspaper, Play, RotateCcw, Scale, Search,
  Sparkles, TrendingUp, Users, Globe2, Calculator, Lightbulb,
} from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  category: string;
  section?: string;
  time_limit: number;
  questions: any[];
  is_paid?: boolean;
  price?: number;
  negative_marking?: number;
  cutoff?: number;
}
interface Attempt { quiz_id: string; score: number; details?: any[]; }

const SUBJECTS = [
  { id: 'Polity', group: 'GS PAPER I', subtitle: 'Constitution & Governance', icon: Scale, image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=900&q=85', tone: 'violet' },
  { id: 'History', group: 'GS PAPER I', subtitle: 'Ancient to Modern India', icon: Landmark, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900&q=85', tone: 'rose' },
  { id: 'Geography', group: 'GS PAPER I', subtitle: 'India & World Geography', icon: Globe2, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=85', tone: 'blue' },
  { id: 'Economy', group: 'GS PAPER III', subtitle: 'Macro, Budget & Banking', icon: TrendingUp, image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&q=85', tone: 'orange' },
  { id: 'Environment', group: 'GS PAPER III', subtitle: 'Ecology & Climate', icon: Leaf, image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=85', tone: 'green' },
  { id: 'Science & Tech', group: 'GS PAPER III', subtitle: 'Space, Biotech & IT', icon: Microscope, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=85', tone: 'cyan' },
  { id: 'Current Affairs', group: 'DYNAMIC GS', subtitle: 'PIB, Hindu & Schemes', icon: Newspaper, image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&q=85', tone: 'pink' },
  { id: 'Maths', group: 'CSAT NUMERACY', subtitle: 'Numeracy & Data', icon: Calculator, image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=900&q=85', tone: 'purple' },
  { id: 'Reasoning', group: 'CSAT LOGIC', subtitle: 'Comprehension & Analytical Logic', icon: Lightbulb, image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=900&q=85', tone: 'violet' },
] as const;

const toneStyles: Record<string, string> = {
  violet: 'from-violet-600/35 via-violet-950/30',
  rose: 'from-fuchsia-600/35 via-rose-950/35',
  blue: 'from-blue-600/35 via-slate-950/35',
  orange: 'from-orange-600/35 via-rose-950/35',
  green: 'from-emerald-600/35 via-green-950/35',
  cyan: 'from-cyan-600/35 via-indigo-950/35',
  pink: 'from-pink-600/35 via-purple-950/35',
  purple: 'from-purple-600/35 via-indigo-950/35',
};

export default function StudentQuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'gs' | 'csat'>('gs');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let alive = true;
    async function loadData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const [quizResult, attemptResult] = await Promise.all([
          supabase.from('quizzes').select('*').eq('active', true).order('created_at', { ascending: false }),
          session?.user?.id
            ? supabase.from('attempts').select('quiz_id, score, details').eq('user_id', session.user.id)
            : Promise.resolve({ data: [], error: null }),
        ]);
        if (quizResult.error) throw quizResult.error;
        if (!alive) return;
        setQuizzes(quizResult.data?.length ? quizResult.data as Quiz[] : FALLBACK_QUIZZES as unknown as Quiz[]);
        setAttempts((attemptResult.data || []) as Attempt[]);
      } catch {
        if (alive) setQuizzes(FALLBACK_QUIZZES as unknown as Quiz[]);
      } finally { if (alive) setLoading(false); }
    }
    loadData();
    return () => { alive = false; };
  }, []);

  const getAttempt = (id: string) => attempts.find((attempt) => attempt.quiz_id === id);
  const countFor = (id: string) => quizzes.filter((quiz) => quiz.category === id).length;
  const visibleSubjects = SUBJECTS.filter((subject) => activeTab === 'gs'
    ? !['Maths', 'Reasoning'].includes(subject.id)
    : ['Maths', 'Reasoning'].includes(subject.id));
  const filteredQuizzes = useMemo(() => quizzes.filter((quiz) =>
    (!activeSubject || quiz.category === activeSubject) &&
    `${quiz.title} ${quiz.section || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
  ), [quizzes, activeSubject, searchQuery]);
  const groupedQuizzes = filteredQuizzes.reduce((acc, quiz) => {
    const section = quiz.section?.trim() && quiz.section !== quiz.category ? quiz.section : 'Standard Sectional Papers';
    (acc[section] ||= []).push(quiz);
    return acc;
  }, {} as Record<string, Quiz[]>);
  const totalAttempts = attempts.length;

  if (loading) return <CivilverseShell><div className="flex min-h-[65vh] items-center justify-center gap-3 text-sm text-violet-100/65"><Loader2 className="h-5 w-5 animate-spin text-violet-300"/>Loading institutional test series…</div></CivilverseShell>;

  return (
    <CivilverseShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="relative overflow-hidden rounded-[26px] border border-violet-200/15 bg-[#130d25]/90 px-5 py-7 text-center shadow-[0_25px_90px_rgba(0,0,0,.36)] sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-600/20 blur-[90px]"/>
          <div className="pointer-events-none absolute -right-20 -top-12 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-[90px]"/>
          <button onClick={() => activeSubject ? setActiveSubject(null) : router.push('/dashboard')} aria-label="Go back" className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[.05] text-violet-100/75 transition hover:bg-white/10"><ArrowLeft size={17}/></button>
          <div className="cv-eyebrow">UPSC CSE PRELIMS & CSAT REPOSITORY</div>
          <div className="mt-3 flex items-center justify-center gap-3 sm:gap-5">
            <span className="hidden text-3xl text-fuchsia-200/80 sm:inline">❧</span>
            <h1 className="font-display text-[clamp(27px,5vw,43px)] font-bold leading-[1.05] tracking-[-.045em]">
              {activeSubject ? <><span className="text-white/65">Institutional</span><br/><span className="cv-gradient-text">{activeSubject} Tests</span></> : <>Institutional<br/><span className="cv-gradient-text">Test Series</span></>}
            </h1>
            <span className="hidden scale-x-[-1] text-3xl text-fuchsia-200/80 sm:inline">❧</span>
          </div>
          <p className="mx-auto mt-3 max-w-md text-xs leading-5 text-violet-100/60 sm:text-sm">Subject-wise sectional tests, full-length papers & performance analytics.</p>
          <div className="mx-auto mt-6 grid max-w-2xl grid-cols-2 gap-3">
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-violet-200/15 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/10 px-3 py-3 text-xs font-semibold text-violet-100 shadow-[inset_0_1px_rgba(255,255,255,.08)]"><Sparkles size={17} className="text-fuchsia-200"/> Ambience</div>
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[.045] px-3 py-3 text-left"><Users size={19} className="text-fuchsia-200"/><span><strong className="block font-display text-lg leading-none">{quizzes.length}</strong><span className="mt-1 block text-[10px] text-violet-100/55">Published papers</span></span></div>
          </div>
        </header>

        {!activeSubject ? (
          <>
            <div className="grid grid-cols-2 rounded-full border border-white/10 bg-white/[.055] p-1.5 shadow-[inset_0_2px_10px_rgba(0,0,0,.22)]">
              <button onClick={() => setActiveTab('gs')} className={`rounded-full px-3 py-3 text-xs font-bold transition-all ${activeTab === 'gs' ? 'bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 text-[#241334] shadow-[0_4px_22px_rgba(219,143,255,.28)]' : 'text-violet-100/55 hover:text-white'}`}>General Studies ({SUBJECTS.filter((s) => !['Maths','Reasoning'].includes(s.id)).length})</button>
              <button onClick={() => setActiveTab('csat')} className={`rounded-full px-3 py-3 text-xs font-bold transition-all ${activeTab === 'csat' ? 'bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 text-[#241334] shadow-[0_4px_22px_rgba(219,143,255,.28)]' : 'text-violet-100/55 hover:text-white'}`}>CSAT</button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {visibleSubjects.map((subject) => {
                const Icon = subject.icon;
                const count = countFor(subject.id);
                const wide = subject.id === 'Reasoning';
                return (
                  <button key={subject.id} onClick={() => { setActiveSubject(subject.id); setSearchQuery(''); }} className={`group relative isolate flex min-h-[190px] flex-col overflow-hidden rounded-[23px] border border-white/10 bg-[#171128] p-4 text-left shadow-[0_14px_40px_rgba(0,0,0,.3)] transition duration-300 hover:-translate-y-1 hover:border-violet-200/35 sm:min-h-[220px] sm:p-5 ${wide ? 'col-span-2 min-h-[160px]' : ''}`}>
                    <div className="absolute inset-0 -z-20 bg-cover bg-center transition duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${subject.image}")` }}/>
                    <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${toneStyles[subject.tone]} to-[#100a20]/95`}/>
                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#10091d] via-[#10091d]/45 to-[#130d24]/10"/>
                    <div className="flex items-start justify-between gap-2">
                      <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-violet-950/45 text-violet-50 shadow-[0_5px_22px_rgba(0,0,0,.3)] backdrop-blur-md"><Icon size={21} strokeWidth={1.8}/></span>
                      <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[8px] font-bold tracking-[.08em] text-white/70 backdrop-blur-md">{subject.group}</span>
                    </div>
                    <div className="mt-auto pt-7">
                      <h2 className="font-display text-base font-bold tracking-tight text-white sm:text-lg">{subject.id}</h2>
                      <p className="mt-1 min-h-8 max-w-[95%] text-[10px] leading-4 text-white/75 sm:text-xs">{subject.subtitle}</p>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="rounded-full border border-white/10 bg-white/15 px-3 py-1.5 text-[9px] font-semibold text-white/90 backdrop-blur-md">{count > 0 ? `${count} Papers` : subject.id === 'Current Affairs' ? 'Dynamic' : subject.id === 'Maths' || subject.id === 'Reasoning' ? 'CSAT' : 'No papers yet'}</span>
                        <span className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-gradient-to-br from-violet-400/80 to-fuchsia-500/80 text-white shadow-[0_5px_18px_rgba(187,89,255,.3)] transition group-hover:translate-x-1"><ArrowRight size={16}/></span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] p-3">
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5"><Search size={15} className="text-violet-200/60"/><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={`Search ${activeSubject} papers…`} className="w-full min-w-0 bg-transparent text-xs outline-none placeholder:text-violet-100/35"/></div>
              <button onClick={() => setActiveSubject(null)} className="rounded-xl border border-white/10 px-3 py-2.5 text-[10px] font-bold text-violet-100/70 hover:bg-white/5"><ArrowLeft size={13} className="mr-1 inline"/> All subjects</button>
            </div>
            {Object.keys(groupedQuizzes).length === 0 ? <div className="rounded-3xl border border-dashed border-white/15 bg-white/[.025] p-12 text-center"><FileText className="mx-auto h-9 w-9 text-violet-200/40"/><h3 className="mt-3 font-display text-lg font-semibold">No papers published yet</h3><p className="mt-1 text-xs text-violet-100/45">New tests for {activeSubject} will appear here when published.</p></div> :
              Object.entries(groupedQuizzes).map(([section, sectionQuizzes]) => (
                <div key={section} className="space-y-3">
                  <button onClick={() => setOpenSections((state) => ({ ...state, [section]: !(state[section] ?? true) }))} className="flex w-full items-center justify-between border-b border-white/10 pb-3 text-left"><span className="flex items-center gap-2 text-xs font-bold"><Layers size={15} className="text-violet-200"/>{section}<span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] text-violet-100/65">{sectionQuizzes.length}</span></span><ChevronDown size={15} className={`text-violet-100/50 transition ${(openSections[section] ?? true) ? '' : '-rotate-90'}`}/></button>
                  {(openSections[section] ?? true) && <div className="grid gap-3 md:grid-cols-2">
                    {sectionQuizzes.map((quiz) => {
                      const attempt = getAttempt(quiz.id);
                      const negative = quiz.negative_marking ?? 0.66;
                      return <article key={quiz.id} className="rounded-2xl border border-white/10 bg-[#171128]/85 p-4 transition hover:border-violet-200/25">
                        <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-violet-400/10 px-2 py-1 text-[8px] font-bold tracking-wider text-violet-200">UPSC PRELIMS PATTERN</span><span className="text-[9px] text-violet-100/45">+2 / -{negative}</span></div>
                        <h3 className="mt-3 font-display text-sm font-bold">{quiz.title}</h3>
                        <div className="mt-3 flex flex-wrap gap-2 text-[9px] text-violet-100/55"><span className="rounded-lg bg-white/[.05] px-2 py-1"><Clock3 className="mr-1 inline h-3 w-3"/> {quiz.time_limit || 20} mins</span><span className="rounded-lg bg-white/[.05] px-2 py-1"><FileText className="mr-1 inline h-3 w-3"/> {quiz.questions?.length || 0} questions</span><span className="rounded-lg bg-white/[.05] px-2 py-1">Cutoff {quiz.cutoff || 50}%</span></div>
                        <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[.07] pt-3">
                          <button onClick={() => openWatermarkStudio(quiz, 'paper', attempt?.details)} className="rounded-lg border border-white/10 px-2.5 py-2 text-[9px] font-semibold text-violet-100/70 hover:bg-white/5"><FileText size={12} className="mr-1 inline"/> Paper PDF</button>
                          <button onClick={() => openWatermarkStudio(quiz, 'solution', attempt?.details)} className="rounded-lg border border-white/10 px-2.5 py-2 text-[9px] font-semibold text-violet-100/70 hover:bg-white/5">Answer key</button>
                          {attempt && <button onClick={() => router.push(`/quiz/${quiz.id}/result`)} className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-2 text-[9px] font-bold text-emerald-200">Score {attempt.score}%</button>}
                          <button onClick={() => router.push(`/quiz/${quiz.id}`)} className="ml-auto rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-2 text-[9px] font-bold text-white shadow-lg shadow-violet-950/30">{attempt ? <><RotateCcw size={12} className="mr-1 inline"/> Re-attempt</> : <><Play size={12} className="mr-1 inline"/> Start test</>}</button>
                        </div>
                      </article>;
                    })}
                  </div>}
                </div>
              ))
            }
          </section>
        )}
        <footer className="border-t border-white/[.06] pt-4 text-center text-[9px] tracking-[.12em] text-violet-100/25">CIVILVERSE INSTITUTIONAL TEST SERIES · PREPARE WITH PRECISION</footer>
      </div>
    </CivilverseShell>
  );
}
