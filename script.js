// DOM Elements
const promptInput = document.getElementById('prompt');
const charCount = document.getElementById('charCount');
const generateBtn = document.getElementById('generateBtn');
const progressContainer = document.getElementById('progressContainer');
const progressText = document.getElementById('progressText');
const progressPercent = document.getElementById('progressPercent');
const progressFill = document.getElementById('progressFill');
const videoResult = document.getElementById('videoResult');
const generatedVideo = document.getElementById('generatedVideo');
const newVideoBtn = document.getElementById('newVideoBtn');
const galleryGrid = document.getElementById('galleryGrid');
const creditsDisplay = document.getElementById('credits');

// State
let credits = 10;
const generatedVideos = [];

// Character count
promptInput.addEventListener('input', () => {
    const count = promptInput.value.length;
    charCount.textContent = count;
    
    if (count > 500) {
        charCount.style.color = 'var(--error)';
    } else {
        charCount.style.color = 'var(--text-secondary)';
    }
});

// Generate video
generateBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        alert('Please enter a description for your video');
        return;
    }
    
    if (credits <= 0) {
        alert('You have no credits remaining. Please purchase more credits to continue.');
        return;
    }
    
    if (prompt.length > 500) {
        alert('Prompt is too long. Please keep it under 500 characters.');
        return;
    }
    
    // Get settings
    const duration = document.getElementById('duration').value;
    const quality = document.getElementById('quality').value;
    const style = document.getElementById('style').value;
    const fps = document.getElementById('fps').value;
    
    // Start generation
    startGeneration(prompt, { duration, quality, style, fps });
});

async function startGeneration(prompt, settings) {
    // Disable button
    generateBtn.disabled = true;
    
    // Hide previous result
    videoResult.style.display = 'none';
    
    // Show progress
    progressContainer.style.display = 'block';
    
    // Simulate generation process
    const stages = [
        { text: 'Initializing AI model...', duration: 500 },
        { text: 'Analyzing your prompt...', duration: 800 },
        { text: 'Generating scene composition...', duration: 1200 },
        { text: 'Rendering frames...', duration: 2000 },
        { text: 'Applying style effects...', duration: 1500 },
        { text: 'Optimizing video quality...', duration: 1000 },
        { text: 'Finalizing video...', duration: 800 }
    ];
    
    let totalProgress = 0;
    const totalDuration = stages.reduce((sum, stage) => sum + stage.duration, 0);
    
    for (const stage of stages) {
        progressText.textContent = stage.text;
        
        const stageProgress = (stage.duration / totalDuration) * 100;
        await animateProgress(totalProgress, totalProgress + stageProgress, stage.duration);
        totalProgress += stageProgress;
    }
    
    // Complete generation
    completeGeneration(prompt, settings);
}

function animateProgress(start, end, duration) {
    return new Promise(resolve => {
        const startTime = Date.now();
        const diff = end - start;
        
        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = start + (diff * progress);
            
            progressFill.style.width = `${current}%`;
            progressPercent.textContent = `${Math.round(current)}%`;
            
            if (progress < 1) {
                requestAnimationFrame(updateProgress);
            } else {
                resolve();
            }
        };
        
        updateProgress();
    });
}

