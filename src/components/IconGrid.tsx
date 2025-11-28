import React from 'react';
import { GeneratedIcon } from '../types';
import { downloadImage } from '../api';
import './IconGrid.css';

interface IconGridProps {
  icons: GeneratedIcon[];
  theme: string;
  style: string;
}

export const IconGrid: React.FC<IconGridProps> = ({ icons, theme, style }) => {
  const handleDownload = async (icon: GeneratedIcon) => {
    try {
      const filename = `${theme.toLowerCase().replace(/\s+/g, '-')}-${icon.index}.png`;
      await downloadImage(icon.url, filename);
    } catch (error) {
      alert('Failed to download image. Please try again.');
    }
  };

  const handleDownloadAll = async () => {
    for (const icon of icons) {
      await handleDownload(icon);
      // Small delay between downloads to avoid browser blocking
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="icon-grid-container">
      <div className="icon-grid-header">
        <h2>Generated Icon Set</h2>
        <div className="metadata">
          <span className="badge">Theme: {theme}</span>
          <span className="badge">Style: {style}</span>
        </div>
        <button onClick={handleDownloadAll} className="download-all-btn">
          Download All Icons
        </button>
      </div>

      <div className="icon-grid">
        {icons.map((icon) => (
          <div key={icon.index} className="icon-card">
            <div className="icon-image-wrapper">
              <img src={icon.url} alt={`${theme} icon ${icon.index}`} />
            </div>
            <div className="icon-card-footer">
              <span className="icon-number">Icon {icon.index}</span>
              <button 
                onClick={() => handleDownload(icon)}
                className="download-btn"
              >
                Download PNG
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
