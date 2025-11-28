import React from 'react';
import './LoadingSpinner.css';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">Generating your icon set...</p>
      <p className="loading-subtext">This may take 20-30 seconds</p>
    </div>
  );
};
