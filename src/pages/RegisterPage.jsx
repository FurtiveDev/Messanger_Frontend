import React from 'react';
import Register from '../components/Auth/Register';
import './RegisterPage.css';

const RegisterPage = () => {
  return (
    <div className="register-page-container">
      <h1 className="register-page-title">Регистрация</h1>
      <Register />
    </div>
  );
};

export default RegisterPage;
