import './Shop.css';

const Shop = ({ pokemonsToBuy, onBuyPokemon }) => (
  <div className="shop-container">
    <h2>🪙 Pokemons to Buy 🪙</h2>
    <div className="buttons-container">
      {pokemonsToBuy.map((pokemon) => (
        <button className="buy-button" key={pokemon._id} onClick={() => onBuyPokemon(pokemon.name)}>
          <img src={`images/sprites/${pokemon.pokedexId}.gif`} alt={pokemon.name} />
          <div>Buy {pokemon.name} for {pokemon.price} coins</div>
        </button>
      ))}
    </div>
  </div>
);

export default Shop;
