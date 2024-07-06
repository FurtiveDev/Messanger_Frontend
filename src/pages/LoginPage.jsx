import React from 'react';
import Login from '../components/Auth/Login';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page-container">
      <h1 className="login-page-title">Авторизоваться</h1>
      <Login />
    </div>
  );
};

export default LoginPage;
