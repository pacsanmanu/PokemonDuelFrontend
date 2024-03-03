import './PokemonDetails.css';

const PokemonDetails = ({ role, pokemon, onAttack }) => {
  return (
    <div className="pokemon-details">
      <img
        className={role === 'user' ? 'user-pokemon' : 'ai-pokemon'}
        src={`${process.env.PUBLIC_URL}/images/sprites/${pokemon.pokedexId}.gif`}
        alt={pokemon.name}
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
