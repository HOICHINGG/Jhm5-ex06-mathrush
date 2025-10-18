import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import Navigation from './components/Navigation';
import GameSettings from './components/GameSettings';
import GamePlay from './components/GamePlay';
import Results from './components/Results';
import Instructions from './components/Instructions';
import About from './components/About';

function App() {
  const [currentPage, setCurrentPage] = useState('game');
  const [gameState, setGameState] = useState('settings'); // settings, playing, results
  const [gameSettings, setGameSettings] = useState({
    difficulty: 'medium',
    operationType: 'mixed',
    timeMode: 'normal',
    totalQuestions: 20
  });
  const [gameResults, setGameResults] = useState(null);

  const handleStartGame = (settings) => {
    setGameSettings(settings);
    setGameState('playing');
  };

  const handleEndGame = (results) => {
    setGameResults(results);
    setGameState('results');
  };

  const handleRestart = () => {
    setGameState('playing');
  };

  const handleBackToSettings = () => {
    setGameState('settings');
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="App">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <AnimatePresence mode="wait">
        {currentPage === 'game' && (
          <motion.div
            key="game-page"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="page-container"
          >
            {gameState === 'settings' && (
              <GameSettings onStartGame={handleStartGame} />
            )}
            {gameState === 'playing' && (
              <GamePlay 
                settings={gameSettings} 
                onEndGame={handleEndGame} 
              />
            )}
            {gameState === 'results' && (
              <Results 
                results={gameResults} 
                onRestart={handleRestart}
                onBackToSettings={handleBackToSettings}
              />
            )}
          </motion.div>
        )}

        {currentPage === 'instructions' && (
          <motion.div
            key="instructions-page"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="page-container"
          >
            <Instructions />
          </motion.div>
        )}

        {currentPage === 'about' && (
          <motion.div
            key="about-page"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="page-container"
          >
            <About />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="main-footer">
        <div className="footer-content">
          <p>© 2025 數學反應挑戰 (Math Rush Challenge). 版權所有。</p>
          <p>開發者：HOICHINGG | 專案作業：JHM5-EX06</p>
          <p className="footer-tech">⚛️ Built with React + Framer Motion</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
