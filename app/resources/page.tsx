'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownToLine, ArrowLeft, ArrowRight, ArrowUpRight, Bookmark,
  BookOpen, Check, ChevronDown, ChevronRight, Clock3, FileText,
  Filter, FolderOpen, Globe2, Landmark, Leaf, LibraryBig, Lightbulb,
  Loader2, Microscope, Newspaper, Search, Scale, Sparkles, TrendingUp,
  X, Calculator, History,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { FALLBACK_RESOURCES } from '@/lib/mockData';
import CivilverseShell from '@/components/CivilverseShell';

interface Resource {
  id: string;
  title: string;
  file_type: string;
  file_url: string;
  category: string;
  section: string;
  created_at?: string;
}

const SUBJECTS = [
  { id: 'Polity', group: 'GS PAPER II', icon: Scale, tone: 'violet', description: 'Constitution, governance & institutions' },
  { id: 'History', group: 'GS PAPER I', icon: Landmark, tone: 'amber', description: 'Ancient, medieval & modern India' },
  { id: 'Geography', group: 'GS PAPER I', icon: Globe2, tone: 'blue', description: 'Physical, Indian & human geography' },
  { id: 'Economy', group: 'GS PAPER III', icon: TrendingUp, tone: 'green', description: 'Growth, banking & public finance' },
  { id: 'Environment', group: 'GS PAPER III', icon: Leaf, tone: 'mint', description: 'Ecology, climate & biodiversity' },
  { id: 'Science & Tech', group: 'GS PAPER III', icon: Microscope, tone: 'cyan', description: 'Emerging technologies & innovation' },
  { id: 'Current Affairs', group: 'EDITORIAL DESK', icon: Newspaper, tone: 'rose', description: 'PIB, PRS, newspapers & monthly reviews' },
  { id: 'Maths', group: 'CSAT NUMERACY', icon: Calculator, tone: 'orange', description: 'Quantitative aptitude & practice' },
  { id: 'Reasoning', group: 'CSAT LOGIC', icon: Lightbulb, tone: 'purple', description: 'Analytical and logical reasoning' },
] as const;

const TONE: Record<string, { icon: string; glow: string; line: string; tag: string }> = {
  violet: { icon: 'text-violet-200 bg-violet-400/10 border-violet-300/15', glow: 'from-violet-500/15', line: 'group-hover:border-violet-300/35', tag: 'text-violet-200 bg-violet-300/10' },
  amber: { icon: 'text-amber-200 bg-amber-400/10 border-amber-300/15', glow: 'from-amber-500/10', line: 'group-hover:border-amber-300/30', tag: 'text-amber-100 bg-amber-300/10' },
  blue: { icon: 'text-sky-200 bg-sky-400/10 border-sky-300/15', glow: 'from-sky-500/10', line: 'group-hover:border-sky-300/30', tag: 'text-sky-100 bg-sky-300/10' },
  green: { icon: 'text-emerald-200 bg-emerald-400/10 border-emerald-300/15', glow: 'from-emerald-500/10', line: 'group-hover:border-emerald-300/30', tag: 'text-emerald-100 bg-emerald-300/10' },
  mint: { icon: 'text-teal-200 bg-teal-400/10 border-teal-300/15', glow: 'from-teal-500/10', line: 'group-hover:border-teal-300/30', tag: 'text-teal-100 bg-teal-300/10' },
  cyan: { icon: 'text-cyan-200 bg-cyan-400/10 border-cyan-300/15', glow: 'from-cyan-500/10', line: 'group-hover:border-cyan-300/30', tag: 'text-cyan-100 bg-cyan-300/10' },
  rose: { icon: 'text-rose-200 bg-rose-400/10 border-rose-300/15', glow: 'from-rose-500/10', line: 'group-hover:border-rose-300/30', tag: 'text-rose-100 bg-rose-300/10' },
  orange: { icon: 'text-orange-200 bg-orange-400/10 border-orange-300/15', glow: 'from-orange-500/10', line: 'group-hover:border-orange-300/30', tag: 'text-orange-100 bg-orange-300/10' },
  purple: { icon: 'text-fuchsia-200 bg-fuchsia-400/10 border-fuchsia-300/15', glow: 'from-fuchsia-500/10', line: 'group-hover:border-fuchsia-300/30', tag: 'text-fuchsia-100 bg-fuchsia-300/10' },
};

