import { useState } from "react";
import "./SettingsModal.css";
import TimeInput from "./TimeInput";

interface SettingsModalProps {
  closeSettingsModal: (value: boolean) => void;
  onSaveSettings: (studyTime: string, breakTime: string) => void;
  themeColor: string;
  onColorChange: (color: string) => void;
}

function SettingsModal({
  closeSettingsModal,
  onSaveSettings,
  themeColor,
  onColorChange,
}: SettingsModalProps) {
  const [studyTime, setStudyTime] = useState("00:25:00");
  const [breakTime, setBreakTime] = useState("00:05:00");
  const handleSave = () => {
    console.log("Saving Times:", { studyTime, breakTime });
    onSaveSettings(studyTime, breakTime); // callback function to pass times to Timer
    closeSettingsModal(false); // closing modal
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

        <div className="color-picker-section">
          <label htmlFor="theme-color-input">Theme Color</label>
          <input
            id="theme-color-input"
            type="color"
            value={themeColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="color-input"
          />
        </div>

        <button className="save-button" onClick={handleSave}>
          Save All Settings
        </button>
      </div>
    </div>
  );
}

export default SettingsModal;
