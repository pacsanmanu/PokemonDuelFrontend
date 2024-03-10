import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CombatProvider } from './components/CombatContext';
import HomePage from './components/HomePage/HomePage';
import BattleArena from './components/BattleArena/BattleArena';
import Login from './components/Login/Login';
import './App.css';

const App = () => {
  const isAuthenticated = () => {
    return localStorage.getItem('token') ? true : false;
  };

  return (
    <Router>
      <CombatProvider>
        <Routes>
          <Route path="/" element={isAuthenticated() ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/battle" element={<BattleArena />} />
          {/* Asegúrate de agregar la ruta de registro cuando crees el componente de registro */}
        </Routes>
      </CombatProvider>
    </Router>
  );
};

export default App;
