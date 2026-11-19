// Filtering, search and the spoiler rule for the trophy checklist.
export const KIND_LABELS = {
  story: 'Story',
  missable: 'Missable',
  collectible: 'Collectible',
  activity: 'Activity',
};

export const GRADE_LABELS = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

// A story trophy stays hidden while spoilers are on and it is not earned yet:
// its name, description and guide are all held back, only its grade shows.
export function isSpoilerHidden(trophy, earnedIds, spoilersOn) {
  return spoilersOn && trophy.kind === 'story' && !earnedIds.has(trophy.id);
}

export function trophyMatchesSearch(trophy, query) {
  if (!query) return true;
  const haystack = [trophy.name, trophy.description, trophy.guide, trophy.chapter || '', trophy.target || '']
    .join(' ')
    .toLowerCase();
  return query.toLowerCase().split(/\s+/).every((word) => haystack.includes(word));
}

export function filterTrophies(trophies, filters, earnedIds) {
  return trophies.filter((trophy) => {
    if (filters.kind !== 'all' && trophy.kind !== filters.kind) return false;
    if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
    if (filters.status === 'earned' && !earnedIds.has(trophy.id)) return false;
    if (filters.status === 'remaining' && earnedIds.has(trophy.id)) return false;
    return trophyMatchesSearch(trophy, filters.search);
  });
}

export function countByGrade(trophies, earnedIds) {
  const counts = { platinum: [0, 0], gold: [0, 0], silver: [0, 0], bronze: [0, 0] };
  for (const trophy of trophies) {
    counts[trophy.grade][1] += 1;
    if (earnedIds.has(trophy.id)) counts[trophy.grade][0] += 1;
  }
  return counts;
}
