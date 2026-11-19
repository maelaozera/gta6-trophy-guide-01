// Boots the Leonida Trophy Guide: loads the trophy data, wires the checklist,
// the filters, the spoiler setting, the tabs and the progress export and import.
import {
  loadProgress,
  saveProgress,
  loadSettings,
  saveSettings,
  buildExportFile,
  downloadBlob,
  readImportedProgress,
} from './store.js';
import { filterTrophies, countByGrade } from './filters.js';
import { renderChecklist, renderDetail } from './render.js';
import { renderRoadmap, renderMissable } from './roadmap.js';

const listElement = document.getElementById('trophyList');
const detailPanel = document.getElementById('detailPanel');
const checklistPanel = document.getElementById('checklistPanel');
const roadmapPanel = document.getElementById('roadmapPanel');
const missablePanel = document.getElementById('missablePanel');
const toolbar = document.getElementById('toolbar');
const searchBox = document.getElementById('searchBox');
const kindFilter = document.getElementById('kindFilter');
const gradeFilter = document.getElementById('gradeFilter');
const statusFilter = document.getElementById('statusFilter');
const spoilerToggle = document.getElementById('spoilerToggle');
const earnedCount = document.getElementById('earnedCount');
const progressFill = document.getElementById('progressFill');
const progressBar = document.getElementById('progressBar');
const progressDetail = document.getElementById('progressDetail');
const listNote = document.getElementById('listNote');
const emptyNote = document.getElementById('emptyNote');

const data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;

const earnedIds = loadProgress();
const settings = loadSettings();
let selectedId = null;
let activeTab = 'checklist';

spoilerToggle.checked = settings.spoilers;

function currentFilters() {
  return {
    search: searchBox.value.trim(),
    kind: kindFilter.value,
    grade: gradeFilter.value,
    status: statusFilter.value,
  };
}

function refreshProgress() {
  const total = trophies.length;
  const done = earnedIds.size;
  const percent = Math.round((done / total) * 100);
  earnedCount.textContent = String(done);
  progressFill.style.width = `${percent}%`;
  progressBar.setAttribute('aria-valuenow', String(done));
  const counts = countByGrade(trophies, earnedIds);
  progressDetail.textContent = `${percent}% complete · ${total - done} to go · ` +
    `platinum ${counts.platinum[0]}/${counts.platinum[1]}, gold ${counts.gold[0]}/${counts.gold[1]}, ` +
    `silver ${counts.silver[0]}/${counts.silver[1]}, bronze ${counts.bronze[0]}/${counts.bronze[1]}`;
}

function refreshAll() {
  refreshProgress();
  const visible = filterTrophies(trophies, currentFilters(), earnedIds);
  emptyNote.classList.toggle('hidden', visible.length > 0);
  renderChecklist(listElement, visible, earnedIds, settings.spoilers, selectedId, toggleEarned, selectTrophy);
  const selected = trophies.find((trophy) => trophy.id === selectedId) || null;
  renderDetail(detailPanel, selected, earnedIds, settings.spoilers);
  renderRoadmap(roadmapPanel, trophies, earnedIds);
  renderMissable(missablePanel, trophies, earnedIds);
}

function toggleEarned(id, checked) {
  if (checked) earnedIds.add(id);
  else earnedIds.delete(id);
  saveProgress(earnedIds);
  refreshAll();
}

function selectTrophy(id) {
  selectedId = id;
  refreshAll();
  if (window.matchMedia('(max-width: 900px)').matches) {
    detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function showTab(tab) {
  activeTab = tab;
  for (const button of document.querySelectorAll('.tab')) {
    button.classList.toggle('active', button.dataset.tab === tab);
  }
  const onChecklist = tab === 'checklist';
  checklistPanel.classList.toggle('hidden', !onChecklist);
  detailPanel.classList.toggle('hidden', !onChecklist);
  toolbar.classList.toggle('hidden', !onChecklist);
  roadmapPanel.classList.toggle('hidden', tab !== 'roadmap');
  missablePanel.classList.toggle('hidden', tab !== 'missable');
  document.querySelector('.layout').classList.toggle('single', !onChecklist);
}

for (const button of document.querySelectorAll('.tab')) {
  button.addEventListener('click', () => showTab(button.dataset.tab));
}
searchBox.addEventListener('input', refreshAll);
kindFilter.addEventListener('change', refreshAll);
gradeFilter.addEventListener('change', refreshAll);
statusFilter.addEventListener('change', refreshAll);
spoilerToggle.addEventListener('change', () => {
  settings.spoilers = spoilerToggle.checked;
  saveSettings(settings);
  refreshAll();
});

document.getElementById('exportButton').addEventListener('click', () => {
  downloadBlob(buildExportFile(earnedIds), 'gta6-trophy-progress.json');
});

const importFile = document.getElementById('importFile');
document.getElementById('importButton').addEventListener('click', () => importFile.click());
importFile.addEventListener('change', async () => {
  const file = importFile.files[0];
  if (!file) return;
  try {
    const imported = await readImportedProgress(file, trophies.map((trophy) => trophy.id));
    earnedIds.clear();
    for (const id of imported) earnedIds.add(id);
    saveProgress(earnedIds);
    refreshAll();
  } catch {
    alert('That file could not be imported: it does not hold a trophy progress list.');
  }
  importFile.value = '';
});

document.getElementById('resetButton').addEventListener('click', () => {
  if (!confirm('Clear all earned trophies and start over?')) return;
  earnedIds.clear();
  saveProgress(earnedIds);
  selectedId = null;
  refreshAll();
});

refreshAll();
