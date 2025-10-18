import React from 'react';
import { motion } from 'framer-motion';
import { FaGamepad, FaBook, FaInfoCircle } from 'react-icons/fa';
import './Navigation.css';

const Navigation = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'game', label: '遊戲', icon: <FaGamepad /> },
    { id: 'instructions', label: '遊戲說明', icon: <FaBook /> },
    { id: 'about', label: '關於我們', icon: <FaInfoCircle /> }
  ];

  return (
    <motion.nav 
      className="main-nav"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="nav-container">
        <motion.div 
          className="nav-brand"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🧮 數學反應挑戰
        </motion.div>
        <div className="nav-links">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
