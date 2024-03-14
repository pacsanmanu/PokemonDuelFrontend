import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCombat } from '../CombatContext';

const HomePage = () => {
  const [userTeam, setUserTeam] = useState([]);
  const [pokemonsToBuy, setPokemonsToBuy] = useState(['pikachu', 'charmander', 'squirtle']);
  const [userCoins, setUserCoins] = useState(0);
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
      setUserTeam(data.team || []);
      setUserCoins(data.coins || 0);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
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
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to buy Pokemon');
      }

      if (data.teamIsFull) {
        // Manejo cuando el equipo está completo
        alert(data.message);
        // Aquí podrías abrir un modal para que el usuario elija qué Pokémon eliminar
      } else {
        alert(`${pokemonName} bought successfully!`);
        fetchUserData(); // Actualiza los datos del usuario si la compra fue exitosa
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
    const userId = localStorage.getItem('userId'); // Asegúrate de que el userId se almacena en localStorage
    if (!token || !userId) {
      console.error('Authentication information not found');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/users/pokemon`, {
        method: 'POST', // Usando POST ya que se envían datos en el cuerpo
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, pokemonIndex: index }), // Enviando userId y pokemonIndex en el cuerpo
      });
      if (!response.ok) {
        throw new Error('Failed to remove Pokémon');
      }
      alert('Pokémon removed successfully!');
      fetchUserData(); // Actualiza los datos del usuario
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

    const teamInput = JSON.stringify({
      player: userTeam,
      ai: ["rattata"]
    });

    try {
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
        {pokemonsToBuy.map((pokemon, index) => (
          <button key={index} onClick={() => handleBuyPokemon(pokemon)}>
            Buy {pokemon}
          </button>
        ))}
      </div>
      <button onClick={handleStartCombat} style={{ marginTop: '10px' }}>Start Combat</button>
    </div>
  );
};

export default HomePage;