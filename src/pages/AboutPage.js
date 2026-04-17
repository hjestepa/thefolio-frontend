// frontend/src/pages/AboutPage.js
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function AboutPage() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header>
        <h1>AnimeVerse</h1>
        <nav>
          <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', alignItems: 'center', margin: 0, padding: 0 }}>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/game">Game</Link></li>
            <li><Link to="/about" style={{ fontWeight: 'bold' }}>About</Link></li>
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

      <section>
        <h2>What I Love About Anime</h2>
        <p>
          Anime is a powerful storytelling medium that blends art, music, and emotion.
          It can explore deep themes while still being entertaining and visually creative.
        </p>
        <img src="/animee1.png" alt="Anime themed artwork" style={{ display: 'block', margin: 'auto' }} />
        <img src="/animee2.PNG" alt="Anime themed artwork" style={{ display: 'block', margin: 'auto' }} />
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
          <li>You can learn lesson from it</li>
        </ol>

        <img src="/logo.png" alt="Logo" className="logo" />
      </section>

      <section>
        <blockquote>
          "Anime is not a genre, it's a medium." — Hayao Miyazaki
        </blockquote>
      </section>

      <footer>
        <p>© 2026 AnimeVerse Portfolio</p>
      </footer>
    </>
  );
}

export default AboutPage;