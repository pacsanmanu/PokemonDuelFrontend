import React from 'react';
import './PokemonDetails.css';

const PokemonDetails = ({ role, pokemon, onAttack }) => {

  const handleImageLoad = (event) => {
    const img = event.target;
    const naturalHeight = img.naturalHeight;
    const naturalWidth = img.naturalWidth;
    const maxHeight = 150;

    let newHeight = naturalHeight;
    let newWidth = naturalWidth;

    if (naturalHeight > maxHeight) {
      const scale = maxHeight / naturalHeight;
      newHeight = maxHeight;
      newWidth = naturalWidth * scale;
    } else if (naturalHeight < 50) {
      const increaseFactor = 2;
      newHeight = naturalHeight * increaseFactor;
      newWidth = naturalWidth * increaseFactor;
    } else if (naturalHeight < 100) {
      const increaseFactor = 1.3;
      newHeight = naturalHeight * increaseFactor;
      newWidth = naturalWidth * increaseFactor;
    }

    img.style.height = `${newHeight}px`;
    img.style.width = `${newWidth}px`;
  };

  return (
    <div className="pokemon-details">
      <img
        className={role === 'user' ? 'user-pokemon' : 'ai-pokemon'}
        src={`${process.env.PUBLIC_URL}/images/sprites/${pokemon.pokedexId}.gif`}
        alt={pokemon.name}
        onLoad={handleImageLoad}
      />
      <h2>{pokemon.name}</h2>
      <p>HP: {pokemon.stats.life}</p>
      <div className="pokemon-moves-container">
        {role === 'user' && pokemon.moves.map((move, index) => (
          <button
          key={index}
          onClick={() => onAttack(index)}
          className={`pokemon-move-button type-${move.type.toLowerCase()}`}
          >
            {move.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PokemonDetails;