export default function StudentResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'pdf' | 'links'>('all');

  useEffect(() => {
    let alive = true;
    async function loadResources() {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (alive) setResources((data?.length ? data : FALLBACK_RESOURCES) as Resource[]);
      } catch {
        if (alive) {
          setResources(FALLBACK_RESOURCES as Resource[]);
          setLoadError('Showing the available local resource catalogue. Connect the library database to sync live uploads.');
        }
      } finally {
        if (alive) setLoading(false);
      }
    }
    loadResources();
    return () => { alive = false; };
  }, []);

  const counts = useMemo(() => {
    return SUBJECTS.reduce((acc, subject) => {
      acc[subject.id] = resources.filter((resource) => resource.category === subject.id).length;
      return acc;
    }, {} as Record<string, number>);
  }, [resources]);

  const totalDocuments = resources.length;
  const filteredResources = useMemo(() => resources.filter((resource) => {
    const matchesSubject = !activeSubject || resource.category === activeSubject;
    const haystack = `${resource.title} ${resource.category} ${resource.section} ${resource.file_type}`.toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    const type = (resource.file_type || '').toLowerCase();
    const matchesType = filter === 'all' || (filter === 'pdf' ? type.includes('pdf') : !type.includes('pdf'));
    return matchesSubject && matchesQuery && matchesType;
  }), [resources, activeSubject, query, filter]);

  const groupedResources = useMemo(() => filteredResources.reduce((acc, resource) => {
    const section = resource.section?.trim() && resource.section !== resource.category
      ? resource.section
      : 'Core reference materials';
    (acc[section] ||= []).push(resource);
    return acc;
  }, {} as Record<string, Resource[]>), [filteredResources]);

  const toggleSaved = (id: string) => {
    setSavedIds((current) => current.includes(id) ? current.filter((saved) => saved !== id) : [...current, id]);
  };

  const activeConfig = SUBJECTS.find((subject) => subject.id === activeSubject);

  if (loading) {
    return <CivilverseShell><div className="flex min-h-[65vh] items-center justify-center"><div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] px-5 py-4 text-sm text-violet-100/70"><Loader2 className="h-5 w-5 animate-spin text-violet-300"/>Opening your knowledge vault…</div></div></CivilverseShell>;
  }

  return (
    <CivilverseShell>
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="cv-eyebrow flex items-center gap-2"><LibraryBig size={13}/> CIVILVERSE / KNOWLEDGE SYSTEM</div>
            <h1 className="font-display text-3xl font-bold tracking-[-.045em] sm:text-4xl">
              {activeSubject ? <><span className="text-white/55">Vault / </span><span className="cv-gradient-text">{activeSubject}</span></> : <>Digital <span className="cv-gradient-text">Reference Vault.</span></>}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-violet-100/55">
              {activeSubject ? `Curated study material and reference documents for ${activeSubject}.` : 'A considered home for your books, government reports, class notes and exam-ready references.'}
            </p>
          </div>
          {activeSubject && <button onClick={() => { setActiveSubject(null); setQuery(''); setFilter('all'); }} className="cv-button cv-button-secondary"><ArrowLeft size={14}/> All collections</button>}
        </header>

        {!activeSubject && (
          <>
            <section className="relative isolate overflow-hidden rounded-[26px] border border-violet-200/15 bg-[#151027]/90 p-5 shadow-[0_24px_80px_rgba(0,0,0,.3)] sm:p-7">
              <div className="pointer-events-none absolute -right-16 -top-28 -z-10 h-80 w-80 rounded-full bg-violet-600/20 blur-[90px]"/>
              <div className="pointer-events-none absolute -bottom-32 right-1/4 -z-10 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-[85px]"/>
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="max-w-xl space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/15 bg-violet-300/[.08] px-3 py-1.5 text-[9px] font-bold tracking-[.16em] text-violet-100"><Sparkles size={12}/> YOUR EXAM KNOWLEDGE, ORGANIZED</div>
                  <h2 className="font-display text-3xl font-semibold leading-[1.08] tracking-[-.045em] sm:text-[42px]">Make every page<br/><span className="cv-gradient-text">count towards your goal.</span></h2>
                  <p className="max-w-lg text-xs leading-6 text-violet-100/55 sm:text-sm">Find the right reference, return to your reading and keep your preparation connected to the syllabus.</p>
                </div>
                <div className="hidden h-28 w-28 items-center justify-center rounded-[28px] border border-violet-200/15 bg-gradient-to-br from-violet-400/15 to-fuchsia-400/[.06] shadow-[inset_0_1px_rgba(255,255,255,.12),0_20px_50px_rgba(0,0,0,.25)] sm:flex">
                  <BookOpen size={43} strokeWidth={1.15} className="text-violet-100"/>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 focus-within:border-violet-300/40 focus-within:ring-2 focus-within:ring-violet-400/10">
                  <Search size={17} className="shrink-0 text-violet-200/60"/>
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, subjects, reports…" className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-violet-100/35"/>
                  {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={15} className="text-violet-100/50"/></button>}
                  <kbd className="hidden rounded-md border border-white/10 px-1.5 py-1 text-[9px] text-violet-100/40 sm:inline">SEARCH</kbd>
                </label>
                <button onClick={() => { setActiveSubject(null); setFilter(filter === 'all' ? 'pdf' : filter === 'pdf' ? 'links' : 'all'); }} className="cv-button cv-button-secondary"><Filter size={14}/>{filter === 'all' ? 'All formats' : filter === 'pdf' ? 'PDF only' : 'External links'}<ChevronDown size={13}/></button>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/[.08] pt-4">
                <div><div className="font-display text-2xl font-bold tracking-tight text-white">{SUBJECTS.length.toString().padStart(2, '0')}</div><div className="mt-0.5 text-[9px] uppercase tracking-[.15em] text-violet-100/40">Subject vaults</div></div>
                <div className="h-8 w-px bg-white/10"/>
                <div><div className="font-display text-2xl font-bold tracking-tight text-white">{totalDocuments.toString().padStart(2, '0')}</div><div className="mt-0.5 text-[9px] uppercase tracking-[.15em] text-violet-100/40">Available resources</div></div>
                <div className="h-8 w-px bg-white/10"/>
                <div><div className="font-display text-2xl font-bold tracking-tight text-white">{savedIds.length.toString().padStart(2, '0')}</div><div className="mt-0.5 text-[9px] uppercase tracking-[.15em] text-violet-100/40">Saved this session</div></div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-end justify-between gap-3">
                <div><div className="cv-eyebrow">Browse the syllabus</div><h2 className="mt-1 font-display text-xl font-semibold tracking-tight">Subject collections</h2></div>
                <span className="text-[10px] text-violet-100/40">{SUBJECTS.length} collections <ArrowDownToLine className="ml-1 inline h-3 w-3 rotate-[-45deg]"/></span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                {SUBJECTS.map((subject, index) => {
                  const Icon = subject.icon;
                  const tone = TONE[subject.tone];
                  const count = counts[subject.id] || 0;
                  return (
                    <button key={subject.id} onClick={() => { setActiveSubject(subject.id); setQuery(''); setFilter('all'); }} className={`group relative isolate min-h-[166px] overflow-hidden rounded-[21px] border border-white/[.09] bg-[#151126]/85 p-4 text-left shadow-[0_12px_38px_rgba(0,0,0,.16)] transition duration-200 hover:-translate-y-1 hover:bg-[#1a1430] ${tone.line} ${index === 0 ? 'col-span-2 sm:col-span-1' : ''}`}>
                      <div className={`pointer-events-none absolute -right-12 -top-14 -z-10 h-36 w-36 rounded-full bg-gradient-to-br ${tone.glow} to-transparent blur-2xl opacity-90 transition group-hover:scale-125`}/>
                      <div className="flex items-start justify-between gap-2">
                        <span className={`grid h-11 w-11 place-items-center rounded-[15px] border ${tone.icon}`}><Icon size={21} strokeWidth={1.65}/></span>
                        <span className={`max-w-[55%] rounded-full px-2 py-1 text-[8px] font-bold tracking-[.08em] ${tone.tag}`}>{subject.group}</span>
                      </div>
                      <div className="mt-5">
                        <h3 className="font-display text-[15px] font-semibold tracking-tight text-white sm:text-base">{subject.id}</h3>
                        <p className="mt-1 line-clamp-2 min-h-8 text-[10px] leading-4 text-violet-100/45">{subject.description}</p>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-white/[.07] pt-3">
                        <span className="text-[10px] text-violet-100/55">{count} {count === 1 ? 'resource' : 'resources'}</span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-violet-200 transition group-hover:gap-2">Explore <ArrowUpRight size={13}/></span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
              <div className="cv-glass rounded-[21px] p-4 sm:p-5">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.13em] text-rose-200"><Newspaper size={14}/> Editorial desk</div>
                <h3 className="mt-3 font-display text-lg font-semibold">Current affairs & publications</h3>
                <p className="mt-1 text-[11px] leading-5 text-violet-100/50">PIB releases, PRS briefs, newspaper references and monthly compilations.</p>
                <button onClick={() => setActiveSubject('Current Affairs')} className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold text-rose-200">Open editorial collection <ArrowRight size={13}/></button>
              </div>
              <div className="cv-glass rounded-[21px] p-4 sm:p-5">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.13em] text-violet-200"><Bookmark size={14}/> Personal shelf</div>
                <h3 className="mt-3 font-display text-lg font-semibold">Saved for later</h3>
                <p className="mt-1 text-[11px] leading-5 text-violet-100/50">Keep important references close while you study.</p>
                <div className="mt-4 text-[10px] font-bold text-violet-200">{savedIds.length} saved in this session</div>
              </div>
            </section>
          </>
        )}

        {activeSubject && (
          <section className="space-y-5">
            <div className="cv-glass flex flex-wrap items-center gap-3 rounded-[22px] p-4 sm:p-5">
              <div className={`grid h-12 w-12 place-items-center rounded-2xl border ${TONE[activeConfig?.tone || 'violet'].icon}`}>
                {activeConfig && <activeConfig.icon size={23}/>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="cv-eyebrow">{activeConfig?.group || 'SUBJECT COLLECTION'}</div>
                <h2 className="mt-1 font-display text-lg font-semibold">{activeSubject} resources</h2>
                <p className="mt-0.5 text-[10px] text-violet-100/45">{counts[activeSubject] || 0} resources in this collection</p>
              </div>
              <div className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 sm:w-auto sm:min-w-[260px]">
                <Search size={15} className="text-violet-200/50"/>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${activeSubject}…`} className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-violet-100/30"/>
                {query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={14}/></button>}
              </div>
              <select aria-label="Filter resource format" value={filter} onChange={(event) => setFilter(event.target.value as 'all' | 'pdf' | 'links')} className="rounded-xl border border-white/10 bg-[#171129] px-3 py-2.5 text-[10px] text-violet-100/75 outline-none">
                <option value="all">All formats</option><option value="pdf">PDF documents</option><option value="links">External links</option>
              </select>
            </div>

            {Object.keys(groupedResources).length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-violet-200/15 bg-white/[.025] px-5 py-14 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[.04] text-violet-200/60"><FolderOpen size={25}/></div>
                <h3 className="mt-4 font-display text-lg font-semibold">No matching resources yet</h3>
                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-violet-100/45">Try another search or format. New materials added to this subject will appear here.</p>
                <button onClick={() => { setQuery(''); setFilter('all'); }} className="cv-button cv-button-secondary mt-4">Clear filters</button>
              </div>
            ) : Object.entries(groupedResources).map(([section, items]) => (
              <div key={section} className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/[.07] pb-2">
                  <div className="flex items-center gap-2"><FolderOpen size={14} className="text-violet-200/65"/><h3 className="text-xs font-semibold text-violet-50/85">{section}</h3></div>
                  <span className="text-[9px] text-violet-100/35">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {items.map((resource) => {
                    const isPdf = (resource.file_type || '').toLowerCase().includes('pdf');
                    const saved = savedIds.includes(resource.id);
                    return (
                      <article key={resource.id} className="group flex min-w-0 items-center gap-3 rounded-[19px] border border-white/[.08] bg-[#151126]/80 p-3.5 transition hover:border-violet-200/25 hover:bg-[#1a1430]">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] border border-violet-200/10 bg-violet-400/[.09] text-violet-200"><FileText size={20}/></div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-xs font-semibold text-white/90">{resource.title}</h4>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-wider text-violet-100/40"><span>{resource.file_type || 'Reference'}</span><span>·</span><span>{resource.category}</span></div>
                        </div>
                        <button onClick={() => toggleSaved(resource.id)} aria-label={saved ? 'Remove bookmark' : 'Bookmark resource'} className={`rounded-lg p-2 transition ${saved ? 'text-fuchsia-200 bg-fuchsia-300/10' : 'text-violet-100/35 hover:text-violet-100'}`}><Bookmark size={15} fill={saved ? 'currentColor' : 'none'}/></button>
                        <a href={resource.file_url} target="_blank" rel="noopener noreferrer" aria-label={isPdf ? 'Open document' : 'Open resource link'} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-violet-950/30 transition hover:scale-105">{isPdf ? <ArrowDownToLine size={15}/> : <ArrowUpRight size={15}/>}</a>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        )}
        {loadError && <p role="status" className="rounded-xl border border-amber-300/15 bg-amber-300/[.06] px-4 py-3 text-[10px] leading-5 text-amber-100/70">{loadError}</p>}
        <footer className="border-t border-white/[.06] pt-4 text-center text-[9px] tracking-[.08em] text-violet-100/25">CIVILVERSE KNOWLEDGE SYSTEM · LEARN WITH INTENT</footer>
      </div>
    </CivilverseShell>
  );
}
