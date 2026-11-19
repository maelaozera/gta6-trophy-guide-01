// Renders the platinum roadmap and the missable-trophies page.
// The roadmap is built from the official descriptions: which story chapters and missions,
// which collectibles and counts, in what order. Figures come from the PowerPyx GTA 6 Trophy Guide.
import { GRADE_LABELS } from './filters.js';

const STEPS = [
  {
    stage: 1,
    title: 'Step 1 — Play the story',
    hours: '60–80 hours',
    intro: 'Finish the 5 chapters and enjoy the game. There are no mission medals and no difficulty setting, so play however you like. Do the optional missions as they appear and scan vehicles and study animals as you go: that progress already counts toward the 100% checklist, even though the checklist itself only becomes visible after the story.',
    bullets: [
      'Do the Chapter 1 balcony meditation for Positive Mental Attitude before Chapter 1 ends — the only trophy that may be missable.',
      'Keep a manual save at the start and end of each chapter (15 manual slots, no mission replay).',
      'Start the named character questlines as they are marked: Kenton and Cal in Chapter 1, Billy and Bret in Chapter 2, Andy, Randy and Tyrone in Chapter 3.',
      'Cheats switch trophies and saving off, so keep them off for the whole run.',
    ],
  },
  {
    stage: 2,
    title: 'Step 2 — The 100% checklist and challenges',
    hours: 'about 100 hours',
    intro: 'After the story, the checklist opens under Progress, then Stats, then 100% Completion. It is far more forgiving than a true 100%: roughly 60% of everything in the game. Most of the trophies in this stage pop while you work through it.',
    bullets: [
      'Any 100 optional missions (there are far more than 100 in total).',
      'Scan 200 of 277 base-model vehicles and study 100 of 255 animals through the binoculars.',
      'Any 70 of the 80 challenges, so you can skip the hardest ten.',
      '300 stunts, 15 of 18 meditation spots, and gold medals in all 42 Shooting Range challenges.',
      'Every robbery, underwater discovery, drone race and Bret hunting quest: all 39 gang operations and all 8 large bank vaults.',
    ],
  },
  {
    stage: 3,
    title: 'Step 3 — Strangers, one-offs and cleanup',
    hours: 'about 10 hours',
    intro: 'Finish the 8 Strangers & Freaks strands and the remaining one-off trophies, then the platinum pops. Total time to the platinum is around 200 hours at a difficulty the guides rate 4 out of 10: long, not hard.',
    bullets: [
      'Complete the 8 stranger strands: Kirk, Kyle, Yago and Pilot Pete are confirmed to count.',
      'Mop up the partner trophies, the driving and combat one-offs, and the money trophies.',
      'Five trophies have no confirmed method yet at launch — In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There and Ten Pin — and their guides say so plainly.',
    ],
  },
];

const CHECKLIST_COUNTS = [
  ['Optional missions', 'Any 100'],
  ['Vehicles scanned', '200 of 277 base models'],
  ['Animals studied', '100 of 255'],
  ['Challenges', 'Any 70 of 80'],
  ['Stunts', '300 of 397'],
  ['Meditation spots', '15 of 18'],
  ['Shooting Range golds', 'All 42'],
  ['Drone race locations', 'All 14'],
  ['Gang operations', 'All 39'],
  ['Large bank vaults', 'All 8'],
  ['Target decks (Bret)', 'All 15'],
];

