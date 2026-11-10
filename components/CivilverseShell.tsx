'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Activity, Aperture, ArrowUpRight, Bell, BookOpen, Bookmark, BrainCircuit,
  CalendarDays, ChevronDown, CircleHelp, Command, FileQuestion, GraduationCap,
  LayoutDashboard, Library, Menu, Newspaper, NotebookPen, Search, Settings2,
  ShieldCheck, Sparkles, Target, Trophy, X, Zap,
} from 'lucide-react';

type NavItem = { label: string; href: string; icon: React.ElementType };
const primary: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Live Classroom', href: '/modules/classroom', icon: GraduationCap },
  { label: 'Courses', href: '/modules/courses', icon: BookOpen },
  { label: 'Current Affairs', href: '/modules/current-affairs', icon: Newspaper },
  { label: 'Daily Crux', href: '/modules/daily-crux', icon: NotebookPen },
  { label: 'Daily Drill', href: '/quizzes', icon: Zap },
  { label: 'Practice & Quiz', href: '/quizzes', icon: FileQuestion },
  { label: 'PYQ Explorer', href: '/modules/pyq-explorer', icon: Target },
  { label: 'Digital Library', href: '/resources', icon: Library },
  { label: 'Test Series', href: '/modules/test-series', icon: Trophy },
  { label: 'AI Study Assistant', href: '/modules/ai-assistant', icon: BrainCircuit },
];
const secondary: NavItem[] = [
  { label: 'Analytics', href: '/history', icon: Activity },
  { label: 'Bookmarks', href: '/modules/bookmarks', icon: Bookmark },
  { label: 'Study Planner', href: '/modules/study-planner', icon: CalendarDays },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return <>
    <div className="mb-2 px-3 pt-5 cv-eyebrow">Learning space</div>
    {primary.map((item) => {
      const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
      const Icon = item.icon;
      return <Link key={item.label} href={item.href} onClick={onNavigate} className={`cv-nav-item ${active ? 'active' : ''}`}><Icon size={16} strokeWidth={1.8}/><span className="flex-1">{item.label}</span>{item.label === 'Live Classroom' && <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_10px_#fb7185]"/>}</Link>;
    })}
    <div className="mb-2 px-3 pt-6 cv-eyebrow">Your progress</div>
    {secondary.map((item) => { const Icon = item.icon; const active = pathname === item.href; return <Link key={item.label} href={item.href} onClick={onNavigate} className={`cv-nav-item ${active ? 'active' : ''}`}><Icon size={16} strokeWidth={1.8}/>{item.label}</Link>; })}
  </>;
}

export default function CivilverseShell({ children }: { children: React.ReactNode }) {
  const [drawer, setDrawer] = useState(false);
  const pathname = usePathname();
  return <div className="cv-app">
    <div className="cv-orb cv-orb-one"/><div className="cv-orb cv-orb-two"/>
    <div className="cv-shell">
      <aside className="cv-sidebar">
        <Link href="/dashboard" className="flex items-center gap-3 px-2 pb-5 border-b border-white/[.07]">
          <span className="cv-brand-mark"><Aperture size={21}/></span>
          <span><span className="font-display block text-[17px] font-bold tracking-[.12em]">CIVILVERSE</span><span className="block text-[9px] tracking-[.17em] text-violet-200/55">LEARNING OS</span></span>
        </Link>
        <nav className="flex-1 overflow-y-auto pt-1"><NavLinks/></nav>
        <div className="cv-glass rounded-2xl p-3 mt-5">
          <div className="flex items-center gap-2 text-xs font-semibold"><Sparkles size={14} className="text-fuchsia-300"/> Civilverse Pro</div>
          <p className="mt-1.5 text-[10px] leading-relaxed cv-muted">Your preparation, structured around the syllabus.</p>
          <Link href="/modules/ai-assistant" className="mt-3 flex items-center justify-between text-[10px] font-bold text-violet-200">Explore workspace <ArrowUpRight size={13}/></Link>
        </div>
        <Link href="/modules/settings" className="cv-nav-item mt-3"><Settings2 size={16}/> Settings & support</Link>
      </aside>

      <main className="cv-main">
        <header className="cv-topbar">
          <div className="flex min-w-0 items-center gap-3">
            <button className="md:hidden cv-glass rounded-xl p-2" aria-label="Open navigation" onClick={() => setDrawer(true)}><Menu size={18}/></button>
            <div className="cv-search"><Search size={15}/><input aria-label="Search Civilverse" placeholder="Search lessons, topics, PYQs..."/><span className="hidden sm:inline rounded-md border border-white/10 px-1.5 py-0.5 text-[9px]">⌘ K</span></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden lg:block text-[10px] text-violet-100/50">UPSC CSE · 2027</span>
            <button aria-label="Notifications" className="cv-glass relative rounded-xl p-2.5 text-violet-100/80"><Bell size={16}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-fuchsia-400"/></button>
            <Link href="/modules/profile" className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] p-1.5 pr-3"><span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[10px] font-bold">CV</span><span className="hidden sm:block text-[10px] font-semibold">My profile</span><ChevronDown size={13} className="hidden sm:block text-violet-200/60"/></Link>
          </div>
        </header>
        {children}
      </main>
    </div>
    <nav className="cv-mobile-nav" aria-label="Mobile navigation">
      <Link href="/dashboard" className={pathname==='/dashboard'?'active':''}><LayoutDashboard size={18}/>Home</Link>
      <Link href="/quizzes" className={pathname==='/quizzes'?'active':''}><Zap size={18}/>Drill</Link>
      <Link href="/modules/ai-assistant" aria-label="AI Study Assistant" className="cv-mobile-ai"><Sparkles size={21}/></Link>
      <Link href="/resources" className={pathname==='/resources'?'active':''}><Library size={18}/>Library</Link>
      <Link href="/history" className={pathname==='/history'?'active':''}><Activity size={18}/>Progress</Link>
    </nav>
    <div className={`cv-mobile-drawer ${drawer?'open':''}`} onClick={() => setDrawer(false)}>
      <div className="cv-mobile-drawer-panel" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4"><div className="flex items-center gap-3"><span className="cv-brand-mark"><Aperture size={20}/></span><span className="font-display font-bold tracking-[.12em]">CIVILVERSE</span></div><button aria-label="Close navigation" onClick={()=>setDrawer(false)}><X size={19}/></button></div>
        <nav className="pt-2"><NavLinks onNavigate={()=>setDrawer(false)}/></nav>
      </div>
    </div>
  </div>;
}
