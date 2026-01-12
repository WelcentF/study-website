/* src/App.tsx */
import { useState, useEffect } from "react";
import Timer from "./components/Timer";
import "./App.css";
import TodoModal from "./components/TodoModal";
import SpotifyPlayer from "./components/SpotifyPlayer";

function App() {
  const [isTodoVisible, setIsTodoVisible] = useState(true);
  const [isNotesVisible, setIsNotesVisible] = useState(true);

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
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX < 120) {
        setIsNotesVisible(true);
      } else if (e.clientX < 450) {
        setIsNotesVisible(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="app-container">
      {/* The aside now uses a dynamic class for visibility */}
      <aside className={`todo-section ${isTodoVisible ? "visible" : "hidden"}`}>
        <TodoModal />
      </aside>

      <main className="timer-section">
        <Timer />
      </main>

      <section className="music-section">
        <SpotifyPlayer />
      </section>

      <aside
        className={`notes-section ${isNotesVisible ? "visible" : "hidden"}`}
      >
        <p>
          NOTES
          <button onClick={() => toggleFullScreen()}>full</button>
        </p>
      </aside>
    </div>
  );
}

export default App;