export function renderRoadmap(panel, trophies, earnedIds) {
  panel.replaceChildren();
  const heading = document.createElement('h2');
  heading.textContent = 'Roadmap to the platinum';
  const intro = document.createElement('p');
  intro.textContent = 'One playthrough, about 200 hours, difficulty 4 out of 10. No online trophies, no mission medals, no difficulty trophies. Figures are from the PowerPyx GTA 6 Trophy Guide.';
  panel.append(heading, intro);

  for (const step of STEPS) {
    const card = document.createElement('div');
    card.className = 'step';
    const title = document.createElement('h3');
    title.textContent = step.title + ' ';
    const hours = document.createElement('span');
    hours.className = 'hours';
    hours.textContent = `(${step.hours})`;
    title.append(hours);
    const text = document.createElement('p');
    text.textContent = step.intro;
    const list = document.createElement('ul');
    for (const bullet of step.bullets) {
      const item = document.createElement('li');
      item.textContent = bullet;
      list.append(item);
    }
    const stageTrophies = trophies.filter((trophy) => trophy.stage === step.stage);
    const done = stageTrophies.filter((trophy) => earnedIds.has(trophy.id)).length;
    const progress = document.createElement('p');
    progress.textContent = `Trophies in this stage: ${done} of ${stageTrophies.length} earned — ` +
      stageTrophies.map((trophy) => `${earnedIds.has(trophy.id) ? '✓ ' : ''}${trophy.name}`).join(', ');
    card.append(title, text, list, progress);
    panel.append(card);
  }

  const tableTitle = document.createElement('h3');
  tableTitle.textContent = 'What the 100% checklist asks for';
  const table = document.createElement('table');
  table.className = 'count-table';
  const headRow = document.createElement('tr');
  for (const label of ['Checklist item', 'Needed for 100%']) {
    const cell = document.createElement('th');
    cell.textContent = label;
    headRow.append(cell);
  }
  table.append(headRow);
  for (const [item, needed] of CHECKLIST_COUNTS) {
    const row = document.createElement('tr');
    const a = document.createElement('td');
    a.textContent = item;
    const b = document.createElement('td');
    b.textContent = needed;
    row.append(a, b);
    table.append(row);
  }
  panel.append(tableTitle, table);
}

export function renderMissable(panel, trophies, earnedIds) {
  panel.replaceChildren();
  const heading = document.createElement('h2');
  heading.textContent = 'Missable trophies';
  const intro = document.createElement('p');
  intro.textContent = 'Only one trophy in the whole list is reported as possibly missable. Everything else can be finished in free roam after the story, because there is no mission replay but the open world stays open.';
  panel.append(heading, intro);

  const missable = trophies.filter((trophy) => trophy.missable);
  for (const trophy of missable) {
    const card = document.createElement('div');
    card.className = 'missable-card';
    const title = document.createElement('h3');
    title.textContent = `${trophy.name} — ${GRADE_LABELS[trophy.grade]}`;
    const desc = document.createElement('p');
    desc.textContent = trophy.description;
    const guide = document.createElement('p');
    guide.textContent = trophy.guide;
    const status = document.createElement('p');
    status.textContent = earnedIds.has(trophy.id) ? 'Status: earned.' : 'Status: not earned yet — do the Chapter 1 meditation first.';
    card.append(title, desc, guide, status);
    panel.append(card);
  }

  const saveCard = document.createElement('div');
  saveCard.className = 'step';
  const saveTitle = document.createElement('h3');
  saveTitle.textContent = 'Save strategy (no mission replay)';
  const saveText = document.createElement('p');
  saveText.textContent = 'The game has 15 manual save slots and 1 autosave slot. The guides recommend a save at the start and end of each chapter — 10 saves — and rotating the remaining 5 for free-roam cleanup. Save at the start of every chapter and once more before the final mission.';
  saveCard.append(saveTitle, saveText);
  panel.append(saveCard);

  const timeCard = document.createElement('div');
  timeCard.className = 'step';
  const timeTitle = document.createElement('h3');
  timeTitle.textContent = 'Time-sensitive, but not trophy-locking';
  const timeText = document.createElement('p');
  timeText.textContent = 'Some optional missions carry an hourglass icon and fail if left too long, and some quest givers go quiet for a chapter before returning. The guides report that none of these lock a trophy: there are far more optional missions than the 100 the checklist needs, and every trophy-related quest giver comes back later. Two to do promptly anyway: Yago\u2019s Race Against Yago in Chapter 3, and the stranger questlines, whose windows follow story progress.';
  timeCard.append(timeTitle, timeText);
  panel.append(timeCard);

  const unknownCard = document.createElement('div');
  unknownCard.className = 'step';
  const unknownTitle = document.createElement('h3');
  unknownTitle.textContent = 'Still unconfirmed at launch';
  const unknownText = document.createElement('p');
  unknownText.textContent = 'Five trophies have no confirmed unlock method in the published guides yet: In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There and Ten Pin. Their guides in this app say so plainly instead of guessing.';
  unknownCard.append(unknownTitle, unknownText);
  panel.append(unknownCard);
}
