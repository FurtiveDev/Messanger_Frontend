import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/api';
import './Register.css';
import { useAuth } from '/home/dev/Рабочий стол/Messanger/my-messenger/src/components/Auth/AuthContext.jsx';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [authState, setAuthState] = useState(isAuthenticated);
  useEffect(() => {
    setAuthState(isAuthenticated);
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      const response = await register({ name, username, password, confirm_password: confirmPassword });
      const sessionCookie = response.headers['set-cookie'];
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      if (sessionCookie) {
        document.cookie = sessionCookie;
        navigate('/profile');
      }
      window.location.href = '/';
    } catch (error) {
      setError('Не удалось зарегистрироваться');
      console.error('Не удалось зарегистрироваться', error.response ? error.response.data : error);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        {error && <p className="error-message">{error}</p>}
        <input 
          type="text" 
          placeholder="Имя" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="register-input"
        />
        <input 
          type="text" 
          placeholder="Никнейм" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          className="register-input"
        />
        <input 
          type="password" 
          placeholder="Пароль" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="register-input"
        />
        <input 
          type="password" 
          placeholder="Подтвердите пароль" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          className="register-input"
        />
        <button type="submit" className="register-button">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default Register;
