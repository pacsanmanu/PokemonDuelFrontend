import React, { useState, useEffect } from 'react';
import PokemonDetails from './PokemonDetails';
import TeamDisplay from './TeamDisplay';
import CombatStatusDisplay from './CombatStatusDisplay';
import './BattleArena.css';

const BattleArena = ({ combatData }) => {
  const [combatState, setCombatState] = useState({
    combatId: null,
    userStatus: null,
    aiStatus: null,
    userTeam: [],
    aiTeam: []
  });

  const [combatLog, setCombatLog] = useState([]);

  useEffect(() => {
    // Establecer el estado inicial con los datos pasados desde App
    if (combatData) {
      setCombatState({
        combatId: combatData.combatId,
        userStatus: combatData.playerPokemons[0], // Asumiendo que el primer Pokémon es el activo
        aiStatus: combatData.aiPokemons[0], // Asumiendo que el primer Pokémon es el activo
        userTeam: combatData.playerPokemons,
        aiTeam: combatData.aiPokemons
      });
    }
  }, [combatData]); // Dependencia de combatData para que se ejecute el efecto cuando cambie

  // Función para manejar el ataque del Pokémon del usuario
  const handleAttack = async (moveIndex) => {
    try {
      const response = await fetch('http://localhost:3000/combat/attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ combatId: combatState.combatId, moveIndex })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // Asumiendo que la respuesta del backend tiene la misma estructura que la inicial
      updateCombatState(data);
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
        body: JSON.stringify({ combatId: combatState.combatId, pokemonName, forcedChange })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
  
      updateCombatState(data);
      setCombatLog(data.result.log);
    } catch (error) {
      console.error('Failed to change Pokémon:', error);
    }
  };

  const updateCombatState = (data) => {
    setCombatState({
      combatId: data.result.combatId,
      userStatus: data.result.userStatus,
      aiStatus: data.result.aiStatus,
      userTeam: data.result.userTeam,
      aiTeam: data.result.aiTeam,
    });
  };

  return (
    <div className="battle-arena">
      <div className="arena-container">
        <div className="pokemon-container">
          {combatState.userStatus && (
            <PokemonDetails
              role="user"
              pokemon={combatState.userStatus}
              onAttack={handleAttack}
            />
          )}
        </div>
        <div className="pokemon-container">
          {combatState.aiStatus && (
            <PokemonDetails
              role="ai"
              pokemon={combatState.aiStatus}
            />
          )}
        </div>
      </div>
      <TeamDisplay
        team={combatState.userTeam}
        onChangePokemon={handleChangePokemon}
      />
      {/* Integra CombatStatusDisplay aquí */}
      <CombatStatusDisplay combatLog={combatLog} />
    </div>
);
};

export default BattleArena;
