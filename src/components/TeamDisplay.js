const TeamDisplay = ({ team, onChangePokemon }) => {
  console.log(team);
  return (
    <div>
      {team.map(pokemon => (
        <button key={pokemon.name} onClick={() => onChangePokemon(pokemon.name)}>
          {pokemon.name}
        </button>
      ))}
    </div>
  );
};

export default TeamDisplay;
