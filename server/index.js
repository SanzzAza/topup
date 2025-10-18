const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  }
});

// In-memory storage for demo purposes (use database in production)
const generations = new Map();

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sora 2 API is running' });
});

// Generate video endpoint
app.post('/api/generate-video', upload.single('image'), async (req, res) => {
  try {
    const { prompt, duration = 5, aspectRatio = '16:9', style = 'cinematic' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const generationId = uuidv4();
    
    // Store generation request
    generations.set(generationId, {
      id: generationId,
      prompt,
      duration: parseInt(duration),
      aspectRatio,
      style,
      status: 'processing',
      createdAt: new Date(),
      progress: 0
    });

    // Simulate video generation process
    simulateVideoGeneration(generationId);

    res.json({
      generationId,
      status: 'processing',
      message: 'Video generation started',
      estimatedTime: duration * 2 // Estimate 2 seconds per video second
    });

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: 'Failed to start video generation' });
  }
});

// Get generation status
app.get('/api/generation/:id', (req, res) => {
  const { id } = req.params;
  const generation = generations.get(id);
  
  if (!generation) {
    return res.status(404).json({ error: 'Generation not found' });
  }
  
  res.json(generation);
});

// Get all generations
app.get('/api/generations', (req, res) => {
  const allGenerations = Array.from(generations.values())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json(allGenerations);
});

// Delete generation
app.delete('/api/generation/:id', (req, res) => {
  const { id } = req.params;
  
  if (generations.has(id)) {
    generations.delete(id);
    res.json({ message: 'Generation deleted successfully' });
  } else {
    res.status(404).json({ error: 'Generation not found' });
  }
});

// Simulate video generation process
function simulateVideoGeneration(generationId) {
  const generation = generations.get(generationId);
  if (!generation) return;

  let progress = 0;
  const duration = generation.duration * 1000; // Convert to milliseconds
  const updateInterval = duration / 20; // Update progress 20 times

  const progressInterval = setInterval(() => {
    progress += 5;
    generation.progress = Math.min(progress, 100);
    
    if (progress >= 100) {
      clearInterval(progressInterval);
      generation.status = 'completed';
      generation.videoUrl = `https://example.com/videos/${generationId}.mp4`; // Mock URL
      generation.thumbnailUrl = `https://example.com/thumbnails/${generationId}.jpg`; // Mock URL
      generation.completedAt = new Date();
    }
    
    generations.set(generationId, generation);
  }, updateInterval);
}

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Sora 2 API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});