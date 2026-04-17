// frontend/src/pages/EditPostPage.js
import { useState, useEffect, useCallback } from 'react';
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
    navigate('/login');
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
      if (res.data.image) {
        setCurrentImage(res.data.image);
      }
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
    if (image) {
      formData.append('image', image);
    }

    try {
      await API.put(`/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
  if (error) return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>{error}</div>;

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

      <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', border: '1px solid var(--border-color)', borderRadius: '10px', background: 'var(--card-bg)' }}>
        <h1>Edit Post</h1>
        
        {error && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
            {error}
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
          
          {currentImage && !imagePreview && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Current Image:</label>
              <img
                src={`http://localhost:5000/uploads/${currentImage}`}
                alt="Current"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: '5px',
                  border: '1px solid var(--border-color)'
                }}
              />
            </div>
          )}
          
          {user?.role === 'admin' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Change Image (Admin only):</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ width: '100%' }}
              />
              <small style={{ color: 'var(--text-medium)' }}>Leave empty to keep current image</small>
              
              {imagePreview && (
                <div style={{ marginTop: '10px' }}>
                  <p>New Image Preview:</p>
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
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              to={`/posts/${id}`}
              style={{
                background: '#ccc',
                color: '#333',
                padding: '12px 24px',
                textDecoration: 'none',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      <footer>
        <p>© 2026 AnimeVerse Portfolio</p>
      </footer>
    </>
  );
}

export default EditPostPage;