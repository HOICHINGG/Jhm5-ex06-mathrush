import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPause, FaPlay, FaStop } from 'react-icons/fa';
import './GamePlay.css';

const GamePlay = ({ settings, onEndGame }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [responseTimes, setResponseTimes] = useState([]);
  const [streak, setStreak] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const timeModes = {
    normal: 10,
    fast: 7,
    pressure: 5,
    extreme: 3
  };

  const timePerQuestion = timeModes[settings.timeMode];

  const ranges = {
    easy: { min: 1, max: 10 },
    medium: { min: 1, max: 50 },
    hard: { min: 1, max: 100 },
    extreme: { min: 1, max: 999 }
  };

  const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const generateQuestion = useCallback(() => {
    const range = ranges[settings.difficulty];
    let operation;
    
    if (settings.operationType === 'mixed') {
      const operations = ['+', '-', '*', '/'];
      operation = operations[randomInt(0, 3)];
    } else {
      const operationMap = {
        addition: '+',
        subtraction: '-',
        multiplication: '*',
        division: '/'
      };
      operation = operationMap[settings.operationType];
    }

    let num1, num2, correctAnswer;

    switch(operation) {
      case '+':
        num1 = randomInt(range.min, range.max);
        num2 = randomInt(range.min, range.max);
        correctAnswer = num1 + num2;
        break;
      case '-':
        num1 = randomInt(range.min, range.max);
        num2 = randomInt(range.min, num1);
        correctAnswer = num1 - num2;
        break;
      case '*':
        const multMax = Math.min(range.max, 20);
        num1 = randomInt(range.min, multMax);
        num2 = randomInt(range.min, multMax);
        correctAnswer = num1 * num2;
        break;
      case '/':
        num2 = randomInt(Math.max(2, range.min), Math.min(range.max, 20));
        correctAnswer = randomInt(range.min, Math.min(range.max, 50));
        num1 = num2 * correctAnswer;
        break;
      default:
        break;
    }

    const question = {
      text: `${num1} ${operation} ${num2}`,
      correctAnswer
    };

    const wrongAnswers = [];
    const variance = Math.max(Math.floor(Math.abs(correctAnswer) * 0.5), 5);
    
    while (wrongAnswers.length < 3) {
      const wrongAnswer = correctAnswer + randomInt(-variance, variance);
      if (!wrongAnswers.includes(wrongAnswer) && wrongAnswer !== correctAnswer && wrongAnswer >= 0) {
        wrongAnswers.push(wrongAnswer);
      }
    }

    const allOptions = shuffleArray([correctAnswer, ...wrongAnswers]);
    
    setCurrentQuestion(question);
    setOptions(allOptions);
    setTimeRemaining(timePerQuestion);
    setQuestionStartTime(Date.now());
    setFeedback(null);
    setSelectedAnswer(null);
  }, [settings, timePerQuestion, ranges]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  useEffect(() => {
    if (isPaused || feedback) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0.1) {
          handleTimeout();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isPaused, feedback]);

  const handleTimeout = () => {
    setFeedback({
      type: 'wrong',
      message: `⏰ 時間到！正確答案是 ${currentQuestion.correctAnswer}`
    });
    setStreak(0);
    setResponseTimes(prev => [...prev, timePerQuestion]);
    
    setTimeout(() => {
      setQuestionsAnswered(prev => {
        const newCount = prev + 1;
        if (newCount >= settings.totalQuestions) {
          endGame();
        } else {
          generateQuestion();
        }
        return newCount;
      });
    }, 2000);
  };

  const handleAnswer = (answer) => {
    if (feedback || selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const responseTime = (Date.now() - questionStartTime) / 1000;
    setResponseTimes(prev => [...prev, responseTime]);

    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      let points = 100;
      const speedBonus = Math.floor((timePerQuestion - responseTime) / timePerQuestion * 50);
      points += Math.max(0, speedBonus);

      const newStreak = streak + 1;
      setStreak(newStreak);

      if (newStreak >= 5) {
        points += 25;
      } else if (newStreak >= 3) {
        points += 10;
      }

      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
      
      let message = `✅ 正確！+${points} 分`;
      if (newStreak >= 3) {
        message += ` 🔥 連擊 x${newStreak}`;
      }
      
      setFeedback({ type: 'correct', message });
    } else {
      setStreak(0);
      setFeedback({
        type: 'wrong',
        message: `❌ 錯誤！正確答案是 ${currentQuestion.correctAnswer}`
      });
    }

    setTimeout(() => {
      setQuestionsAnswered(prev => {
        const newCount = prev + 1;
        if (newCount >= settings.totalQuestions) {
          endGame();
        } else {
          generateQuestion();
        }
        return newCount;
      });
    }, 2000);
  };

  const endGame = () => {
    const accuracy = ((correctAnswers / questionsAnswered) * 100).toFixed(1);
    const avgTime = (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2);
    const bestTime = Math.min(...responseTimes).toFixed(2);

    onEndGame({
      score,
      questionsAnswered,
      correctAnswers,
      accuracy,
      avgTime,
      bestTime,
      settings
    });
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleQuit = () => {
    if (window.confirm('確定要結束遊戲嗎？')) {
      endGame();
    }
  };

  const accuracy = questionsAnswered > 0 
    ? ((correctAnswers / questionsAnswered) * 100).toFixed(0)
    : 100;

  const avgTime = responseTimes.length > 0
    ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1)
    : '0.0';

  const timerPercentage = (timeRemaining / timePerQuestion) * 100;

  return (
    <div className="gameplay-container">
      <motion.div 
        className="stats-dashboard"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {[
          { label: '分數', value: score, icon: '🏆' },
          { label: '題目', value: `${questionsAnswered}/${settings.totalQuestions}`, icon: '📝' },
          { label: '正確率', value: `${accuracy}%`, icon: '🎯' },
          { label: '平均時間', value: `${avgTime}s`, icon: '⏱️' }
        ].map((stat, index) => (
          <motion.div 
            key={stat.label}
            className="stat-card"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="question-card"
        key={currentQuestion?.text}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="question-display">
          <motion.div
            className="question-text"
            animate={{ 
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {currentQuestion?.text} = ?
          </motion.div>
        </div>

        <div className="timer-container">
          <motion.div 
            className="timer-bar"
            style={{ width: `${timerPercentage}%` }}
            animate={{ 
              backgroundColor: timerPercentage < 30 ? '#ef4444' : 
                              timerPercentage < 60 ? '#f59e0b' : '#10b981'
            }}
          />
        </div>
        <div className="timer-text">
          剩餘時間：<span className={timeRemaining < 3 ? 'time-warning' : ''}>
            {Math.max(0, timeRemaining).toFixed(1)}
          </span> 秒
        </div>
      </motion.div>

      <div className="answers-grid">
        {options.map((option, index) => {
          const letters = ['A', 'B', 'C', 'D'];
          const isSelected = selectedAnswer === option;
          const isCorrect = option === currentQuestion?.correctAnswer;
          const showResult = feedback !== null;

          let buttonClass = 'answer-btn';
          if (showResult) {
            if (isCorrect) buttonClass += ' correct';
            else if (isSelected) buttonClass += ' wrong';
          } else if (isSelected) {
            buttonClass += ' selected';
          }

          return (
            <motion.button
              key={index}
              className={buttonClass}
              onClick={() => handleAnswer(option)}
              disabled={feedback !== null}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: feedback ? 1 : 1.05, y: feedback ? 0 : -5 }}
              whileTap={{ scale: feedback ? 1 : 0.95 }}
            >
              <span className="answer-letter">{letters[index]}</span>
              <span className="answer-value">{option}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            className={`feedback-message ${feedback.type}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="game-controls">
        <motion.button
          className="control-btn pause-btn"
          onClick={handlePause}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isPaused ? <FaPlay /> : <FaPause />}
          {isPaused ? '繼續' : '暫停'}
        </motion.button>
        <motion.button
          className="control-btn quit-btn"
          onClick={handleQuit}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaStop /> 結束遊戲
        </motion.button>
      </div>
    </div>
  );
};

export default GamePlay;
