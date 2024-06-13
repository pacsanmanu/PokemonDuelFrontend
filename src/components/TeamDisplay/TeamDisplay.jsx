import './TeamDisplay.css';

const TeamDisplay = ({ team, onChangePokemon, currentPokemon }) => {
  return (
    <div className="team-display">
      {team.map((pokemon, index) => {
        const isDisabled = pokemon.stats.life <= 0;
        const isCurrent = pokemon.name === currentPokemon.name;
        const buttonClass = `${isDisabled ? 'isDisabled' : ''} ${isCurrent ? 'isCurrent' : ''}`;

        return (
          <button
            key={index}
            onClick={() => !isDisabled && !isCurrent && onChangePokemon(pokemon.name)}
            disabled={isDisabled}
            className={buttonClass}
          >
            <div>
              <img
                src={`${process.env.PUBLIC_URL}/images/sprites/${pokemon.pokedexId}.gif`}
                alt={pokemon.name}
              />
              <p>{pokemon.name}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default TeamDisplay;
