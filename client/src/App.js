import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import VideoGenerator from './components/VideoGenerator';
import VideoGallery from './components/VideoGallery';
import LoadingOverlay from './components/LoadingOverlay';
import { VideoProvider } from './context/VideoContext';

function App() {
  const [currentView, setCurrentView] = useState('generator');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <VideoProvider>
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        </div>

        <Header currentView={currentView} setCurrentView={setCurrentView} />
        
        <main className="relative z-10">
          <AnimatePresence mode="wait">
            {currentView === 'generator' && (
              <motion.div
                key="generator"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <VideoGenerator />
              </motion.div>
            )}
            {currentView === 'gallery' && (
              <motion.div
                key="gallery"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <VideoGallery />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </VideoProvider>
  );
}

export default App;