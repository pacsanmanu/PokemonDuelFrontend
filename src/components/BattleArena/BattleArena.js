import React, { useEffect, useState } from 'react';
import { useCombat } from '../CombatContext';
import PokemonDetails from '../PokemonDetails/PokemonDetails';
import TeamDisplay from '../TeamDisplay/TeamDisplay';
import CombatStatusDisplay from '../CombatStatusDisplay/CombatStatusDisplay';
import WinnerDisplay from '../WinnerDisplay/WinnerDisplay';
import './BattleArena.css';

const BattleArena = () => {
  const { combatData } = useCombat();
  const [combatState, setCombatState] = useState({
    combatId: null,
    userStatus: null,
    aiStatus: null,
    userTeam: [],
    aiTeam: [],
    winner: null
  });
  const [combatLog, setCombatLog] = useState([]);

  useEffect(() => {
    if (combatData) {
      const userTeamWithMaxLife = combatData.playerPokemons.map(pokemon => ({
        ...pokemon,
        maxLife: pokemon.stats.life, // Establece maxLife en la inicialización
      }));
      const aiTeamWithMaxLife = combatData.aiPokemons.map(pokemon => ({
        ...pokemon,
        maxLife: pokemon.stats.life, // Establece maxLife en la inicialización
      }));
      setCombatState({
        combatId: combatData.combatId,
        userStatus: userTeamWithMaxLife[0],
        aiStatus: aiTeamWithMaxLife[0],
        userTeam: userTeamWithMaxLife,
        aiTeam: aiTeamWithMaxLife,
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
          moveIndex,
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      const newUserStatus = {
        ...data.result.userStatus,
        maxLife: combatState.userTeam.find(p => p._id === data.result.userStatus._id).maxLife,
      };

      const newAiStatus = {
        ...data.result.aiStatus,
        maxLife: combatState.aiTeam.find(p => p._id === data.result.aiStatus._id).maxLife,
      };

      setCombatState(prevState => ({
        ...prevState,
        userStatus: newUserStatus,
        aiStatus: newAiStatus,
        userTeam: prevState.userTeam.map(p => p._id === newUserStatus._id ? newUserStatus : p),
        aiTeam: prevState.aiTeam.map(p => p._id === newAiStatus._id ? newAiStatus : p),
        winner: data.result.winner,
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
          forcedChange,
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      const newUserStatus = {
        ...data.result.userStatus,
        maxLife: combatState.userTeam.find(p => p.name === pokemonName).maxLife,
      };

      const newAiStatus = {
        ...data.result.aiStatus,
        maxLife: combatState.aiTeam.find(p => p._id === data.result.aiStatus._id).maxLife,
      };

      setCombatState(prevState => ({
        ...prevState,
        userStatus: newUserStatus,
        aiStatus: newAiStatus,
        userTeam: prevState.userTeam.map(p => p._id === newUserStatus._id ? newUserStatus : p),
        aiTeam: prevState.aiTeam.map(p => p._id === newAiStatus._id ? newAiStatus : p),
        winner: data.result.winner,
      }));

      setCombatLog(data.result.log);
    } catch (error) {
      console.error('Failed to change Pokémon:', error);
    }
  };

  return (
    <div className="battle-arena">
      {combatState.winner ? (
        <WinnerDisplay winner={combatState.winner} />
      ) : (
        <>
          <div className="arena-container">
            {combatState.userStatus && (
              <PokemonDetails
                role="user"
                pokemon={combatState.userStatus}
                maxLife={combatState.userStatus.maxLife}
                onAttack={handleAttack}
              />
            )}
            {combatState.aiStatus && (
              <PokemonDetails
                role="ai"
                pokemon={combatState.aiStatus}
                maxLife={combatState.aiStatus.maxLife}
              />
            )}
          </div>
          <TeamDisplay
            team={combatState.userTeam}
            onChangePokemon={handleChangePokemon}
            currentPokemon={combatState.userStatus}
          />
          <CombatStatusDisplay combatLog={combatLog} />
        </>
      )}
    </div>
  );
};

export default BattleArena;
