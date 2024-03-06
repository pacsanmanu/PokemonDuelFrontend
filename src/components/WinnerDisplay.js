import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para la redirección

const WinnerDisplay = ({ winner, combatId }) => {
  const navigate = useNavigate(); // Hook para navegar

  const deleteCombatAndNavigate = async () => {
    try {
      await fetch(`http://localhost:3000/combat/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ combatId }),
      });
      navigate('/'); // Redirige a la página de inicio después de eliminar el combate
    } catch (error) {
      console.error('Error deleting combat:', error);
    }
  };

  if (!winner) return null; // No renderizamos nada si no hay ganador

  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
      <h2>{`¡El ganador es ${winner}!`}</h2>
      <button onClick={deleteCombatAndNavigate}>Cerrar combate</button>
    </div>
  );
};

export default WinnerDisplay;
