import { useMemo } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { difficultyOrder } from "../src/constants.js";

export default function DifficultySelector({ difficulty, unlockedDifficulties, onChange }) {
  const { t } = useTranslation()

  const difficultyButtons = useMemo(() =>
    difficultyOrder.map((level) => {
      const isLocked = !unlockedDifficulties.includes(level)
      return (
        <button
          key={level}
          className={clsx(
            "difficulty-button",
            difficulty === level && "active",
            isLocked && "locked"
          )}
          disabled={isLocked}
          aria-current={difficulty === level ? "true" : undefined}
          onClick={() => onChange(level)}
        >
          {t(level)}
        </button>
      )
    }), [difficulty, unlockedDifficulties, onChange, t]);

  return (
    <section className="difficulty-selector" aria-label={t("difficultySelector")}>
      {difficultyButtons}
    </section>
  );
}