function completeGeneration(prompt, settings) {
    // Deduct credit
    credits--;
    creditsDisplay.textContent = `${credits} credits`;
    
    // Hide progress
    progressContainer.style.display = 'none';
    
    // Create video placeholder (using Big Buck Bunny sample video)
    const videoUrl = createSampleVideo(prompt, settings);
    generatedVideo.src = videoUrl;
    
    // Show result
    videoResult.style.display = 'block';
    videoResult.classList.add('fade-in');
    
    // Add to gallery
    addToGallery(prompt, videoUrl, settings);
    
    // Re-enable button
    generateBtn.disabled = false;
    
    // Scroll to video
    videoResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function createSampleVideo(prompt, settings) {
    // In a real application, this would call an API to generate the video
    // For demo purposes, we'll use a placeholder video service
    // Using Big Buck Bunny (free sample video) or a sample video URL
    
    // You can replace this with actual video generation API call
    const sampleVideos = [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
    ];
    
    // Return a random sample video
    return sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
}

function addToGallery(prompt, videoUrl, settings) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item fade-in';
    
    const video = document.createElement('video');
    video.src = videoUrl;
    video.muted = true;
    video.loop = true;
    
    const info = document.createElement('div');
    info.className = 'gallery-item-info';
    
    const promptText = document.createElement('p');
    promptText.className = 'gallery-item-prompt';
    promptText.textContent = prompt;
    
    const meta = document.createElement('div');
    meta.className = 'gallery-item-meta';
    meta.innerHTML = `
        <span>${settings.quality} • ${settings.duration}s</span>
        <span>${settings.style}</span>
    `;
    
    info.appendChild(promptText);
    info.appendChild(meta);
    
    galleryItem.appendChild(video);
    galleryItem.appendChild(info);
    
    // Add hover effect to play video
    galleryItem.addEventListener('mouseenter', () => {
        video.play();
    });
    
    galleryItem.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
    });
    
    // Click to view full
    galleryItem.addEventListener('click', () => {
        generatedVideo.src = videoUrl;
        videoResult.style.display = 'block';
        videoResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    
    // Add to beginning of gallery
    galleryGrid.insertBefore(galleryItem, galleryGrid.firstChild);
    
    // Keep only last 12 items
    while (galleryGrid.children.length > 12) {
        galleryGrid.removeChild(galleryGrid.lastChild);
    }
    
    generatedVideos.unshift({ prompt, videoUrl, settings });
}

// New video button
newVideoBtn.addEventListener('click', () => {
    videoResult.style.display = 'none';
    promptInput.value = '';
    charCount.textContent = '0';
    promptInput.focus();
    
    // Scroll to prompt input
    promptInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Download button
document.querySelector('.download-btn').addEventListener('click', () => {
    const videoSrc = generatedVideo.src;
    if (videoSrc) {
        const a = document.createElement('a');
        a.href = videoSrc;
        a.download = 'sora2-generated-video.mp4';
        a.click();
    }
});

// Share button
document.querySelector('.share-btn').addEventListener('click', async () => {
    const videoSrc = generatedVideo.src;
    if (videoSrc) {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check out my Sora 2 generated video!',
                    text: 'I created this amazing video with Sora 2 AI',
                    url: videoSrc
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(videoSrc);
            alert('Video link copied to clipboard!');
        }
    }
});

// Initialize with sample gallery items
function initializeGallery() {
    const samplePrompts = [
        {
            prompt: 'A futuristic city at night with flying cars and neon lights, cyberpunk style',
            settings: { duration: '5', quality: '1080p', style: 'cinematic', fps: '30' }
        },
        {
            prompt: 'A serene mountain landscape at sunrise with mist rolling through valleys',
            settings: { duration: '10', quality: '4k', style: 'realistic', fps: '60' }
        },
        {
            prompt: 'An underwater scene with colorful coral reefs and tropical fish swimming',
            settings: { duration: '5', quality: '1080p', style: 'realistic', fps: '30' }
        },
        {
            prompt: 'Abstract geometric shapes morphing and flowing in vibrant colors',
            settings: { duration: '3', quality: '720p', style: 'abstract', fps: '30' }
        },
        {
            prompt: 'A cozy coffee shop on a rainy day, anime style with warm lighting',
            settings: { duration: '5', quality: '1080p', style: 'anime', fps: '24' }
        },
        {
            prompt: 'Space exploration scene with a rocket launching into the stars',
            settings: { duration: '10', quality: '4k', style: 'cinematic', fps: '60' }
        }
    ];
    
    samplePrompts.forEach(sample => {
        const videoUrl = createSampleVideo(sample.prompt, sample.settings);
        addToGallery(sample.prompt, videoUrl, sample.settings);
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeGallery();
    
    // Add entrance animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('.feature-card, .gallery-item').forEach(el => {
        observer.observe(el);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to generate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (promptInput.value.trim() && !generateBtn.disabled) {
            generateBtn.click();
        }
    }
});

// Add prompt suggestions
const promptSuggestions = [
    'A serene beach at sunset with waves gently crashing, birds flying overhead, cinematic lighting, 4K quality',
    'Time-lapse of a flower blooming in spring, macro photography, vibrant colors',
    'Abstract visualization of music, particles dancing to rhythm, neon colors',
    'Astronaut floating in space with Earth in background, realistic, dramatic lighting',
    'Cozy cabin in snowy mountains, smoke from chimney, winter wonderland, warm atmosphere',
    'Underwater scene with bioluminescent creatures, deep ocean, mystical lighting',
    'City street in heavy rain at night, reflections on wet pavement, cinematic mood',
    'Northern lights dancing over snow-covered landscape, night time, magical atmosphere'
];

// Add suggestion on empty prompt focus
promptInput.addEventListener('focus', () => {
    if (!promptInput.value.trim()) {
        const randomSuggestion = promptSuggestions[Math.floor(Math.random() * promptSuggestions.length)];
        promptInput.placeholder = randomSuggestion;
    }
});

promptInput.addEventListener('blur', () => {
    if (!promptInput.value.trim()) {
        promptInput.placeholder = 'E.g., A serene beach at sunset with waves gently crashing, birds flying overhead, cinematic lighting, 4K quality...';
    }
});
