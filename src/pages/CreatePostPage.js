import React, { useState } from 'react';
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
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
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
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    if (image) formData.append('image', image);
    try {
      const response = await API.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate(`/posts/${response.data.id}`);
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
        <h1>Write a New Post</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}><label>Title:</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
            <div style={{ marginBottom: '20px' }}><label>Content:</label><textarea value={body} onChange={(e) => setBody(e.target.value)} required rows="10" /></div>
            {user?.role === 'admin' && (
              <div style={{ marginBottom: '20px' }}>
                <label>Cover Image (Admin only):</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />}
              </div>
            )}
            <button type="submit" disabled={loading}>{loading ? 'Publishing...' : 'Publish Post'}</button>
        </form>
      </div>
      <footer><p>© 2026 AnimeVerse Portfolio</p></footer>
    </>
  );
}

export default CreatePostPage;