import React from 'react';
import { motion } from 'framer-motion';
import { FaReact, FaGithub, FaRocket, FaHeart } from 'react-icons/fa';
import { SiJavascript, SiFramer, SiCss3 } from 'react-icons/si';
import './About.css';

const About = () => {
  const techStack = [
    { name: 'React', icon: <FaReact />, color: '#61dafb' },
    { name: 'Framer Motion', icon: <SiFramer />, color: '#ff0055' },
    { name: 'JavaScript', icon: <SiJavascript />, color: '#f7df1e' },
    { name: 'CSS3', icon: <SiCss3 />, color: '#264de4' }
  ];

  return (
    <div className="about-container">
      <motion.div
        className="about-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="about-hero"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
        >
          <FaRocket className="hero-icon" />
          <h1>數學快算挑戰</h1>
          <p className="hero-subtitle">Math Rush Challenge</p>
        </motion.div>

        <motion.section
          className="about-section"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2>關於這個專案</h2>
          <p>
            數學快算挑戰是一個互動式的數學練習遊戲，旨在幫助學生和愛好者提升數學運算能力。
            透過有趣的遊戲方式，讓學習數學變得更加輕鬆愉快。
          </p>
          <p>
            遊戲支援多種難度和運算類型，並提供即時反饋和詳細的成績分析，
            幫助使用者了解自己的學習進度和需要改進的地方。
          </p>
        </motion.section>

        <motion.section
          className="about-section"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2>主要功能</h2>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-emoji">🎯</span>
              <h3>多種難度</h3>
              <p>從簡單到困難，適合不同程度的學習者</p>
            </div>
            <div className="feature-item">
              <span className="feature-emoji">⚡</span>
              <h3>限時挑戰</h3>
              <p>訓練快速反應和計算能力</p>
            </div>
            <div className="feature-item">
              <span className="feature-emoji">🏆</span>
              <h3>成就系統</h3>
              <p>連勝獎勵和速度加分機制</p>
            </div>
            <div className="feature-item">
              <span className="feature-emoji">📊</span>
              <h3>數據分析</h3>
              <p>詳細的成績統計和表現評估</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="about-section tech-section"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2>技術棧</h2>
          <div className="tech-stack">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                className="tech-badge"
                style={{ borderColor: tech.color }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <span className="tech-icon" style={{ color: tech.color }}>
                  {tech.icon}
                </span>
                <span className="tech-name">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="about-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2>開發資訊</h2>
          <div className="dev-info">
            <p><strong>版本：</strong>2.0.0 (React Edition)</p>
            <p><strong>更新日期：</strong>2024</p>
            <p><strong>開發者：</strong>Math Rush Team</p>
          </div>
        </motion.section>

        <motion.div
          className="about-footer"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <p className="made-with">
            Made with <FaHeart className="heart-icon" /> using React & Framer Motion
          </p>
          <div className="footer-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FaGithub /> GitHub
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
