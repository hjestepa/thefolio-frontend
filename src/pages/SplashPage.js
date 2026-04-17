import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashPage.css';

function SplashPage() {
  const [dotCount, setDotCount] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Animate dots
    const dotInterval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);

    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        navigate('/home');
      }, 500);
    }, 3000);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className={`loader-container ${fadeOut ? 'fade-out' : ''}`}>
      <img src="/logo.png" alt="Logo" className="logo1" />
      <h1>AnimeVerse</h1>
      <div className="spinner"></div>
      <div className="loading-text">
        Loading<span className="dots">{'.'.repeat(dotCount)}</span>
      </div>
    </div>
  );
}

export default SplashPage;