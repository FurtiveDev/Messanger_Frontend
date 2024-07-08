import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/api';
import './Register.css';
import { useAuth } from './../Auth/AuthContext.jsx';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [authState, setAuthState] = useState(isAuthenticated);

  useEffect(() => {
    setAuthState(isAuthenticated);
  }, [isAuthenticated]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (value.length < 5) {
      setNameError('Имя должно быть не менее 5 символов');
    } else {
      setNameError('');
    }
  };

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

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError('Пароли не совпадают');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword || username.length < 5 || password.length < 8 || name.length < 5) {
      setError('Проверьте корректность введенных данных');
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
      window.location.href = '/home';
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
          onChange={handleNameChange} 
          className="register-input"
          minLength="5"
          required
        />
        {nameError && <p className="error-message">{nameError}</p>}
        <input 
          type="text" 
          placeholder="Никнейм" 
          value={username} 
          onChange={handleUsernameChange} 
          className="register-input"
          minLength="5"
          required
        />
        {usernameError && <p className="error-message">{usernameError}</p>}
        <input 
          type="password" 
          placeholder="Пароль" 
          value={password} 
          onChange={handlePasswordChange} 
          className="register-input"
          minLength="8"
          required
        />
        {passwordError && <p className="error-message">{passwordError}</p>}
        <input 
          type="password" 
          placeholder="Подтвердите пароль" 
          value={confirmPassword} 
          onChange={handleConfirmPasswordChange} 
          className="register-input"
          required
        />
        {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
        <button type="submit" className="register-button">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default Register;
