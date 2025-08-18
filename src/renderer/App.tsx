/* eslint-disable no-alert */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function Hello() {
  const [sessionATimer, setSessionATimer] = useState('00:00');
  const [sessionAElapsedTime, setSessionAElapsedTime] = useState('00:00');
  const [sessionBTimer, setSessionBTimer] = useState('00:00');
  const [sessionBElapsedTime, setSessionBElapsedTime] = useState('00:00');
  const [isSessionARunning, setIsSessionARunning] = useState(false);
  const [isSessionBRunning, setIsSessionBRunning] = useState(false);

  interface Timer {
    name: string;
    currentTime: string;
    setTime: string;
    status: boolean; // true = active (could be playing or paused), false = inactive (not playing)
  }

  const [seshATimer, setSeshATimer] = useState<Timer>({
    name: 'Timer A',
    currentTime: '00:00',
    setTime: '00:00',
    status: false,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Helper functions for Timer interface
  function updateTimerName(timer: Timer, newName: string): Timer {
    return { ...timer, name: newName };
  }

  const updateTimerCurrentTime = React.useCallback(
    (timer: Timer, newCurrentTime: string): Timer => {
      return { ...timer, currentTime: newCurrentTime };
    },
    [],
  );

  function updateTimerSetTime(timer: Timer, newSetTime: string): Timer {
    return { ...timer, setTime: newSetTime };
  }

  function updateTimerStatus(timer: Timer, newStatus: boolean): Timer {
    return { ...timer, status: newStatus };
  }

  useEffect(() => {
    if (seshATimer.currentTime === '00:00') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (seshATimer.status && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setSeshATimer((prev) => {
          const [minutes, seconds] = prev.currentTime.split(':').map(Number);
          const totalSeconds = minutes * 60 + seconds - 1;
          const newMinutes = String(
            Math.floor((totalSeconds % 3600) / 60),
          ).padStart(2, '0');
          const newSeconds = String(totalSeconds % 60).padStart(2, '0');
          const newTime = `${newMinutes}:${newSeconds}`;
          return updateTimerCurrentTime(prev, newTime);
        });
      }, 1000);
    }
  }, [seshATimer.status, seshATimer.currentTime, updateTimerCurrentTime]);

  function startPomodoro() {
    const sessionAMinutesInput = document.getElementById(
      'session-a-minutes',
    ) as HTMLInputElement;
    const sessionASecondsInput = document.getElementById(
      'session-a-seconds',
    ) as HTMLInputElement;
    const sessionBMinutesInput = document.getElementById(
      'session-b-minutes',
    ) as HTMLInputElement;
    const sessionBSecondsInput = document.getElementById(
      'session-b-seconds',
    ) as HTMLInputElement;

    const sessionAMinutes = sessionAMinutesInput?.value || '00';
    const sessionASeconds = sessionASecondsInput?.value || '00';
    const sessionBMinutes = sessionBMinutesInput?.value || '00';
    const sessionBSeconds = sessionBSecondsInput?.value || '00';

    if (sessionAMinutes === '00' && sessionASeconds === '00') {
      alert('Please enter a valid time for Session A.');
      return;
    }

    const newTime = `${String(sessionAMinutes).padStart(2, '0')}:${String(sessionASeconds).padStart(2, '0')}`;
    setSeshATimer((prev) => {
      let updated = updateTimerCurrentTime(prev, newTime);
      updated = updateTimerSetTime(updated, newTime);
      updated = updateTimerStatus(updated, true);
      return updated;
    });
  }

  return (
    <div>
      <div id="session-a-timer">
        <p>Session A</p>
        <h1>{seshATimer.currentTime}</h1>
        <input type="number" name="" id="session-a-minutes" />
        <input type="number" name="" id="session-a-seconds" />
      </div>
      <div id="session-b-timer">
        <p>Session B</p>
        <h1>{sessionBElapsedTime}</h1>
        <input type="number" name="" id="session-b-minutes" />
        <input type="number" name="" id="session-b-seconds" />
      </div>
      <button className="start-timer-btn" type="button" onClick={startPomodoro}>
        GO!
      </button>

      <div className="timer-control-btns">
        <button type="button">Restart</button>
        <button type="button">Resume</button>
        <button type="button">Skip</button>
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
