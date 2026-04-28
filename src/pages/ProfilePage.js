import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';

function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      if (user.profile_pic) {
        setPreviewUrl(`https://thefolio-backend-1.onrender.com/uploads/${user.profile_pic}`);
      }
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    if (profilePic) formData.append('profilePic', profilePic);
    try {
      const { data } = await API.put('/auth/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUser(data);
      setMessage('Profile updated successfully!');
      setProfilePic(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await API.put('/auth/change-password', { currentPassword, newPassword });
      setMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="container"><h2>Please login to view your profile</h2><Link to="/login">Go to Login</Link></div>;
  }

  return (
    <>
      <header>
        <h1>AnimeVerse</h1>
        <nav>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/game">Game</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/create-post">Write Post</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            {user?.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
            <li><button onClick={handleLogout}>Logout</button></li>
            <li><button onClick={toggleTheme} className="theme-toggle">{darkMode ? '☀️ Light' : '🌙 Dark'}</button></li>
          </ul>
        </nav>
      </header>

      <div className="container">
        <h1>My Profile</h1>
        {message && <p style={{ color: '#2ecc71' }}>{message}</p>}
        {error && <p style={{ color: '#e74c3c' }}>{error}</p>}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src={previewUrl || 'https://via.placeholder.com/150?text=Avatar'} alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
        </div>
        <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
          <h2>Edit Profile</h2>
          <form onSubmit={handleProfileUpdate}>
            <div style={{ marginBottom: '15px' }}><label>Display Name:</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div style={{ marginBottom: '15px' }}><label>Bio:</label><textarea value={bio} onChange={(e) => setBio(e.target.value)} rows="4" placeholder="Tell us about yourself..." /></div>
            <div style={{ marginBottom: '15px' }}><label>Profile Picture:</label><input type="file" accept="image/*" onChange={handleFileChange} /><small>Leave empty to keep current</small></div>
            <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>
        <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '10px' }}>
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordChange}>
            <div style={{ marginBottom: '15px' }}><label>Current Password:</label><input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required /></div>
            <div style={{ marginBottom: '15px' }}><label>New Password:</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength="6" /><small>Minimum 6 characters</small></div>
            <button type="submit" disabled={loading}>{loading ? 'Changing...' : 'Change Password'}</button>
          </form>
        </div>
      </div>
      <footer><p>© 2026 AnimeVerse Portfolio</p></footer>
    </>
  );
}

export default ProfilePage;