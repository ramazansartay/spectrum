import React from 'react';
import './Error.css';

interface ErrorProps {
  message: string;
  onRetry: () => void;
}

const Error: React.FC<ErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="error-overlay">
      <p className="error-message">{message}</p>
      <button className="retry-button" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
};

export default Error;
