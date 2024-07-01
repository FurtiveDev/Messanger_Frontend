import React, { useEffect, useState } from 'react';
import { fetchSelfProfile, updateProfile } from '../../api/api';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    bio: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchSelfProfile();
        setProfile(response.data.response);  // Обновляем с учетом структуры данных от бэка
        setFormData({
          username: response.data.response.username,
          name: response.data.response.name,
          bio: response.data.response.bio,
        });
      } catch (error) {
        setError('Не удалось загрузить профиль');
        console.error('Не удалось загрузить профиль', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      await updateProfile(formData);
      setEditing(false);
      const response = await fetchSelfProfile();
      setProfile(response.data.response);  // Обновляем с учетом структуры данных от бэка
    } catch (error) {
      console.error('Не удалось обновить профиль', error);
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return <div className="error-message">Загрузка...</div>;

  // Функция для форматирования даты в нужный формат
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-circle">
          <div className="profile-icon">👤</div>
        </div>
        <div className="profile-header">
          <h1>{profile.username}</h1>
          {editing ? (
            <button className="edit-button" onClick={handleSaveClick}>Сохранить</button>
          ) : (
            <button className="edit-button" onClick={handleEditClick}>Редактировать</button>
          )}
        </div>
        <div className="profile-details">
          {editing ? (
            <>
              <label htmlFor="name">Имя:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <label htmlFor="bio">Статус:</label>
              <input
                type="text"
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
              />
            </>
          ) : (
            <>
              <p>Имя пользователя: {profile.name}</p>
              <p>Статус: {profile.bio}</p>
              <p>Последняя активность: {formatDate(profile.last_active)}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
