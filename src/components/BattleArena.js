import React, { useState, useEffect } from 'react';
import PokemonDetails from './PokemonDetails'; // Asegúrate de que este componente esté correctamente implementado
import TeamDisplay from './TeamDisplay'; // Asegúrate de que este componente esté correctamente implementado

const BattleArena = ({ combatData }) => {
  const [combatState, setCombatState] = useState({
    combatId: null,
    userStatus: null,
    aiStatus: null,
    userTeam: [],
    aiTeam: []
  });

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
    } catch (error) {
      console.error('Failed to execute attack:', error);
    }
  };

  // Función para manejar el cambio de Pokémon del usuario
  const handleChangePokemon = async (pokemonName) => {
    try {
      const response = await fetch('http://localhost:3000/combat/change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ combatId: combatState.combatId, pokemonName })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // Asumiendo que la respuesta del backend tiene la misma estructura que la inicial
      updateCombatState(data);
    } catch (error) {
      console.error('Failed to change Pokémon:', error);
    }
  };

  const updateCombatState = (data) => {
    setCombatState({
      combatId: data.combatId,
      userStatus: data.message.userStatus,
      aiStatus: data.message.aiStatus,
      userTeam: data.message.userTeam,
      aiTeam: data.message.aiTeam,
    });
  };

  return (
    <div>
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
      <TeamDisplay
        team={combatState.userTeam}
        onChangePokemon={handleChangePokemon}
      />
    </div>
  );
};

export default BattleArena;
