export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}