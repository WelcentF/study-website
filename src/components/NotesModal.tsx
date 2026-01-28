import { useState, useRef, useEffect } from "react";
import "./NotesModal.css";

function NotesModal({
  isLocked,
  onLockToggle,
}: {
  isLocked: boolean;
  onLockToggle: (locked: boolean) => void;
}) {
  const [content, setContent] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("studyNotes");
    if (savedNotes) {
      setContent(savedNotes);
      if (editorRef.current) {
        editorRef.current.innerHTML = savedNotes;
      }
    }
  }, []);

  // Handle input and save to localStorage
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.innerHTML;
    setContent(text);
    localStorage.setItem("studyNotes", text);
  };

  return (
    <div className="notes-modal">
      <div className="notes-header">
        <h2>Notes</h2>
      </div>
      <div
        ref={editorRef}
        className="notes-editor"
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
      />
      <button
        className={`lock-button ${isLocked ? "locked" : ""}`}
        onClick={() => onLockToggle(!isLocked)}
        title={isLocked ? "Unlock" : "Lock"}
      >
        {isLocked ? "🔒" : "🔓"}
      </button>
    </div>
  );
}

export default NotesModal;
