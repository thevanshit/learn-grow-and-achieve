import { useState, useEffect } from 'react';
import api from '../api.js';
import { PageHeader, ProgressBar, CountUp, StatCard } from '../components/ui.jsx';
import { IconSparkles, IconCalendar, IconTarget, IconZap, IconFlag, IconRocket, IconClock } from '../components/Icons.jsx';

const ROADMAP = [
  { key: 'start', label: 'Roadmap starts', date: '2026-08-08', desc: 'Day one. Batch 1 kicks off with Git and math foundations.' },
  { key: 'org_list', label: 'Org list announced', date: '2027-02-08', desc: 'Organizations go live. Shortlist 3–5 orgs and dig into their codebases.' },
  { key: 'apps_open', label: 'Applications open', date: '2027-03-01', desc: 'Proposal writing window opens. Start drafting early.' },
  { key: 'proposal', label: 'Proposal deadline', date: '2027-03-20', desc: 'Submit your proposal. Get mentors to review it before you hit send.' },
  { key: 'results', label: 'Results announced', date: '2027-04-30', desc: 'Accepted? Pre-coding period and community bonding start.' },
  { key: 'coding', label: 'Coding period begins', date: '2027-05-17', desc: 'Code, commit, and check in with your mentor every week.' },
  { key: 'midterm', label: 'Midterm evaluations', date: '2027-07-13', desc: 'First evaluation. Halfway point — keep the momentum.' },
  { key: 'final', label: 'Final evaluations', date: '2027-08-23', desc: 'Ship your project. Celebrate. You earned it.' },
];

const PHASES = [
  { key: 'foundation', title: 'Foundation', weeks: 'Weeks 1–11', range: [1, 11], desc: 'Python, ML, LLMs, transformers — the base everything else stands on.', color: '#6366f1' },
  { key: 'project', title: 'Project-ready', weeks: 'Weeks 12–22', range: [12, 22], desc: 'Agents, RAG, evals, multimodal — real code, real tools.', color: '#8b5cf6' },
  { key: 'sprint', title: 'GSoC sprint', weeks: 'Weeks 23–40', range: [23, 40], desc: 'Systems, MLOps, interviews — the final push before proposals.', color: '#10b981' },
];

const WEEK_TO_BATCH = [
  { range: [1, 4], batch: 1, title: 'Git & Math Foundations' },
  { range: [5, 7], batch: 3, title: 'ML/DL Core' },
  { range: [8, 11], batch: 4, title: 'Transformers & LLM Internals' },
  { range: [12, 15], batch: 5, title: 'LLM Application Engineering' },
  { range: [16, 19], batch: 6, title: 'Agents, MCP, Evals & Ops' },
  { range: [20, 22], batch: 7, title: 'Multimodal & Advanced AI' },
  { range: [23, 24], batch: 8, title: 'CS Fundamentals' },
  { range: [25, 29], batch: 9, title: 'Backend, Databases & Data' },
  { range: [30, 34], batch: 10, title: 'MLOps, DevOps & Cloud' },
  { range: [35, 40], batch: 11, title: 'System Design & Interviews' },
];

