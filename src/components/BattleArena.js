import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Importa useLocation
import PokemonDetails from './PokemonDetails';
import TeamDisplay from './TeamDisplay';
import CombatStatusDisplay from './CombatStatusDisplay';
import WinnerDisplay from './WinnerDisplay';
import './BattleArena.css';

const BattleArena = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const combatData = location.state ? location.state.combatData : null;

  const [winner, setWinner] = useState(null);
  const [combatState, setCombatState] = useState({
    combatId: null,
    userStatus: null,
    aiStatus: null,
    userTeam: [],
    aiTeam: []
  });
  const [combatLog, setCombatLog] = useState([]);

  useEffect(() => {
    if (combatData && combatData.result) {
      setCombatState({
        combatId: combatData.result.combatId,
        userStatus: combatData.result.userStatus,
        aiStatus: combatData.result.aiStatus,
        userTeam: combatData.result.userTeam,
        aiTeam: combatData.result.aiTeam
      });
      if (combatData.result.winner) {
        setWinner(combatData.result.winner);
      }
    }
  }, [combatData]);

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

  const onCombatEnd = () => {
    navigate('/');
  };

  const dataIsReady = combatState.userTeam && combatState.userTeam.length > 0;
  console.log(dataIsReady);

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
      <CombatStatusDisplay combatLog={combatLog} />
      {winner && (
        <WinnerDisplay
          winner={winner}
          combatId={combatState.combatId}
          onCombatEnd={onCombatEnd}
        />
      )}
    </div>
  );
};

export default BattleArena;