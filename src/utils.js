import { words } from "./words";

const difficultyLengthMap = {
  easy: [5],
  medium: [6],
  hard: [7],
  expert: [8, 9],
};

const wordsByLength = {};
words.forEach(w => {
  const len = w.word.length;
  (wordsByLength[len] ||= []).push(w);
});

export function getRandomWord(difficulty = "easy", excludeWord) {
  const lengths = difficultyLengthMap[difficulty] || [5];
  let pool = lengths.flatMap(len => wordsByLength[len] || []);
  if (excludeWord) {
    const filtered = pool.filter(w => w.word !== excludeWord);
    if (filtered.length) pool = filtered;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}