import React, { useState } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";

function Header() {
  return <h1 className="header">🔐Code Breaker</h1>;
}

function Codebreaker() {
  const [mode, setMode] = useState("a");
  const [display, setDisplay] = useState([]); // Current guess
  const [attempts, setAttempts] = useState(0);
  const [code, setCode] = useState([
    Math.floor(Math.random() * 9),
    Math.floor(Math.random() * 9),
    Math.floor(Math.random() * 9),
    Math.floor(Math.random() * 9)
  ]);
  const [guesses, setGuesses] = useState([]); // Track all guesses
  const [feedbacks, setFeedbacks] = useState([]); // Track feedbacks for guesses

  function Start() {
    return (
      <button className="start" onClick={start}>
        Start
      </button>
    );
  }

  function start() {
    setMode("b");
    setDisplay([]); // Reset the current guess
    setAttempts(0);
    setGuesses([]); // Reset guesses
    setFeedbacks([]); // Reset feedbacks
    setCode([
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9)
    ]);
  }

  function Digit(props) {
    return (
      <button className="num" onClick={() => add(props.num)} id={props.id}>
        {props.num}
      </button>
    );
  }

  function clear() {
    setDisplay([]); // Clear current guess
  }

  function Clear() {
    return <button className="btn" onClick={clear}>Clear</button>;
  }

  // Function to check the guess
  function check() {
    if (display.length < 4) return; // Ensure 4 digits are entered

    setGuesses([...guesses, display]); // Save current guess
    setAttempts(attempts + 1);

    // Compare display (guess) to the code
    let feedback = [];
    let codeCopy = [...code];
    let displayCopy = [...display];

    // First pass: Check for correct positions (exact matches)
    for (let i = 0; i < 4; i++) {
      if (displayCopy[i] === codeCopy[i]) {
        feedback.push("green");
        codeCopy[i] = null; // Remove the matched digit
        displayCopy[i] = null; // Remove the matched digit
      } else {
        feedback.push(null); // Placeholder for incorrect position
      }
    }

    // Second pass: Check for correct values (wrong positions)
    for (let i = 0; i < 4; i++) {
      if (feedback[i] === null && displayCopy[i] !== null) {
        const index = codeCopy.indexOf(displayCopy[i]);
        if (index !== -1) {
          feedback[i] = "yellow"; // Partly correct
          codeCopy[index] = null; // Remove the matched digit
        } else {
          feedback[i] = "red"; // Incorrect
        }
      }
    }

    setFeedbacks([...feedbacks, feedback]); // Save feedback for the guess

    // Check if the guess is correct
    if (JSON.stringify(display) === JSON.stringify(code)) {
      setMode("c"); // Win state
    } else if (attempts >= 7) {
      setMode("d"); // Lose state after 8 attempts
    } else {
      setDisplay([]); // Reset display for next guess
    }
  }

  function Check() {
    return <button className="btn" onClick={check}>Check</button>;
  }

  function Guess() {
    return (
      <div className="guess">
        {guesses.map((guess, index) => (
          <div key={index} className="guess-row">
            {guess.map((digit, i) => (
              <span
                key={i}
                className={`guess-digit ${feedbacks[index][i]}`}
              >
                {digit}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  }

  function add(num) {
    if (display.length < 4) {
      setDisplay([...display, num]); // Add digit to current guess
    }
  }

  if (mode === "a") {
    return (
      <div className="main">
        <h2 className="title">Click Start</h2>
        <Start />
      </div>
    );
  } else if (mode === "b") {
    return (
      <div className="main">
        <p>You have 8 attempts!</p>
        <div className="attempts">Attempts: {attempts}</div>
        <div className="keypad">
          {[...Array(10)].map((_, i) => (
            <Digit key={i} num={i} id={`num-${i + 1}`} />
          ))}
        </div>
        <div className="buttons">
          <Clear />
          <Check />
        </div>
        <div className="display">{display.join("")}</div>
        <Guess />
      </div>
    );
  } else if (mode === "c") {
    return (
      <div className="win">
        <h1>Congrats</h1>
        <p>You took {attempts} attempt{attempts > 1 ? "s" : ""}!</p>
        <Guess />
        <Start />
      </div>
    );
  } else if (mode === "d") {
    return (
      <div className="main">
        <h2>Game Over!</h2>
        <p>The code was {code}</p>
        <Guess />
        <Start />
      </div>
    );
  }
}

function App() {
  return (
    <>
      <Header />
      <Codebreaker />
    </>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
