import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CombatProvider } from './components/CombatContext';
import HomePage from './components/HomePage/HomePage';
import BattleArena from './components/BattleArena/BattleArena';
import './App.css';

const App = () => {
  return (
    <Router>
      <CombatProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/battle" element={<BattleArena />} />
        </Routes>
      </CombatProvider>
    </Router>
  );
};

export default App;
