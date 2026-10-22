import { useTranslation } from "react-i18next";
import { languages } from "../src/languages.js";

export default function GameStatus({ isGameOver, isGameWon, wrongGuessedCount }) {
  const { t } = useTranslation()

  if (isGameOver) {
    return isGameWon ? (
      <>
        <h2>{t("youWin")}</h2>
        <p>{t("winMessage")}</p>
      </>
    ) : (
      <>
        <h2>{t("youLose")}</h2>
        <p>{t("loseMessage")}</p>
      </>
    )
  }

  if (wrongGuessedCount) {
    return <p className="farewell-message">{t("farewell", { name: languages[wrongGuessedCount - 1].name })}</p>
  }

  return null;
}