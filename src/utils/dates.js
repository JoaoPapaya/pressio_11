const DIAS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addDays = (d, n) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

export const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const weekdayShort = (d) => DIAS[d.getDay()];
export const monthShort = (d) => MESES[d.getMonth()];

// "QUA 12 Out, 10:00"
export const formatAppointment = (d) => {
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${weekdayShort(d)} ${d.getDate()} ${monthShort(d)}, ${hh}:${mm}`;
};

// "12 Out"
export const formatShort = (d) => `${d.getDate()} ${monthShort(d)}`;

// Semana (domingo a sábado) que contém a data
export const weekOf = (d) => {
  const start = addDays(startOfDay(d), -d.getDay());
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

// Aceita "dd/mm hh:mm" ou "dd/mm" (ano atual). Retorna Date ou null.
export const parseDateTime = (text) => {
  const m = /^\s*(\d{1,2})\/(\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?\s*$/.exec(text || '');
  if (!m) return null;
  const now = new Date();
  const d = new Date(now.getFullYear(), Number(m[2]) - 1, Number(m[1]), Number(m[3] || 9), Number(m[4] || 0));
  return Number.isNaN(d.getTime()) ? null : d;
};
