import Timer from "./components/Timer";
import "./App.css";
import TodoModal from "./components/TodoModal";

function App() {
  return (
    <div className="app-container">
      <div className="todo-box">
        <TodoModal />
      </div>
      <main>
        <Timer />
      </main>
    </div>
  );
}

export default App;
