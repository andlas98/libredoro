import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './App.css';

function Hello() {
  const [timer, setTimer] = useState('00:00:00');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          const [hours, minutes, seconds] = prevTimer.split(':').map(Number);
          const totalSeconds = hours * 3600 + minutes * 60 + seconds + 1;
          const newHours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
          const newMinutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
          const newSeconds = String(totalSeconds % 60).padStart(2, '0');
          return `${newHours}:${newMinutes}:${newSeconds}`;
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
    console.log('Timer started');
    setIsRunning(true);
  }

  return (
    <div>
      <h1>{timer}</h1>
      <button type='button'>Resume</button>
      <button type='button' onClick={startTimer}>Restart</button>
      <button type='button'>Skip</button>
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
