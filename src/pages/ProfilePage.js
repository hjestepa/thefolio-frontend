// frontend/src/pages/ProfilePage.js
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';

function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
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
    navigate('/login');
  };

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      if (user.profile_pic) {
        setPreviewUrl(`http://localhost:5000/uploads/${user.profile_pic}`);
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
    if (profilePic) {
      formData.append('profilePic', profilePic);
    }

    try {
      const { data } = await API.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUser(data);
      setMessage('Profile updated successfully!');
      setProfilePic(null);
      if (data.profile_pic) {
        setPreviewUrl(`http://localhost:5000/uploads/${data.profile_pic}`);
      }
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
      await API.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
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
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Please login to view your profile</h2>
        <Link to="/login">Go to Login</Link>
      </div>
    );
  }

  return (
    <>
      <header>
        <h1>AnimeVerse</h1>
        <nav>
          <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', alignItems: 'center', margin: 0, padding: 0 }}>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/game">Game</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            
            {user && (
              <>
                <li><Link to="/create-post">✏️ Write Post</Link></li>
                <li><Link to="/profile" style={{ fontWeight: 'bold' }}>👤 My Profile</Link></li>
                {user.role === 'admin' && (
                  <li><Link to="/admin" style={{ fontWeight: 'bold', color: '#ff6b6b' }}>⚡ Admin</Link></li>
                )}
                <li>
                  <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    Logout
                  </button>
                </li>
              </>
            )}
            
            {!user && (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
            
            <li>
              <button onClick={toggleTheme} className="theme-toggle">
                {darkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
        <h1>My Profile</h1>
        
        {message && (
          <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
            {message}
          </div>
        )}
        {error && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
            {error}
          </div>
        )}
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img
            src={previewUrl || 'https://via.placeholder.com/150?text=Avatar'}
            alt="Profile"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #4a90e2'
            }}
          />
        </div>
        
        <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
          <h2>Edit Profile</h2>
          <form onSubmit={handleProfileUpdate}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Display Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '5px', background: 'var(--card-bg)', color: 'var(--text-dark)' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Bio:</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="4"
                placeholder="Tell us about yourself..."
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '5px', fontFamily: 'inherit', background: 'var(--card-bg)', color: 'var(--text-dark)' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Profile Picture:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ width: '100%' }}
              />
              <small style={{ color: 'var(--text-medium)' }}>Leave empty to keep current picture</small>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
        
        <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '10px' }}>
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordChange}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Current Password:</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '5px', background: 'var(--card-bg)', color: 'var(--text-dark)' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="6"
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '5px', background: 'var(--card-bg)', color: 'var(--text-dark)' }}
              />
              <small style={{ color: 'var(--text-medium)' }}>Minimum 6 characters</small>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>

      <footer>
        <p>© 2026 AnimeVerse Portfolio</p>
      </footer>
    </>
  );
}

export default ProfilePage;