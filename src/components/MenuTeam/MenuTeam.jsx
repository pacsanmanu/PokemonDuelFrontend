const MenuTeam = ({ userTeam, evolutions, onEvolvePokemon, onRemovePokemon, userCoins }) => (
  <div>
    <h2>Your Team (Coins: {userCoins})</h2>
    <ul>
      {userTeam.map((pokemon, index) => (
        <li key={index}>
          {pokemon} 
          {evolutions[pokemon] && (
            <>
              <button onClick={() => onEvolvePokemon(index)}>Evolve for {evolutions[pokemon].evolutionCost} coins</button>
            </>
          )}
          <button onClick={() => onRemovePokemon(index)}>Remove</button>
        </li>
      ))}
    </ul>
  </div>
);

export default MenuTeam;