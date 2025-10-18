import React from 'react';
import { motion } from 'framer-motion';
import { FaGamepad, FaClock, FaStar, FaBolt, FaTrophy, FaFire } from 'react-icons/fa';
import './Instructions.css';

const Instructions = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="instructions-container">
      <motion.div
        className="instructions-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="instructions-title"
          variants={itemVariants}
        >
          <FaGamepad /> 遊戲說明
        </motion.h1>

        <motion.section className="instruction-section" variants={itemVariants}>
          <h2><FaClock /> 遊戲規則</h2>
          <ul>
            <li>選擇難度、運算類型和題目數量</li>
            <li>在限時內回答數學問題</li>
            <li>答對得分，答錯不扣分</li>
            <li>連續答對可獲得連勝獎勵</li>
            <li>完成所有題目查看成績分析</li>
          </ul>
        </motion.section>

        <motion.section className="instruction-section" variants={itemVariants}>
          <h2><FaStar /> 難度說明</h2>
          <div className="difficulty-cards">
            <div className="difficulty-card easy">
              <h3>🟢 簡單</h3>
              <p>數字範圍：1-20</p>
              <p>答題時間：10秒</p>
            </div>
            <div className="difficulty-card medium">
              <h3>🟡 中等</h3>
              <p>數字範圍：1-50</p>
              <p>答題時間：8秒</p>
            </div>
            <div className="difficulty-card hard">
              <h3>🔴 困難</h3>
              <p>數字範圍：1-100</p>
              <p>答題時間：6秒</p>
            </div>
          </div>
        </motion.section>

        <motion.section className="instruction-section" variants={itemVariants}>
          <h2><FaBolt /> 計分方式</h2>
          <ul>
            <li><strong>基本分數：</strong>答對一題得100分</li>
            <li><strong>速度獎勵：</strong>剩餘時間越多，額外獎勵越高（最高50分）</li>
            <li><strong>連勝獎勵：</strong>
              <ul>
                <li>3連勝：+10分</li>
                <li>5連勝：+15分</li>
                <li>10連勝：+25分</li>
              </ul>
            </li>
          </ul>
        </motion.section>

        <motion.section className="instruction-section" variants={itemVariants}>
          <h2><FaTrophy /> 成就系統</h2>
          <div className="achievement-cards">
            <div className="achievement-card">
              <span>🏆 優秀</span>
              <p>正確率 ≥ 90%</p>
            </div>
            <div className="achievement-card">
              <span>🌟 良好</span>
              <p>正確率 ≥ 75%</p>
            </div>
            <div className="achievement-card">
              <span>👍 合格</span>
              <p>正確率 ≥ 60%</p>
            </div>
            <div className="achievement-card">
              <span>💪 需要加強</span>
              <p>正確率 &lt; 60%</p>
            </div>
          </div>
        </motion.section>

        <motion.section className="instruction-section" variants={itemVariants}>
          <h2><FaFire /> 遊戲技巧</h2>
          <ul>
            <li>保持專注，快速判斷答案</li>
            <li>建立連勝以獲得更多獎勵分數</li>
            <li>從簡單難度開始熟悉遊戲節奏</li>
            <li>練習不同運算類型提升技能</li>
            <li>查看結果分析了解強弱項</li>
          </ul>
        </motion.section>

        <motion.div 
          className="start-tip"
          variants={itemVariants}
        >
          <FaGamepad size={40} />
          <p>準備好了嗎？點擊上方「遊戲」開始挑戰！</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Instructions;
