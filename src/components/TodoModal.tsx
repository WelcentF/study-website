import { useState } from "react";
import "./TodoModal.css";

function TodoModal() {
  const [tasks, setTasks] = useState([""]);
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim() === "") {
      return;
    }
    setTasks([...tasks, inputValue]);
    setInputValue("");
  };

  const handleDelete = (taskToDelete: string) => {
    setTasks(tasks.filter((task) => task !== taskToDelete));
  };

  return (
    <div className="todo-container">
      <h3>Todo List</h3>

      <div className="add-task-row">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add task"
          className="pixel-textarea"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <button className="add-button" onClick={handleAdd}>
          +
        </button>
      </div>

      {tasks.length === 0 && <p className="no-tasks">All done!</p>}

      <ul className="list-group">
        {tasks.map((task, index) => (
          <li key={index} className="task-item">
            <span className="task-text">{task}</span>
            <div className="task-buttons">
              <button
                className="delete-button"
                onClick={() => handleDelete(task)}
              >
                delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoModal;
