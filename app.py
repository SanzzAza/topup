from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import time
import json
from datetime import datetime

app = Flask(__name__, static_folder='.')
CORS(app)

# Store generated videos metadata
generated_videos = []

@app.route('/')
def index():
    """Serve the main HTML page"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files"""
    return send_from_directory('.', path)

@app.route('/api/generate', methods=['POST'])
def generate_video():
    """
    API endpoint to generate video
    In a real application, this would integrate with actual video generation AI models
    """
    try:
        data = request.json
        prompt = data.get('prompt', '')
        settings = data.get('settings', {})
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        # Validate prompt length
        if len(prompt) > 500:
            return jsonify({'error': 'Prompt is too long (max 500 characters)'}), 400
        
        # Simulate video generation process
        # In production, this would call actual AI video generation API
        # Examples: Stability AI, Runway ML, or custom models
        
        video_id = f"video_{int(time.time() * 1000)}"
        
        # Sample video URLs for demo purposes
        sample_videos = [
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
        ]
        
        video_metadata = {
            'id': video_id,
            'prompt': prompt,
            'settings': settings,
            'url': sample_videos[len(generated_videos) % len(sample_videos)],
            'created_at': datetime.now().isoformat(),
            'status': 'completed'
        }
        
        generated_videos.append(video_metadata)
        
        return jsonify({
            'success': True,
            'video': video_metadata
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/videos', methods=['GET'])
def get_videos():
    """Get list of generated videos"""
    return jsonify({
        'success': True,
        'videos': generated_videos[-20:]  # Return last 20 videos
    })

@app.route('/api/video/<video_id>', methods=['GET'])
def get_video(video_id):
    """Get specific video details"""
    video = next((v for v in generated_videos if v['id'] == video_id), None)
    
    if not video:
        return jsonify({'error': 'Video not found'}), 404
    
    return jsonify({
        'success': True,
        'video': video
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Sora 2 Video Generation API',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'True').lower() == 'true'
    
    print(f"""
    ╔══════════════════════════════════════╗
    ║   Sora 2 - AI Video Generation      ║
    ╚══════════════════════════════════════╝
    
    🚀 Server starting...
    📍 URL: http://localhost:{port}
    🔧 Debug mode: {debug}
    
    Press CTRL+C to stop the server
    """)
    
    app.run(host='0.0.0.0', port=port, debug=debug)
