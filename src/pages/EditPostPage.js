import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';

function EditPostPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams();
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const fetchPost = useCallback(async () => {
    try {
      const res = await API.get(`/posts/${id}`);
      if (user?.role !== 'admin' && res.data.author_id !== user?.id) {
        setError('You are not authorized to edit this post');
        setLoading(false);
        return;
      }
      setTitle(res.data.title);
      setBody(res.data.body);
      if (res.data.image) setCurrentImage(res.data.image);
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    if (image) formData.append('image', image);
    try {
      await API.put(`/posts/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
      setSaving(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container" style={{ color: 'red' }}>{error}</div>;

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
        <h1>Edit Post</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}><label>Title:</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
          <div style={{ marginBottom: '20px' }}><label>Content:</label><textarea value={body} onChange={(e) => setBody(e.target.value)} required rows="10" /></div>
          {currentImage && !imagePreview && (
            <div style={{ marginBottom: '20px' }}><label>Current Image:</label><img src={`https://thefolio-backend-1.onrender.com/uploads/${currentImage}`} alt="Current" style={{ maxWidth: '200px' }} /></div>
          )}
          {user?.role === 'admin' && (
            <div style={{ marginBottom: '20px' }}>
              <label>Change Image (Admin only):</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <small>Leave empty to keep current image</small>
              {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />}
            </div>
          )}
          <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          <Link to={`/posts/${id}`} style={{ marginLeft: '10px' }}>Cancel</Link>
        </form>
      </div>
      <footer><p>© 2026 AnimeVerse Portfolio</p></footer>
    </>
  );
}

export default EditPostPage;