import React from 'react';
import './MenuTeam.css'; // Asegúrate de crear este archivo CSS

const MenuTeam = ({ userTeam, menuTeam, evolutions, onEvolvePokemon, onRemovePokemon, userCoins }) => {

  return (
    <div className="menu-team">
      <h2>Your Team (Coins: {userCoins})</h2>
      <ul className="team-list">
        {userTeam.map((pokemonName, index) => (
          <li key={index} className="team-item">
            <img
              src={`/images/sprites/${menuTeam[pokemonName].pokedexId}.gif`} // Ajusta la ruta según tu estructura de proyecto
              alt={pokemonName}
              className="pokemon-image"
            />
            <div className="pokemon-info">
              <p className="pokemon-name">{pokemonName}</p>
              {evolutions[pokemonName] && evolutions[pokemonName].evolution && (
                <button className="evolve-button" onClick={() => onEvolvePokemon(index)}>
                  Evolve to {evolutions[pokemonName].evolution} for {evolutions[pokemonName].cost} coins
                </button>
              )}
              <button className="remove-button" onClick={() => onRemovePokemon(index)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuTeam;
