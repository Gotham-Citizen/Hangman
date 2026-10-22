import { useMemo } from "react";
import clsx from "clsx";

export default function WordDisplay({ currentWord, guessedLetters, isGameOver }) {
  const letterElements = useMemo(() =>
    [...currentWord].map((letter, index) => (
      <span
        key={`${letter}-${index}`}
        className={clsx(
          "current-letter",
          (isGameOver && !guessedLetters.includes(letter)) && "missed-letter"
        )}>
        {(guessedLetters.includes(letter) || isGameOver) && letter.toUpperCase()}
      </span>
    )), [currentWord, guessedLetters, isGameOver]);

  return (
    <section className="word">
      {letterElements}
    </section>
  );
}