import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ onCombatStart }) => {
  const [teamInput, setTeamInput] = useState('{"player": ["charizard", "mewtwo", "pikachu"], "ai": ["rattata", "raticate", "spearow"]}');
	const navigate = useNavigate();

	const handleStartClick = async () => {
		const data = await onCombatStart(teamInput);
		navigate('/battle', { state: { combatData: data } });
	};

  return (
    <>
      <textarea
        value={teamInput}
        onChange={(e) => setTeamInput(e.target.value)}
        rows="5"
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <button onClick={handleStartClick}>Start Combat</button>
    </>
  );
};

export default HomePage;
