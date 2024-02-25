export default function CombatControls({ combatStatus }) {
  // Aquí, combatStatus debe incluir la información necesaria para generar los botones de ataque
  
  const handleAttack = async (moveIndex) => {
    // Implementa la lógica para atacar, similar a handleStartCombat en App
  };

  return (
    <div>
      {combatStatus.Fighting.userPokemon.moves.map((move, index) => (
        <button key={index} onClick={() => handleAttack(index)}>{move.name}</button>
      ))}
      <button onClick={() => {/* Implementa el cambio de Pokémon aquí */}}>Change Pokémon</button>
    </div>
  );
}
