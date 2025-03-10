import React, { useState, useEffect } from 'react';
import { Send, Sparkles, RefreshCw, Heart, History, Globe2, Sun, Moon, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Greeting = {
  message: string;
  encouragement: string;
  timestamp: string;
  timeGreeting: string;
  greetingCount: number;
};

type GreetingHistory = {
  timestamp: string;
  language: string;
  encouragement: string;
};

function App() {
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState<Greeting | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<GreetingHistory[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' }
  ];

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark' : '';
  }, [theme]);

  const fetchGreeting = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3000/api/greet?name=${encodeURIComponent(name)}&language=${language}`);
      if (!response.ok) throw new Error('Server error');
      
      const data = await response.json();
      setGreeting(data);
      await fetchHistory();
    } catch (err) {
      setError('Connection error. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/history/${encodeURIComponent(name)}`);
      const data = await response.json();
      setHistory(data.history);
    } catch (err) {
      console.error('Failed to fetch history');
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white'
        : 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500'
    } flex items-center justify-center p-4`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${
          theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'
        } backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-md w-full`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Sparkles className={`${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'} w-8 h-8 mr-2`} />
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Greeting App
            </h1>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200/20"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            } mb-1`}>
              Your Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-300'
                } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none`}
                placeholder="Enter your name"
                onKeyPress={(e) => e.key === 'Enter' && fetchGreeting()}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            } mb-1`}>
              Language
            </label>
            <div className="flex gap-2 flex-wrap">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    language === lang.code
                      ? 'bg-purple-500 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-200 text-gray-700'
                  } transition-colors`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchGreeting}
              disabled={isLoading}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Get Greeting</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              } transition-colors`}
            >
              <History className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mt-2"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence>
            {greeting && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 space-y-4"
              >
                <div className={`${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'
                } p-4 rounded-lg`}>
                  <p className="text-lg mb-2">{greeting.timeGreeting}!</p>
                  <p className={`${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  } text-lg`}>{greeting.message}</p>
                </div>
                
                <div className={`${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-pink-50'
                } p-4 rounded-lg flex items-start space-x-2`}>
                  <Heart className="w-5 h-5 text-pink-500 flex-shrink-0 mt-1" />
                  <p className={
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }>{greeting.encouragement}</p>
                </div>
                
                <div className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                } text-right`}>
                  Visit #{greeting.greetingCount} • {new Date(greeting.timestamp).toLocaleString()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showHistory && history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <h2 className={`text-lg font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  Greeting History
                </h2>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className={`${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      } p-2 rounded-lg text-sm`}
                    >
                      <div className="flex items-center gap-2">
                        <Globe2 className="w-4 h-4" />
                        <span className="uppercase">{item.language}</span>
                      </div>
                      <p className={`${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      } mt-1`}>
                        {item.encouragement}
                      </p>
                      <p className={`${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      } text-xs mt-1`}>
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default App;