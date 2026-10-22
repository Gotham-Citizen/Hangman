import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function WinProgressModal({ nextDifficulty, onContinue }) {
  const { t } = useTranslation()
  const continueRef = useRef(null)

  useEffect(() => {
    if (continueRef.current) {
      continueRef.current.focus();
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onContinue();
      } else if (e.key === "Tab") {
        e.preventDefault();
        continueRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onContinue]);

  return (
    <div className="level-up-overlay" role="dialog" aria-modal="true" aria-labelledby="win-progress-text">
      <div className="level-up-prompt">
        <p id="win-progress-text">{t("winProgress", { level: t(nextDifficulty) })}</p>
        <div className="level-up-buttons">
          <button ref={continueRef} className="level-up-continue" onClick={onContinue}>{t("continue")}</button>
        </div>
      </div>
    </div>
  );
}