export default function Timeline() {
  const [stats, setStats] = useState(null);
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.stats().then(setStats).catch(console.error).finally(() => setLoading(false));
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (loading) return <div className="splash"><div className="spinner" /></div>;

  const today = now;
  const start = new Date('2026-08-08');
  const end = new Date('2027-08-23');
  const totalSpan = end - start;
  const elapsed = Math.min(Math.max(today - start, 0), totalSpan);
  const timelinePct = Math.round((elapsed / totalSpan) * 100);

  // Next milestone + live countdown
  const next = ROADMAP.find(r => new Date(r.date) >= today) || ROADMAP[ROADMAP.length - 1];
  const nextDate = new Date(next.date);
  const msLeft = Math.max(0, nextDate - today);
  const cd = {
    days: Math.floor(msLeft / 86400000),
    hours: Math.floor((msLeft % 86400000) / 3600000),
    mins: Math.floor((msLeft % 3600000) / 60000),
    secs: Math.floor((msLeft % 60000) / 1000),
  };
  const daysLeft = cd.days;

  const currentWeek = stats.currentWeek;
  const phaseProgress = (ph) => {
    const [a, b] = ph.range;
    const span = b - a + 1;
    const done = Math.min(Math.max(currentWeek - a + 1, 0), span);
    return Math.round((done / span) * 100);
  };
  const focus = WEEK_TO_BATCH.find(({ range }) => currentWeek >= range[0] && currentWeek <= range[1]);
  const milestonesDone = stats.milestonesDone ?? 0;
  const milestonesTotal = stats.milestonesTotal ?? 0;

  return (
    <div>
      <PageHeader
        title="GSoC 2027 Timeline"
        subtitle="Every date that matters, and exactly where you should be when it arrives."
      />

      {/* Top stats */}
      <div className="grid grid-4 mb-24">
        <div className="anim-in-1"><StatCard icon={<IconCalendar />} iconBg="#6366f1" value={<CountUp value={cd.days} />} label="Days to next milestone" sub={next.label} /></div>
        <div className="anim-in-2"><StatCard icon={<IconClock />} iconBg="#8b5cf6" value={<CountUp value={timelinePct} suffix="%" />} label="Journey complete" sub="Aug 8, 2026 → Aug 23, 2027" /></div>
        <div className="anim-in-3"><StatCard icon={<IconFlag />} iconBg="#f59e0b" value={<><CountUp value={milestonesDone} />/{milestonesTotal}</>} label="Milestones done" sub="Portfolio proof" /></div>
        <div className="anim-in-4"><StatCard icon={<IconRocket />} iconBg="#10b981" value={<CountUp value={currentWeek} />} label="Current week" sub="of the 40-week plan" /></div>
      </div>

      {/* Live countdown hero */}
      <div className="card mb-16 anim-in-1" style={{ background: 'linear-gradient(135deg, var(--primary-soft), transparent 70%)', borderLeft: '4px solid var(--primary)' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="badge medium mb-8"><IconCalendar size={13} /> Next milestone</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>{next.label}</div>
            <div className="muted" style={{ fontSize: 13 }}>{nextDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>
          <div className="flex" style={{ gap: 10, textAlign: 'center' }}>
            {[
              { v: cd.days, l: 'days' },
              { v: cd.hours, l: 'hrs' },
              { v: cd.mins, l: 'min' },
              { v: cd.secs, l: 'sec' },
            ].map(u => (
              <div key={u.l} style={{ minWidth: 56 }}>
                <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
                  {String(u.v).padStart(2, '0')}
                </div>
                <div className="muted" style={{ fontSize: 11 }}>{u.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Where you are */}
      <div className="card mb-16 anim-in-2">
        <div className="flex-between mb-8">
          <span style={{ fontWeight: 700 }}>Where you are in the journey</span>
          <span className="muted" style={{ fontSize: 13 }}>{timelinePct}% of the way</span>
        </div>
        <ProgressBar value={timelinePct} striped />
      </div>

      {/* Timeline */}
      <div className="timeline">
        {ROADMAP.map((r, i) => {
          const d = new Date(r.date);
          const past = d < today;
          const isNext = !past && (i === 0 || new Date(ROADMAP[i - 1].date) < today);
          return (
            <div key={r.key} className={`timeline-item${past ? ' past' : ''}${isNext ? ' next' : ''} anim-in-${Math.min(i + 1, 6)}`}>
              <div className="timeline-content card">
                <div className="flex-between">
                  <div className="badge medium">{r.label}</div>
                  <span className="muted" style={{ fontSize: 12 }}>{r.date}</span>
                </div>
                <div className="mt-8" style={{ fontWeight: 600 }}>{r.desc}</div>
                {isNext && <div className="badge high mt-8">Next up</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Phases */}
      <div className="card mt-16 anim-in-4">
        <div className="card-title"><IconTarget /> Your three phases</div>
        <div className="grid grid-3">
          {PHASES.map(ph => (
            <div key={ph.key} style={{ padding: 16, borderRadius: 14, border: '1px solid var(--border)', background: 'var(--surface-2)' }}>
              <div className="flex-between mb-8">
                <span style={{ fontWeight: 700, fontSize: 14 }}>{ph.title}</span>
                <span className="badge low">{ph.weeks}</span>
              </div>
              <p className="muted" style={{ fontSize: 12, marginBottom: 10 }}>{ph.desc}</p>
              <div className="flex-between mb-8">
                <span className="muted" style={{ fontSize: 12 }}>Progress</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{phaseProgress(ph)}%</span>
              </div>
              <ProgressBar value={phaseProgress(ph)} style={{ height: 6 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Focus now */}
      <div className="card mt-16 anim-in-5" style={{ borderLeft: '4px solid var(--success)' }}>
        <div className="card-title"><IconZap /> Focus now</div>
        {focus ? (
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.7 }}>
            You're in <strong>week {currentWeek}</strong> — that puts you in <strong>Batch {focus.batch}: {focus.title}</strong>.
            Stay with the weekly read/do plan and keep the daily page target. The org list is {daysLeft} days away.
          </p>
        ) : (
          <p className="muted" style={{ fontSize: 14 }}>The plan is complete. Time to ship your proposal.</p>
        )}
      </div>

      {/* How it maps */}
      <div className="card mt-16 anim-in-6">
        <div className="card-title"><IconSparkles /> How the plan maps to GSoC</div>
        <p className="muted" style={{ fontSize: 14, lineHeight: 1.7 }}>
          <strong>Batches 1–4 (weeks 1–11)</strong> build your foundation: Python, ML, LLMs, and transformers.
          <br />
          <strong>Batches 5–7 (weeks 12–22)</strong> make you project-ready: agents, RAG, evals, and multimodal.
          <br />
          <strong>Batches 8–11 (weeks 23–40)</strong> are the GSoC sprint: systems, MLOps, and interview prep.
          <br /><br />
          By the time the org list drops in February, you'll have 11 portfolio milestones and a real contribution history. That's not a wish — it's a schedule.
        </p>
      </div>
    </div>
  );
}