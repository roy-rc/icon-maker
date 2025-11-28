import React, { useState } from 'react';
import { STYLE_PRESETS, StylePreset } from '../types';
import './IconForm.css';

interface IconFormProps {
  onSubmit: (prompt: string, style: StylePreset, colors: string[]) => void;
  isLoading: boolean;
}

export const IconForm: React.FC<IconFormProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<StylePreset>('Pastels');
  const [colors, setColors] = useState<string[]>(['', '', '']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    const validColors = colors.filter(c => c.trim() !== '');
    onSubmit(prompt.trim(), style, validColors);
  };

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
  };

  return (
    <form onSubmit={handleSubmit} className="icon-form">
      <div className="form-group">
        <label htmlFor="prompt">Icon Set Theme</label>
        <input
          id="prompt"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Toys, Space, Nature, Food..."
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="style">Preset Style</label>
        <select
          id="style"
          value={style}
          onChange={(e) => setStyle(e.target.value as StylePreset)}
          disabled={isLoading}
        >
          {STYLE_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name} — {preset.description}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Brand Colors (Optional)</label>
        <div className="color-inputs">
          {colors.map((color, index) => (
            <div key={index} className="color-picker-wrapper">
              <input
                type="color"
                value={color || '#000000'}
                onChange={(e) => handleColorChange(index, e.target.value)}
                disabled={isLoading}
                className="color-picker"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                placeholder={`#${['FF5733', '33FF57', '3357FF'][index]}`}
                disabled={isLoading}
                className="color-input"
              />
            </div>
          ))}
        </div>
        <small>Pick colors or enter hex codes for custom palette</small>
      </div>

      <button type="submit" disabled={isLoading || !prompt.trim()}>
        {isLoading ? 'Generating Icons...' : 'Generate Icon Set'}
      </button>
    </form>
  );
};
