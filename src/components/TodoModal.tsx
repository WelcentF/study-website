import "./TodoModal.css";

function TodoModal() {
  const tasks = ["hi", "ww", "ss"];

  const addTask = (task: string) => {
    return;
  };

  const handleDelete = () => {};

  return (
    <div>
      <h3>Todo List</h3>
      {tasks.length === 0 && <p>No Tasks</p>}
      <ul className="list-group">
        {tasks.map((task) => (
          <li key={task} className="task">
            {task}
            <button onClick={handleDelete}>delete</button>
            <button>edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoModal;
