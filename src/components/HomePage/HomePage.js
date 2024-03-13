// HomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCombat } from '../CombatContext';

const HomePage = () => {
  const [teamInput, setTeamInput] = useState('');
  const navigate = useNavigate();
  const { setCombatData } = useCombat();

  useEffect(() => {
    const fetchUserTeam = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
          console.error('No token found, please login');
          navigate('/login');
          return;
      }

      try {
          const response = await fetch('http://localhost:3000/users/me', {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`
              },
          });
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json();
          if(data && data.team) {
            setTeamInput(JSON.stringify({
              player: data.team,
              ai: ["rattata"]
            }));
          }
      } catch (error) {
          console.error('Failed to fetch user team:', error);
      }
    };

    fetchUserTeam();
  }, [navigate]);

  const handleStartCombat = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found, please login');
        navigate('/login');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/combat/start', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
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
        readOnly
      />
      <button onClick={handleStartCombat}>Start Combat</button>
    </div>
  );
};

export default HomePage;
