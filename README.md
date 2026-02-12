# Sora 2 - AI Video Generation Website

A modern, beautiful web application for AI-powered video generation using the Sora 2 model. Built with React, Node.js, and Tailwind CSS.

![Sora 2 Demo](https://via.placeholder.com/800x400/0ea5e9/ffffff?text=Sora+2+AI+Video+Generation)

## ✨ Features

- **AI Video Generation**: Create stunning videos from text prompts
- **Image-to-Video**: Upload reference images to guide video generation
- **Customizable Settings**: Control duration, aspect ratio, and style
- **Real-time Progress**: Live updates during video generation
- **Video Gallery**: Manage and organize your generated videos
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Dark Theme**: Elegant dark mode interface
- **Mobile Friendly**: Fully responsive across all devices

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sora-2-video-generator
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Set up environment variables**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
SORA_API_ENDPOINT=https://api.openai.com/v1/video/generations
MAX_FILE_SIZE=50MB
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### API Integration

This project includes a mock API for demonstration. To integrate with the actual Sora 2 API:

1. Update the `OPENAI_API_KEY` in your `.env` file
2. Modify the video generation logic in `server/index.js`
3. Replace the mock video URLs with actual API responses

## 🎨 UI Components

### Video Generator
- **Prompt Input**: Rich text area for video descriptions
- **Image Upload**: Drag-and-drop image upload with preview
- **Settings Panel**: Duration, aspect ratio, and style controls
- **Real-time Preview**: Live generation progress and video preview

### Video Gallery
- **Grid/List Views**: Toggle between different viewing modes
- **Search & Filter**: Find videos by prompt or status
- **Sorting Options**: Sort by date, duration, or other criteria
- **Batch Operations**: Select and manage multiple videos

## 🎯 Usage

### Generating Videos

1. **Enter a Prompt**: Describe your desired video in detail
2. **Upload Reference Image** (Optional): Provide a reference image
3. **Configure Settings**: Set duration, aspect ratio, and style
4. **Generate**: Click the generate button and watch the progress
5. **Preview & Download**: View your completed video and download

### Managing Videos

1. **Gallery View**: Browse all your generated videos
2. **Search**: Find specific videos using the search bar
3. **Filter**: Filter by status (completed, processing, failed)
4. **Actions**: Play, download, or delete videos

## 🛠️ Development

### Project Structure

```
sora-2-video-generator/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context providers
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                # Node.js backend
│   ├── index.js          # Express server
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

### Available Scripts

```bash
# Development
npm run dev          # Start both client and server
npm run client       # Start only React client
npm run server       # Start only Node.js server

# Production
npm run build        # Build React app for production
npm start           # Start production server

# Dependencies
npm run install-deps # Install all dependencies
```

### Adding New Features

1. **Frontend Components**: Add new React components in `client/src/components/`
2. **API Endpoints**: Add new routes in `server/index.js`
3. **Styling**: Use Tailwind CSS classes or extend the theme in `tailwind.config.js`
4. **State Management**: Use React Context in `client/src/context/`

## 🎨 Customization

### Theming

The app uses a custom color palette defined in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Blue gradient colors
  },
  dark: {
    // Dark theme colors
  }
}
```

### Animations

Framer Motion animations are configured throughout the app:
- Page transitions
- Component entrance animations
- Loading states
- Hover effects

## 🚀 Deployment

### Frontend (Netlify/Vercel)

1. Build the React app:
   ```bash
   cd client && npm run build
   ```

2. Deploy the `build` folder to your hosting service

### Backend (Heroku/Railway/DigitalOcean)

1. Set environment variables on your hosting platform
2. Deploy the `server` directory
3. Update the frontend API base URL

### Full Stack (Docker)

```dockerfile
# Example Dockerfile structure
FROM node:16-alpine
# ... Docker configuration
```

## 📱 Mobile Support

The app is fully responsive and works great on:
- 📱 Mobile phones (iOS/Android)
- 📱 Tablets (iPad/Android tablets)
- 💻 Desktop computers
- 🖥️ Large displays

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **File Upload Validation**: Secure file handling
- **CORS Protection**: Controlled cross-origin requests
- **Helmet Security**: Security headers and protection
- **Input Sanitization**: Clean user inputs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for the Sora 2 model
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **Lucide** for beautiful icons

## 📞 Support

If you have any questions or need help:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Made with ❤️ by the Sora 2 Team**