import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/register', { name, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)'
    }}>
      <div style={{
        background: 'var(--card-bg)',
        padding: '40px',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: 'var(--primary)' }}>AnimeVerse</h1>
          <button onClick={toggleTheme} className="theme-toggle">
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
        <h2>Register</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ marginBottom: '15px' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: '15px' }}
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            style={{ marginBottom: '20px' }}
          />
          <button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p style={{ marginTop: '20px' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;