import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Dice6, Menu, Sun, Moon, Monitor, Contrast, Palette, Eye, EyeOff } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system' | 'low-contrast' | 'high-contrast';

function App() {
  const [number, setNumber] = useState<number>(Math.floor(Math.random() * 100));
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [showGauge, setShowGauge] = useState<boolean>(true);
  const [theme, setTheme] = useState<Theme>('system');
  const [showMenu, setShowMenu] = useState<boolean>(false);

  // Generate new random number
  const generateNumber = useCallback(() => {
    setNumber(Math.floor(Math.random() * 100));
  }, []);

  // Handle interval for auto-refresh
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(generateNumber, 1000);
    return () => clearInterval(interval);
  }, [isRunning, generateNumber]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.className = ''; // Reset classes
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = document.documentElement;
      root.className = '';
      root.classList.add(mediaQuery.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu && !(event.target as Element).closest('.menu-container')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // Get color for the number based on range
  const getNumberColor = (num: number): string => {
    if (num < 25) return 'text-green-500';
    if (num < 50) return 'text-blue-500';
    if (num < 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Get gauge color based on range
  const getGaugeColor = (num: number): string => {
    if (num < 25) return 'bg-gradient-to-r from-green-400 to-green-600';
    if (num < 50) return 'bg-gradient-to-r from-blue-400 to-blue-600';
    if (num < 75) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    return 'bg-gradient-to-r from-red-400 to-red-600';
  };

  const themes = [
    { key: 'light' as Theme, label: 'Light', icon: Sun },
    { key: 'dark' as Theme, label: 'Dark', icon: Moon },
    { key: 'system' as Theme, label: 'System', icon: Monitor },
    { key: 'low-contrast' as Theme, label: 'Low Contrast', icon: Contrast },
    { key: 'high-contrast' as Theme, label: 'High Contrast', icon: Palette },
  ];

  return (
    <div className="min-h-screen transition-all duration-300 bg-gradient-to-br from-theme-bg-primary to-theme-bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-theme-surface backdrop-blur-sm border border-theme-border rounded-2xl shadow-xl p-8 transition-all duration-300">
          {/* Number Display */}
          <div className="text-center mb-8">
            <div className={`text-6xl font-bold transition-all duration-500 ${getNumberColor(number)}`}>
              {number.toString().padStart(2, '0')}
            </div>
          </div>

          {/* Visual Gauge */}
          {showGauge && (
            <div className="mb-8 transition-all duration-300">
              <div className="relative h-3 bg-theme-gauge-bg rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ease-out ${getGaugeColor(number)}`}
                  style={{ width: `${number}%` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
              </div>
              <div className="text-center text-xs text-theme-text-secondary mt-1">
                {number}%
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 relative">
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center justify-center w-12 h-12 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              aria-label={isRunning ? 'Pause' : 'Play'}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
            </button>

            {/* Generate Button */}
            <button
              onClick={generateNumber}
              className="flex items-center justify-center w-12 h-12 bg-theme-surface-secondary hover:bg-theme-surface-hover text-theme-text-primary rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 border border-theme-border"
              aria-label="Generate new number"
            >
              <Dice6 size={20} />
            </button>

            {/* Menu Button */}
            <div className="menu-container relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center justify-center w-12 h-12 bg-theme-surface-secondary hover:bg-theme-surface-hover text-theme-text-primary rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 border border-theme-border"
                aria-label="Menu"
              >
                <Menu size={20} />
              </button>

              {/* Menu Dropdown */}
              {showMenu && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-theme-surface border border-theme-border rounded-xl shadow-xl overflow-hidden transition-all duration-200">
                  {/* Show/Hide Gauge Option */}
                  <button
                    onClick={() => {
                      setShowGauge(!showGauge);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:bg-theme-surface-hover text-theme-text-primary"
                  >
                    {showGauge ? <EyeOff size={18} /> : <Eye size={18} />}
                    <span className="text-sm font-medium">
                      {showGauge ? 'Hide Progress' : 'Show Progress'}
                    </span>
                  </button>

                  {/* Divider */}
                  <div className="border-t border-theme-border" />

                  {/* Theme Options */}
                  {themes.map((themeOption) => (
                    <button
                      key={themeOption.key}
                      onClick={() => {
                        setTheme(themeOption.key);
                        setShowMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:bg-theme-surface-hover ${
                        theme === themeOption.key ? 'bg-theme-accent text-white' : 'text-theme-text-primary'
                      }`}
                    >
                      <themeOption.icon size={18} />
                      <span className="text-sm font-medium">{themeOption.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;