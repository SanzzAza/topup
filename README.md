# Sora 2 - AI Video Generation Website

A beautiful, modern web application for AI-powered video generation. Transform your text descriptions into stunning videos with advanced AI technology.

![Sora 2](https://img.shields.io/badge/Sora-2.0-blue) ![Python](https://img.shields.io/badge/Python-3.8+-green) ![Flask](https://img.shields.io/badge/Flask-3.0-red)

## ✨ Features

- 🎬 **AI Video Generation** - Transform text prompts into high-quality videos
- ⚡ **Lightning Fast** - Generate videos in seconds with optimized processing
- 🎨 **Multiple Styles** - Choose from realistic, cinematic, anime, and abstract styles
- 🔧 **Full Control** - Customize duration, quality, frame rate, and more
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🌌 **Animated Background** - Stunning starfield animation
- 🖼️ **Video Gallery** - Browse and manage your generated videos
- 💳 **Credit System** - Track your usage with a built-in credit system

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Clone or download this repository**

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   
   Option A - Using the quick start script (recommended):
   ```bash
   ./start.sh
   ```
   
   Option B - Using Python directly:
   ```bash
   python3 app.py
   ```

4. **Open your browser**
   Navigate to: `http://localhost:5000`

## 🎯 Usage

1. **Enter a Prompt**: Describe the video you want to generate in the text area
2. **Customize Settings**: Choose duration, quality, style, and frame rate
3. **Generate**: Click "Generate Video" and watch the AI create your video
4. **Download or Share**: Save your video or share it with others

### Example Prompts

- "A serene beach at sunset with waves gently crashing, birds flying overhead, cinematic lighting, 4K quality"
- "Time-lapse of a flower blooming in spring, macro photography, vibrant colors"
- "Astronaut floating in space with Earth in background, realistic, dramatic lighting"
- "Abstract visualization of music, particles dancing to rhythm, neon colors"

## 🏗️ Project Structure

```
sora-2/
├── index.html          # Main HTML page
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── app.py             # Flask backend server
├── requirements.txt   # Python dependencies
└── README.md          # This file
```

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Structure and semantics
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Interactive functionality
- **Google Fonts (Inter)** - Beautiful typography

### Backend
- **Python 3.8+** - Server-side language
- **Flask** - Web framework
- **Flask-CORS** - Cross-Origin Resource Sharing

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --primary-light: #818cf8;
    --secondary: #8b5cf6;
    /* ... more colors */
}
```

### Adding New Video Styles

1. Add the style option in `index.html`:
```html
<option value="your-style">Your Style</option>
```

2. Update the generation logic in `script.js` to handle the new style

### Integrating Real AI Video Generation

To integrate with actual AI video generation APIs:

1. **Choose a provider**: Stability AI, Runway ML, or custom models
2. **Get API credentials**: Sign up and obtain API keys
3. **Update `app.py`**: Replace the sample video URLs with actual API calls
4. **Handle authentication**: Securely store and use API keys

Example integration with a hypothetical API:

```python
import requests

@app.route('/api/generate', methods=['POST'])
def generate_video():
    data = request.json
    
    # Call actual video generation API
    response = requests.post(
        'https://api.video-ai.com/generate',
        headers={'Authorization': f'Bearer {API_KEY}'},
        json={
            'prompt': data.get('prompt'),
            'settings': data.get('settings')
        }
    )
    
    video_url = response.json()['video_url']
    return jsonify({'success': True, 'video': {'url': video_url}})
```

## 🔒 Security Notes

For production deployment:

1. **Add authentication** - Implement user login and API key management
2. **Rate limiting** - Prevent abuse with rate limits
3. **Input validation** - Sanitize and validate all user inputs
4. **HTTPS** - Use SSL/TLS certificates
5. **Environment variables** - Store sensitive data in environment variables
6. **Database** - Use a proper database for user data and video metadata

## 📝 API Documentation

### Generate Video
```http
POST /api/generate
Content-Type: application/json

{
  "prompt": "Your video description",
  "settings": {
    "duration": "5",
    "quality": "1080p",
    "style": "realistic",
    "fps": "30"
  }
}
```

### Get Videos
```http
GET /api/videos
```

### Get Specific Video
```http
GET /api/video/{video_id}
```

### Health Check
```http
GET /api/health
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🌟 Acknowledgments

- Inspired by OpenAI's Sora video generation model
- Sample videos from Google's test video repository
- Icons and animations created with CSS and SVG

## 📞 Support

For issues, questions, or suggestions, please open an issue on the repository.

---

**Made with ❤️ for the AI community**
