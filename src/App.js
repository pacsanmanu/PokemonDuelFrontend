import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BattleArena from './components/BattleArena';
import HomePage from './components/HomePage';
import './App.css';

const App = () => {
  const [combatData, setCombatData] = useState(null);

  const handleStartCombat = async (teamInput) => {
    try {
      const response = await fetch('http://localhost:3000/combat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: teamInput
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCombatData(data);
    } catch (error) {
      console.error('Failed to start combat:', error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage onCombatStart={handleStartCombat} />} />
        <Route path="/battle" element={<BattleArena combatData={combatData} />} />
      </Routes>
    </Router>
  );
};

export default App;
