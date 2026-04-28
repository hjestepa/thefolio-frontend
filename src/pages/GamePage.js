import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function GamePage() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [gameImages, setGameImages] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const allImages = [
    { id: 1, src: '/images/image1.png', answer: 'Naruto Shippuden' },
    { id: 2, src: '/images/image2.png', answer: 'Naruto Shippuden' },
    { id: 3, src: '/images/image3.png', answer: 'Naruto Shippuden' },
    { id: 4, src: '/images/image4.png', answer: 'Naruto Shippuden' },
    { id: 5, src: '/images/image5.png', answer: 'Attack on Titan' },
    { id: 6, src: '/images/image6.png', answer: 'Attack on Titan' },
    { id: 7, src: '/images/image7.png', answer: 'Attack on Titan' },
    { id: 8, src: '/images/image8.png', answer: 'Attack on Titan' },
    { id: 9, src: '/images/image9.png', answer: 'Dragon Ball' },
    { id: 10, src: '/images/image10.png', answer: 'Dragon Ball' },
    { id: 11, src: '/images/image11.png', answer: 'Dragon Ball' },
    { id: 12, src: '/images/image12.png', answer: 'Dragon Ball' },
  ];

  const baseChoices = ['One Piece', 'Jujutsu Kaisen'];

  const startNewGame = () => {
    const shuffled = [...allImages].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5);
    setGameImages(selected);
    setCurrentRound(0);
    setScore(0);
    setSelectedAnswer(null);
    setFeedback('');
    setGameOver(false);
    setLoading(false);
  };

  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getChoices = (correctAnswer) => {
    let choices = [...baseChoices, correctAnswer];
    return choices.sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (choice) => {
    if (selectedAnswer !== null) return;
    const currentImage = gameImages[currentRound];
    const isCorrect = choice === currentImage.answer;
    setSelectedAnswer(choice);
    if (isCorrect) {
      setScore(score + 2);
      setFeedback(`✅ Correct! It's ${currentImage.answer}! +2 points`);
    } else {
      setFeedback(`❌ Wrong! It's ${currentImage.answer}.`);
    }
    setTimeout(() => {
      if (currentRound + 1 >= gameImages.length) {
        setGameOver(true);
      } else {
        setCurrentRound(currentRound + 1);
        setSelectedAnswer(null);
        setFeedback('');
      }
    }, 1500);
  };

  const playAgain = () => {
    startNewGame();
  };

  if (loading) return <div className="container">Loading game...</div>;

  const currentImage = gameImages[currentRound];

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
            {user ? <li><button onClick={handleLogout}>Logout</button></li> : <><li><Link to="/login">Login</Link></li><li><Link to="/register">Register</Link></li></>}
            <li><button onClick={toggleTheme} className="theme-toggle">{darkMode ? '☀️ Light' : '🌙 Dark'}</button></li>
          </ul>
        </nav>
      </header>

      <div className="container">
        <h1 style={{ textAlign: 'center' }}>🎮 Anime Picture Game</h1>
        <p style={{ textAlign: 'center' }}>Guess the anime from the picture. 5 rounds, 2 points each.</p>

        {!gameOver ? (
          <>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              background: 'var(--secondary)',
              padding: '15px 20px',
              borderRadius: '10px',
              margin: '20px 0',
              color: 'var(--text-dark)',
              fontWeight: 'bold'
            }}>
              <div>Round: {currentRound + 1} / {gameImages.length}</div>
              <div>Score: {score} / {gameImages.length * 2}</div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <img
                src={currentImage.src}
                alt="Anime character"
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  borderRadius: '10px',
                  border: '3px solid var(--primary)',
                  boxShadow: '0 5px 20px var(--shadow)'
                }}
                onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'}
              />
            </div>

            {feedback && (
              <div style={{
                textAlign: 'center',
                margin: '20px 0',
                padding: '10px',
                fontSize: '18px',
                fontWeight: 'bold',
                borderRadius: '8px',
                backgroundColor: feedback.includes('✅') ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)',
                color: feedback.includes('✅') ? '#2ecc71' : '#e74c3c'
              }}>
                {feedback}
              </div>
            )}

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '15px',
              marginTop: '20px'
            }}>
              {getChoices(currentImage.answer).map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(choice)}
                  disabled={selectedAnswer !== null}
                  style={{
                    padding: '12px 24px',
                    minWidth: '180px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    background: selectedAnswer === choice 
                      ? (choice === currentImage.answer ? '#2ecc71' : '#e74c3c')
                      : 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '30px',
                    cursor: selectedAnswer !== null ? 'default' : 'pointer',
                    opacity: selectedAnswer !== null ? 0.8 : 1,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 5px var(--shadow)'
                  }}
                >
                  {choice}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div style={{
            textAlign: 'center',
            background: 'var(--card-bg)',
            padding: '40px',
            borderRadius: '15px',
            marginTop: '30px',
            boxShadow: '0 5px 20px var(--shadow)'
          }}>
            <h2>Game Over!</h2>
            <div style={{ fontSize: '48px', color: 'var(--primary)', margin: '20px 0', fontWeight: 'bold' }}>
              {score} / {gameImages.length * 2}
            </div>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>
              {score === 10 ? '🎯 PERFECT! Anime master!' :
               score >= 8 ? '🌟 Excellent!' :
               score >= 6 ? '👍 Good job!' :
               score >= 4 ? '📚 Keep watching!' :
               '🎌 Beginner level!'}
            </p>
            <button onClick={playAgain} style={{ marginRight: '10px' }}>Play Again</button>
            <Link to="/home"><button>Back to Home</button></Link>
          </div>
        )}
      </div>
      <footer><p>© 2026 AnimeVerse | Anime Picture Game</p></footer>
    </>
  );
}

export default GamePage;