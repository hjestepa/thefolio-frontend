// frontend/src/App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import GamePage from './pages/GamePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RegisterPage from './pages/RegisterPage';
import CreatePostPage from './pages/CreatePostPage';
import PostPage from './pages/PostPage';
import EditPostPage from './pages/EditPostPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes - Only login and register are public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Redirect root to login if not logged in, to home if logged in */}
      <Route path="/" element={
        user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
      } />
      
      {/* Protected Routes - Require login for everything else */}
      <Route path="/home" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      
      <Route path="/game" element={
        <ProtectedRoute>
          <GamePage />
        </ProtectedRoute>
      } />
      
      <Route path="/about" element={
        <ProtectedRoute>
          <AboutPage />
        </ProtectedRoute>
      } />
      
      <Route path="/contact" element={
        <ProtectedRoute>
          <ContactPage />
        </ProtectedRoute>
      } />
      
      <Route path="/posts/:id" element={
        <ProtectedRoute>
          <PostPage />
        </ProtectedRoute>
      } />
      
      <Route path="/create-post" element={
        <ProtectedRoute>
          <CreatePostPage />
        </ProtectedRoute>
      } />
      
      <Route path="/edit-post/:id" element={
        <ProtectedRoute>
          <EditPostPage />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute role="admin">
          <AdminPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;