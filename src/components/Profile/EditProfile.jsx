import React, { useEffect, useState } from 'react';
import { fetchSelfProfile, updateProfile } from '../../api/api';

const EditProfile = () => {
  const [profile, setProfile] = useState({ username: '', email: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchSelfProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profile);
      // Handle profile update success
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="username" 
        value={profile.username} 
        onChange={handleChange} 
      />
      <input 
        type="email" 
        name="email" 
        value={profile.email} 
        onChange={handleChange} 
      />
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default EditProfile;
