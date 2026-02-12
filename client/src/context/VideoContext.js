import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const VideoContext = createContext();

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGeneration, setCurrentGeneration] = useState(null);

  const generateVideo = useCallback(async (prompt, options = {}) => {
    try {
      setIsGenerating(true);
      
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('duration', options.duration || 5);
      formData.append('aspectRatio', options.aspectRatio || '16:9');
      formData.append('style', options.style || 'cinematic');
      
      if (options.image) {
        formData.append('image', options.image);
      }

      const response = await axios.post('/api/generate-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { generationId } = response.data;
      setCurrentGeneration(generationId);
      
      // Poll for status updates
      pollGenerationStatus(generationId);
      
      return generationId;
    } catch (error) {
      console.error('Error generating video:', error);
      setIsGenerating(false);
      throw error;
    }
  }, []);

  const pollGenerationStatus = useCallback(async (generationId) => {
    try {
      const response = await axios.get(`/api/generation/${generationId}`);
      const generation = response.data;
      
      // Update videos list
      setVideos(prev => {
        const existingIndex = prev.findIndex(v => v.id === generationId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = generation;
          return updated;
        } else {
          return [generation, ...prev];
        }
      });

      if (generation.status === 'processing') {
        // Continue polling
        setTimeout(() => pollGenerationStatus(generationId), 2000);
      } else {
        setIsGenerating(false);
        setCurrentGeneration(null);
      }
    } catch (error) {
      console.error('Error polling generation status:', error);
      setIsGenerating(false);
      setCurrentGeneration(null);
    }
  }, []);

  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get('/api/generations');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  }, []);

  const deleteVideo = useCallback(async (videoId) => {
    try {
      await axios.delete(`/api/generation/${videoId}`);
      setVideos(prev => prev.filter(v => v.id !== videoId));
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }, []);

  const value = {
    videos,
    isGenerating,
    currentGeneration,
    generateVideo,
    fetchVideos,
    deleteVideo,
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};