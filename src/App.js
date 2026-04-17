// frontend/src/App.js
import { Routes, Route } from 'react-router-dom';
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
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
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
      
      <Route path="/posts/:id" element={<PostPage />} />
      
      <Route path="/admin" element={
        <ProtectedRoute role="admin">
          <AdminPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;