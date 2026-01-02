import { useState } from "react";
import "./SettingsModal.css";
import TimeInput from "./TimeInput";

interface SettingsModalProps {
  closeSettingsModal: (value: boolean) => void;
}

function SettingsModal({ closeSettingsModal }: SettingsModalProps) {
  const [studyTime, setStudyTime] = useState("");
  const [breakTime, setBreakTime] = useState("");
  const handleSave = () => {
    console.log("Saving Times:", { studyTime, breakTime });
    setStudyTime(studyTime);
    setBreakTime(breakTime);
  };

  return (
    <div className="settings-modal-background">
      <div className="settings-modal-container">
        <div className="close-button">
          <button onClick={() => closeSettingsModal(false)}> X </button>
        </div>

        <h4>TIMER SETTING</h4>

        <TimeInput
          label="Study Duration"
          value={studyTime}
          onChange={setStudyTime}
        />

        <TimeInput
          label="Break Duration"
          value={breakTime}
          onChange={setBreakTime}
        />

        <button className="save-button" onClick={handleSave}>
          Save All Settings
        </button>
      </div>
    </div>
  );
}

export default SettingsModal;
