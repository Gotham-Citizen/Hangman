import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function LevelUpModal({ nextDifficulty, onChoice }) {
  const { t } = useTranslation()
  const acceptRef = useRef(null)
  const dismissRef = useRef(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    acceptRef.current?.focus()
    return () => {
      if (previouslyFocused instanceof HTMLElement &&
          previouslyFocused.isConnected && !previouslyFocused.disabled) {
        previouslyFocused.focus()
      } else {
        document.querySelector("button.new-game")?.focus()
      }
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onChoice(false);
      } else if (e.key === "Tab") {
        e.preventDefault();
        if (document.activeElement === acceptRef.current) {
          dismissRef.current?.focus();
        } else {
          acceptRef.current?.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onChoice]);

  return (
    <div className="level-up-overlay" role="dialog" aria-modal="true" aria-labelledby="level-up-text">
      <div className="level-up-prompt">
        <h2 id="level-up-text">{t("levelUpPrompt", { level: t(nextDifficulty) })}</h2>
        <div className="level-up-buttons">
          <button ref={acceptRef} className="level-up-accept" onClick={() => onChoice(true)}>{t("accept")}</button>
          <button ref={dismissRef} className="level-up-dismiss" onClick={() => onChoice(false)}>{t("dismiss")}</button>
        </div>
      </div>
    </div>
  );
}
