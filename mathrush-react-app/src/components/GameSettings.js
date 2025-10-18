import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaFire, FaBolt, FaBrain, FaRocket } from 'react-icons/fa';
import './GameSettings.css';

const GameSettings = ({ onStartGame }) => {
  const [settings, setSettings] = useState({
    difficulty: 'medium',
    operationType: 'mixed',
    timeMode: 'normal',
    totalQuestions: 20
  });

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleStart = () => {
    onStartGame(settings);
  };

  const difficultyIcons = {
    easy: '🟢',
    medium: '🟡',
    hard: '🟠',
    extreme: '🔴'
  };

  const timeModeIcons = {
    normal: '⏱️',
    fast: '⚡',
    pressure: '🔥',
    extreme: '💀'
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="game-settings-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="game-header"
        variants={itemVariants}
      >
        <h1 className="game-title">
          <motion.span
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            🧮
          </motion.span>
          {' '}數學反應挑戰
        </h1>
        <motion.p 
          className="game-subtitle"
          variants={itemVariants}
        >
          測試你的數學速度和準確性！
        </motion.p>
      </motion.div>

      <motion.div 
        className="settings-card"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        <h2><FaBrain /> 遊戲設定</h2>
        
        <motion.div className="setting-group" variants={itemVariants}>
          <label>
            <span className="setting-icon">🎯</span>
            難度等級
          </label>
          <div className="option-grid">
            {['easy', 'medium', 'hard', 'extreme'].map(diff => (
              <motion.button
                key={diff}
                className={`option-btn ${settings.difficulty === diff ? 'active' : ''}`}
                onClick={() => handleChange('difficulty', diff)}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="option-icon">{difficultyIcons[diff]}</span>
                {diff === 'easy' && '簡單 (1-10)'}
                {diff === 'medium' && '中等 (1-50)'}
                {diff === 'hard' && '困難 (1-100)'}
                {diff === 'extreme' && '極限 (1-999)'}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div className="setting-group" variants={itemVariants}>
          <label>
            <span className="setting-icon">🔢</span>
            運算類型
          </label>
          <div className="option-grid">
            {[
              { value: 'mixed', label: '混合運算', icon: '🔀' },
              { value: 'addition', label: '僅加法', icon: '➕' },
              { value: 'subtraction', label: '僅減法', icon: '➖' },
              { value: 'multiplication', label: '僅乘法', icon: '✖️' },
              { value: 'division', label: '僅除法', icon: '➗' }
            ].map(op => (
              <motion.button
                key={op.value}
                className={`option-btn ${settings.operationType === op.value ? 'active' : ''}`}
                onClick={() => handleChange('operationType', op.value)}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="option-icon">{op.icon}</span>
                {op.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div className="setting-group" variants={itemVariants}>
          <label>
            <span className="setting-icon">⏰</span>
            時間模式
          </label>
          <div className="option-grid">
            {['normal', 'fast', 'pressure', 'extreme'].map(mode => (
              <motion.button
                key={mode}
                className={`option-btn ${settings.timeMode === mode ? 'active' : ''}`}
                onClick={() => handleChange('timeMode', mode)}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="option-icon">{timeModeIcons[mode]}</span>
                {mode === 'normal' && '標準 (10秒)'}
                {mode === 'fast' && '快速 (7秒)'}
                {mode === 'pressure' && '壓力 (5秒)'}
                {mode === 'extreme' && '極限 (3秒)'}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div className="setting-group" variants={itemVariants}>
          <label>
            <span className="setting-icon">📊</span>
            題目數量
          </label>
          <div className="option-grid">
            {[10, 20, 30, 50].map(num => (
              <motion.button
                key={num}
                className={`option-btn ${settings.totalQuestions === num ? 'active' : ''}`}
                onClick={() => handleChange('totalQuestions', num)}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                {num} 題
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.button
          className="start-game-btn"
          onClick={handleStart}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlay /> 開始遊戲 <FaRocket />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default GameSettings;
