// frontend/src/pages/CreatePostPage.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';

function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await API.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess('Post created successfully! Redirecting...');
      setTimeout(() => {
        navigate(`/posts/${response.data.id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
      setLoading(false);
    }
  };

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
                <li><Link to="/create-post" style={{ fontWeight: 'bold' }}>✏️ Write Post</Link></li>
                <li><Link to="/profile">👤 My Profile</Link></li>
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

      <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
        <h1>Write a New Post</h1>
        
        {error && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
            Error: {error}
          </div>
        )}
        
        {success && (
          <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--border-color)',
                borderRadius: '5px',
                fontSize: '16px',
                background: 'var(--card-bg)',
                color: 'var(--text-dark)'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Content:</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows="10"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--border-color)',
                borderRadius: '5px',
                fontSize: '16px',
                fontFamily: 'inherit',
                background: 'var(--card-bg)',
                color: 'var(--text-dark)'
              }}
            />
          </div>
          
          {user?.role === 'admin' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Cover Image (Admin only):</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ width: '100%' }}
              />
              <small style={{ color: 'var(--text-medium)' }}>Upload a cover image for your post (JPG, PNG, GIF)</small>
              
              {imagePreview && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '5px',
                      border: '1px solid var(--border-color)'
                    }}
                  />
                </div>
              )}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="btn"
            style={{ fontSize: '16px', fontWeight: 'bold' }}
          >
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
      </div>

      <footer>
        <p>© 2026 AnimeVerse Portfolio</p>
      </footer>
    </>
  );
}

export default CreatePostPage;