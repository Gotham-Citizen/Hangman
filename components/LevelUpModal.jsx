import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function LevelUpModal({ nextDifficulty, onChoice }) {
  const { t } = useTranslation()
  const acceptRef = useRef(null)

  useEffect(() => {
    if (acceptRef.current) {
      acceptRef.current.focus();
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onChoice(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onChoice]);

  return (
    <div className="level-up-overlay" role="dialog" aria-modal="true" aria-labelledby="level-up-text">
      <div className="level-up-prompt">
        <p id="level-up-text">{t("levelUpPrompt", { level: t(nextDifficulty) })}</p>
        <div className="level-up-buttons">
          <button ref={acceptRef} className="level-up-accept" onClick={() => onChoice(true)}>{t("accept")}</button>
          <button className="level-up-dismiss" onClick={() => onChoice(false)}>{t("dismiss")}</button>
        </div>
      </div>
    </div>
  );
}