import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Asumiendo que el token se almacena en localStorage
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="profile">
      <h1>Profile</h1>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Username:</strong> {userData.username}</p>
      <p><strong>Victories:</strong> {userData.victories}</p>
      <p><strong>Longest Win Streak:</strong> {userData.longestWinStreak}</p>
      <p><strong>Coins:</strong> {userData.coins}</p>
      <p><strong>Team:</strong> {userData.team.join(', ')}</p>
    </div>
  );
};

export default Profile;
