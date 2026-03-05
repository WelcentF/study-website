/* src/App.tsx */
import { useState, useEffect } from "react";
import Timer from "./components/Timer";
import "./App.css";
import TodoModal from "./components/TodoModal";
import NotesModal from "./components/NotesModal";
import SpotifyPlayer from "./components/SpotifyPlayer";

const STORAGE_KEYS = {
  THEME: "study-app-theme",
  LOCKS: "study-app-locks",
  DARK_MODE: "study-app-dark-mode",
} as const;

function getInitialTheme(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) return saved;
  } catch (_) {}
  return "#92cd41";
}

function getInitialLocks(): { todo: boolean; notes: boolean } {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LOCKS);
    if (saved) {
      const parsed = JSON.parse(saved) as { todoLocked?: boolean; notesLocked?: boolean };
      return { todo: !!parsed.todoLocked, notes: !!parsed.notesLocked };
    }
  } catch (_) {}
  return { todo: false, notes: false };
}

function getInitialDarkMode(): boolean {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (saved !== null) return saved === "true";
  } catch (_) {}
  return false;
}

function App() {
  const [isTodoVisible, setIsTodoVisible] = useState(true);
  const [isNotesVisible, setIsNotesVisible] = useState(false);
  const [isTodoLocked, setIsTodoLocked] = useState(() => getInitialLocks().todo);
  const [isNotesLocked, setIsNotesLocked] = useState(() => getInitialLocks().notes);
  const [themeColor, setThemeColor] = useState(getInitialTheme);
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isFullscreenButtonVisible, setIsFullscreenButtonVisible] =
    useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(isDarkMode));
    } catch (_) {}
  }, [isDarkMode]);

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

  // Hide fullscreen button when mouse isn't near it (top-right corner)
  useEffect(() => {
    const PROXIMITY_PX = 100; // show button when mouse is within this many px of top-right

    const handleMouseMove = (e: MouseEvent) => {
      const nearTop = e.clientY < PROXIMITY_PX;
      const nearRight = e.clientX > window.innerWidth - PROXIMITY_PX;
      setIsFullscreenButtonVisible(nearTop && nearRight);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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

  // Persist theme when it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, themeColor);
    } catch (_) {}
  }, [themeColor]);

  // Persist lock state when it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.LOCKS,
        JSON.stringify({ todoLocked: isTodoLocked, notesLocked: isNotesLocked }),
      );
    } catch (_) {}
  }, [isTodoLocked, isNotesLocked]);

  return (
    <div className={`app-container ${isUrgent ? "urgent-border" : ""}`}>
      <div className={`top-right-buttons ${isFullscreenButtonVisible ? "visible" : "hidden"}`}>
        <button
          className="theme-toggle-button"
          onClick={() => setIsDarkMode((d) => !d)}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={isDarkMode ? "Light mode" : "Dark mode"}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
        <button className="fullscreen-button" onClick={toggleFullScreen}>
          ⛶
        </button>
      </div>

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
