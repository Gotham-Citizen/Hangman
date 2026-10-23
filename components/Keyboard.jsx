import { useMemo } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { ALPHABET } from "../src/constants.js";

export default function Keyboard({ guessedLetters, currentWord, isGameOver, onGuess }) {
  const { t } = useTranslation()

  const keyboardButtons = useMemo(() =>
    ALPHABET.split("").map(letter => {
      const isGuessed = guessedLetters.includes(letter);
      return (
        <button
          key={letter}
          className={clsx(
            isGuessed && currentWord.includes(letter) && 'right-letter',
            isGuessed && !currentWord.includes(letter) && 'wrong-letter'
          )}
          onClick={() => onGuess(letter)}
          disabled={isGameOver || isGuessed}
        >
          {letter.toUpperCase()}
        </button>
      );
    }), [guessedLetters, currentWord, isGameOver, onGuess]);

  return (
    <section className="keyboard" aria-label={t("keyboard")}>
      {keyboardButtons}
    </section>
  );
}