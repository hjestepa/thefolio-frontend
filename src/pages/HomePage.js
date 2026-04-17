// frontend/src/pages/HomePage.js
import { useState, useEffect } from 'react';
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
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        Loading posts...
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

      <section className="hero">
        <h2>Exploring the World of Anime</h2>
        <p>
          Anime is a unique storytelling medium that combines art, emotion,
          music, and culture into unforgettable experiences.
        </p>
        <img src="/anime1.png" alt="Anime themed artwork" />
        <img src="/anime2.PNG" alt="Anime themed artwork" />
      </section>

      <section>
        <h3>Latest Blog Posts</h3>
        {posts.length === 0 ? (
          <p>No posts yet. Be the first to write one!</p>
        ) : (
          <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
            {posts.map(post => (
              <div key={post.id} className="post-card">
                {post.image && (
                  <img 
                    src={`http://localhost:5000/uploads/${post.image}`} 
                    alt={post.title}
                    style={{ maxWidth: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }}
                  />
                )}
                <h3>{post.title}</h3>
                <p className="card-meta">
                  By {post.author_name || 'Unknown'} | {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p>{post.body.substring(0, 150)}...</p>
                <Link to={`/posts/${post.id}`} className="btn" style={{ display: 'inline-block', marginTop: '10px' }}>
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3>Why Anime Matters</h3>
        <ul>
          <li>Creative and expressive animation styles</li>
          <li>Emotional and meaningful storytelling</li>
          <li>Strong influence on global pop culture</li>
        </ul>
      </section>

      <footer>
        <p>Placeholder Email: hjestepa@gmail.com</p>
        <p>© 2026 AnimeVerse Portfolio</p>
      </footer>
    </>
  );
}

export default HomePage;