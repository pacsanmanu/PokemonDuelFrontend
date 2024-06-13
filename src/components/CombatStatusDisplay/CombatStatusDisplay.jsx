import React from 'react';
import './CombatStatusDisplay.css';

const CombatStatusDisplay = ({ combatLog }) => {
  return (
    <div className="combat-status-container">
      <div className="combat-status">
        <h2 className='log-title'>Combat Log</h2>
        {combatLog.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
    </div>
  );
};

export default CombatStatusDisplay;
