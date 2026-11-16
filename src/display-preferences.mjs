let expanded = true;
try { expanded = localStorage.getItem('words-static-content-expanded') !== 'false'; } catch {}

export const contentExpanded = () => expanded;

export function saveContentExpanded(value) {
  expanded = value;
  try {
    localStorage.setItem('words-static-content-expanded', String(value));
    return true;
  } catch { return false; }
}

export function applyContentExpansion(container) {
  container.querySelectorAll('details').forEach(detail => { detail.open = expanded; });
}
