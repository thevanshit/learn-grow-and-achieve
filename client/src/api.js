const API = '/api';

function getToken() {
  return localStorage.getItem('lga_token');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem('lga_token');
    localStorage.removeItem('lga_user');
    if (!path.startsWith('/auth/')) window.location.href = '/login';
    throw new Error('Not authenticated');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  get: (p) => request(p),
  post: (p, body) => request(p, { method: 'POST', body: JSON.stringify(body) }),
  patch: (p, body) => request(p, { method: 'PATCH', body: JSON.stringify(body) }),
  del: (p) => request(p, { method: 'DELETE' }),

  // auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
  updateMe: (body) => request('/auth/me', { method: 'PATCH', body: JSON.stringify(body) }),

  // planner
  batches: () => request('/batches'),
  books: () => request('/books'),
  updateBook: (id, body) => request(`/books/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  weeks: () => request('/weeks'),
  toggleWeek: (id, completed) => request(`/weeks/${id}`, { method: 'PATCH', body: JSON.stringify({ completed }) }),
  milestones: () => request('/milestones'),
  toggleMilestone: (id, completed) => request(`/milestones/${id}`, { method: 'PATCH', body: JSON.stringify({ completed }) }),
  plan: () => request('/plan'),

  // tasks
  tasks: (date) => request(`/tasks${date ? `?date=${date}` : ''}`),
  createTask: (body) => request('/tasks', { method: 'POST', body: JSON.stringify(body) }),
  updateTask: (id, body) => request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  daily: () => request('/daily'),
  notes: () => request('/notes'),
  createNote: (body) => request('/notes', { method: 'POST', body: JSON.stringify(body) }),
  deleteNote: (id) => request(`/notes/${id}`, { method: 'DELETE' }),

  // stats
  stats: () => request('/stats')
};

export default api;