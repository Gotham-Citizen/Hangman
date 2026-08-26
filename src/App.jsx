import React from "react";
import { languages } from "./languages.js";
import { useState } from "react"
import Chip from "./Chip.jsx";
import clsx from "clsx";
import { getFarewellText, getRandomWord } from "./utils.js";
import Confetti from "react-confetti"

export default function AssemblyEndGame() {
  const [currentWord, setCurrentWord] = useState(getRandomWord)
  const [guessedLetters, setGuessedLetters] = useState([])
  const wrongGuessedCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length;
  const isGameWon = currentWord.split('').every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessedCount >= languages.length - 1 
  const isGameOver = isGameWon || isGameLost
  const lastGuessedLetter = guessedLetters.at(-1)
  const numGuessesLeft = languages.length - 1 - wrongGuessedCount

  // console.log(`You have ${numGuessesLeft}`);
  const [languagesArray, setLanguagesArray] = useState(languages)
  const chipElements = languagesArray.map((language, index) =>
    <Chip key = {index} 
          index = {index}
          name = {language.name} 
          backgroundColor = {language.backgroundColor} 
          color={language.color}
          wrongGuessedCount = {wrongGuessedCount}  />
  )


  const letterElements = [...currentWord].map((letter,index) => 
    <span 
      key={index} 
      className={clsx(
        "current-letter",
        (isGameOver && !guessedLetters.includes(letter)) && "missed-letter"
      )}>
        {(guessedLetters.includes(letter) || isGameOver) && letter.toUpperCase()}
    </span>)
  
  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  const keyboardElements = [...alphabet].map(letter => 
    <button 
      key={letter} 
      className={clsx(
        guessedLetters.includes(letter) && currentWord.includes(letter) && 'right-letter', 
        guessedLetters.includes(letter) && !currentWord.includes(letter) && 'wrong-letter' 
      )}
      aria-label={letter.toUpperCase()} 
      onClick={() => {addLetter(letter)}}
      disabled = {isGameOver} 
      aria-disabled ={guessedLetters.includes(letter)}>
        {letter.toUpperCase()}
    </button>)

  function addLetter(letter) {
    setGuessedLetters(prevGuessedLetters => 
      prevGuessedLetters.includes(letter) ? prevGuessedLetters :  [...prevGuessedLetters, letter])
  }

  function renderGameStatus() {
    if (isGameOver) {
      if (isGameWon) {
        return (<>
          <h2>You win!</h2>
          <p>Congratulations!🎉</p>
        </>)
      } else {
        return (<>
          <h2>You lose!</h2>
          <p>Better start learning Assembly!😭</p>
        </>) 
      }
    } else {
      if (wrongGuessedCount) {
        return <p className="farewell-message">{ getFarewellText(languages[wrongGuessedCount - 1].name) }</p>
      }
    }
  }

  function startNewGame() {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }


  return (
    <main>
      { 
        isGameWon && 
        <Confetti 
          recycle={false} 
          numberOfPieces={1000} 
        />
      }
      {
        isGameLost && 
        <Confetti 
          width={window.innerWidth}
          height={window.innerHeight}
          colors={['#444', '#666', '#888']} 
          recycle={false} 
          numberOfPieces={100} 
          gravity={0.1} 
          drawShape={(ctx) => 
            {
              ctx.font = '20px serif'; 
              ctx.fillText('😢', 0, 0);
            }
        }/> 
      }
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word within 8 attempts to keep the programming world safe from assembly! </p>
        <p aria-hidden="true">You have {numGuessesLeft} { numGuessesLeft <= 1 ? "attempt" : "attempts"}</p>
      </header>
      <section 
        aria-live="polite"
        role="status"
        className={clsx("game-status", {
          won : isGameWon, 
          lost : isGameLost,
          farewell: !isGameOver && wrongGuessedCount
        })}
      >
        {renderGameStatus()}
      </section>
      <section className="chips-container">
        {chipElements}
      </section>
      <section className="word">
        {letterElements}
      </section>
      <section 
        className="sr-only"
        aria-live="polite"
        role="status"
      >
        <p>{ 
              currentWord.includes(lastGuessedLetter) ? 
              `You guessed right! Letter ${lastGuessedLetter} is in` : 
              `You guessed wrong! Letter ${lastGuessedLetter} is not in`
            }
            You have {numGuessesLeft} { numGuessesLeft <= 1 ? "attempt" : "attempts"}
        </p>
        <p>Current word: 
        { currentWord
          .split("")
          .map(letter => 
            guessedLetters.includes(letter) ? letter + "." : "blank.").join(" ") }</p>
      </section>
      <section className="keyboard" aria-label="keyboard">
        {keyboardElements}
      </section>
      {isGameOver && <button className = "new-game" onClick={startNewGame}>New Game</button> }
    </main>
  )
}