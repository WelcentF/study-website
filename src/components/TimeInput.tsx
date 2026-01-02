interface TimeInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

function TimeInput({ label, value, onChange }: TimeInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 6) {
      val = val.slice(0, 6);
    }
    let formatted = val;
    if (val.length > 4) {
      formatted = `${val.slice(0, 2)}:${val.slice(2, 4)}:${val.slice(4)}`;
    } else if (val.length > 2) {
      formatted = `${val.slice(0, 2)}:${val.slice(2)}`;
    }
    onChange(formatted);
  };
  return (
    <div className="set-time">
      <p>{label}</p>
      <div className="button-spacing">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="00:00:00"
          maxLength={8}
          className="pixel-input"
        />
      </div>
    </div>
  );
}

export default TimeInput;
