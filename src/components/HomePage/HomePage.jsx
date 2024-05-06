import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCombat } from '../CombatContext';
import MenuTeam from '../MenuTeam/MenuTeam';
import Shop from '../Shop/Shop';
import CombatStarter from '../CombatStarter/CombatStarter'; 

const HomePage = () => {
  const [userTeam, setUserTeam] = useState([]);
  const [evolutions, setEvolutions] = useState({});
  const [pokemonsToBuy, setPokemonsToBuy] = useState([]);
  const [userCoins, setUserCoins] = useState(0);
  const [userVictories, setUserVictories] = useState(0); 
  const navigate = useNavigate();
  const { setCombatData } = useCombat();

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchPokemonsToBuy();
  }, [userVictories]);

  const fetchUserData = async () => {
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
      localStorage.setItem('userId', data._id);
      setUserTeam(data.team || []);
      setUserCoins(data.coins || 0);
      setUserVictories(data.victories || 0);
      fetchEvolutions(data.team, token);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchEvolutions = async (team, token) => {
    if (!team.length) return;

    try {
      const evolutionResponse = await fetch('http://localhost:3000/pokemon/by-names', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ names: team })
      });
      if (!evolutionResponse.ok) {
        throw new Error('Failed to fetch Pokemon evolutions');
      }
      const evolutionsData = await evolutionResponse.json();
      const evolutionsMap = evolutionsData.reduce((acc, pokemon) => {
        acc[pokemon.name] = pokemon.evolution;
        return acc;
      }, {});
      setEvolutions(evolutionsMap);
    } catch (error) {
      console.error('Failed to fetch evolutions:', error);
    }
  };

  const fetchPokemonsToBuy = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Authentication information not found');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/market/pokemons`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ victories: userVictories })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Pokemons to buy');
      }
      const { pokemons } = await response.json();
      setPokemonsToBuy(pokemons);
    } catch (error) {
      console.error('Failed to fetch Pokemons to buy:', error);
    }
  };

  const handleBuyPokemon = async (pokemonName) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/market/buy`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pokemonName })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to buy Pokemon');
      }

      const data = await response.json();
      if (data.teamIsFull) {
        alert(data.message);
      } else {
        alert(`${pokemonName} bought successfully!`);
        fetchUserData();
      }
    } catch (error) {
      console.error('Failed to buy Pokemon:', error);
      alert(error.message);
    }
  };

  const handleEvolvePokemon = async (index) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      console.error('Authentication information not found');
      return;
    }
  
    const pokemonName = userTeam[index]; // Asume que userTeam tiene los nombres de los Pokémon
  
    try {
      // Obtener el costo de evolución antes de intentar la evolución
      const costResponse = await fetch(`http://localhost:3000/pokemon/evolution-cost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pokemonName }),
      });
  
      if (!costResponse.ok) {
        throw new Error('Failed to fetch evolution cost');
      }
      
      const costData = await costResponse.json();
      const evolutionCost = costData.evolutionCost;
  
      if (userCoins >= evolutionCost) {
        const evolveResponse = await fetch(`http://localhost:3000/pokemon/evolve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ userId, pokemonIndex: index }),
        });
  
        if (!evolveResponse.ok) {
          const errorData = await evolveResponse.json();
          throw new Error(errorData.message || 'Failed to evolve Pokémon');
        }
  
        const evolveData = await evolveResponse.json();
        const evolvedPokemonName = evolveData.evolvedPokemon;
    
        const updatedTeam = [...userTeam];
        updatedTeam[index] = evolvedPokemonName;
    
        setUserTeam(updatedTeam);
        setUserCoins(prevCoins => prevCoins - evolutionCost); 
        alert(`Pokemon evolved to ${evolvedPokemonName}!`);
      } else {
        alert('Not enough coins to evolve this Pokémon');
      }
    } catch (error) {
      console.error('Failed to evolve Pokémon:', error);
      alert(error.message);
    }
  };
  
  
  const handleRemovePokemon = async (index) => {
    const confirmation = window.confirm("Are you sure you want to remove this Pokémon from your team?");
    if (!confirmation) {
      return;
    }
  
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      console.error('Authentication information not found');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/users/pokemon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, pokemonIndex: index }),
      });
      if (!response.ok) {
        throw new Error('Failed to remove Pokémon');
      }
      alert('Pokémon removed successfully!');
      fetchUserData();
    } catch (error) {
      console.error('Failed to remove Pokémon:', error);
      alert(error.message);
    }
  };
  

  const handleStartCombat = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please login');
      navigate('/login');
      return;
    }

    try {
      const aiResponse = await fetch('http://localhost:3000/combat/ai-team', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });

      if (!aiResponse.ok) {
        throw new Error('Failed to get AI team');
      }

      const { aiTeam } = await aiResponse.json();
      const teamInput = JSON.stringify({
        player: userTeam,
        ai: aiTeam
      });

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
      <MenuTeam
        userTeam={userTeam}
        evolutions={evolutions}
        onEvolvePokemon={handleEvolvePokemon}
        onRemovePokemon={handleRemovePokemon}
        userCoins={userCoins}
      />
      <Shop
        pokemonsToBuy={pokemonsToBuy}
        onBuyPokemon={handleBuyPokemon}
      />
      <CombatStarter onStartCombat={handleStartCombat} />
    </div>
  );
}

export default HomePage;
