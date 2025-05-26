import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './App.css';

function Hello() {
  const [sessionATimer, setSessionATimer] = useState('00:00');
  const [sessionBTimer, setSessionBTimer] = useState('00:00');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSessionATimer((prevTimer) => {
          const [minutes, seconds] = prevTimer.split(':').map(Number);
          if (minutes === 0 && seconds === 0) {
            setIsRunning(false);
            return '00:00'; // Reset timer when it reaches zero
          }
          const totalSeconds = minutes * 60 + seconds - 1;
          const newMinutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
          const newSeconds = String(totalSeconds % 60).padStart(2, '0');
          return `${newMinutes}:${newSeconds}`;
        });
      }, 1000);
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  function startTimer() {
    const minutesInput = document.getElementById('session-a-minutes') as HTMLInputElement;
    const secondsInput = document.getElementById('session-a-seconds') as HTMLInputElement;

    const minutes = minutesInput?.value || '00';
    const seconds = secondsInput?.value || '00';

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    setSessionATimer(`${formattedMinutes}:${formattedSeconds}`);
    console.log('Timer started');
    setIsRunning(true);
  }

  return (
    <div>
      <div id="session-a-timer">
        <p>Session A</p>
        <h1>{sessionATimer}</h1>
        <input type="number" name="" id="session-a-minutes" />
        <input type="number" name="" id="session-a-seconds" />
      </div>
      <div id="session-b-timer">
        <p>Session B</p>
        <h1>{sessionBTimer}</h1>
        <input type="number" name="" id="" />
        <input type="number" name="" id="" />
      </div>
      <button class="start-timer-btn" type='button' onClick={startTimer}>GO!</button>

      <div className="timer-control-btns">
        <button type='button'>Restart</button>
        <button type='button'>Resume</button>
        <button type='button'>Skip</button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
