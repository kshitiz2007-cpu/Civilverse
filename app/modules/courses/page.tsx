'use client';

import Link from 'next/link';
import CivilverseShell from '@/components/CivilverseShell';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, CheckCircle2,
  Clock3, GraduationCap, Layers3, Network, Play, ShieldCheck,
  Sparkles, Target, Users, Library, FileQuestion,
} from 'lucide-react';

const tracks = [
  {
    title: 'UPSC CSE',
    subtitle: 'Prelims · Mains · Interview',
    description: 'A connected path from foundational concepts to examination-ready practice.',
    href: '/quizzes',
    action: 'Explore practice',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1100&q=88',
    tone: 'from-fuchsia-700/50 via-violet-950/25',
    icon: Target,
    tag: 'CIVIL SERVICES',
  },
  {
    title: 'General Studies (GS)',
    subtitle: 'Complete GS Foundation & Advanced',
    description: 'Build subject depth across polity, history, geography, economy and more.',
    href: '/resources',
    action: 'Explore resources',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1100&q=88',
    tone: 'from-blue-700/45 via-indigo-950/30',
    icon: Layers3,
    tag: 'GS FOUNDATION',
  },
  {
    title: 'Optional Subjects',
    subtitle: 'Subject-wise in-depth preparation',
    description: 'A focused workspace for optional learning, faculty guidance and revision.',
    href: '/modules/classroom',
    action: 'Explore classroom',
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1100&q=88',
    tone: 'from-violet-700/45 via-fuchsia-950/30',
    icon: BookOpen,
    tag: 'SPECIALISED LEARNING',
  },
];

const capabilities = [
  { title: 'GS and optional-subject curriculum', icon: Network, detail: 'Organise preparation around the syllabus.' },
  { title: 'Lesson completion and enrollment', icon: Users, detail: 'Continue learning across connected spaces.' },
  { title: 'Faculty-led learning paths', icon: GraduationCap, detail: 'Connect classroom sessions with study.' },
];

