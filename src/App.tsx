/* src/App.tsx */
import Timer from "./components/Timer";
import "./App.css";
import TodoModal from "./components/TodoModal";

function App() {
  const toggleFullScreen = (): void => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="app-container">
      <aside className="todo-section">
        <TodoModal />
      </aside>

      <main className="timer-section">
        <Timer />
      </main>

      <section className="music-section">
        {/* Replace with your Music component later */}
        <p>MUSIC PLAYER</p>
      </section>

      <aside className="notes-section">
        {/* Replace with your Notes component later */}
        <p>NOTES</p>
        <button onClick={() => toggleFullScreen()}>full</button>
      </aside>
    </div>
  );
}

export default App;
