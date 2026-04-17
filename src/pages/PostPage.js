// frontend/src/pages/PostPage.js
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';
import Comments from '../components/Comments';

function PostPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
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
      setPost(res.data);
    } catch (err) {
      setError('Post not found');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await API.delete(`/posts/${id}`);
      navigate('/home');
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  const canEdit = () => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (post && user.id === post.author_id) return true;
    return false;
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading post...</div>;
  if (error) return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!post) return <div style={{ padding: '50px', textAlign: 'center' }}>Post not found</div>;

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

      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
        <h1 style={{ marginBottom: '10px' }}>{post.title}</h1>
        
        <p style={{ color: 'var(--text-medium)', marginBottom: '20px' }}>
          By {post.author_name || 'Unknown'} | {new Date(post.created_at).toLocaleDateString()}
        </p>
        
        {canEdit() && (
          <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
            <Link 
              to={`/edit-post/${post.id}`}
              className="btn"
            >
              ✏️ Edit Post
            </Link>
            <button 
              onClick={handleDelete}
              className="btn btn-danger"
            >
              🗑️ Delete Post
            </button>
          </div>
        )}
        
        {post.image && (
          <img 
            src={`http://localhost:5000/uploads/${post.image}`} 
            alt={post.title}
            style={{ 
              maxWidth: '100%', 
              borderRadius: '8px', 
              margin: '20px 0',
              boxShadow: '0 2px 8px var(--shadow)'
            }}
          />
        )}
        
        <div style={{ 
          lineHeight: '1.8', 
          fontSize: '18px', 
          marginTop: '20px',
          whiteSpace: 'pre-wrap'
        }}>
          {post.body.split('\n').map((paragraph, index) => (
            <p key={index} style={{ marginBottom: '15px' }}>
              {paragraph}
            </p>
          ))}
        </div>
        
        <Comments postId={post.id} />
        
        <Link 
          to="/home" 
          style={{ 
            display: 'inline-block', 
            marginTop: '30px',
            color: 'var(--primary)',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          ← Back to Home
        </Link>
      </div>

      <footer>
        <p>© 2026 AnimeVerse Portfolio</p>
      </footer>
    </>
  );
}

export default PostPage;