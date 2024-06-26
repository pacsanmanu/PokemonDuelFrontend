import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCombat } from '../CombatContext';
import MenuTeam from '../MenuTeam/MenuTeam';
import Shop from '../Shop/Shop';
import CombatStarter from '../CombatStarter/CombatStarter';

const HomePage = () => {
  const [userTeam, setUserTeam] = useState([]);
  const [evolutions, setEvolutions] = useState({});
  const [menuTeam, setMenuTeam] = useState({});
  const [pokemonsToBuy, setPokemonsToBuy] = useState([]);
  const [userCoins, setUserCoins] = useState(0);
  const [userVictories, setUserVictories] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { setCombatData } = useCombat();

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!isLoading && userTeam.length === 0) {
      navigate('/starter-selection');
    }
  }, [userTeam, isLoading, navigate]);

  useEffect(() => {
    fetchPokemonsToBuy();
  }, [userVictories]);

  const fetchUserData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please login');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/me`, {
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
      await fetchEvolutions(data.team, token);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvolutions = async (team, token) => {
    if (!team.length) return;

    try {
      const evolutionResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/pokemon/by-names`, {
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

      const evolutionCostPromises = evolutionsData.map(pokemon => {
        if (pokemon.evolution) {
          return fetch(`${process.env.REACT_APP_BACKEND_URL}/pokemon/evolution-cost`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ pokemonName: pokemon.evolution })
          }).then(response => response.json().then(data => ({
            name: pokemon.name,
            evolution: pokemon.evolution,
            cost: data.evolutionCost,
            pokedexId: pokemon.pokedexId
          })));
        } else {
          return Promise.resolve({ name: pokemon.name, evolution: null, cost: null, pokedexId: pokemon.pokedexId });
        }
      });

      const evolutionsWithCost = await Promise.all(evolutionCostPromises);
      const evolutionsMap = evolutionsWithCost.reduce((acc, item) => {
        acc[item.name] = { evolution: item.evolution, cost: item.cost };
        return acc;
      }, {});

      const teamWithPokedexId = evolutionsWithCost.reduce((acc, item) => {
        acc[item.name] = { pokedexId: item.pokedexId };
        return acc;
      }, {});

      setEvolutions(evolutionsMap);
      setMenuTeam(teamWithPokedexId);
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
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/market/pokemons`, {
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
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/market/buy`, {
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
      alert("Not enough coins to buy the Pokemon.");
    }
  };

  const handleEvolvePokemon = async (index) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      console.error('Authentication information not found');
      return;
    }

    const pokemonName = userTeam[index];
    const evolutionInfo = evolutions[pokemonName];
    if (!evolutionInfo || !evolutionInfo.evolution) {
      alert('This Pokémon cannot evolve or evolution data is missing.');
      return;
    }

    try {
      const evolutionCost = evolutionInfo.cost;
      if (userCoins >= evolutionCost) {
        const evolveResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/pokemon/evolve`, {
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

        // Fetch updated evolutions and menuTeam data for the new evolved Pokémon
        const updatedTeamWithEvolvedPokemon = await fetchEvolutions(updatedTeam, token);

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
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/pokemon`, {
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
      const aiResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/combat/ai-team`, {
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

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/combat/start`, {
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <MenuTeam
        userTeam={userTeam}
        menuTeam={menuTeam}
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
