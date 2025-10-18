import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  Upload, 
  Wand2, 
  Clock, 
  Monitor, 
  Palette,
  Sparkles,
  Play,
  Download,
  Trash2
} from 'lucide-react';
import { useVideo } from '../context/VideoContext';

const VideoGenerator = () => {
  const { generateVideo, isGenerating, currentGeneration, videos } = useVideo();
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(5);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [style, setStyle] = useState('cinematic');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    try {
      await generateVideo(prompt, {
        duration,
        aspectRatio,
        style,
        image
      });
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  const currentVideo = currentGeneration ? videos.find(v => v.id === currentGeneration) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generator Panel */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Section */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
              Create Amazing Videos
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Transform your ideas into stunning videos with AI-powered generation
            </p>
          </div>

          {/* Prompt Input */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Wand2 className="inline w-4 h-4 mr-2" />
              Describe your video
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A majestic eagle soaring through mountain peaks at sunset, cinematic slow motion..."
              className="input-field w-full h-32 resize-none"
              disabled={isGenerating}
            />
          </div>

          {/* Image Upload */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Upload className="inline w-4 h-4 mr-2" />
              Reference Image (Optional)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 hover:border-primary-500 hover:bg-primary-500/5 ${
                imagePreview ? 'border-primary-500 bg-primary-500/10' : ''
              }`}
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-32 mx-auto rounded-lg"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-400">Click to upload an image</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Duration */}
            <div className="card">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                <Clock className="inline w-4 h-4 mr-2" />
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="input-field w-full"
                disabled={isGenerating}
              >
                <option value={3}>3 seconds</option>
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
                <option value={15}>15 seconds</option>
              </select>
            </div>

            {/* Aspect Ratio */}
            <div className="card">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                <Monitor className="inline w-4 h-4 mr-2" />
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="input-field w-full"
                disabled={isGenerating}
              >
                <option value="16:9">16:9 (Landscape)</option>
                <option value="9:16">9:16 (Portrait)</option>
                <option value="1:1">1:1 (Square)</option>
              </select>
            </div>

            {/* Style */}
            <div className="card">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                <Palette className="inline w-4 h-4 mr-2" />
                Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="input-field w-full"
                disabled={isGenerating}
              >
                <option value="cinematic">Cinematic</option>
                <option value="realistic">Realistic</option>
                <option value="artistic">Artistic</option>
                <option value="animated">Animated</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
              !prompt.trim() || isGenerating
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'button-primary'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating Video...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Video</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Preview Panel */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {currentVideo ? (
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Video className="w-5 h-5 mr-2" />
                Current Generation
              </h3>
              
              <div className="space-y-4">
                {/* Progress */}
                {currentVideo.status === 'processing' && (
                  <div>
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{currentVideo.progress}%</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${currentVideo.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Video Info */}
                <div className="bg-dark-800/50 rounded-xl p-4">
                  <p className="text-sm text-gray-300 mb-2">
                    <strong>Prompt:</strong> {currentVideo.prompt}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-primary-600/20 text-primary-300 px-2 py-1 rounded">
                      {currentVideo.duration}s
                    </span>
                    <span className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded">
                      {currentVideo.aspectRatio}
                    </span>
                    <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded">
                      {currentVideo.style}
                    </span>
                  </div>
                </div>

                {/* Video Preview */}
                {currentVideo.status === 'completed' && currentVideo.videoUrl && (
                  <div className="space-y-3">
                    <div className="bg-dark-800 rounded-xl p-4 text-center">
                      <div className="w-full h-48 bg-gradient-to-br from-primary-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                        <div className="text-center">
                          <Play className="w-12 h-12 mx-auto mb-2 text-primary-400" />
                          <p className="text-gray-300">Video Ready!</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 button-primary flex items-center justify-center space-x-2">
                        <Play className="w-4 h-4" />
                        <span>Play</span>
                      </button>
                      <button className="flex-1 button-secondary flex items-center justify-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card text-center">
              <div className="py-12">
                <Video className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No Active Generation
                </h3>
                <p className="text-gray-500">
                  Enter a prompt and click generate to create your video
                </p>
              </div>
            </div>
          )}

          {/* Recent Videos */}
          {videos.length > 0 && (
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Videos
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {videos.slice(0, 3).map((video) => (
                  <div
                    key={video.id}
                    className="bg-dark-800/50 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300 truncate">
                        {video.prompt}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-3">
                      {video.status === 'completed' && (
                        <>
                          <button className="p-1 text-primary-400 hover:text-primary-300 transition-colors">
                            <Play className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="p-1 text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VideoGenerator;