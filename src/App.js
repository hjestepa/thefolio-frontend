import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/posts/:id" element={<PostPage />} />
            <Route path="/create-post" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
            <Route path="/edit-post/:id" element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;