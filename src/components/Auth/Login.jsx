import React, { useState, useEffect } from 'react';
import { login } from '../../api/api';
import './Login.css';
import { useAuth } from '/home/dev/Рабочий стол/Messanger/my-messenger/src/components/Auth/AuthContext.jsx';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [authState, setAuthState] = useState(isAuthenticated);

  useEffect(() => {
    setAuthState(isAuthenticated);
  }, [isAuthenticated]);

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value.length < 5) {
      setUsernameError('Имя пользователя должно быть не менее 5 символов');
    } else {
      setUsernameError('');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value.length < 8) {
      setPasswordError('Пароль должен быть не менее 8 символов');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.length < 5 || password.length < 8) {
      setError('Проверьте корректность введенных данных');
      return;
    }

    try {
      const response = await login({ username, password });
      const sessionCookie = response.headers['set-cookie'];
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      if (sessionCookie) {
        document.cookie = sessionCookie;
      }
      window.location.href = '/home';
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
          onChange={handleUsernameChange} 
          className="login-input"
        />
        {usernameError && <p className="error-message">{usernameError}</p>}
        <input 
          type="password" 
          placeholder="Пароль" 
          value={password} 
          onChange={handlePasswordChange} 
          className="login-input"
        />
        {passwordError && <p className="error-message">{passwordError}</p>}
        <button type="submit" className="login-button">Войти</button>
      </form>
    </div>
  );
};

export default Login;
