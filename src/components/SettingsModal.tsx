import "./SettingsModal.css";

interface SettingsModalProps {
  closeSettingsModal: (value: boolean) => void;
}

function SettingsModal({ closeSettingsModal }: SettingsModalProps) {
  return (
    <div className="settings-modal-background">
      <div className="settings-modal-container">
        <div className="close-button">
          <button onClick={() => closeSettingsModal(false)}> X </button>
        </div>
        <div className="title">
          <h4>TIMER SETTING</h4>
        </div>
        <div className="set-time">
          <p>Study Duration</p>
          <div className="button-spacing">
            <input type="String" placeholder="00:00:00"></input>
            <button className="save-button">Save</button>
          </div>
        </div>
        <div className="set-time">
          <p>Break Duration</p>
          <div className="button-spacing">
            <input type="String" placeholder="00:00:00"></input>
            <button className="save-button">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
