import React, { useState } from "react";
import "./ColorPicker.css";

interface ColorPickerProps {
  onColorChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#92cd41");

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setSelectedColor(color);
    onColorChange(color);
  };

  return (
    <div className="color-picker-container">
      <button
        className="color-picker-button"
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: selectedColor }}
        title="Change theme color"
      >
        🎨
      </button>
      {isOpen && (
        <div className="color-picker-popup">
          <input
            type="color"
            value={selectedColor}
            onChange={handleColorChange}
            className="color-input"
          />
          <button
            className="color-picker-close"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
