// Progress and settings storage for the Leonida Trophy Guide.
// Progress lives only in this browser (localStorage) and can be exported to a file and imported back.
export const PROGRESS_KEY = 'leonida-trophy-progress-v1';
export const SETTINGS_KEY = 'leonida-trophy-settings-v1';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    const ids = Array.isArray(parsed) ? parsed : parsed.earned;
    return new Set((ids || []).filter((id) => Number.isInteger(id)));
  } catch {
    return new Set();
  }
}

export function saveProgress(earnedIds) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earnedIds].sort((a, b) => a - b) }));
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { spoilers: true };
    const parsed = JSON.parse(raw);
    return { spoilers: parsed.spoilers !== false };
  } catch {
    return { spoilers: true };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function buildExportFile(earnedIds) {
  const payload = {
    game: 'Grand Theft Auto VI',
    guide: 'Leonida Trophy Guide',
    exportedAt: new Date().toISOString(),
    earned: [...earnedIds].sort((a, b) => a - b),
  };
  return new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
}

export function downloadBlob(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

export async function readImportedProgress(file, knownIds) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const rawIds = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(rawIds)) throw new Error('That file holds no earned list.');
  const known = new Set(knownIds);
  const imported = new Set();
  for (const entry of rawIds) {
    if (Number.isInteger(entry) && known.has(entry)) imported.add(entry);
  }
  return imported;
}
