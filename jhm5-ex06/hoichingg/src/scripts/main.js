// ===== Math Rush Challenge Game =====
// Complete game implementation with all requirements

class MathRushGame {
  constructor() {
    // Game state
    this.isPlaying = false;
    this.isPaused = false;
    this.score = 0;
    this.questionsAnswered = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.currentQuestion = null;
    this.questionStartTime = null;
    this.responseTimes = [];
    this.streak = 0;
    
    // Game settings
    this.difficulty = 'medium';
    this.operationType = 'mixed';
    this.timeMode = 'normal';
    this.totalQuestions = 20;
    this.timePerQuestion = 10;
    
    // Timer
    this.timer = null;
    this.timeRemaining = 10;
    
    // Sound elements
    this.correctSound = document.getElementById('correct-sound');
    this.wrongSound = document.getElementById('wrong-sound');
    this.completeSound = document.getElementById('complete-sound');
    
    // Initialize
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupGameControls();
    this.setupAnswerButtons();
  }

  // ===== Navigation System =====
  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const footerLinks = document.querySelectorAll('.footer-links a');
    
    [...navLinks, ...footerLinks].forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        this.showPage(page);
      });
    });
  }

  showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(`${pageName}-page`);
    if (selectedPage) {
      selectedPage.classList.add('active');
    }
    
    // Update nav active state
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === pageName) {
        link.classList.add('active');
      }
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ===== Game Controls Setup =====
  setupGameControls() {
    // Start game button
    const startBtn = document.getElementById('start-game-btn');
    startBtn.addEventListener('click', () => this.startGame());
    
    // Pause button
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => this.togglePause());
    }
    
    // Quit button
    const quitBtn = document.getElementById('quit-btn');
    if (quitBtn) {
      quitBtn.addEventListener('click', () => this.quitGame());
    }
    
    // Restart button (on results screen)
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.restartGame());
    }
    
    // New settings button
    const newSettingsBtn = document.getElementById('new-settings-btn');
    if (newSettingsBtn) {
      newSettingsBtn.addEventListener('click', () => this.backToSettings());
    }
  }

  setupAnswerButtons() {
    const answerBtns = document.querySelectorAll('.answer-btn');
    answerBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isPlaying && !this.isPaused) {
          this.checkAnswer(parseInt(btn.dataset.answer));
        }
      });
    });
  }

  // ===== Start Game =====
  startGame() {
    // Get settings
    this.difficulty = document.getElementById('difficulty-select').value;
    this.operationType = document.getElementById('operation-select').value;
    this.timeMode = document.getElementById('time-mode-select').value;
    this.totalQuestions = parseInt(document.getElementById('question-count-select').value);
    
    // Set time per question based on mode
    const timeModes = {
      normal: 10,
      fast: 7,
      pressure: 5,
      extreme: 3
    };
    this.timePerQuestion = timeModes[this.timeMode];
    
    // Reset game state
    this.isPlaying = true;
    this.isPaused = false;
    this.score = 0;
    this.questionsAnswered = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.responseTimes = [];
    this.streak = 0;
    
    // Hide settings, show game area
    document.getElementById('game-settings').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    document.getElementById('results-screen').style.display = 'none';
    
    // Update display
    this.updateStatsDisplay();
    
    // Generate first question
    this.generateQuestion();
  }

  // ===== Question Generation =====
  generateQuestion() {
    if (this.questionsAnswered >= this.totalQuestions) {
      this.endGame();
      return;
    }
    
    const ranges = {
      easy: { min: 1, max: 10 },
      medium: { min: 1, max: 50 },
      hard: { min: 1, max: 100 },
      extreme: { min: 1, max: 999 }
    };
    
    const range = ranges[this.difficulty];
    
    // Choose operation
    let operation;
    if (this.operationType === 'mixed') {
      const operations = ['+', '-', '*', '/'];
      operation = operations[Math.floor(Math.random() * operations.length)];
    } else {
      const operationMap = {
        addition: '+',
        subtraction: '-',
        multiplication: '*',
        division: '/'
      };
      operation = operationMap[this.operationType];
    }
    
    // Generate numbers based on operation
    let num1, num2, correctAnswer;
    
    switch(operation) {
      case '+':
        num1 = this.randomInt(range.min, range.max);
        num2 = this.randomInt(range.min, range.max);
        correctAnswer = num1 + num2;
        break;
        
      case '-':
        num1 = this.randomInt(range.min, range.max);
        num2 = this.randomInt(range.min, num1); // Ensure positive result
        correctAnswer = num1 - num2;
        break;
        
      case '*':
        // Scale down for multiplication
        const multMax = Math.min(range.max, 20);
        num1 = this.randomInt(range.min, multMax);
        num2 = this.randomInt(range.min, multMax);
        correctAnswer = num1 * num2;
        break;
        
      case '/':
        // Ensure even division
        num2 = this.randomInt(Math.max(2, range.min), Math.min(range.max, 20));
        correctAnswer = this.randomInt(range.min, Math.min(range.max, 50));
        num1 = num2 * correctAnswer;
        break;
    }
    
    // Store current question
    this.currentQuestion = {
      num1,
      num2,
      operation,
      correctAnswer,
      questionText: `${num1} ${operation} ${num2}`
    };
    
    // Display question
    document.getElementById('question-text').textContent = this.currentQuestion.questionText;
    
    // Generate answer options
    this.generateAnswerOptions(correctAnswer);
    
    // Start timer
    this.questionStartTime = Date.now();
    this.startTimer();
    
    // Clear feedback
    document.getElementById('feedback-message').textContent = '';
    document.getElementById('feedback-message').className = 'feedback-message';
  }

  generateAnswerOptions(correctAnswer) {
    const options = [correctAnswer];
    
    // Generate 3 wrong answers
    while (options.length < 4) {
      let wrongAnswer;
      const variance = Math.max(Math.floor(Math.abs(correctAnswer) * 0.5), 5);
      
      wrongAnswer = correctAnswer + this.randomInt(-variance, variance);
      
      // Ensure unique and not equal to correct answer
      if (!options.includes(wrongAnswer) && wrongAnswer !== correctAnswer && wrongAnswer >= 0) {
        options.push(wrongAnswer);
      }
    }
    
    // Shuffle options
    this.shuffleArray(options);
    
    // Display options
    const answerBtns = document.querySelectorAll('.answer-btn');
    const letters = ['A', 'B', 'C', 'D'];
    
    answerBtns.forEach((btn, index) => {
      btn.textContent = `${letters[index]}. ${options[index]}`;
      btn.dataset.answer = index;
      btn.dataset.value = options[index];
      btn.disabled = false;
      btn.className = 'answer-btn';
    });
    
    // Store correct answer index
    this.correctAnswerIndex = options.indexOf(correctAnswer);
  }

  // ===== Timer System =====
  startTimer() {
    this.timeRemaining = this.timePerQuestion;
    this.updateTimerDisplay();
    
    if (this.timer) {
      clearInterval(this.timer);
    }
    
    this.timer = setInterval(() => {
      if (!this.isPaused) {
        this.timeRemaining -= 0.1;
        
        if (this.timeRemaining <= 0) {
          this.timeRemaining = 0;
          this.handleTimeout();
        }
        
        this.updateTimerDisplay();
      }
    }, 100);
  }

  updateTimerDisplay() {
    const timeDisplay = document.getElementById('time-remaining');
    timeDisplay.textContent = Math.max(0, this.timeRemaining).toFixed(1);
    
    const timerBar = document.getElementById('timer-bar');
    const percentage = (this.timeRemaining / this.timePerQuestion) * 100;
    timerBar.style.width = `${Math.max(0, percentage)}%`;
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // ===== Answer Checking =====
  checkAnswer(selectedIndex) {
    this.stopTimer();
    
    // Calculate response time
    const responseTime = (Date.now() - this.questionStartTime) / 1000;
    this.responseTimes.push(responseTime);
    
    // Get selected answer value
    const answerBtns = document.querySelectorAll('.answer-btn');
    const selectedBtn = answerBtns[selectedIndex];
    const selectedValue = parseInt(selectedBtn.dataset.value);
    
    // Disable all buttons
    answerBtns.forEach(btn => btn.disabled = true);
    
    // Check if correct
    const isCorrect = selectedValue === this.currentQuestion.correctAnswer;
    
    if (isCorrect) {
      this.handleCorrectAnswer(selectedBtn, responseTime);
    } else {
      this.handleWrongAnswer(selectedBtn, answerBtns);
    }
    
    // Update stats
    this.questionsAnswered++;
    this.updateStatsDisplay();
    
    // Next question after delay
    setTimeout(() => {
      this.generateQuestion();
    }, 2000);
  }

  handleCorrectAnswer(btn, responseTime) {
    this.correctAnswers++;
    this.streak++;
    
    // Calculate score
    let points = 100;
    
    // Speed bonus (up to 50 points)
    const speedBonus = Math.floor((this.timePerQuestion - responseTime) / this.timePerQuestion * 50);
    points += Math.max(0, speedBonus);
    
    // Streak bonus
    if (this.streak >= 5) {
      points += 25;
    } else if (this.streak >= 3) {
      points += 10;
    }
    
    this.score += points;
    
    // Visual feedback
    btn.classList.add('correct');
    
    // Display feedback
    const feedback = document.getElementById('feedback-message');
    let message = `✅ 正確！+${points} 分`;
    if (this.streak >= 3) {
      message += ` 🔥 連擊 x${this.streak}`;
    }
    feedback.textContent = message;
    feedback.className = 'feedback-message correct show';
    
    // Play sound
    this.playSound(this.correctSound);
  }

  handleWrongAnswer(selectedBtn, allBtns) {
    this.wrongAnswers++;
    this.streak = 0;
    
    // Visual feedback
    selectedBtn.classList.add('wrong');
    
    // Show correct answer
    allBtns.forEach(btn => {
      if (parseInt(btn.dataset.value) === this.currentQuestion.correctAnswer) {
        btn.classList.add('correct');
      }
    });
    
    // Display feedback
    const feedback = document.getElementById('feedback-message');
    feedback.textContent = `❌ 錯誤！正確答案是 ${this.currentQuestion.correctAnswer}`;
    feedback.className = 'feedback-message wrong show';
    
    // Play sound
    this.playSound(this.wrongSound);
  }

  handleTimeout() {
    this.stopTimer();
    this.wrongAnswers++;
    this.streak = 0;
    
    // Show correct answer
    const answerBtns = document.querySelectorAll('.answer-btn');
    answerBtns.forEach(btn => {
      btn.disabled = true;
      if (parseInt(btn.dataset.value) === this.currentQuestion.correctAnswer) {
        btn.classList.add('correct');
      }
    });
    
    // Display feedback
    const feedback = document.getElementById('feedback-message');
    feedback.textContent = `⏰ 時間到！正確答案是 ${this.currentQuestion.correctAnswer}`;
    feedback.className = 'feedback-message wrong show';
    
    // Play sound
    this.playSound(this.wrongSound);
    
    // Update stats
    this.questionsAnswered++;
    this.responseTimes.push(this.timePerQuestion);
    this.updateStatsDisplay();
    
    // Next question after delay
    setTimeout(() => {
      this.generateQuestion();
    }, 2000);
  }

  // ===== Stats Display =====
  updateStatsDisplay() {
    // Score
    document.getElementById('score-display').textContent = this.score;
    
    // Question count
    document.getElementById('question-count-display').textContent = 
      `${this.questionsAnswered}/${this.totalQuestions}`;
    
    // Accuracy
    const accuracy = this.questionsAnswered > 0 
      ? ((this.correctAnswers / this.questionsAnswered) * 100).toFixed(0)
      : 100;
    document.getElementById('accuracy-display').textContent = `${accuracy}%`;
    
    // Average time
    const avgTime = this.responseTimes.length > 0
      ? (this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length).toFixed(1)
      : '0.0';
    document.getElementById('avg-time-display').textContent = `${avgTime}s`;
  }

  // ===== Game Control Functions =====
  togglePause() {
    this.isPaused = !this.isPaused;
    const pauseBtn = document.getElementById('pause-btn');
    
    if (this.isPaused) {
      pauseBtn.textContent = '繼續';
    } else {
      pauseBtn.textContent = '暫停';
    }
  }

  quitGame() {
    if (confirm('確定要結束遊戲嗎？')) {
      this.endGame();
    }
  }

  restartGame() {
    // Hide results, show settings
    document.getElementById('results-screen').style.display = 'none';
    document.getElementById('game-settings').style.display = 'block';
    document.getElementById('game-area').style.display = 'none';
    
    // Reset but keep settings
    this.isPlaying = false;
    this.stopTimer();
  }

  backToSettings() {
    document.getElementById('results-screen').style.display = 'none';
    document.getElementById('game-settings').style.display = 'block';
    document.getElementById('game-area').style.display = 'none';
  }

  // ===== End Game =====
  endGame() {
    this.isPlaying = false;
    this.stopTimer();
    
    // Hide game area, show results
    document.getElementById('game-area').style.display = 'none';
    document.getElementById('results-screen').style.display = 'block';
    
    // Calculate final stats
    const accuracy = ((this.correctAnswers / this.questionsAnswered) * 100).toFixed(1);
    const avgTime = (this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length).toFixed(2);
    const bestTime = Math.min(...this.responseTimes).toFixed(2);
    
    // Display results
    document.getElementById('final-score').textContent = this.score;
    document.getElementById('final-questions').textContent = this.questionsAnswered;
    document.getElementById('final-correct').textContent = this.correctAnswers;
    document.getElementById('final-accuracy').textContent = `${accuracy}%`;
    document.getElementById('final-avg-time').textContent = `${avgTime}s`;
    document.getElementById('final-best-time').textContent = `${bestTime}s`;
    
    // Performance analysis
    this.displayPerformanceAnalysis(parseFloat(accuracy), parseFloat(avgTime));
    
    // Play completion sound
    this.playSound(this.completeSound);
    
    // Congratulations message
    const congratsMsg = document.getElementById('congrats-message');
    if (accuracy >= 90) {
      congratsMsg.textContent = '🏆 太棒了！你是數學天才！';
    } else if (accuracy >= 75) {
      congratsMsg.textContent = '🎉 很好！繼續保持！';
    } else if (accuracy >= 60) {
      congratsMsg.textContent = '👍 不錯！還有進步空間！';
    } else {
      congratsMsg.textContent = '💪 繼續加油！多多練習！';
    }
  }

  displayPerformanceAnalysis(accuracy, avgTime) {
    const analysisDiv = document.getElementById('performance-analysis');
    
    let analysis = '<h3>📊 表現分析</h3>';
    
    // Accuracy analysis
    if (accuracy >= 90) {
      analysis += '<p>✨ <strong>準確率：</strong>優秀！你的正確率非常高。</p>';
    } else if (accuracy >= 75) {
      analysis += '<p>👍 <strong>準確率：</strong>良好！繼續保持這個水平。</p>';
    } else if (accuracy >= 60) {
      analysis += '<p>📈 <strong>準確率：</strong>中等，多加練習可以提高。</p>';
    } else {
      analysis += '<p>💡 <strong>準確率：</strong>建議從簡單難度開始，循序漸進。</p>';
    }
    
    // Speed analysis
    if (avgTime < 3) {
      analysis += '<p>⚡ <strong>反應速度：</strong>極快！你的計算速度令人驚嘆。</p>';
    } else if (avgTime < 5) {
      analysis += '<p>🚀 <strong>反應速度：</strong>很快！反應迅速。</p>';
    } else if (avgTime < 7) {
      analysis += '<p>⏱️ <strong>反應速度：</strong>中等，可以嘗試加快速度。</p>';
    } else {
      analysis += '<p>🐢 <strong>反應速度：</strong>別急，先求準確再求快。</p>';
    }
    
    // Score analysis
    if (this.score >= 2500) {
      analysis += '<p>🌟 <strong>分數：</strong>優秀！你獲得了高分！</p>';
    } else if (this.score >= 1500) {
      analysis += '<p>⭐ <strong>分數：</strong>不錯的成績！</p>';
    } else {
      analysis += '<p>💪 <strong>分數：</strong>繼續努力，你會越來越好！</p>';
    }
    
    // Recommendations
    analysis += '<p><strong>建議：</strong>';
    if (accuracy < 70) {
      analysis += '先降低難度，掌握基礎後再挑戰更高難度。';
    } else if (avgTime > 7) {
      analysis += '嘗試快速模式來提升反應速度。';
    } else {
      analysis += '可以嘗試更高難度或極限模式挑戰自己！';
    }
    analysis += '</p>';
    
    analysisDiv.innerHTML = analysis;
  }

  // ===== Utility Functions =====
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  playSound(audioElement) {
    if (audioElement) {
      audioElement.currentTime = 0;
      audioElement.play().catch(e => console.log('Audio play failed:', e));
    }
  }
}

// ===== Initialize Game on Page Load =====
document.addEventListener('DOMContentLoaded', () => {
  const game = new MathRushGame();
  console.log('Math Rush Challenge initialized!');
});
