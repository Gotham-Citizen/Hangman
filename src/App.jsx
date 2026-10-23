import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import clsx from "clsx";
import { getRandomWord } from "./utils.js";
import Confetti from "react-confetti"
import { useTranslation } from "react-i18next";
import Chip from "../components/Chip.jsx";
import Keyboard from "../components/Keyboard.jsx";
import WordDisplay from "../components/WordDisplay.jsx";
import DifficultySelector from "../components/DifficultySelector.jsx";
import LevelUpModal from "../components/LevelUpModal.jsx";
import WinProgressModal from "../components/WinProgressModal.jsx";
import GameStatus from "../components/GameStatus.jsx";
import { languages } from "./languages.js";
import { difficultyOrder, WINS_NEEDED, ALPHABET } from "./constants.js";
import { loadGameState, saveGameState } from "./storage.js";

export default function App() {
  const { t } = useTranslation()
  const [savedState] = useState(loadGameState)

  const [difficulty, setDifficulty] = useState(savedState?.difficulty || "easy")
  const [currentWordData, setCurrentWordData] = useState(
    () => savedState?.currentWordData || getRandomWord(savedState?.difficulty || "easy")
  )
  const currentWord = currentWordData.word
  const currentCategory = currentWordData.category
  const [guessedLetters, setGuessedLetters] = useState(savedState?.guessedLetters || [])
  const [hintUsed, setHintUsed] = useState(savedState?.hintUsed || false)
  const [winStreak, setWinStreak] = useState(savedState?.winStreak || 0)
  const [bestStreak, setBestStreak] = useState(savedState?.bestStreak || 0)
  const [unlockedDifficulties, setUnlockedDifficulties] = useState(
    savedState?.unlockedDifficulties || ["easy"]
  )
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showWinProgress, setShowWinProgress] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
  const hintMessageRef = useRef(null)

  const wrongGuessedCount = useMemo(
    () => guessedLetters.filter(letter => !currentWord.includes(letter)).length,
    [guessedLetters, currentWord]
  )
  const isGameWon = useMemo(
    () => currentWord.split('').every(letter => guessedLetters.includes(letter)),
    [currentWord, guessedLetters]
  )
  const isGameLost = wrongGuessedCount >= languages.length - 1
  const isGameOver = isGameWon || isGameLost
  const lastGuessedLetter = guessedLetters.at(-1)
  const numGuessesLeft = languages.length - 1 - wrongGuessedCount

  // Screen-reader status line: initialized with the current attempt count so
  // it is read during initial page traversal, then updated on game/difficulty
  // resets and cleared once per-guess feedback takes over
  const [announcement, setAnnouncement] = useState(
    () => t("attemptsLeft", { count: numGuessesLeft })
  )

  const chipElements = useMemo(() =>
    languages.map((language, index) =>
      <Chip
        key={language.name}
        index={index}
        name={language.name}
        backgroundColor={language.backgroundColor}
        color={language.color}
        wrongGuessedCount={wrongGuessedCount}
      />
    ), [wrongGuessedCount])

  const addLetter = useCallback((letter) => {
    if (guessedLetters.includes(letter)) return

    const newGuessed = [...guessedLetters, letter]
    setGuessedLetters(newGuessed)
    setAnnouncement("")

    const currentIdx = difficultyOrder.indexOf(difficulty)
    const hasNextDifficulty = currentIdx < difficultyOrder.length - 1

    const newWrongCount = newGuessed.filter(l => !currentWord.includes(l)).length
    const newWon = currentWord.split('').every(l => newGuessed.includes(l))
    const newLost = newWrongCount >= languages.length - 1

    if (newWon) {
      const newStreak = winStreak + 1
      setWinStreak(newStreak)
      setBestStreak(prev => Math.max(prev, newStreak))

      if (newStreak >= WINS_NEEDED) {
        if (hasNextDifficulty) {
          const nextLevel = difficultyOrder[currentIdx + 1]
          if (!unlockedDifficulties.includes(nextLevel)) {
            const updatedUnlocked = [...unlockedDifficulties, nextLevel]
            setUnlockedDifficulties(updatedUnlocked)
            setShowLevelUp(true)
          }
        }
      } else {
        if (hasNextDifficulty && newStreak === WINS_NEEDED - 1) {
          setShowWinProgress(true)
        }
      }
    } else if (newLost) {
      setWinStreak(0)
    }
  }, [guessedLetters, difficulty, currentWord, winStreak, unlockedDifficulties])

  useEffect(() => {
    function handleKeyDown(e) {
      if (isGameOver || showLevelUp || showWinProgress) return
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.isComposing) return
      const key = e.key.toLowerCase()
      if (ALPHABET.includes(key)) {
        addLetter(key)
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [addLetter, isGameOver, showLevelUp, showWinProgress])

  const nextDifficulty = difficultyOrder[difficultyOrder.indexOf(difficulty) + 1]

  const persistState = useCallback((overrides = {}) => {
    const stateToSave = {
      difficulty,
      currentWordData,
      guessedLetters,
      hintUsed,
      winStreak,
      bestStreak,
      unlockedDifficulties,
      ...overrides,
    }
    saveGameState(stateToSave)
  }, [difficulty, currentWordData, guessedLetters, hintUsed, winStreak, bestStreak, unlockedDifficulties])

  useEffect(() => {
    persistState()
  }, [guessedLetters, difficulty, hintUsed, winStreak, bestStreak, unlockedDifficulties, currentWordData, persistState])

  // External system: keep the OS reduced-motion preference in sync
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    function handleChange() {
      setPrefersReducedMotion(mediaQuery.matches)
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Keep focus somewhere sensible when the hint button is replaced by text
  useEffect(() => {
    if (hintUsed) hintMessageRef.current?.focus()
  }, [hintUsed])

  function startNewGame() {
    setCurrentWordData(getRandomWord(difficulty, currentWord))
    setGuessedLetters([])
    setHintUsed(false)
    setAnnouncement(t("newGameStarted", { count: languages.length - 1 }))
  }

  const handleDifficultyChange = useCallback((level) => {
    const newWordData = getRandomWord(level)
    setDifficulty(level)
    setCurrentWordData(newWordData)
    setGuessedLetters([])
    setHintUsed(false)
    if (level !== difficulty) setWinStreak(0)
    setShowLevelUp(false)
    setShowWinProgress(false)
    setAnnouncement(t("difficultyChanged", { level: t(level), count: languages.length - 1 }))
  }, [difficulty, t])

  const handleLevelUpChoice = useCallback((accept) => {
    if (accept) {
      const currentIdx = difficultyOrder.indexOf(difficulty)
      const nextLevel = difficultyOrder[currentIdx + 1]
      handleDifficultyChange(nextLevel)
    } else {
      setShowLevelUp(false)
    }
  }, [difficulty, handleDifficultyChange])

  function handleWinProgressContinue() {
    setShowWinProgress(false)
  }

  return (
    <>
      {showLevelUp && (
        <LevelUpModal nextDifficulty={nextDifficulty} onChoice={handleLevelUpChoice} />
      )}
      {showWinProgress && (
        <WinProgressModal nextDifficulty={nextDifficulty} onContinue={handleWinProgressContinue} />
      )}
      <main inert={showLevelUp || showWinProgress}>
        {!prefersReducedMotion && isGameWon && (
          <div aria-hidden="true" className="confetti-layer">
            <Confetti
              recycle={false}
              numberOfPieces={1000}
            />
          </div>
        )}
        {!prefersReducedMotion && isGameLost && (
          <div aria-hidden="true" className="confetti-layer">
            <Confetti
              colors={['#444', '#666', '#888']}
              recycle={false}
              numberOfPieces={100}
              gravity={0.1}
              drawShape={(ctx) => {
                ctx.font = '20px serif';
                ctx.fillText('😢', 0, 0);
              }}
            />
          </div>
        )}
        <header>
          <h1>Assembly: Endgame</h1>
          <p>{t("subtitle")}</p>
          <p aria-hidden="true">
            {isGameOver
              ? t("bestStreak", { count: bestStreak })
              : t("attemptsLeft", { count: numGuessesLeft })}
          </p>
        </header>
        <DifficultySelector
          difficulty={difficulty}
          unlockedDifficulties={unlockedDifficulties}
          onChange={handleDifficultyChange}
        />
        <section
          aria-live="polite"
          role="status"
          className={clsx("game-status", {
            won: isGameWon,
            lost: isGameLost,
            farewell: !isGameOver && wrongGuessedCount
          })}
        >
          <GameStatus isGameOver={isGameOver} isGameWon={isGameWon} wrongGuessedCount={wrongGuessedCount} />
        </section>
        <section className="chips-container">
          {chipElements}
        </section>
        <WordDisplay currentWord={currentWord} guessedLetters={guessedLetters} isGameOver={isGameOver} />
        {!isGameOver && (
          <section className="hint-area">
            {hintUsed ? (
              <p
                className="hint-message"
                role="status"
                ref={hintMessageRef}
                tabIndex={-1}
              >
                {t("hintMessage", { category: t(currentCategory) })}
              </p>
            ) : (
              <button
                className="hint-button"
                onClick={() => setHintUsed(true)}
              >
                {t("hint")}
              </button>
            )}
          </section>
        )}
        <section
          className="sr-only"
          aria-live="polite"
          role="status"
        >
          {announcement && <p>{announcement}</p>}
          {lastGuessedLetter && !isGameOver && (
            <>
              <p>
                {currentWord.includes(lastGuessedLetter) ?
                  t("guessedRight", { letter: lastGuessedLetter }) :
                  t("guessedWrong", { letter: lastGuessedLetter })}
                {" "}{t("attemptsLeft", { count: numGuessesLeft })}
              </p>
              <p>{t("currentWord")}{" "}
                {currentWord
                  .split("")
                  .map(letter =>
                    guessedLetters.includes(letter) ? letter + "." : "blank.").join(" ")}</p>
            </>
          )}
          {isGameOver && !isGameWon && (
            <p>{t("theWordWas", { word: currentWord.toUpperCase().split("").join(" ") })}</p>
          )}
        </section>
        <Keyboard
          guessedLetters={guessedLetters}
          currentWord={currentWord}
          isGameOver={isGameOver}
          onGuess={addLetter}
        />
        {isGameOver && <button className="new-game" onClick={startNewGame}>{t("newGame")}</button>}
      </main>
    </>
  )
}
