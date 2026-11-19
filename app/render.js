// Renders the checklist rows and the guide detail panel.
import { GRADE_LABELS, KIND_LABELS, isSpoilerHidden } from './filters.js';

function makeTag(text, className) {
  const tag = document.createElement('span');
  tag.className = `tag${className ? ` ${className}` : ''}`;
  tag.textContent = text;
  return tag;
}

function makeMedal(grade) {
  const medal = document.createElement('span');
  medal.className = `medal ${grade}`;
  medal.textContent = grade === 'platinum' ? 'P' : grade[0].toUpperCase();
  medal.title = GRADE_LABELS[grade];
  return medal;
}

export function renderChecklist(listElement, trophies, earnedIds, spoilersOn, selectedId, onToggle, onSelect) {
  listElement.replaceChildren();
  for (const trophy of trophies) {
    const hidden = isSpoilerHidden(trophy, earnedIds, spoilersOn);
    const earned = earnedIds.has(trophy.id);
    const row = document.createElement('li');
    row.className = `trophy-row${earned ? ' earned' : ''}${selectedId === trophy.id ? ' selected' : ''}`;

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned;
    box.setAttribute('aria-label', `Mark ${hidden ? 'hidden story trophy' : trophy.name} as earned`);
    box.addEventListener('change', () => onToggle(trophy.id, box.checked));

    const middle = document.createElement('div');
    const name = document.createElement('div');
    name.className = hidden ? 'trophy-name spoiler-name' : 'trophy-name';
    name.textContent = hidden ? 'Hidden story trophy' : trophy.name;
    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = hidden ? 'Earn it in the game to reveal its name and guide.' : trophy.description;
    const tags = document.createElement('div');
    tags.className = 'trophy-tags';
    if (trophy.kind !== 'missable') {
      tags.append(makeTag(KIND_LABELS[trophy.kind], trophy.kind === 'story' ? 'story' : trophy.kind === 'collectible' ? 'collectible' : ''));
    }
    if (trophy.missable) tags.append(makeTag('Missable', 'missable'));
    if (trophy.target) tags.append(makeTag(trophy.target));
    if (trophy.chapter) tags.append(makeTag(trophy.chapter));
    middle.append(name, desc, tags);

    const guideButton = document.createElement('button');
    guideButton.type = 'button';
    guideButton.className = 'guide-button';
    guideButton.textContent = hidden ? 'Hidden' : 'Guide';
    guideButton.disabled = hidden;
    guideButton.addEventListener('click', () => onSelect(trophy.id));

    row.append(box, makeMedal(trophy.grade), middle, guideButton);
    listElement.append(row);
  }
}

function renderSources(panel, sources) {
  const block = document.createElement('p');
  block.className = 'sources';
  const label = document.createElement('b');
  label.textContent = 'Sources: ';
  block.append(label, document.createTextNode(sources.join(' · ')));
  panel.append(block);
}

export function renderDetail(panel, trophy, earnedIds, spoilersOn) {
  panel.replaceChildren();
  if (!trophy) {
    renderOverview(panel, earnedIds);
    return;
  }
  if (isSpoilerHidden(trophy, earnedIds, spoilersOn)) {
    const heading = document.createElement('h2');
    heading.textContent = 'Hidden story trophy';
    const note = document.createElement('p');
    note.className = 'detail-empty';
    note.textContent = 'Spoilers are on, so this story trophy stays hidden until you earn it. Tick it off in the checklist once it pops, or turn the spoiler setting off to reveal it.';
    panel.append(heading, note);
    return;
  }
  const gradeLine = document.createElement('div');
  gradeLine.className = 'detail-grade';
  gradeLine.append(makeMedal(trophy.grade));
  const gradeText = document.createElement('b');
  gradeText.textContent = GRADE_LABELS[trophy.grade];
  gradeLine.append(gradeText);
  if (trophy.missable) gradeLine.append(makeTag('Missable', 'missable'));

  const heading = document.createElement('h2');
  heading.textContent = trophy.name;
  const desc = document.createElement('p');
  desc.className = 'detail-desc';
  desc.textContent = trophy.description;
  const guide = document.createElement('p');
  guide.className = 'detail-guide';
  guide.textContent = trophy.guide;

  panel.append(gradeLine, heading, desc);
  if (trophy.missable) {
    const warn = document.createElement('div');
    warn.className = 'warn-box';
    const warnTitle = document.createElement('b');
    warnTitle.textContent = 'Potentially missable — read before Chapter 1 ends. ';
    const warnText = document.createTextNode('The balcony meditation at Jason\u2019s house is only available during Chapter 1. Do it early and keep a Chapter 1 save until this trophy pops.');
    warn.append(warnTitle, warnText);
    panel.append(warn);
  }
  panel.append(guide);
  const meta = document.createElement('p');
  meta.className = 'detail-meta';
  const bits = [];
  if (trophy.chapter) bits.push(`Chapter: ${trophy.chapter}`);
  if (trophy.target) bits.push(`Target: ${trophy.target}`);
  bits.push(earnedIds.has(trophy.id) ? 'Status: earned' : 'Status: not earned yet');
  meta.textContent = bits.join('  ·  ');
  panel.append(meta);
  renderSources(panel, trophy.sources);
}

function renderOverview(panel, earnedIds) {
  const wrap = document.createElement('div');
  wrap.className = 'detail-empty';
  const heading = document.createElement('h2');
  heading.textContent = 'Your road to the platinum';
  const intro = document.createElement('p');
  intro.textContent = 'Pick any trophy on the left to read its guide and sources. Your progress is saved in this browser as you tick trophies off.';
  const note = document.createElement('p');
  note.textContent = 'One trophy may be missable: Positive Mental Attitude, the Chapter 1 balcony meditation. Do it before Chapter 1 ends. Everything else can be finished in free roam after the story.';
  wrap.append(heading, intro, note);
  panel.append(wrap);
}
