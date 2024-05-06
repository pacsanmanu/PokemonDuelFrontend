import React, { createContext, useState, useContext } from 'react';

const CombatContext = createContext();

export const useCombat = () => useContext(CombatContext);

export const CombatProvider = ({ children }) => {
  const [combatData, setCombatData] = useState(null);

  return (
    <CombatContext.Provider value={{ combatData, setCombatData }}>
      {children}
    </CombatContext.Provider>
  );
};
