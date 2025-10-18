import React from 'react';
import { motion } from 'framer-motion';
import { Video, Sparkles } from 'lucide-react';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center z-50">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Logo Animation */}
        <motion.div
          className="flex items-center justify-center mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative">
            <motion.div 
              className="w-20 h-20 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl flex items-center justify-center"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Video className="w-10 h-10 text-white" />
            </motion.div>
            <motion.div 
              className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, -360]
              }}
              transition={{ 
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 3, repeat: Infinity, ease: "linear" }
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl font-bold gradient-text mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Sora 2
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          AI Video Generation Platform
        </motion.p>

        {/* Loading Animation */}
        <motion.div
          className="loading-dots mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </motion.div>

        {/* Loading Text */}
        <motion.p
          className="text-gray-400 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          Initializing AI models...
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingOverlay;