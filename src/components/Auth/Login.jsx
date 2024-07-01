import React, { useState, useEffect } from 'react';
import { login } from '../../api/api';
import './Login.css';
import { useAuth } from '/home/dev/Рабочий стол/Messanger/my-messenger/src/components/Auth/AuthContext.jsx';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [authState, setAuthState] = useState(isAuthenticated);

  useEffect(() => {
    setAuthState(isAuthenticated);
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login({ username, password });
      const sessionCookie = response.headers['set-cookie'];
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      if (sessionCookie) {
        document.cookie = sessionCookie;
      }
      window.location.href = '/';
    } catch (error) {
      setError('Не удалось войти');
      console.error('Login failed', error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        {error && <p className="error-message">{error}</p>}
        <input 
          type="text" 
          placeholder="Никнейм" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          className="login-input"
        />
        <input 
          type="password" 
          placeholder="Пароль" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="login-input"
        />
        <button type="submit" className="login-button">Войти</button>
      </form>
    </div>
  );
};

export default Login;
