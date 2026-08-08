import { useState, useEffect, useMemo } from 'react';
import api from '../api.js';
import { PageHeader, Badge, Empty, ProgressBar, toast } from '../components/ui.jsx';
import { IconCheck, IconBook } from '../components/Icons.jsx';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [batches, setBatches] = useState([]);
  const [filter, setFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.books(), api.batches()])
      .then(([b, bt]) => { setBooks(b); setBatches(bt); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const update = async (book, status) => {
    const progress = status === 'done' ? 100 : book.user_progress || 0;
    await api.updateBook(book.id, { status, progress });
    setBooks(bs => bs.map(x => x.id === book.id ? { ...x, status, user_progress: progress } : x));
    if (status === 'done') toast(`Finished "${book.title}" — keep going.`);
    else if (status === 'reading') toast(`Started "${book.title}" — happy reading.`);
  };

  const filtered = useMemo(() => books.filter(b => {
    if (filter !== 'all' && b.status !== filter) return false;
    if (batchFilter !== 'all' && b.batch_id !== Number(batchFilter)) return false;
    if (query && !`${b.title} ${b.author}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }), [books, filter, batchFilter, query]);

  if (loading) return <div className="splash"><div className="spinner" /></div>;

  const doneCount = books.filter(b => b.status === 'done').length;
  const readingCount = books.filter(b => b.status === 'reading').length;
  const totalPages = books.reduce((s, b) => s + (b.pages || 0), 0);
  const pagesRead = books.reduce((s, b) => s + Math.round(((b.pages || 0) * (b.user_progress || 0)) / 100), 0);

  return (
    <div>
      <PageHeader
        title="Books"
        subtitle={`77 books · ${doneCount} done · ${readingCount} reading · ${pagesRead.toLocaleString()}/${totalPages.toLocaleString()} pages`}
        actions={
          <div className="flex" style={{ flexWrap: 'wrap' }}>
            <select className="select" style={{ width: 'auto' }} value={batchFilter} onChange={e => setBatchFilter(e.target.value)}>
              <option value="all">All batches</option>
              {batches.map(b => <option key={b.id} value={b.id}>Batch {b.id} — {b.title}</option>)}
            </select>
            <select className="select" style={{ width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="todo">To do</option>
              <option value="reading">Reading</option>
              <option value="done">Done</option>
            </select>
            <input className="input" style={{ width: 200 }} placeholder="Search books…" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
        }
      />

      {filtered.length === 0 ? (
        <Empty text="No books match your filters." icon={<IconBook />} />
      ) : (
        <div className="card" style={{ padding: 12 }}>
          {filtered.map((b, i) => (
            <div key={b.id} className={`book-row${b.status === 'done' ? ' done' : ''} anim-in-${Math.min((i % 6) + 1, 6)}`} style={{ marginBottom: 8 }}>
              <div className="book-num">{b.id}</div>
              <div className="book-info">
                <div className="book-title">{b.title}</div>
                <div className="book-author">{b.author} · {b.publisher} {b.year} · Batch {b.batch_id}</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{b.covers}</div>
                {b.pages > 0 && (
                  <div className="flex-between mt-8" style={{ maxWidth: 320 }}>
                    <span className="muted" style={{ fontSize: 12 }}>{Math.round(((b.pages || 0) * (b.user_progress || 0)) / 100)}/{b.pages} pages</span>
                    <ProgressBar value={b.user_progress || 0} className={b.status === 'done' ? 'success' : ''} style={{ flex: 1, marginLeft: 12 }} />
                  </div>
                )}
              </div>
              <div className="flex" style={{ gap: 6 }}>
                <Badge status={b.status} />
                <button className="btn btn-secondary btn-sm" onClick={() => update(b, b.status === 'reading' ? 'todo' : 'reading')}>
                  {b.status === 'reading' ? 'Pause' : 'Start'}
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => update(b, b.status === 'done' ? 'todo' : 'done')}>
                  {b.status === 'done' ? 'Undo' : <><IconCheck size={13} /> Done</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}