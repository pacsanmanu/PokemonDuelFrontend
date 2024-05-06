import React from 'react';
import { useNavigate } from 'react-router-dom';

const WinnerDisplay = ({ winner }) => {
  const navigate = useNavigate();
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  return (
    <div className="winner-display">
      <h2>{winner === 'User' ? '¡Has ganado el combate!' : 'Has perdido el combate'}</h2>
      <button onClick={handleGoHome}>Volver a inicio</button>
    </div>
  );
};

export default WinnerDisplay;
