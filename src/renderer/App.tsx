/* eslint-disable no-alert */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function Hello() {
  const [sessionBTimer, setSessionBTimer] = useState('00:00');
  const [sessionBElapsedTime, setSessionBElapsedTime] = useState('00:00');
  const [isSessionBRunning, setIsSessionBRunning] = useState(false);

  interface Timer {
    name: string;
    currentTime: string;
    setTime: string;
    status: boolean; // true = active (could be playing or paused), false = inactive (not playing)
  }

  // setTime = the time the user sets on the timer
  // currentTime = the time currently displaying on its corresponding timer, regardless of whether a timer is paused, active, or in another state
  const [seshATimer, setSeshATimer] = useState<Timer>({
    name: 'Timer A',
    currentTime: '00:00',
    setTime: '00:00',
    status: false,
  });

  const [seshBTimer, setSeshBTimer] = useState<Timer>({
    name: 'Timer B',
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

  function checkForInvalidSetTime(
    seshAMinutes: String,
    seshASeconds: String,
    seshBMinutes: String,
    seshBSeconds: String,
  ) {
    if (
      (seshAMinutes === '00' && seshASeconds === '00') ||
      (seshBMinutes === '00' && seshBSeconds === '00')
    ) {
      alert('Please enter a valid time for Session A.');
    }
  }

  useEffect(() => {
    if (seshATimer.currentTime === '00:00') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Start Session B when Session A finishes
      setSeshBTimer((prev) => updateTimerStatus(prev, true));
      if (
        seshBTimer.currentTime === '00:00' &&
        seshBTimer.setTime !== '00:00'
      ) {
        setSeshBTimer((prev) =>
          updateTimerCurrentTime(prev, seshBTimer.setTime),
        );
      }
      return;
    }

    if (seshATimer.status && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setSeshATimer((prev) => {
          const [minutes, seconds] = prev.currentTime.split(':').map(Number);
          const totalSeconds = minutes * 60 + seconds - 1;
          const newMinutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
          const newSeconds = String(totalSeconds % 60).padStart(2, '0');
          const newTime = `${newMinutes}:${newSeconds}`;
          return updateTimerCurrentTime(prev, newTime);
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [seshATimer.status, seshATimer.currentTime, updateTimerCurrentTime]);

  // Handles Session B countdown and transition back to Session A
  useEffect(() => {
    if (seshBTimer.currentTime === '00:00' && seshBTimer.status) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Optionally, restart Session A or stop both timers here
      setSeshATimer((prev) => updateTimerStatus(prev, true));
      if (
        seshATimer.currentTime === '00:00' &&
        seshATimer.setTime !== '00:00'
      ) {
        setSeshATimer((prev) =>
          updateTimerCurrentTime(prev, seshATimer.setTime),
        );
      }
      return;
    }

    if (seshBTimer.status && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setSeshBTimer((prev) => {
          const [minutes, seconds] = prev.currentTime.split(':').map(Number);
          const totalSeconds = minutes * 60 + seconds - 1;
          const newMinutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
          const newSeconds = String(totalSeconds % 60).padStart(2, '0');
          const newTime = `${newMinutes}:${newSeconds}`;
          return updateTimerCurrentTime(prev, newTime);
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [seshBTimer.status, seshBTimer.currentTime, updateTimerCurrentTime]);

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

    checkForInvalidSetTime(
      sessionAMinutes,
      sessionASeconds,
      sessionBMinutes,
      sessionBSeconds,
    );

    const setTimeA = `${String(sessionAMinutes).padStart(2, '0')}:${String(sessionASeconds).padStart(2, '0')}`;
    const setTimeB = `${String(sessionBMinutes).padStart(2, '0')}:${String(sessionBSeconds).padStart(2, '0')}`;

    setSeshATimer((prev) => {
      let updated = updateTimerCurrentTime(prev, setTimeA);
      updated = updateTimerSetTime(updated, setTimeA);
      updated = updateTimerStatus(updated, true); // Start Session A
      return updated;
    });

    setSeshBTimer((prev) => {
      let updated = updateTimerCurrentTime(prev, setTimeB);
      updated = updateTimerSetTime(updated, setTimeB);
      updated = updateTimerStatus(updated, false); // Do NOT start Session B yet
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
        <h1>{seshBTimer.currentTime}</h1>
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
