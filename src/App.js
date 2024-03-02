import React, { useState } from 'react';
import BattleArena from './components/BattleArena';
import './App.css';

const App = () => {
  const [teamInput, setTeamInput] = useState('{"player": ["charizard", "mewtwo", "pikachu"], "ai": ["rattata", "raticate", "spearow"]}');
  const [combatData, setCombatData] = useState(null); // Se almacenarán aquí los datos del combate

  const handleStartCombat = async () => {
    try {
      const response = await fetch('http://localhost:3000/combat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: teamInput
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCombatData(data); // Almacenar los datos del combate para pasárselos a BattleArena
    } catch (error) {
      console.error('Failed to start combat:', error);
    }
  };

  return (
    <div>
      {!combatData ? (
        <>
          <textarea
            value={teamInput}
            onChange={(e) => setTeamInput(e.target.value)}
            rows="5"
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <button onClick={handleStartCombat}>Start Combat</button>
        </>
      ) : (
        <BattleArena combatData={combatData} /> // Pasar los datos del combate como prop a BattleArena
      )}
    </div>
  );
};

export default App;
