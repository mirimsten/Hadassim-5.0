// components/BackButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css'; 

function BackButton() {
  const navigate = useNavigate();

  return (
    <div className="back-button-container">
      <button className="back-button" onClick={() => navigate(-1)}>
      ← Back
      </button>
    </div>
  );
}

export default BackButton;