export default function CoursesPage() {
  return (
    <CivilverseShell>
      <main className="mx-auto max-w-[1180px] space-y-5 pb-8 sm:space-y-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 px-1 text-[11px] font-semibold text-violet-200/75 transition hover:text-white">
          <ArrowLeft size={15}/> Back to overview
        </Link>

        <section className="cv-courses-hero relative isolate overflow-hidden rounded-[27px] border border-fuchsia-200/20 bg-[#170c29] px-5 py-7 shadow-[0_22px_70px_rgba(0,0,0,.36)] sm:min-h-[270px] sm:px-8 sm:py-8">
          <div className="absolute inset-0 -z-20 bg-cover bg-[center_42%] opacity-80" style={{backgroundImage:'url("https://images.unsplash.com/photo-1548013146-72479768bada?w=1500&q=90")'}}/>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#13091f] via-[#180d2b]/95 to-[#1b0b2c]/30"/>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#170b27]/80 via-transparent to-[#170b27]/10"/>
          <div className="pointer-events-none absolute -bottom-24 left-1/4 -z-10 h-48 w-3/4 rounded-full bg-fuchsia-500/25 blur-[65px]"/>
          <div className="relative max-w-[590px]">
            <div className="cv-eyebrow flex items-center gap-2 text-fuchsia-200"><Sparkles size={13}/> STRUCTURED LEARNING PATHS</div>
            <h1 className="mt-3 font-display text-[clamp(34px,5vw,54px)] font-bold leading-[1.02] tracking-[-.055em] text-white">Courses</h1>
            <p className="mt-3 max-w-[490px] text-[13px] leading-6 text-violet-50/80 sm:text-base sm:leading-7">
              Syllabus-aligned courses that connect modules, lessons, assessments and learning progress.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-fuchsia-200/20 bg-violet-950/45 px-4 py-2 text-[10px] font-bold text-violet-100 shadow-[inset_0_1px_rgba(255,255,255,.12)] backdrop-blur-xl">
              <Clock3 size={14} className="text-fuchsia-200"/> PHASE 2 · LEARNING PATHS
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-1 right-0 hidden h-1 w-full bg-gradient-to-r from-transparent via-fuchsia-400/80 to-violet-400/70 blur-[2px] sm:block"/>
        </section>

        <section aria-label="Course overview" className="grid grid-cols-3 gap-2.5 sm:gap-4">
          <div className="cv-glass flex min-w-0 items-center gap-2.5 rounded-[19px] p-3 sm:gap-3 sm:p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-fuchsia-200/15 bg-fuchsia-500/10 text-fuchsia-200 sm:h-12 sm:w-12"><BookOpen size={21}/></span>
            <span className="min-w-0"><strong className="block font-display text-xl font-bold leading-none sm:text-2xl">03</strong><span className="mt-1 block text-[9px] leading-tight text-violet-100/65 sm:text-[11px]">Course tracks</span></span>
          </div>
          <div className="cv-glass flex min-w-0 items-center gap-2.5 rounded-[19px] p-3 sm:gap-3 sm:p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-200/15 bg-violet-500/10 text-violet-200 sm:h-12 sm:w-12"><Play size={20}/></span>
            <span className="min-w-0"><strong className="block font-display text-xl font-bold leading-none sm:text-2xl">03</strong><span className="mt-1 block text-[9px] leading-tight text-violet-100/65 sm:text-[11px]">Learning spaces</span></span>
          </div>
          <div className="cv-glass flex min-w-0 items-center gap-2.5 rounded-[19px] p-3 sm:gap-3 sm:p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-pink-200/15 bg-pink-500/10 text-pink-200 sm:h-12 sm:w-12"><Target size={20}/></span>
            <span className="min-w-0"><strong className="block font-display text-xl font-bold leading-none sm:text-2xl">01</strong><span className="mt-1 block text-[9px] leading-tight text-violet-100/65 sm:text-[11px]">Exam focus</span></span>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3 px-1">
            <div><div className="cv-eyebrow">Choose your direction</div><h2 className="mt-1 font-display text-xl font-bold tracking-tight sm:text-2xl">Explore Course Tracks</h2></div>
            <span className="hidden items-center gap-1 text-[11px] font-semibold text-violet-200/70 sm:inline-flex">3 pathways <ArrowRight size={13}/></span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {tracks.map((track) => {
              const Icon = track.icon;
              return <article key={track.title} className="group relative isolate flex min-h-[235px] flex-col overflow-hidden rounded-[23px] border border-white/[.12] bg-[#1a102b] p-4 shadow-[0_15px_42px_rgba(0,0,0,.28)] transition duration-300 hover:-translate-y-1 hover:border-fuchsia-200/30 sm:min-h-[265px] sm:p-5">
                <div className="absolute inset-0 -z-20 bg-cover bg-center transition duration-700 group-hover:scale-105" style={{backgroundImage:`url("${track.image}")`}}/>
                <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${track.tone} to-[#11091e]/90`}/>
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#10091d] via-[#10091d]/65 to-[#10091d]/10"/>
                <div className="flex items-start justify-between gap-2">
                  <span className="grid h-11 w-11 place-items-center rounded-[15px] border border-white/15 bg-violet-950/45 text-white shadow-lg backdrop-blur-lg"><Icon size={22}/></span>
                  <span className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1.5 text-[8px] font-bold tracking-[.12em] text-white/75 backdrop-blur-lg">{track.tag}</span>
                </div>
                <div className="mt-auto pt-8">
                  <h3 className="font-display text-[20px] font-bold leading-tight tracking-tight text-white">{track.title}</h3>
                  <p className="mt-1.5 max-w-[250px] text-[11px] leading-[1.45] text-white/80">{track.subtitle}</p>
                  <p className="mt-2 hidden max-w-[290px] text-[10px] leading-5 text-white/60 sm:block">{track.description}</p>
                  <Link href={track.href} className="mt-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-100/20 bg-gradient-to-r from-violet-500/85 via-fuchsia-500/85 to-pink-500/85 px-4 py-2.5 text-[10px] font-bold text-white shadow-[0_6px_22px_rgba(192,38,211,.24)] transition hover:brightness-110">
                    {track.action} <ArrowRight size={13}/>
                  </Link>
                </div>
              </article>;
            })}
          </div>
        </section>

        <section className="cv-glass rounded-[24px] p-4 shadow-[0_15px_45px_rgba(0,0,0,.22)] sm:p-5">
          <div className="mb-4 flex items-center gap-3 px-1"><span className="grid h-9 w-9 place-items-center rounded-xl border border-violet-200/15 bg-violet-400/10 text-violet-200"><Layers3 size={19}/></span><h2 className="font-display text-base font-bold sm:text-lg">Workspace capabilities</h2></div>
          <div className="grid gap-2.5 sm:grid-cols-3 sm:gap-3">
            {capabilities.map((capability) => {
              const Icon = capability.icon;
              return <div key={capability.title} className="flex items-center gap-3 rounded-[17px] border border-white/[.08] bg-white/[.035] p-3.5 sm:min-h-[112px] sm:flex-col sm:justify-center sm:text-center sm:p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-fuchsia-200/15 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/15 text-fuchsia-200"><Icon size={19}/></span>
                <span><strong className="block text-[11px] font-semibold leading-5 text-white/90">{capability.title}</strong><span className="mt-0.5 hidden text-[9px] leading-4 text-violet-100/45 sm:block">{capability.detail}</span></span>
              </div>;
            })}
          </div>
        </section>

        <section className="relative isolate overflow-hidden rounded-[24px] border border-violet-200/15 bg-gradient-to-r from-[#211033] via-[#1b102d] to-[#29103a] p-4 shadow-[0_15px_45px_rgba(0,0,0,.25)] sm:p-5">
          <div className="pointer-events-none absolute -right-5 -top-16 -z-10 h-56 w-64 rounded-full bg-fuchsia-500/20 blur-[65px]"/>
          <div className="flex items-start gap-3 sm:items-center sm:gap-5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-fuchsia-200/20 bg-fuchsia-400/10 text-fuchsia-200 sm:h-14 sm:w-14"><ShieldCheck size={27}/></span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-base font-bold sm:text-lg">Built in phases, not as a placeholder</h2>
              <p className="mt-1 max-w-3xl text-[10px] leading-5 text-violet-100/60 sm:text-xs">The course pathways connect to the currently available practice, reference-library and classroom spaces. Enrollments, lesson tracking and a persistent course catalogue will be added with the Phase 2 learning backend.</p>
            </div>
            <div className="hidden shrink-0 text-fuchsia-200/60 sm:block"><CheckCircle2 size={30}/></div>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-2">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-[11px] font-bold text-violet-200 hover:text-white">Return to command centre <ArrowUpRight size={14}/></Link>
          <div className="flex items-center gap-2 text-[9px] tracking-[.12em] text-violet-100/30"><Sparkles size={12}/> CIVILVERSE LEARNING PATHS</div>
        </div>
      </main>
    </CivilverseShell>
  );
}
