import React, { useState } from 'react';
import PokemonStatus from './components/PokemonStatus.js';
import CombatControls from './components/CombatControls.js';

function App() {
  const [teamInput, setTeamInput] = useState('');
  const [combatStatus, setCombatStatus] = useState(null);

  const handleStartCombat = async () => {
    const teams = JSON.parse(teamInput);
    try{
      const response = await fetch('http://localhost:3000/combat/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teams),
      });
      const data = await response.json();
      setCombatStatus(data);
    }catch (error){
      console.log('Failed to fetch', error.message);
    }
  };

  return (
    <div className="App">
      <h1>Pokémon Combat</h1>
      <textarea value={teamInput} onChange={(e) => setTeamInput(e.target.value)} placeholder="Insert teams JSON here" />
      <button onClick={handleStartCombat}>Start Combat</button>
      {combatStatus && <PokemonStatus userStatus={combatStatus.UserStatus} aiStatus={combatStatus.AIStatus} />}
      {combatStatus && <CombatControls combatStatus={combatStatus} />}
    </div>
  );
}

export default App;
