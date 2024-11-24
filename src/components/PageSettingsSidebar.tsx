import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function PageSettingsSidebar() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="settings-sidebar">
      <h2>Page Settings</h2>
      <nav>
        <div className="sidebar-nav">
          <button 
            className="theme-toggle-button" 
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            <span className="icon">
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </span>
            <span className="label">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
} 