import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    API.get('/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (loading) {
    return <div className="container">Loading posts...</div>;
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
            {user && <li><Link to="/create-post">Write Post</Link></li>}
            {user && <li><Link to="/profile">Profile</Link></li>}
            {user?.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
            {user ? (
              <li><button onClick={handleLogout}>Logout</button></li>
            ) : (
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

      <div className="hero">
        <h2>Exploring the World of Anime</h2>
        <p>
          Anime is a unique storytelling medium that combines art, emotion,
          music, and culture into unforgettable experiences.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <img src="/images/anime1.png" alt="Anime artwork" style={{ maxWidth: '280px', borderRadius: '15px' }} />
          <img src="/images/anime2.PNG" alt="Anime artwork" style={{ maxWidth: '280px', borderRadius: '15px' }} />
        </div>
      </div>

      <div className="container">
        <h3>Latest Blog Posts</h3>
        {posts.length === 0 ? (
          <p>No posts yet. Be the first to write one!</p>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>By {post.author_name} | {new Date(post.created_at).toLocaleDateString()}</p>
              <p>{post.body?.substring(0, 150)}...</p>
              <Link to={`/posts/${post.id}`}>Read More →</Link>
            </div>
          ))
        )}

        <h3>Why Anime Matters</h3>
        <ul>
          <li>Creative and expressive animation styles</li>
          <li>Emotional and meaningful storytelling</li>
          <li>Strong influence on global pop culture</li>
        </ul>
      </div>

      <footer>
        <p>Placeholder Email: hjestepa@gmail.com</p>
        <p>© 2026 AnimeVerse Portfolio</p>
      </footer>
    </>
  );
}

export default HomePage;