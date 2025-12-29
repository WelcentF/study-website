import { useState, useEffect, use } from "react";

function Timer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isBreak, setIsBreak] = useState(false);

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
          // reached 00:00:00
          // setIsActive(false);

          const nextIsBreak = !isBreak;
          setIsBreak(nextIsBreak);
          setMinutes(isBreak ? 25 : 5);
          setSeconds(0);
          // alert(isBreak ? "Break Ended" : "Work Session Ended");
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, hours, minutes, seconds]);

  return (
    <p>
      {hours}:{minutes}:{seconds}
    </p>
  );
}

export default Timer;
