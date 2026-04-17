// frontend/src/pages/GamePage.js
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function GamePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  
  // Game Data
  const pictures = [
    { img: "/anime_1.jpg", ans: "A", name: "Naruto Shippuden" },
    { img: "/anime_2.jpg", ans: "A", name: "Naruto Shippuden" },
    { img: "/anime_3.jpg", ans: "C", name: "Jujutsu Kaisen" },
    { img: "/anime_4.jpg", ans: "A", name: "Naruto Shippuden" },
    { img: "/anime_5.jpg", ans: "A", name: "Naruto Shippuden" },
    { img: "/anime_6.jpg", ans: "A", name: "Naruto Shippuden" },
    { img: "/anime_7.jpg", ans: "A", name: "Naruto Shippuden" },
    { img: "/anime_8.jpg", ans: "D", name: "Attack on Titan" },
    { img: "/anime_9.jpg", ans: "B", name: "Dragon Ball" },
    { img: "/anime_10.jpg", ans: "B", name: "Dragon Ball" },
    { img: "/anime_11.jpg", ans: "E", name: "One Piece" },
    { img: "/anime_12.jpg", ans: "D", name: "Attack on Titan" },
    { img: "/anime_13.jpg", ans: "B", name: "Dragon Ball" },
    { img: "/anime_14.jpg", ans: "E", name: "One Piece" },
    { img: "/anime_15.jpg", ans: "D", name: "Attack on Titan" },
    { img: "/anime_16.jpg", ans: "A", name: "Naruto Shippuden" },
    { img: "/anime_17.jpg", ans: "A", name: "Naruto Shippuden" },
    { img: "/anime_18.jpg", ans: "C", name: "Jujutsu Kaisen" }
  ];

  const choices = {
    "A": "Naruto Shippuden",
    "B": "Dragon Ball",
    "C": "Jujutsu Kaisen",
    "D": "Attack on Titan",
    "E": "One Piece"
  };

  // Game State
  const [game, setGame] = useState([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackClass, setFeedbackClass] = useState('');
  const [gameActive, setGameActive] = useState(true);
  const [showResults, setShowResults] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const startNewGame = () => {
    const shuffled = [...pictures].sort(() => Math.random() - 0.5).slice(0, 10);
    setGame(shuffled);
    setRound(0);
    setScore(0);
    setSelected(false);
    setGameActive(true);
    setShowResults(false);
    setFeedback('');
  };

  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectAnswer = (choice) => {
    if (!gameActive || selected || !game[round]) return;
    
    const correct = game[round].ans;
    const animeName = game[round].name;
    
    setSelected(true);
    
    if (choice === correct) {
      setScore(prev => prev + 10);
      setFeedback(`✅ Correct! It's ${animeName}!`);
      setFeedbackClass('feedback correct-feedback');
    } else {
      setFeedback(`❌ Wrong! It's ${animeName}.`);
      setFeedbackClass('feedback wrong-feedback');
    }
  };

  const nextRound = () => {
    if (round < 9) {
      setRound(prev => prev + 1);
      setSelected(false);
      setFeedback('');
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameActive(false);
    setShowResults(true);
  };

  const quitGame = () => {
    if (window.confirm("Quit? Progress lost.")) {
      endGame();
    }
  };

  const getScoreMessage = () => {
    const messages = [
      "🎯 PERFECT! Anime master!",
      "🌟 Excellent!",
      "👍 Good job!",
      "📚 Keep watching!",
      "🎌 Beginner level!"
    ];
    const idx = score === 100 ? 0 : score >= 80 ? 1 : score >= 60 ? 2 : score >= 40 ? 3 : 4;
    return messages[idx];
  };

  if (!game.length) {
    return <div>Loading game...</div>;
  }

  return (
    <>
      <header>
        <h1>AnimeVerse</h1>
        <nav>
          <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', alignItems: 'center', margin: 0, padding: 0 }}>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/game" style={{ fontWeight: 'bold' }}>Game</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            
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

      <div className="game-container">
        <h2>🎮 Anime Picture Game</h2>
        <p>Guess the anime from the picture. 10 rounds, 10 points each.</p>

        {!showResults ? (
          <div className="game-screen">
            <div className="game-header">
              <div className="game-stats">Round: <span>{round + 1}</span>/10</div>
              <div className="game-stats">Score: <span>{score}</span>/100</div>
            </div>

            <img 
              className="anime-picture" 
              src={game[round].img} 
              alt="Anime character from the quiz" 
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x300?text=Anime+Image';
              }}
            />

            <div className={feedbackClass}>{feedback}</div>

            <div className="choices-container">
              {Object.entries(choices).map(([letter, name]) => {
                const correct = game[round]?.ans;
                let buttonClass = "choice-btn";
                
                if (selected) {
                  if (letter === correct) {
                    buttonClass += " correct";
                  }
                }
                
                return (
                  <button
                    key={letter}
                    className={buttonClass}
                    onClick={() => selectAnswer(letter)}
                    disabled={selected || !gameActive}
                  >
                    {letter}) {name}
                  </button>
                );
              })}
            </div>

            <div className="controls">
              <button 
                className="game-btn" 
                onClick={nextRound}
                disabled={!selected}
              >
                Next →
              </button>
              <button 
                className="game-btn" 
                onClick={quitGame}
              >
                Quit
              </button>
            </div>
          </div>
        ) : (
          <div className="results-screen">
            <h2>Game Over!</h2>
            <div className="final-score">{score}/100</div>
            <div className="score-message">{getScoreMessage()}</div>
            <div className="results-buttons">
              <button className="game-btn" onClick={startNewGame}>
                Play Again
              </button>
              <Link to="/home">
                <button className="game-btn">Home</button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <footer>
        <p>© 2026 AnimeVerse | Game</p>
      </footer>
    </>
  );
}

export default GamePage;