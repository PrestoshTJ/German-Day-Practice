import React, { useRef, useState } from 'react'
import './App.css'
import {fairyTaleWords} from './data'


export default function App() {
  const spellRef = useRef(null)
  const wordRef = useRef(null)
  const statusRef = useRef(null)
  const posRef = useRef(null)
  const negRef = useRef(null)
  const [word, useWord] = useState("")
  const [index, useIndex] = useState(0)

  const randomizer = () => {
    wordRef.current.textContent = ""
    statusRef.current.textContent = ""
    spellRef.current.value = ""
    posRef.current.textContent = ""
    negRef.current.textContent = ""
    const randomNum = Math.floor(Math.random() * fairyTaleWords.length)
    const randomWord = fairyTaleWords[randomNum].word
    console.log(randomWord)   
    useWord(randomWord)
    useIndex(randomNum)
    vocalizer(randomWord)
  }



  const vocalizer = (randWord) => {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance()
      msg.text = randWord
      // msg.lang = "German"
      window.speechSynthesis.speak(msg)
      console.log(msg)
    } else {
      //Yeah kinda sucks for u ig
    }
  }
  // I literally dont care
  const vocalizerBypass = () => {vocalizer(word)}

  const checker = () => {
    const value = spellRef.current.value
    wordRef.current.textContent = word
    const pastScore = fairyTaleWords[index].score
    if (value == word) {
      statusRef.current.textContent = "Correct!"
      fairyTaleWords[index].score = pastScore + 1
    } else {
      statusRef.current.textContent = "Incorrect!"
      fairyTaleWords[index].score = pastScore - 1
    }
    localStorage.setItem('fairyTaleWords', JSON.stringify(fairyTaleWords))
  }

  const textAdder = (char) => {
    const pastValue = spellRef.current.value
    spellRef.current.value = pastValue + char
  }

  const statChecker = () => {
    let posCount = 0
    let negCount = 0
    for (let i = 0; i < fairyTaleWords.length; i++) {
      console.log(fairyTaleWords[i].score)
      if (fairyTaleWords[i].score > 3) {
        posCount++
      } else if (fairyTaleWords[i].score < 0) {
        negCount++
      }
    }
    posRef.current.textContent = "You have " + posCount + " Good words"
    negRef.current.textContent = "You have " + negCount + " Skill issues"
    
  }
   
  return (
    <main>
      <div>
        <h1 className = "green" ref = {posRef}></h1>
        <h1 className = "red" ref = {negRef}></h1>
      </div>
      <div>
        <button className = "btn" onClick = {randomizer}> New Word </button>
        <button className = "btn" onClick = {vocalizerBypass}> Repeat Word </button>
        <button className = "btn" onClick = {statChecker}> Stats </button>
      </div>
      <h1 ref = {wordRef} className = "trueWord"></h1>
      <div className = "form">
        <input ref = {spellRef} type = "text" />
      </div>
      <button className = "btn" onClick = {checker}> Submit </button>
      <h1 ref = {statusRef}></h1>
      <div>
        {['Ä', 'Ö', 'Ü', 'ä', 'ö', 'ü', 'ß'].map((char, index) => (
          <button key={index} onClick={() => textAdder(char)}>
            {char}
          </button>
        ))}
      </div>
    </main>
  )
}
