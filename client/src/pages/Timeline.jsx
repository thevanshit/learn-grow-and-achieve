import { useState, useEffect } from 'react';
import api from '../api.js';
import { PageHeader } from '../components/ui.jsx';

const ROADMAP = [
  { key: 'start', label: 'Roadmap starts', date: '2026-08-03', desc: 'Begin the 40-week plan — batches 1–2 (Python + ML foundations).' },
  { key: 'org_list', label: 'GSoC Org List', date: '2027-02-08', desc: 'Organizations announced. Shortlist 3–5 orgs and study their codebases.' },
  { key: 'proposal', label: 'Proposal Deadline', date: '2027-03-20', desc: 'Submit your proposal. Have mentors review it before submission.' },
  { key: 'results', label: 'Results Announced', date: '2027-04-30', desc: 'Accepted? Start pre-coding period and community bonding.' },
  { key: 'coding', label: 'Coding Period', date: '2027-05-17', desc: 'Code, commit, and communicate weekly with your mentor.' },
];

export default function Timeline() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.stats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="splash"><div className="spinner" /></div>;

  const today = new Date();
  const daysLeft = stats.gsoc.find(g => g.key === 'org_list')?.daysLeft ?? 0;

  return (
    <div>
      <PageHeader
        title="GSoC 2027 Timeline"
        subtitle={`${daysLeft} days until the org list is announced. Stay on schedule.`}
      />

      <div className="timeline">
        {ROADMAP.map((r, i) => {
          const d = new Date(r.date);
          const past = d < today;
          const isNext = !past && (i === 0 || new Date(ROADMAP[i - 1].date) < today);
          return (
            <div key={r.key} className={`timeline-item${past ? ' past' : ''}${isNext ? ' next' : ''}`}>
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

      <div className="card mt-16">
        <div className="card-title">How the plan maps to GSoC</div>
        <p className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>
          Batches 1–4 (weeks 1–16) build your fundamentals: Python, ML, LLMs, and systems.
          Batches 5–7 (weeks 17–28) make you project-ready with real code, tools and open-source practice.
          Batches 8–10 (weeks 29–40) are your GSoC sprint: portfolio, proposals, and org contributions.
          By the time the org list drops in February 2027, you'll have 8 portfolio milestones and a real contribution history.
        </p>
      </div>
    </div>
  );
}