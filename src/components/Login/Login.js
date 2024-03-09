import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

		const handleSubmit = async (e) => {
			e.preventDefault();
			try {
					const response = await fetch('http://localhost:3000/login', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ username, password })
					});
					if (!response.ok) {
							throw new Error('Login failed');
					}
					const data = await response.json();
					localStorage.setItem('token', data.token); // Guarda el token en localStorage
					navigate('/'); // Navega a HomePage después de guardar el token
			} catch (error) {
					console.error('Login error:', error);
			}
	};
	

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>
                No tienes una cuenta? <a href="/register">Regístrate aquí</a>
            </p>
        </div>
    );
};

export default Login;
