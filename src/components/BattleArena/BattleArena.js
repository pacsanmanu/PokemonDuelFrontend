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
      setCombatState({
        combatId: combatData.combatId,
        userStatus: combatData.playerPokemons[0],
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
        userTeam: data.result.userTeam,
        aiTeam: data.result.aiTeam,
        winner: data.result.winner
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
        aiStatus: data.result.aiStatus,
        userTeam: data.result.userTeam,
        aiTeam: data.result.aiTeam,
        winner: data.result.winner
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
            currentPokemon={combatState.userStatus}
          />
          <CombatStatusDisplay combatLog={combatLog} />
        </>
      )}
    </div>
  );
};


export default BattleArena;
