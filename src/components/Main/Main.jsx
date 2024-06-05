import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CombatProvider } from '../CombatContext';
import Lobby from '../Lobby/Lobby';
import BattleArena from '../BattleArena/BattleArena';
import Login from '../Login/Login';
import Register from '../Register/Register';
import StarterSelection from '../StarterSelection/StarterSelection';
import AuthProvider from '../AuthContext';
import AuthenticatedRoute from '../AuthenticatedRoute';
import Navbar from '../Navbar/Navbar';
import Leaderboard from '../Leaderboard/Leaderboard';

const Main = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <AuthProvider>
      <CombatProvider>
        {!isAuthPage && <Navbar />}
        <div className={`main-content ${isAuthPage ? 'full-width' : ''}`}>
          <Routes>
            <Route path="/" element={<AuthenticatedRoute><Lobby /></AuthenticatedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/battle" element={<AuthenticatedRoute><BattleArena /></AuthenticatedRoute>} />
            <Route path="/register" element={<Register />} />
            <Route path="/starter-selection" element={<AuthenticatedRoute><StarterSelection /></AuthenticatedRoute>} />
            <Route path="/leaderboard" element={<AuthenticatedRoute><Leaderboard /></AuthenticatedRoute>} />
          </Routes>
        </div>
      </CombatProvider>
    </AuthProvider>
  );
};

export default Main;
