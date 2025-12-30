import SettingsModal from "./SettingsModal";
import "./Timer.css";
import { useState, useEffect, use } from "react";

function Timer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isBreak, setIsBreak] = useState(false);

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);
  const handleReset = () => {
    setIsActive(false);
    setHours(0);
    setMinutes(25);
    setSeconds(0);
  };

  const [openSettingsModal, setOpenSettingsModal] = useState(false);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive) {
      interval = window.setInterval(() => {
        if (seconds > 0) {
          setSeconds((prev) => prev - 1);
        } else if (minutes > 0) {
          setMinutes((prev) => prev - 1);
          setSeconds(59);
        } else if (hours > 0) {
          setHours((prev) => prev - 1);
          setMinutes(59);
          setSeconds(59);
        } else {
          const nextIsBreak = !isBreak;
          setIsBreak(nextIsBreak);
          setMinutes(isBreak ? 25 : 5);
          setSeconds(0);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, hours, minutes, seconds]);

  return (
    <div>
      <div className="timer-labels">
        <span>HOURS</span>
        <span>MINUTES</span>
        <span>SECONDS</span>
      </div>
      <p className="time-display">
        {hours.toString().padStart(2, "0")}:
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </p>
      <div className="buttons">
        <button className="buttons reset-button" onClick={handleReset}>
          Reset
        </button>
        <button className="buttons start-button" onClick={handleStart}>
          Start
        </button>
        <button className="buttons pause-button" onClick={handlePause}>
          Pause
        </button>
      </div>
      <div className="setting-buttion-container">
        <button
          className="setting-button"
          onClick={() => {
            setOpenSettingsModal(true);
          }}
        >
          Settings
        </button>
      </div>
      {openSettingsModal && (
        <SettingsModal closeSettingsModal={setOpenSettingsModal} />
      )}
    </div>
  );
}

export default Timer;
