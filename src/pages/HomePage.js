import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

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
    return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>AnimeVerse</h1>
      <p>Welcome, {user?.name}!</p>
      <button onClick={handleLogout}>Logout</button>
      <hr />
      <h2>Latest Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map(post => (
          <div key={post.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
            <h3>{post.title}</h3>
            <p>{post.body?.substring(0, 150)}...</p>
            <small>By {post.author_name} | {new Date(post.created_at).toLocaleDateString()}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default HomePage;