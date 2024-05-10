import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Solo necesitamos la función login

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('https://projectbackend-ypns.onrender.com/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Usuario o contraseña incorrecta');
                return;
            }

            login(data.token); // Almacena el token y considera al usuario autenticado
            navigate('/'); // Navega a la página principal directamente
        } catch (error) {
            console.error('Login failed:', error);
            setError('Error al conectar con el servidor. Por favor, intenta de nuevo más tarde.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>
                {error && <div className="error-message">{error}</div>}
                <label htmlFor="username">Usuario</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="password">Contraseña</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Iniciar Sesión</button>
                <div className="register-link">
                    ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
