import React from 'react';

const CombatStatusDisplay = ({ combatLog }) => {
  return (
    <div className="combat-status">
      {combatLog.map((log, index) => (
        <p key={index}>{log}</p>
      ))}
    </div>
  );
};

export default CombatStatusDisplay;
