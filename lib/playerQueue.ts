// Decides which song plays next from the current queue, in order or at random.

const RANDOM_HISTORY_SIZE = 10;

export const getNextId = (ids: string[], activeId?: string) => {
  const currentIndex = ids.findIndex((id) => id === activeId);
  return ids[currentIndex + 1] ?? ids[0];
};

export const getPreviousId = (ids: string[], activeId?: string) => {
  const currentIndex = ids.findIndex((id) => id === activeId);
  return ids[currentIndex - 1] ?? ids[ids.length - 1];
};

export const pickRandomId = (
  ids: string[],
  history: string[],
  activeId?: string,
  random: () => number = Math.random
) => {
  const unplayed = ids.filter((id) => !history.includes(id));
  const exhausted = unplayed.length === 0;
  const others = ids.filter((id) => id !== activeId);
  const pool = exhausted ? (others.length > 0 ? others : ids) : unplayed;

  const id = pool[Math.floor(random() * pool.length)];
  const previous = exhausted ? [] : history;

  return { id, history: [...previous, id].slice(-RANDOM_HISTORY_SIZE) };
};
