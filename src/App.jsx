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
  const [wordSubmitted, setWordSubmitted] = useState(false)

  const randomizer = () => {
    setWordSubmitted(false)
    wordRef.current.textContent = ""
    statusRef.current.textContent = ""
    spellRef.current.value = ""
    posRef.current.textContent = ""
    negRef.current.textContent = ""
    
    let masteredWord = true
    let safetyCount = 0
    
    while (masteredWord) {
      const randomNum = Math.floor(Math.random() * fairyTaleWords.length)
      
      if (fairyTaleWords[randomNum].score < 4) {
        masteredWord = false
        const randomWord = fairyTaleWords[randomNum].word  
        useWord(randomWord)
        useIndex(randomNum)
        vocalizer(randomWord)
        console.log(fairyTaleWords[randomNum].score)
      }
      
      if (safetyCount > 10000) {
        //Game over message. Also idrc to implement a better solution. Ain't no way it can go over 10,000 times if there is still a word left.
        masteredWord = false
      }
      safetyCount++
    }
  }

  const vocalizer = (randWord) => {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance()
      msg.text = randWord
      msg.lang = "de-DE"
      window.speechSynthesis.speak(msg)
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
    setWordSubmitted(true)
  }

  const textAdder = (char) => {
    const pastValue = spellRef.current.value
    spellRef.current.value = pastValue + char
  }

  const statChecker = () => {
    let posCount = 0
    let negCount = 0
    
    for (let i = 0; i < fairyTaleWords.length; i++) {
      if (fairyTaleWords[i].score > 3) {
        posCount++
      } else if (fairyTaleWords[i].score < 0) {
        negCount++
      }
    }
    
    posRef.current.textContent = "You have " + posCount + " Good words"
    negRef.current.textContent = "You have " + negCount + " Skill issues"   
  }

  const nounChecker = () => {
    let result = "no"
    if (word[0] == word[0].toUpperCase() ) {
      result = "yes"
    }
    
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance()
      msg.text = result
      window.speechSynthesis.speak(msg)
    } else {
      //Yeah kinda sucks for u ig
    }
  }

  const reset = () => {
    localStorage.removeItem('fairyTaleWords')
    location.reload()
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
        <button className = "btn" onClick = {nounChecker}> Ist es ein Nommen? </button>
        <button className = "btn" onClick = {statChecker}> Stats </button>
        
      </div>
      
      <h1 ref = {wordRef} className = "trueWord"></h1>
      <div className = "form">
        <input spellCheck = "false" ref = {spellRef} type = "text" />
      </div>
      
      <button className = "btn" onClick = {checker} disabled = {wordSubmitted}> Submit </button>
      <h1 ref = {statusRef}></h1>
      
      <div>
        {['Ä', 'Ö', 'Ü', 'ä', 'ö', 'ü', 'ß'].map((char, index) => (
          <button key={index} onClick={() => textAdder(char)}>
            {char}
          </button>
        ))}
      </div>
      
      <button className = "btn" onClick = {reset}> Reset </button>
    </main>
  )
}
