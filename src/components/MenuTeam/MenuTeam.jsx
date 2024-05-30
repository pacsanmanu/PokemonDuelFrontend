const MenuTeam = ({ userTeam, evolutions, onEvolvePokemon, onRemovePokemon, userCoins }) => (
  <div>
    <h2>Your Team (Coins: {userCoins})</h2>
    <ul>
      {userTeam.map((pokemon, index) => (
        <li key={index}>
          {pokemon}
          {evolutions[pokemon] && evolutions[pokemon].evolution && (
            <>
              <button onClick={() => onEvolvePokemon(index)}>
                Evolve to {evolutions[pokemon].evolution} for {evolutions[pokemon].cost} coins
              </button>
            </>
          )}
          <button onClick={() => onRemovePokemon(index)}>Remove</button>
        </li>
      ))}
    </ul>
  </div>
);

export default MenuTeam;
