import { useMemo } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export default function WordDisplay({ currentWord, guessedLetters, isGameOver }) {
  const { t, i18n } = useTranslation()

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

  // Game words are always English — mark them for correct pronunciation in zh/es UI
  const wordLang = i18n.resolvedLanguage === "en" ? undefined : "en"

  return (
    <section className="word" aria-label={t("currentWord")} lang={wordLang}>
      {letterElements}
    </section>
  );
}
