import React from 'react';
import { motion } from 'framer-motion';
import { Video, Sparkles, Gallery } from 'lucide-react';

const Header = ({ currentView, setCurrentView }) => {
  return (
    <header className="relative z-20 border-b border-white/10 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Sora 2</h1>
              <p className="text-xs text-gray-400">AI Video Generation</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.nav 
            className="flex items-center space-x-1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              onClick={() => setCurrentView('generator')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                currentView === 'generator'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Generate</span>
            </button>
            <button
              onClick={() => setCurrentView('gallery')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                currentView === 'gallery'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Gallery className="w-4 h-4" />
              <span>Gallery</span>
            </button>
          </motion.nav>
        </div>
      </div>
    </header>
  );
};

export default Header;