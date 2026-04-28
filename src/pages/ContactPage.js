import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function ContactPage() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
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
        <h2>Contact Me</h2>
        <p>Feel free to reach out for any anime-related discussions or questions!</p>

        <div style={{ background: 'var(--secondary)', padding: '20px', borderRadius: '15px', margin: '30px 0' }}>
          <h3>📍 My Location</h3>
          <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '10px', marginTop: '15px' }}>
            <p><strong>📍 Address:</strong> Agoo, La Union, Philippines</p>
            <p><strong>🏝️ Region:</strong> Ilocos Region, Luzon</p>
            <p><strong>📧 Email:</strong> hjestepa@gmail.com</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div style={{ background: 'var(--card-bg)', padding: '25px', borderRadius: '15px' }}>
            <h3>Send a Message</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required style={{ marginBottom: '15px' }} />
              <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required style={{ marginBottom: '15px' }} />
              <textarea name="message" placeholder="Your Message" rows="4" value={formData.message} onChange={handleChange} required style={{ marginBottom: '15px' }} />
              <button type="submit">Send Message</button>
            </form>
            {submitted && <p style={{ color: '#2ecc71', marginTop: '15px' }}>✅ Message sent successfully!</p>}
          </div>

          <div>
            <h2>Anime Resources</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--card-bg)', borderRadius: '10px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: 'var(--secondary)' }}>
                  <th style={{ padding: '12px' }}>Resource</th>
                  <th style={{ padding: '12px' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '12px' }}>MyAnimeList</td><td>Track anime</td></tr>
                <tr><td style={{ padding: '12px' }}>Crunchyroll</td><td>Stream anime</td></tr>
                <tr><td style={{ padding: '12px' }}>Anime News Network</td><td>News & updates</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <footer>
        <p>© 2026 AnimeVerse | Based in Agoo, La Union</p>
      </footer>
    </>
  );
}

export default ContactPage;