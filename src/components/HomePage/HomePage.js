import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useCombat } from '../CombatContext';

const HomePage = () => {
  const [teamInput, setTeamInput] = useState(JSON.stringify({
    player: ["pikachu"], 
    ai: ["charizard"]
  }));
  const [socket, setSocket] = useState(null); // Estado para almacenar la instancia de socket
  const navigate = useNavigate();
  const { setCombatData } = useCombat();
  const [combatId, setCombatId] = useState(''); // Estado para almacenar el combatId

  useEffect(() => {
    // Inicializar la conexión de Socket.io y almacenarla en el estado
    const newSocket = io('http://localhost:3000', { autoConnect: false });
    setSocket(newSocket);

    newSocket.on('combatStarted', (data) => {
      console.log('Combat started via socket:', data);
      setCombatData(data); // Actualiza el contexto con los datos del combate
      setCombatId(data.combatId); // Guarda el combatId recibido
      navigate('/battle'); // Navega a la página de la batalla
    });

    return () => {
      newSocket.off('combatStarted');
      newSocket.disconnect();
    };
  }, [navigate, setCombatData]);

  const handleStartRealTimeCombat = () => {
    if (socket) {
      socket.connect();
      const teams = JSON.parse(teamInput);
      socket.emit('startCombat', teams);
    } else {
      console.error('Socket is not initialized');
    }
  };

  const handleStartAICombat = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, please login');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/combat/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: teamInput
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setCombatData(data); // Actualiza el contexto con los datos del combate
      navigate('/battle'); // Navega a la página de la batalla
    } catch (error) {
      console.error('Failed to start combat against AI:', error);
    }
  };

  return (
    <div>
      <h2>Prepare for Battle</h2>
      <textarea
        value={teamInput}
        onChange={(e) => setTeamInput(e.target.value)}
        rows="5"
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <button onClick={handleStartRealTimeCombat}>Start Real-Time Combat</button>
      <button onClick={handleStartAICombat} style={{ marginTop: '10px' }}>Start Combat Against AI</button>
      {combatId && <p>Your Combat ID: {combatId}</p>} {/* Muestra el combatId si está disponible */}
    </div>
  );
};

export default HomePage;
