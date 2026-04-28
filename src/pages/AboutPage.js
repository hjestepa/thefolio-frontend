import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function AboutPage() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
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

      <div className="container">
        <section>
          <h2>What I Love About Anime</h2>
          <p>
            Anime is a powerful storytelling medium that blends art, music, and emotion.
            It can explore deep themes while still being entertaining and visually creative.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
            <img src="/images/animee1.png" alt="Anime artwork" style={{ maxWidth: '300px', borderRadius: '10px' }} />
            <img src="/images/animee2.PNG" alt="Anime artwork" style={{ maxWidth: '300px', borderRadius: '10px' }} />
          </div>
        </section>

        <section>
          <h2>My Journey With Anime</h2>
          <p>
            I started watching anime at a young age (first year highschool), and over time it became more than just
            entertainment. It helped me appreciate animation, culture, and storytelling.
          </p>
          <ol>
            <li>First anime experience</li>
            <li>Exploring different genres</li>
            <li>You can learn lessons from it</li>
          </ol>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <img src="/images/logo.png" alt="Logo" style={{ width: '100px', borderRadius: '50%' }} />
          </div>
        </section>

        <section>
          <blockquote style={{
            fontStyle: 'italic',
            fontSize: '1.5rem',
            textAlign: 'center',
            padding: '20px',
            borderLeft: '4px solid var(--primary)',
            background: 'var(--secondary)',
            borderRadius: '10px',
            margin: '20px 0'
          }}>
            "Anime is not a genre, it's a medium." — Hayao Miyazaki
          </blockquote>
        </section>
      </div>

      <footer>
        <p>© 2026 AnimeVerse Portfolio</p>
      </footer>
    </>
  );
}

export default AboutPage;