import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Usuario o contraseña incorrecta');
                return;
            }

            login(data.token);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            setError('Error al conectar con el servidor. Por favor, intenta de nuevo más tarde.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-image"></div>
            <div className="login-form-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Inicia sesión</h2>
                    {error && <div className="error-message">{error}</div>}
                    <label htmlFor="username">Usuario</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ingresa tu usuario"
                    />
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingresa tu contraseña"
                    />
                    <button type="submit">Iniciar sesión</button>
                    <div className="register-link">
                        ¿No tienes cuenta? <Link to="/register"><span className='here'>Regístrate aquí</span></Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
