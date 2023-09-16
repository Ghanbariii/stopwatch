import React, { useState, useEffect, useRef } from 'react';
import { formatSeconds } from './format'; 

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [startTimer, setStartTimer] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState<string[]>([]);
  const [lapIsClicked, setLapIsClicked] = useState(false); // New state for lap button
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      setStartTimer(Date.now() - elapsedTime);
      intervalRef.current = window.setInterval(() => {
        setElapsedTime(Date.now() - startTimer!);
      }, 10);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, startTimer, elapsedTime]);

  const startStop = () => {
    setIsRunning(!isRunning);
  };

  const lap = () => {
    setLapIsClicked(true); // Set lapIsClicked to true when the lap button is clicked
    setLaps([...laps, formatTime(elapsedTime)]);
  };

  const formatTime = (timeInMilliseconds: number) => {
    const timeInSeconds = Math.floor(timeInMilliseconds / 10);
    return formatSeconds(timeInSeconds); // Use formatSeconds function
  };

  return (
    <div>
      <button onClick={startStop}>{isRunning ? 'Stop' : 'Start'}</button>
      <button onClick={lap}>
        Lap
      </button>
      <div>
        <p>Elapsed:</p> <pre id="elapsed">{formatTime(elapsedTime)}</pre>
      </div>
      <hr />
      {lapIsClicked && (
        <div id="laps">
          <p>Lap:</p>
          <ul>
            {laps.map((lapTime, index) => (
              <li key={index}>{lapTime}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
