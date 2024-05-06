const Shop = ({ pokemonsToBuy, onBuyPokemon }) => (
  <div>
    <h2>Pokemons to Buy</h2>
    {pokemonsToBuy.map((pokemon) => (
      <button key={pokemon._id} onClick={() => onBuyPokemon(pokemon.name)}>
        Buy {pokemon.name} for {pokemon.price} coins
      </button>
    ))}
  </div>
);

export default Shop;