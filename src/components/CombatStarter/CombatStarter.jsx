import React from 'react';
import './CombatStarter.css';

const CombatStarter = ({ onStartCombat }) => (
  <div className="combat-starter-container">
    <button onClick={onStartCombat} className="combat-starter-button">
      <img src={'images/fight.webp'} alt="Start Combat" />
    </button>
  </div>
);

export default CombatStarter;
