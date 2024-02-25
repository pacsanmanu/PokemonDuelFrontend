export default function PokemonStatus({ userStatus, aiStatus }) {
  return (
    <div>
      <h2>User Pokémon</h2>
      <img src={`../public/images/sprites/${userStatus.name}.gif`} alt={userStatus.name} />
      <p>{userStatus.name}: {userStatus.life} HP</p>

      <h2>AI Pokémon</h2>
      <img src={`../public/images/sprites/${aiStatus.name}.gif`} alt={aiStatus.name} />
      <p>{aiStatus.name}: {aiStatus.life} HP</p>
    </div>
  );
}