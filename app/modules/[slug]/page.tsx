import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, BookOpen, Clock3, Layers3, Sparkles } from 'lucide-react';
import CivilverseShell from '@/components/CivilverseShell';

const modules: Record<string, { title: string; eyebrow: string; description: string; phase: string; capabilities: string[] }> = {
  classroom: { title: 'Live Classroom', eyebrow: 'Digital learning environment', description: 'A unified space for scheduled classes, recorded lectures, faculty resources and student discussion.', phase: 'Phase 2', capabilities: ['Class schedule and attendance', 'HLS-compatible lecture player', 'Lecture notes and downloadable resources'] },
  courses: { title: 'Courses', eyebrow: 'Structured learning paths', description: 'Syllabus-aligned courses that connect modules, lessons, assessments and learning progress.', phase: 'Phase 2', capabilities: ['GS and optional-subject curriculum', 'Lesson completion and enrollment', 'Faculty-led learning paths'] },
  'current-affairs': { title: 'Current Affairs Intelligence', eyebrow: 'Twelve syllabus-aligned modules', description: 'Examination-oriented current affairs with source traceability, background, facts and Prelims/Mains dimensions.', phase: 'Phase 3', capabilities: ['Date-wise and monthly archive', 'Prelims pointers and Mains analysis', 'Hindi and English editorial content'] },
  'daily-crux': { title: 'Daily Crux', eyebrow: 'Editorial intelligence', description: 'Transform important newspaper issues into concise, structured and answer-writing-ready learning material.', phase: 'Phase 3', capabilities: ['Issue background and core arguments', 'Constitutional and policy dimensions', 'Mains questions and answer frameworks'] },
  'pyq-explorer': { title: 'PYQ Explorer', eyebrow: 'Previous-year question intelligence', description: 'A verified question repository organized by examination, year, paper, subject and topic.', phase: 'Phase 3', capabilities: ['UPSC and State PCS filters', 'Verified source and answer metadata', 'Mains answer-writing workspace'] },
  'test-series': { title: 'Test Series', eyebrow: 'Examination simulator', description: 'A configurable test environment for full-length, sectional and topic-wise assessments.', phase: 'Phase 3', capabilities: ['Timed examination interface', 'Negative marking and review palette', 'Detailed result analysis'] },
  'ai-assistant': { title: 'AI Study Assistant', eyebrow: 'Your intelligent study companion', description: 'A source-aware assistant for concept explanations, revision, question generation and answer frameworks.', phase: 'Phase 4', capabilities: ['Explain and summarize learning material', 'Generate revision notes and practice', 'Separate verified sources from AI output'] },
  bookmarks: { title: 'Bookmarks', eyebrow: 'Your saved learning material', description: 'A single place for saved questions, articles, lessons and documents.', phase: 'Phase 4', capabilities: ['Unified saved-items view', 'Revision status and tags', 'Spaced-repetition review'] },
  'study-planner': { title: 'Study Planner', eyebrow: 'Plan with intention', description: 'Convert exam goals into daily study blocks, revision cycles and measurable weekly targets.', phase: 'Phase 4', capabilities: ['Daily and weekly timetable', 'Revision calendar and reminders', 'Pomodoro and consistency tracking'] },
  analytics: { title: 'Performance Analytics', eyebrow: 'Evidence-led preparation', description: 'Understand learning consistency, subject accuracy and topic mastery from your real activity.', phase: 'Phase 4', capabilities: ['Subject-wise accuracy and trends', 'Weak-topic identification', 'Progress and revision insights'] },
  settings: { title: 'Settings & Support', eyebrow: 'Account preferences', description: 'Manage account preferences, language, accessibility and support options.', phase: 'Phase 1 foundation', capabilities: ['Account and profile preferences', 'Language and accessibility', 'Help and support'] },
  profile: { title: 'My Profile', eyebrow: 'Your learning identity', description: 'Your exam goals and learning preferences will be managed here.', phase: 'Phase 1 foundation', capabilities: ['Profile information', 'Exam target and language', 'Learning preferences'] },
};

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const module = modules[slug] || { title: 'Learning Workspace', eyebrow: 'CIVILVERSE', description: 'This workspace is part of the CIVILVERSE learning ecosystem.', phase: 'Planned', capabilities: ['Structured learning experience', 'Connected student progress', 'Responsive learning interface'] };
  return <CivilverseShell><div className="mx-auto max-w-5xl">
    <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-[10px] font-semibold text-violet-200/70 hover:text-white"><ArrowLeft size={14}/> Back to overview</Link>
    <section className="cv-glass cv-card relative overflow-hidden p-6 sm:p-9">
      <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-[80px]"/>
      <div className="relative"><div className="cv-eyebrow">{module.eyebrow}</div><h1 className="font-display mt-3 text-3xl font-semibold tracking-[-.045em] sm:text-5xl">{module.title}</h1><p className="mt-4 max-w-2xl text-sm leading-7 cv-muted">{module.description}</p>
        <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1.5 text-[10px] font-bold text-violet-200"><Clock3 size={13}/> {module.phase}</div>
      </div>
    </section>
    <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_.72fr]">
      <section className="cv-glass cv-card p-5 sm:p-6"><div className="flex items-center gap-2"><Layers3 size={16} className="text-fuchsia-200"/><h2 className="text-sm font-bold">Workspace capabilities</h2></div><div className="mt-4 space-y-3">{module.capabilities.map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-white/[.07] bg-white/[.025] p-3"><span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-400/10 text-violet-200"><Sparkles size={13}/></span><span className="text-[11px] text-violet-50/80">{item}</span></div>)}</div></section>
      <aside className="cv-glass cv-card flex flex-col justify-between p-5 sm:p-6"><div><BookOpen size={19} className="text-violet-200"/><h2 className="mt-4 text-sm font-bold">Built in phases, not as a placeholder</h2><p className="mt-2 text-[10px] leading-6 cv-muted">This module is mapped into the product architecture. Its functional implementation will be connected to verified content and persistent records in its scheduled phase.</p></div><Link href="/dashboard" className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold text-violet-200">Return to command centre <ArrowUpRight size={13}/></Link></aside>
    </div>
  </div></CivilverseShell>;
}
