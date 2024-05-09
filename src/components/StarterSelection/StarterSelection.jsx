import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StarterSelection = () => {
  const [starterPokemons, setStarterPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/pokemon/starters', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch starters. Please check your authentication.');
        }

        const data = await response.json();
        setStarterPokemons(data);
      } catch (error) {
        console.error('Failed to fetch starter Pokemons:', error);
        setError(error.message || 'Failed to load starter Pokémon. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectStarter = async (pokemonName) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      setError('Authentication failed. Please log in again.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/users/add-starter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, pokemonName })
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to add starter Pokémon');
      }

      navigate('/');
    } catch (error) {
      console.error('Failed to select starter Pokémon:', error);
      setError(error.message || 'Failed to add starter Pokémon. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Select Your Starter Pokémon</h1>
      {starterPokemons.map(pokemon => (
        <button key={pokemon.name} onClick={() => handleSelectStarter(pokemon.name)}>
          {pokemon.name}
        </button>
      ))}
    </div>
  );
};

export default StarterSelection;
