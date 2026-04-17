// frontend/src/pages/AdminPage.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const usersRes = await API.get('/admin/users');
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      const postsRes = await API.get('/admin/posts');
      setPosts(Array.isArray(postsRes.data) ? postsRes.data : []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const res = await API.put(`/admin/users/${userId}/status`);
      setMessage(res.data.message);
      setUsers(prevUsers => prevUsers.map(u => 
        u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      ));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update user status');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const removePost = async (postId) => {
    if (!window.confirm('Are you sure you want to remove this post?')) return;
    try {
      await API.put(`/admin/posts/${postId}/remove`);
      setMessage('Post removed successfully');
      setPosts(prevPosts => prevPosts.map(p => 
        p.id === postId ? { ...p, status: 'removed' } : p
      ));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to remove post');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (!user || user.role !== 'admin') {
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
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li>
                <button onClick={toggleTheme} className="theme-toggle">
                  {darkMode ? '☀️ Light' : '🌙 Dark'}
                </button>
              </li>
            </ul>
          </nav>
        </header>
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p>You do not have permission to view this page.</p>
          <Link to="/home" style={{ color: 'var(--primary)' }}>Go to Home</Link>
        </div>
      </>
    );
  }

  if (loading) {
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
              <li><Link to="/create-post">✏️ Write Post</Link></li>
              <li><Link to="/profile">👤 My Profile</Link></li>
              <li><Link to="/admin" style={{ fontWeight: 'bold', color: '#ff6b6b' }}>⚡ Admin</Link></li>
              <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Logout</button></li>
              <li>
                <button onClick={toggleTheme} className="theme-toggle">
                  {darkMode ? '☀️ Light' : '🌙 Dark'}
                </button>
              </li>
            </ul>
          </nav>
        </header>
        <div style={{ padding: '50px', textAlign: 'center' }}>Loading dashboard...</div>
      </>
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
            <li><Link to="/create-post">✏️ Write Post</Link></li>
            <li><Link to="/profile">👤 My Profile</Link></li>
            <li><Link to="/admin" style={{ fontWeight: 'bold', color: '#ff6b6b' }}>⚡ Admin</Link></li>
            <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Logout</button></li>
            <li>
              <button onClick={toggleTheme} className="theme-toggle">
                {darkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)', padding: '30px', borderRadius: '15px', marginBottom: '30px', color: 'white' }}>
          <h1 style={{ marginBottom: '10px' }}>Admin Dashboard</h1>
          <p>Manage users, posts, and site content from this panel.</p>
        </div>
        
        {message && (
          <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '15px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #2ecc71' }}>
            {message}
          </div>
        )}
        
        {error && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '15px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #e74c3c' }}>
            {error}
            <button onClick={fetchData} style={{ marginLeft: '15px', padding: '5px 15px', background: '#c62828', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Retry</button>
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '2px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'users' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'users' ? 'white' : 'var(--text-dark)',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '8px 8px 0 0',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            👥 Members ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'posts' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'posts' ? 'white' : 'var(--text-dark)',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '8px 8px 0 0',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            📝 All Posts ({posts.length})
          </button>
        </div>
        
        {activeTab === 'users' && (
          <div>
            <h2 style={{ marginBottom: '20px', color: 'var(--text-dark)' }}>Manage Members</h2>
            {users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'var(--card-bg)', borderRadius: '10px' }}>
                <p>No members found.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(userItem => (
                      <tr key={userItem.id}>
                        <td><strong>{userItem.name}</strong></td>
                        <td>{userItem.email}</td>
                        <td>
                          <span className={`badge ${userItem.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                            {userItem.status === 'active' ? '● Active' : '○ Inactive'}
                          </span>
                        </td>
                        <td>{new Date(userItem.created_at).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => toggleUserStatus(userItem.id)}
                            className={userItem.status === 'active' ? 'btn btn-danger' : 'btn btn-success'}
                            style={{ padding: '6px 16px', fontSize: '12px' }}
                          >
                            {userItem.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'posts' && (
          <div>
            <h2 style={{ marginBottom: '20px', color: 'var(--text-dark)' }}>Manage Posts</h2>
            {posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'var(--card-bg)', borderRadius: '10px' }}>
                <p>No posts found.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map(post => (
                      <tr key={post.id}>
                        <td>
                          <Link to={`/posts/${post.id}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>
                            {post.title}
                          </Link>
                        </td>
                        <td>{post.author_name || 'Unknown'}</td>
                        <td>
                          <span className={`badge ${post.status === 'published' ? 'badge-active' : 'badge-inactive'}`}>
                            {post.status === 'published' ? '● Published' : '○ Removed'}
                          </span>
                        </td>
                        <td>{new Date(post.created_at).toLocaleDateString()}</td>
                        <td>
                          {post.status === 'published' && (
                            <button
                              onClick={() => removePost(post.id)}
                              className="btn btn-danger"
                              style={{ padding: '6px 16px', fontSize: '12px' }}
                            >
                              Remove
                            </button>
                          )}
                          {post.status === 'removed' && (
                            <span style={{ color: 'var(--text-medium)', fontSize: '12px' }}>Removed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <footer>
        <p>© 2026 AnimeVerse | Admin Dashboard</p>
      </footer>
    </>
  );
}

export default AdminPage;