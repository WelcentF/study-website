/* src/components/TodoModal.tsx */
import { useState, useRef, useEffect } from "react";
import "./TodoModal.css";

function TodoModal() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [tempTask, setTempTask] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus the textarea when it appears
  useEffect(() => {
    if (isAdding && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isAdding]);

  const handleSave = () => {
    if (tempTask.trim() !== "") {
      setTasks([...tasks, tempTask]);
    }
    setTempTask("");
    setIsAdding(false);
  };

  const handleDelete = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h3>Todo List</h3>
        <button className="add-button-circle" onClick={() => setIsAdding(true)}>
          +
        </button>
      </div>

      <ul className="list-group">
        {/* The Sliding Input Area */}
        {isAdding && (
          <li className="task-item new-task-slide">
            <textarea
              ref={textareaRef}
              value={tempTask}
              onChange={(e) => setTempTask(e.target.value)}
              placeholder="Type task..."
              className="inline-textarea"
              onBlur={handleSave} // Saves when you click away
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
                if (e.key === "Escape") {
                  setIsAdding(false);
                  setTempTask("");
                }
              }}
            />
          </li>
        )}

        {/* Existing Tasks */}
        {tasks.map((task, index) => (
          <li key={index} className="task-item">
            <span className="task-text">{task}</span>
            <button
              className="delete-button"
              onClick={() => handleDelete(index)}
            >
              delete
            </button>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && !isAdding && <p className="no-tasks">All done!</p>}
    </div>
  );
}

export default TodoModal;
