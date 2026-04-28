import React, { useState, useEffect, useCallback } from 'react';
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
    window.location.href = '/';
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
    if (!window.confirm('Delete this post?')) return;
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

  if (loading) return <div className="container">Loading post...</div>;
  if (error) return <div className="container" style={{ color: 'red' }}>{error}</div>;
  if (!post) return <div className="container">Post not found</div>;

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
            {user && <li><Link to="/create-post">Write Post</Link></li>}
            {user && <li><Link to="/profile">Profile</Link></li>}
            {user?.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
            {user ? <li><button onClick={handleLogout}>Logout</button></li> : <><li><Link to="/login">Login</Link></li><li><Link to="/register">Register</Link></li></>}
            <li><button onClick={toggleTheme} className="theme-toggle">{darkMode ? '☀️ Light' : '🌙 Dark'}</button></li>
          </ul>
        </nav>
      </header>

      <div className="container">
        <h1>{post.title}</h1>
        <p>By {post.author_name} | {new Date(post.created_at).toLocaleDateString()}</p>
        {canEdit() && (
          <div style={{ margin: '20px 0' }}>
            <Link to={`/edit-post/${post.id}`} style={{ marginRight: '10px' }}>✏️ Edit Post</Link>
            <button onClick={handleDelete}>🗑️ Delete Post</button>
          </div>
        )}
        {post.image && <img src={`https://thefolio-backend-1.onrender.com/uploads/${post.image}`} alt={post.title} style={{ maxWidth: '100%', borderRadius: '10px', margin: '20px 0' }} />}
        <div style={{ lineHeight: '1.8', fontSize: '18px' }}>{post.body.split('\n').map((p, i) => <p key={i}>{p}</p>)}</div>
        <Comments postId={post.id} />
        <Link to="/home">← Back to Home</Link>
      </div>
      <footer><p>© 2026 AnimeVerse Portfolio</p></footer>
    </>
  );
}

export default PostPage;