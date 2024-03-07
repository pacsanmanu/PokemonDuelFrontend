import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCombat } from './CombatContext'; // Ajusta la ruta según tu estructura de archivos
import PokemonDetails from './PokemonDetails';
import TeamDisplay from './TeamDisplay';
import CombatStatusDisplay from './CombatStatusDisplay';
import './BattleArena.css';

const BattleArena = () => {
  const { combatData, setCombatData } = useCombat();
  const navigate = useNavigate();
  const [combatState, setCombatState] = useState({
    combatId: null,
    userStatus: null,
    aiStatus: null,
    userTeam: [],
    aiTeam: []
  });
  const [combatLog, setCombatLog] = useState([]);

  useEffect(() => {
    if (combatData) {
      // Actualiza este estado inicial basado en la estructura de tus datos
      setCombatState({
        combatId: combatData.combatId,
        userStatus: combatData.playerPokemons[0], // Asumiendo que el primer Pokémon es el activo
        aiStatus: combatData.aiPokemons[0],
        userTeam: combatData.playerPokemons,
        aiTeam: combatData.aiPokemons
      });
    }
  }, [combatData]);

  const handleAttack = async (moveIndex) => {
    try {
      const response = await fetch('http://localhost:3000/combat/attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          combatId: combatState.combatId,
          moveIndex
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCombatState(prevState => ({
        ...prevState,
        userStatus: data.result.userStatus,
        aiStatus: data.result.aiStatus,
      }));
      setCombatLog(data.result.log);
    } catch (error) {
      console.error('Failed to execute attack:', error);
    }
  };

  const handleChangePokemon = async (pokemonName, forcedChange = false) => {
    try {
      if (combatState.userStatus && combatState.userStatus.stats.life <= 0) {
        forcedChange = true;
      }
      const response = await fetch('http://localhost:3000/combat/change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          combatId: combatState.combatId,
          pokemonName,
          forcedChange
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCombatState(prevState => ({
        ...prevState,
        userStatus: data.result.userStatus,
      }));
      setCombatLog(data.result.log);
    } catch (error) {
      console.error('Failed to change Pokémon:', error);
    }
  };

  // Función para manejar el fin del combate y posiblemente reiniciar los datos
  const handleEndCombat = () => {
    setCombatData(null); // Limpia los datos del combate del contexto global
    navigate('/'); // Navega de vuelta a la HomePage
  };

  return (
    <div className="battle-arena">
      <div className="arena-container">
        {combatState.userStatus && (
          <PokemonDetails
            role="user"
            pokemon={combatState.userStatus}
            onAttack={handleAttack}
          />
        )}
        {combatState.aiStatus && (
          <PokemonDetails
            role="ai"
            pokemon={combatState.aiStatus}
          />
        )}
      </div>
      <TeamDisplay
        team={combatState.userTeam}
        onChangePokemon={handleChangePokemon}
      />
      <CombatStatusDisplay combatLog={combatLog} />
      {/* Considera agregar un botón o mecanismo para manejar el fin del combate */}
      <button onClick={handleEndCombat}>End Combat</button>
    </div>
  );
};

export default BattleArena;
