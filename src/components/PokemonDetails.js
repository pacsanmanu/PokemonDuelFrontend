const PokemonDetails = ({ role, pokemon, onAttack }) => {
  console.log(pokemon);
  return (
    <div>
      <img src={pokemon.imageUrl} alt={pokemon.name} />
      <h2>{pokemon.name}</h2>
      <p>HP: {pokemon.stats.life}</p>
      {role === 'user' && pokemon.moves.map((move, index) => (
        <button key={index} onClick={() => onAttack(index)}>
          {move.name}
        </button>
      ))}
    </div>
  );
};

export default PokemonDetails;
