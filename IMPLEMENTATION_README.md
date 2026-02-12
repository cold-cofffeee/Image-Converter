# ConvertHub - Professional Multi-Format Conversion Platform

A modern, production-grade web application for converting files between various formats. Built with Node.js, Express, Sharp, FFmpeg, and more.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-green)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Overview

**ConvertHub** is a professional SaaS-style file conversion platform inspired by freeconvert.com and cloudconvert.com. It provides a comprehensive suite of conversion tools across multiple categories with a modern, clean UI and robust backend architecture.

## ✨ Features

### Multi-Category Tool Suite
- **🖼️ Image Tools**: Convert, resize, crop, compress, rotate images
- **📄 PDF Tools**: Merge, split, compress PDFs, convert to/from images
- **🎬 Video Tools**: Convert video formats, compress, create GIFs
- **🎵 Audio Tools**: Convert audio formats, compress files
- **📝 Document Tools**: Convert between DOCX and PDF
- **📦 Archive Tools**: Create and extract ZIP archives

### Professional UI/UX
- Clean, modern SaaS design
- Tool category grid layout
- Responsive on all devices
- Drag-and-drop file upload
- Real-time progress tracking
- Toast notifications
- Smooth animations
- Empty and error states

### Technical Features
- Bulk file processing
- ZIP download for multiple files
- Large file support (up to 100MB per file)
- Quality control for lossy formats
- Modular architecture
- RESTful API
- Client-side routing
- Local storage for recent tools

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm 8+
- FFmpeg (for video/audio processing)
- LibreOffice (for document conversion)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install system dependencies:**

   **Windows:**
   - Download and install [FFmpeg](https://ffmpeg.org/download.html)
   - Download and install [LibreOffice](https://www.libreoffice.org/download/)

   **Linux (Ubuntu/Debian):**
   ```bash
   sudo apt update
   sudo apt install ffmpeg libreoffice
   ```

   **macOS:**
   ```bash
   brew install ffmpeg libreoffice
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
Image-Converter/
├── server/
│   ├── index.js                    # Express server entry
│   ├── config/
│   │   └── tools.config.js         # Tool definitions
│   ├── routes/
│   │   ├── index.js                # Main API router
│   │   ├── image.routes.js         # Image tool routes
│   │   ├── pdf.routes.js           # PDF tool routes
│   │   ├── video.routes.js         # Video tool routes
│   │   ├── audio.routes.js         # Audio tool routes
│   │   ├── document.routes.js      # Document tool routes
│   │   └── archive.routes.js       # Archive tool routes
│   ├── controllers/                # Request handlers
│   ├── services/                   # Business logic
│   ├── middleware/                 # Express middleware
│   └── utils/                      # Utilities
│
├── public/
│   ├── index.html                  # Homepage
│   ├── tool.html                   # Tool page template
│   ├── styles/
│   │   ├── design-system.css       # CSS variables & tokens
│   │   ├── reset.css               # CSS reset
│   │   ├── layout.css              # Layout utilities
│   │   ├── components.css          # Reusable components
│   │   ├── homepage.css            # Homepage styles
│   │   ├── tool-page.css           # Tool page styles
│   │   └── animations.css          # Animations
│   └── js/
│       ├── app.js                  # App initialization
│       ├── components/             # UI components
│       ├── pages/                  # Page controllers
│       └── utils/                  # Client utilities
│
├── package.json
└── README.md
```

## 🛠️ Available Tools

### Image Tools
- **PNG to JPG** - Convert PNG images to JPG format
- **JPG to PNG** - Convert JPG images to PNG format
- **WebP Converter** - Convert images to/from WebP
- **Image Resize** - Resize images to custom dimensions
- **Image Crop** - Crop images to specific areas
- **Image Compress** - Compress images to reduce size
- **Image Rotate** - Rotate images by degrees
- **Image to PDF** - Convert images to PDF document

### PDF Tools
- **Merge PDF** - Combine multiple PDFs into one
- **Split PDF** - Split PDF into multiple files
- **Compress PDF** - Reduce PDF file size
- **PDF to JPG** - Convert PDF pages to images
- **JPG to PDF** - Convert images to PDF

### Video Tools
- **MP4 Converter** - Convert videos to MP4 format
- **Video Compressor** - Compress video files
- **Video to GIF** - Convert video to animated GIF

### Audio Tools
- **MP3 Converter** - Convert audio to MP3 format
- **Audio Compressor** - Compress audio files

### Document Tools
- **DOCX to PDF** - Convert Word documents to PDF
- **PDF to DOCX** - Convert PDF to Word document

### Archive Tools
- **ZIP Extractor** - Extract files from ZIP archives
- **Create ZIP** - Create ZIP archives from files

## 🎨 Design System

### Colors
- Primary: `#2563eb` (Blue)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Orange)
- Error: `#ef4444` (Red)

### Typography
- Font: System font stack (Inter style)
- Scale: 12px - 60px

### Spacing
- Base unit: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px

### Components
- Buttons: Primary, Secondary (Small, Medium, Large)
- Cards: Tool cards, Info cards
- Upload zone: Drag & drop enabled
- Progress bar: Animated
- Toast notifications: 4 types (Success, Error, Warning, Info)
- File list: With remove functionality

## 📡 API Endpoints

### Tool Information
- `GET /api/tools` - Get all tool categories
- `GET /api/tools/:toolId` - Get specific tool info
- `GET /api/health` - Health check

### Image Tools
- `POST /api/image/convert` - Convert image format
- `POST /api/image/resize` - Resize image
- `POST /api/image/crop` - Crop image
- `POST /api/image/compress` - Compress image
- `POST /api/image/rotate` - Rotate image
- `POST /api/image/to-pdf` - Convert images to PDF

### PDF Tools
- `POST /api/pdf/merge` - Merge PDFs
- `POST /api/pdf/split` - Split PDF
- `POST /api/pdf/compress` - Compress PDF
- `POST /api/pdf/to-images` - Convert PDF to images
- `POST /api/pdf/from-images` - Convert images to PDF

### Video Tools
- `POST /api/video/to-mp4` - Convert to MP4
- `POST /api/video/compress` - Compress video
- `POST /api/video/to-gif` - Convert to GIF

### Audio Tools
- `POST /api/audio/to-mp3` - Convert to MP3
- `POST /api/audio/compress` - Compress audio

### Document Tools
- `POST /api/document/docx-to-pdf` - DOCX to PDF
- `POST /api/document/pdf-to-docx` - PDF to DOCX

### Archive Tools
- `POST /api/archive/create` - Create ZIP
- `POST /api/archive/extract` - Extract ZIP

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
MAX_FILE_SIZE=104857600
MAX_FILES_COUNT=50
```

### File Size Limits
Default: 100MB per file, 50 files maximum

Modify in `server/middleware/upload.middleware.js`:
```javascript
limits: {
  fileSize: 100 * 1024 * 1024, // bytes
  files: 50
}
```

## 🔧 Development

### Run in development mode with auto-reload:
```bash
npm run dev
```

### Project follows modular architecture:
- **Routes** → **Controllers** → **Services**
- Separation of concerns
- Reusable components
- Error handling middleware
- File cleanup utilities

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🐛 Troubleshooting

### FFmpeg not found
```bash
# Windows: Add FFmpeg to PATH
# Linux/Mac:
which ffmpeg  # Should show path
```

### LibreOffice not found
Document conversion requires LibreOffice installed and accessible in PATH.

### Sharp installation issues
```bash
npm rebuild sharp
```

### Port already in use
```bash
PORT=3001 npm start
```

## 🚀 Deployment

### Production build steps:
1. Install dependencies: `npm install --production`
2. Set `NODE_ENV=production`
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificate
5. Configure file upload limits
6. Set up monitoring

### Recommended hosting:
- VPS (DigitalOcean, Linode, AWS EC2)
- Minimum: 2GB RAM, 2 CPU cores
- Storage: Depends on concurrent users

## 📝 License

MIT License - Free to use for personal and commercial projects

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Submit pull request

## 💡 Roadmap

- [ ] User authentication
- [ ] Cloud storage integration (S3, Google Drive)
- [ ] API rate limiting
- [ ] Conversion history
- [ ] Batch API for developers
- [ ] More file formats
- [ ] Image filters and effects
- [ ] Advanced PDF editing
- [ ] OCR support
- [ ] Webhook notifications

## 📧 Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review API documentation

---

**Built with Node.js, Express, Sharp, FFmpeg, pdf-lib, and modern web technologies.**

**Transform your files with ConvertHub - Professional, Fast, Free.**
