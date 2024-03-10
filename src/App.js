import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CombatProvider } from './components/CombatContext';
import HomePage from './components/HomePage/HomePage';
import BattleArena from './components/BattleArena/BattleArena';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import { AuthProvider, useAuth } from './components/AuthContext';
import './App.css';

const AuthenticatedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CombatProvider>
          <Routes>
            <Route path="/" element={<AuthenticatedRoute><HomePage /></AuthenticatedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/battle" element={<AuthenticatedRoute><BattleArena /></AuthenticatedRoute>} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </CombatProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
