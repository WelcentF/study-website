import SettingsModal from "./SettingsModal";
import "./Timer.css";
import { useState, useEffect, useRef, useMemo } from "react";

const TIMER_STORAGE_KEY = "study-app-timer";

interface TimerProps {
  themeColor: string;
  onColorChange: (color: string) => void;
  onUrgentChange?: (isUrgent: boolean) => void;
}

type SavedTimer = {
  study: { h: number; m: number; s: number };
  break: { h: number; m: number; s: number };
  current: { h: number; m: number; s: number };
  isBreak: boolean;
};

function loadSavedTimer(): SavedTimer | null {
  try {
    const raw = localStorage.getItem(TIMER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedTimer;
  } catch {
    return null;
  }
}

function saveTimerState(payload: SavedTimer) {
  try {
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(payload));
  } catch (_) {}
}

function Timer({ themeColor, onColorChange, onUrgentChange }: TimerProps) {
  const saved = useMemo(() => loadSavedTimer(), []);
  const [studyHours, setStudyHours] = useState(saved?.study.h ?? 0);
  const [studyMinutes, setStudyMinutes] = useState(saved?.study.m ?? 25);
  const [studySeconds, setStudySeconds] = useState(saved?.study.s ?? 0);

  const [breakHours, setBreakHours] = useState(saved?.break.h ?? 0);
  const [breakMinutes, setBreakMinutes] = useState(saved?.break.m ?? 5);
  const [breakSeconds, setBreakSeconds] = useState(saved?.break.s ?? 0);

  const [hours, setHours] = useState(saved?.current.h ?? saved?.study.h ?? 0);
  const [minutes, setMinutes] = useState(saved?.current.m ?? saved?.study.m ?? 25);
  const [seconds, setSeconds] = useState(saved?.current.s ?? saved?.study.s ?? 0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(saved?.isBreak ?? false);

  const persistTimer = () => {
    saveTimerState({
      study: { h: studyHours, m: studyMinutes, s: studySeconds },
      break: { h: breakHours, m: breakMinutes, s: breakSeconds },
      current: { h: hours, m: minutes, s: seconds },
      isBreak,
    });
  };

  const handleStart = () => setIsActive(true);
  const handlePause = () => {
    setIsActive(false);
    // persist after state has updated (next tick)
    setTimeout(persistTimer, 0);
  };
  const handleReset = () => {
    setIsActive(false);
    if (isBreak) {
      setHours(breakHours);
      setMinutes(breakMinutes);
      setSeconds(breakSeconds);
      setTimeout(
        () =>
          saveTimerState({
            study: { h: studyHours, m: studyMinutes, s: studySeconds },
            break: { h: breakHours, m: breakMinutes, s: breakSeconds },
            current: { h: breakHours, m: breakMinutes, s: breakSeconds },
            isBreak: true,
          }),
        0,
      );
    } else {
      setHours(studyHours);
      setMinutes(studyMinutes);
      setSeconds(studySeconds);
      setTimeout(
        () =>
          saveTimerState({
            study: { h: studyHours, m: studyMinutes, s: studySeconds },
            break: { h: breakHours, m: breakMinutes, s: breakSeconds },
            current: { h: studyHours, m: studyMinutes, s: studySeconds },
            isBreak: false,
          }),
        0,
      );
    }
  };

  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const controlsRef = useRef<HTMLDivElement>(null);

  const handleSaveSettings = (studyTime: string, breakTime: string) => {
    const studyParts = studyTime.split(":").map((n) => parseInt(n) || 0);
    const breakParts = breakTime.split(":").map((n) => parseInt(n) || 0);
    const sh = studyParts[0] || 0, sm = studyParts[1] || 0, ss = studyParts[2] || 0;
    const bh = breakParts[0] || 0, bm = breakParts[1] || 0, bs = breakParts[2] || 0;
    setStudyHours(sh);
    setStudyMinutes(sm);
    setStudySeconds(ss);
    setBreakHours(bh);
    setBreakMinutes(bm);
    setBreakSeconds(bs);
    setIsActive(false);
    if (isBreak) {
      setHours(bh);
      setMinutes(bm);
      setSeconds(bs);
    } else {
      setHours(sh);
      setMinutes(sm);
      setSeconds(ss);
    }
    setTimeout(() => saveTimerState({
      study: { h: sh, m: sm, s: ss },
      break: { h: bh, m: bm, s: bs },
      current: { h: isBreak ? bh : sh, m: isBreak ? bm : sm, s: isBreak ? bs : ss },
      isBreak,
    }), 0);
  };

  const playDingSound = () => {
    const audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5,
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
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
          playDingSound();
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

  useEffect(() => {
    const isUrgentState =
      hours === 0 && minutes === 0 && seconds <= 5 && seconds > 0;
    if (onUrgentChange) {
      onUrgentChange(isUrgentState);
    }
  }, [hours, minutes, seconds, onUrgentChange]);

  // Persist timer state periodically while running (so refresh keeps progress)
  useEffect(() => {
    if (!isActive) return;
    const id = setInterval(persistTimer, 5000);
    return () => clearInterval(id);
  }, [isActive, hours, minutes, seconds, isBreak, studyHours, studyMinutes, studySeconds, breakHours, breakMinutes, breakSeconds]);

  // Hide start/reset/pause/settings when mouse isn't close to them
  useEffect(() => {
    const PROXIMITY_PX = 120;

    const handleMouseMove = (e: MouseEvent) => {
      const el = controlsRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const expanded = {
        top: rect.top - PROXIMITY_PX,
        right: rect.right + PROXIMITY_PX,
        bottom: rect.bottom + PROXIMITY_PX,
        left: rect.left - PROXIMITY_PX,
      };
      const near =
        e.clientX >= expanded.left &&
        e.clientX <= expanded.right &&
        e.clientY >= expanded.top &&
        e.clientY <= expanded.bottom;
      setIsControlsVisible(near);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div>
      <h2 className="status-title">{isBreak ? "REST" : "STUDY"}</h2>
      <div className="timer-labels">
        <span>HOURS</span>
        <span>MINUTES</span>
        <span>SECONDS</span>
      </div>
      <p
        className={`time-display ${hours === 0 && minutes === 0 && seconds <= 5 && seconds > 0 ? "urgent" : ""}`}
      >
        {hours.toString().padStart(2, "0")}:
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </p>
      <div
        ref={controlsRef}
        className={`timer-controls ${isControlsVisible ? "visible" : "hidden"}`}
      >
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
      </div>
      {openSettingsModal && (
        <SettingsModal
          closeSettingsModal={setOpenSettingsModal}
          onSaveSettings={handleSaveSettings}
          themeColor={themeColor}
          onColorChange={onColorChange}
        />
      )}
    </div>
  );
}

export default Timer;
