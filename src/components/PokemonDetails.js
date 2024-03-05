import React from 'react';
import './PokemonDetails.css';

const PokemonDetails = ({ role, pokemon, onAttack }) => {

  const handleImageLoad = (event) => {
    const img = event.target;
    const naturalHeight = img.naturalHeight;
    const naturalWidth = img.naturalWidth;
    const maxHeight = 150; // El alto máximo permitido

    let newHeight = naturalHeight;
    let newWidth = naturalWidth;

    // Reescalar basándonos únicamente en el alto
    if (naturalHeight > maxHeight) {
      // Si el alto supera el máximo, ajustamos manteniendo la proporción
      const scale = maxHeight / naturalHeight;
      newHeight = maxHeight; // Limitamos el alto a 150px
      newWidth = naturalWidth * scale; // Ajustamos el ancho proporcionalmente
    } else if (naturalHeight < 50) {
      // Para imágenes muy pequeñas, aumentamos su tamaño
      const increaseFactor = 2; // Aumento para imágenes muy pequeñas
      newHeight = naturalHeight * increaseFactor;
      newWidth = naturalWidth * increaseFactor;
    } else if (naturalHeight < 100) {
      // Para imágenes pequeñas, aplicamos un incremento moderado
      const increaseFactor = 1.3; // Incremento moderado para imágenes pequeñas
      newHeight = naturalHeight * increaseFactor;
      newWidth = naturalWidth * increaseFactor;
    }

    // Ajustar las dimensiones de la imagen
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
  );
};

export default PokemonDetails;
