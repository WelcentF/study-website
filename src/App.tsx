/* src/App.tsx */
import { useState, useEffect } from "react";
import Timer from "./components/Timer";
import "./App.css";
import TodoModal from "./components/TodoModal";
import NotesModal from "./components/NotesModal";
import SpotifyPlayer from "./components/SpotifyPlayer";
import ColorPicker from "./components/ColorPicker";

function App() {
  const [isTodoVisible, setIsTodoVisible] = useState(true);
  const [isNotesVisible, setIsNotesVisible] = useState(false);
  const [isTodoLocked, setIsTodoLocked] = useState(false);
  const [isNotesLocked, setIsNotesLocked] = useState(false);
  const [themeColor, setThemeColor] = useState("#92cd41");
  const [isUrgent, setIsUrgent] = useState(false);

  const toggleFullScreen = (): void => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isTodoLocked) return;
      // Show if cursor is near left edge (within 50px)
      if (e.clientX < 50) {
        setIsTodoVisible(true);
      }
      // Hide if cursor moves away (past 450px to give space for the modal)
      else if (e.clientX > 450) {
        setIsTodoVisible(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isTodoLocked]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isNotesLocked) return;
      // Show if cursor is near right edge (within 50px)
      if (e.clientX > window.innerWidth - 50) {
        setIsNotesVisible(true);
      }
      // Hide if cursor moves away from the modal area (past 450px from right edge)
      else if (e.clientX < window.innerWidth - 450) {
        setIsNotesVisible(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isNotesLocked]);

  // Update CSS variables when theme color changes
  useEffect(() => {
    document.documentElement.style.setProperty("--theme-color", themeColor);
    // Calculate darker shade for shadows/accents
    const rgb = parseInt(themeColor.slice(1), 16);
    const r = Math.max(0, ((rgb >> 16) & 255) - 40);
    const g = Math.max(0, ((rgb >> 8) & 255) - 40);
    const b = Math.max(0, (rgb & 255) - 40);
    const darkerShade = `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
    document.documentElement.style.setProperty(
      "--theme-color-dark",
      darkerShade,
    );
  }, [themeColor]);

  return (
    <div className={`app-container ${isUrgent ? "urgent-border" : ""}`}>
      <button className="fullscreen-button" onClick={toggleFullScreen}>
        ⛶
      </button>

      {/* The aside now uses a dynamic class for visibility */}
      <aside className={`todo-section ${isTodoVisible ? "visible" : "hidden"}`}>
        <TodoModal isLocked={isTodoLocked} onLockToggle={setIsTodoLocked} />
      </aside>

      <main className="timer-section">
        <Timer
          themeColor={themeColor}
          onColorChange={setThemeColor}
          onUrgentChange={setIsUrgent}
        />
      </main>

      <section className="music-section">
        <SpotifyPlayer />
      </section>

      <aside
        className={`notes-section ${isNotesVisible ? "visible" : "hidden"}`}
      >
        <NotesModal isLocked={isNotesLocked} onLockToggle={setIsNotesLocked} />
      </aside>
    </div>
  );
}

export default App;
