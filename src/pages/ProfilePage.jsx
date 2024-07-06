import React from 'react';
import Profile from '../components/Profile/Profile';
import './ProfilePage.css';
const ProfilePage = () => {
  return (
    <div className="profile-page-container">
      <h1>Мой профиль</h1>
      <Profile />
    </div>
  );
};

export default ProfilePage;
