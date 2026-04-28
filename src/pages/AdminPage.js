import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersRes = await API.get('/admin/users');
      setUsers(usersRes.data);
      const postsRes = await API.get('/admin/posts');
      setPosts(postsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const res = await API.put(`/admin/users/${userId}/status`);
      setMessage(res.data.message);
      setUsers(users.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update user');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const removePost = async (postId) => {
    if (!window.confirm('Remove this post?')) return;
    try {
      await API.put(`/admin/posts/${postId}/remove`);
      setMessage('Post removed');
      setPosts(posts.map(p => p.id === postId ? { ...p, status: 'removed' } : p));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to remove post');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="container"><h1>Access Denied</h1><Link to="/home">Go to Home</Link></div>;
  }

  if (loading) return <div className="container">Loading dashboard...</div>;

  return (
    <>
      <header>
        <h1>AnimeVerse Admin</h1>
        <nav>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/game">Game</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/create-post">Write Post</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/admin">Admin</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
            <li><button onClick={toggleTheme} className="theme-toggle">{darkMode ? '☀️ Light' : '🌙 Dark'}</button></li>
          </ul>
        </nav>
      </header>

      <div className="container">
        <h1>Admin Dashboard</h1>
        {message && <p style={{ color: '#2ecc71' }}>{message}</p>}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button onClick={() => setActiveTab('users')} style={{ background: activeTab === 'users' ? 'var(--primary)' : 'var(--secondary)' }}>Members ({users.length})</button>
          <button onClick={() => setActiveTab('posts')} style={{ background: activeTab === 'posts' ? 'var(--primary)' : 'var(--secondary)' }}>All Posts ({posts.length})</button>
        </div>
        {activeTab === 'users' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--card-bg)' }}>
            <thead><tr style={{ background: 'var(--secondary)' }}><th style={{ padding: '10px' }}>Name</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}><td style={{ padding: '10px' }}>{u.name}</td><td>{u.email}</td><td>{u.status}</td><td><button onClick={() => toggleUserStatus(u.id)}>{u.status === 'active' ? 'Deactivate' : 'Activate'}</button></td></tr>
              ))}
            </tbody>
          </table>
        )}
        {activeTab === 'posts' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--card-bg)' }}>
            <thead><tr style={{ background: 'var(--secondary)' }}><th style={{ padding: '10px' }}>Title</th><th>Author</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id}><td style={{ padding: '10px' }}><Link to={`/posts/${p.id}`}>{p.title}</Link></td><td>{p.author_name}</td><td>{p.status}</td><td>{p.status === 'published' && <button onClick={() => removePost(p.id)}>Remove</button>}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <footer><p>© 2026 AnimeVerse | Admin Dashboard</p></footer>
    </>
  );
}

export default AdminPage;