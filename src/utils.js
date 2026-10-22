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

export function getRandomWord(difficulty = "easy") {
  const lengths = difficultyLengthMap[difficulty] || [5];
  const pool = lengths.flatMap(len => wordsByLength[len] || []);
  return pool[Math.floor(Math.random() * pool.length)];
}