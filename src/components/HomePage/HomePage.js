// HomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useCombat } from '../CombatContext';

const HomePage = () => {
  const [teamInput, setTeamInput] = useState('{"player": ["rayquaza-mega", "groudon-primal", "metagross-mega", "mewtwo-mega-y"], "ai": ["rattata", "raticate", "spearow"]}');
  const navigate = useNavigate();
  const { setCombatData } = useCombat();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establece la conexión de Socket.io cuando el componente se monta
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('combatStarted', (data) => {
      console.log('Combat started via socket:', data);
      setCombatData(data);
      navigate('/battle');
    });

    // Limpieza al desmontar el componente
    return () => {
      newSocket.off('combatStarted');
      newSocket.disconnect();
    };
  }, [navigate, setCombatData]); // Asegúrate de que las dependencias sean correctas

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

  const handleStartRealTimeCombat = () => {
    if (socket) {
      socket.connect(); // Asegura que el socket esté conectado
      const teams = JSON.parse(teamInput); // Parsea el input del usuario
      socket.emit('combatAction', { action: 'startCombat', data: teams }); // Ajusta según la acción esperada por tu servidor
    } else {
      console.error('Socket is not initialized');
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
      <button onClick={handleStartCombat}>Start Combat Against AI</button>
      <button onClick={handleStartRealTimeCombat} style={{ marginTop: '10px' }}>Start Real-Time Combat</button>
    </div>
  );
};

export default HomePage;
