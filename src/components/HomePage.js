// HomePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCombat } from './CombatContext'; // Asegúrate de usar la ruta correcta

const HomePage = () => {
  const [teamInput, setTeamInput] = useState('{"player": ["charizard", "mewtwo", "pikachu"], "ai": ["rattata", "raticate", "spearow"]}');
  const navigate = useNavigate();
  const { setCombatData } = useCombat();

  const handleStartCombat = async () => {
    // Suponiendo que este es el endpoint correcto y formato de datos
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
      setCombatData(data);
      navigate('/battle');
    } catch (error) {
      console.error('Failed to start combat:', error);
    }
  };

  return (
    <div>
      <textarea
        value={teamInput}
        onChange={(e) => setTeamInput(e.target.value)}
        rows="5"
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <button onClick={handleStartCombat}>Start Combat</button>
    </div>
  );
};

export default HomePage;
