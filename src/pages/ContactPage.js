// frontend/src/pages/ContactPage.js
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function ContactPage() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
          <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', alignItems: 'center', margin: 0, padding: 0 }}>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/game">Game</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact" style={{ fontWeight: 'bold' }}>Contact</Link></li>
            
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

      <div className="contact-container">
        <section>
          <h2>Contact Me</h2>
          <p>Feel free to reach out for any anime-related discussions or questions!</p>
        </section>

        <div className="map-container">
          <h3 className="map-title">📍 My Location</h3>
          <iframe 
            className="map-frame"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61232.05548523264!2d120.30688773433331!3d16.322552522966943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3391dc8ed1a41a57%3A0x411e5d9a3338e987!2sAgoo%2C%20La%20Union%2C%20Philippines!5e0!3m2!1sen!2s!4v1698765432105!5m2!1sen!2s"
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map Location"
          />
          
          <div className="location-info">
            <p><strong>📍 Address:</strong> Agoo, La Union, Philippines</p>
            <p><strong>🏝️ Region:</strong> Ilocos Region, Luzon</p>
            <p><strong>📧 Email:</strong> hjestepa@gmail.com</p>
            <p><strong>🎌 About:</strong> Coastal municipality known for its beaches and friendly community</p>
          </div>
        </div>

        <div className="contact-sections">
          <div className="contact-form-container">
            <h3>Send a Message</h3>
            <form className="contact-form" onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="name"
                placeholder="Your Name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
              <input 
                type="email" 
                name="email"
                placeholder="Your Email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
              <textarea 
                name="message"
                placeholder="Your Message" 
                rows="4" 
                value={formData.message}
                onChange={handleChange}
                required 
                className="message-box"
              />
              <button type="submit">Send Message</button>
            </form>
            {submitted && (
              <p className="success-message">
                ✅ Message sent successfully! I'll get back to you soon.
              </p>
            )}
          </div>

          <section className="quick-info">
            <h3>Quick Contact Info</h3>
            <div className="info-card">
              <p><strong>Email:</strong> hjestepa@gmail.com</p>
              <p><strong>Location:</strong> Agoo, La Union, Philippines</p>
              <p><strong>Timezone:</strong> Philippine Standard Time (UTC+8)</p>
              <p><strong>Best Time to Contact:</strong> Weekdays, 9AM-6PM</p>
            </div>
          </section>
        </div>

        <section className="resources-section">
          <h2>Anime Resources</h2>
          
          <table className="resources-table">
            <thead>
              <tr>
                <th>Resource Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>MyAnimeList</td>
                <td>Track and review anime series</td>
              </tr>
              <tr>
                <td>Crunchyroll</td>
                <td>Official anime streaming service</td>
              </tr>
              <tr>
                <td>Anime News Network</td>
                <td>Industry news and updates</td>
              </tr>
            </tbody>
           </table>

          <div className="external-links">
            <p>External Links:</p>
            <a href="https://myanimelist.net" target="_blank" rel="noopener noreferrer">MyAnimeList</a>
            <span className="separator">|</span>
            <a href="https://www.crunchyroll.com" target="_blank" rel="noopener noreferrer">Crunchyroll</a>
            <span className="separator">|</span>
            <a href="https://www.animenewsnetwork.com/" target="_blank" rel="noopener noreferrer">AnimeNewsNetwork</a>
          </div>
        </section>
      </div>

      <footer>
        <p>© 2026 AnimeVerse Portfolio | Based in Agoo, La Union, Philippines</p>
      </footer>
    </>
  );
}

export default ContactPage;
