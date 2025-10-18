import React from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaCheckCircle, FaTimesCircle, FaBolt, FaFire, FaChartLine, FaRedo, FaHome } from 'react-icons/fa';
import Confetti from 'react-confetti';
import './Results.css';

const Results = ({ stats, difficulty, onRestart, onHome }) => {
  const accuracy = stats.total > 0 ? (stats.correct / stats.total * 100).toFixed(1) : 0;
  const averageTime = stats.total > 0 ? (stats.totalTime / stats.total).toFixed(1) : 0;
  
  const getPerformanceLevel = () => {
    if (accuracy >= 90) return { level: '優秀', emoji: '🏆', color: '#10b981' };
    if (accuracy >= 75) return { level: '良好', emoji: '🌟', color: '#3b82f6' };
    if (accuracy >= 60) return { level: '合格', emoji: '👍', color: '#f59e0b' };
    return { level: '需要加強', emoji: '💪', color: '#ef4444' };
  };

  const performance = getPerformanceLevel();
  const showConfetti = accuracy >= 75;

  return (
    <div className="results-container">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <motion.div
        className="results-card"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
      >
        <motion.div 
          className="trophy-icon"
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FaTrophy size={80} color={performance.color} />
        </motion.div>

        <h1 className="results-title">遊戲結束！</h1>
        
        <motion.div
          className="performance-badge"
          style={{ backgroundColor: performance.color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          <span className="performance-emoji">{performance.emoji}</span>
          <span className="performance-level">{performance.level}</span>
        </motion.div>

        <div className="results-grid">
          <motion.div 
            className="result-stat"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <FaCheckCircle className="stat-icon" color="#10b981" />
            <div className="stat-label">答對題數</div>
            <div className="stat-value correct">{stats.correct}</div>
          </motion.div>

          <motion.div 
            className="result-stat"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <FaTimesCircle className="stat-icon" color="#ef4444" />
            <div className="stat-label">答錯題數</div>
            <div className="stat-value wrong">{stats.wrong}</div>
          </motion.div>

          <motion.div 
            className="result-stat"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <FaChartLine className="stat-icon" color="#3b82f6" />
            <div className="stat-label">正確率</div>
            <div className="stat-value accuracy">{accuracy}%</div>
          </motion.div>

          <motion.div 
            className="result-stat"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <FaBolt className="stat-icon" color="#f59e0b" />
            <div className="stat-label">平均時間</div>
            <div className="stat-value time">{averageTime}秒</div>
          </motion.div>

          <motion.div 
            className="result-stat"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.0 }}
          >
            <FaTrophy className="stat-icon" color="#667eea" />
            <div className="stat-label">總得分</div>
            <div className="stat-value score">{stats.score}</div>
          </motion.div>

          <motion.div 
            className="result-stat"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.1 }}
          >
            <FaFire className="stat-icon" color="#f97316" />
            <div className="stat-label">最高連勝</div>
            <div className="stat-value streak">{stats.maxStreak}</div>
          </motion.div>
        </div>

        <motion.div
          className="results-actions"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.button
            className="action-btn restart-btn"
            onClick={onRestart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaRedo /> 再玩一次
          </motion.button>
          <motion.button
            className="action-btn home-btn"
            onClick={onHome}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaHome /> 返回首頁
          </motion.button>
        </motion.div>

        <motion.div
          className="difficulty-display"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          難度：{difficulty === 'easy' ? '簡單' : difficulty === 'medium' ? '中等' : '困難'}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Results;
