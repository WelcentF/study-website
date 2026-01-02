import SettingsModal from "./SettingsModal";
import "./Timer.css";
import { useState, useEffect } from "react";

function Timer() {
  const [studyHours, setStudyHours] = useState(0);
  const [studyMinutes, setStudyMinutes] = useState(25);
  const [studySeconds, setStudySeconds] = useState(0);

  const [breakHours, setBreakHours] = useState(0);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [breakSeconds, setBreakSeconds] = useState(0);

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);
  const handleReset = () => {
    setIsActive(false);
    if (isBreak) {
      setHours(breakHours);
      setMinutes(breakMinutes);
      setSeconds(breakSeconds);
    } else {
      setHours(studyHours);
      setMinutes(studyMinutes);
      setSeconds(studySeconds);
    }
  };

  const [openSettingsModal, setOpenSettingsModal] = useState(false);

  const handleSaveSettings = (studyTime: string, breakTime: string) => {
    // parse study time
    const studyParts = studyTime.split(":").map((n) => parseInt(n) || 0);
    setStudyHours(studyParts[0] || 0);
    setStudyMinutes(studyParts[1] || 0);
    setStudySeconds(studyParts[2] || 0);

    // parse break time
    const breakParts = breakTime.split(":").map((n) => parseInt(n) || 0);
    setBreakHours(breakParts[0] || 0);
    setBreakMinutes(breakParts[1] || 0);
    setBreakSeconds(breakParts[2] || 0);

    // reset timer with new values
    setIsActive(false);
    if (isBreak) {
      setHours(breakParts[0] || 0);
      setMinutes(breakParts[1] || 0);
      setSeconds(breakParts[2] || 0);
    } else {
      setHours(studyParts[0] || 0);
      setMinutes(studyParts[1] || 0);
      setSeconds(studyParts[2] || 0);
    }
  };

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

          if (nextIsBreak) {
            setHours(breakHours);
            setMinutes(breakMinutes);
            setSeconds(breakSeconds);
          } else {
            setHours(studyHours);
            setMinutes(studyMinutes);
            setSeconds(studySeconds);
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [
    isActive,
    hours,
    minutes,
    seconds,
    isBreak,
    studyHours,
    studyMinutes,
    studySeconds,
    breakHours,
    breakMinutes,
    breakSeconds,
  ]);

  return (
    <div>
      <h2 className="status-title">{isBreak ? "REST" : "STUDY"}</h2>
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
        <SettingsModal
          closeSettingsModal={setOpenSettingsModal}
          onSaveSettings={handleSaveSettings}
        />
      )}
    </div>
  );
}

export default Timer;
