import React from 'react';
import './MenuTeam.css';

const MenuTeam = ({ userTeam, evolutions, onEvolvePokemon, onRemovePokemon, userCoins }) => (
  <div className="menu-team">
    <h2>Your Team (Coins: {userCoins})</h2>
    <ul className="pokemon-list">
      {userTeam.map((pokemon, index) => (
        <li key={index} className="pokemon-item">
          <img
            src={`../../public/images/sprites/${pokemon.pokedexId}.gif`}
            alt={pokemon.name}
            className="pokemon-image"
          />
          <span className="pokemon-name">{pokemon.name}</span>
          {evolutions[pokemon.name] && evolutions[pokemon.name].evolution && (
            <>
              <button
                className="evolve-button"
                onClick={() => onEvolvePokemon(index)}
              >
                Evolve to {evolutions[pokemon.name].evolution} for {evolutions[pokemon.name].cost} coins
              </button>
            </>
          )}
          <button className="remove-button" onClick={() => onRemovePokemon(index)}>Remove</button>
        </li>
      ))}
    </ul>
  </div>
);

export default MenuTeam;
