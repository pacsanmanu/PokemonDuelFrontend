import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCombat } from '../CombatContext';

const HomePage = () => {
  const [userTeam, setUserTeam] = useState([]);
  const [pokemonsToBuy, setPokemonsToBuy] = useState([]);
  const [userCoins, setUserCoins] = useState(0);
  const [userVictories, setUserVictories] = useState(0); 
  const navigate = useNavigate();
  const { setCombatData } = useCombat();

  useEffect(() => {
    fetchUserData();
  }, []);

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
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  useEffect(() => {
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
    fetchPokemonsToBuy();
  }, [userVictories]);

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
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to buy Pokemon');
      }

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

      console.log(teamInput);
  
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
      console.log(data);
      navigate('/battle');
    } catch (error) {
      console.error('Failed to start combat:', error);
    }
  };
  

  return (
    <div>
      <h2>Your Team (Coins: {userCoins})</h2>
      <ul>
        {userTeam.map((pokemon, index) => (
          <li key={index}>
            <button onClick={() => handleRemovePokemon(index)}>Remove</button> {pokemon}
          </li>
        ))}
      </ul>
      <h2>Pokemons to Buy</h2>
      <div>
        {pokemonsToBuy.map((pokemon) => (
          <button key={pokemon._id} onClick={() => handleBuyPokemon(pokemon.name)}>
            Buy {pokemon.name}
          </button>
        ))}
      </div>
      <button onClick={handleStartCombat} style={{ marginTop: '10px' }}>Start Combat</button>
    </div>
  );
}
  
export default HomePage;