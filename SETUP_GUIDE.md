# Implementation Guide - ConvertHub

## Step-by-Step Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install all required Node.js packages:
- express (web server)
- sharp (image processing)
- fluent-ffmpeg (video/audio processing)
- pdf-lib (PDF manipulation)
- pdfkit (PDF creation)
- libreoffice-convert (document conversion)
- archiver & unzipper (archive handling)
- multer (file upload)
- cors (cross-origin support)

### 2. Install System Dependencies

#### Windows:
1. **FFmpeg**: Download from https://ffmpeg.org/download.html
   - Extract to `C:\ffmpeg`
   - Add `C:\ffmpeg\bin` to System PATH
   - Verify: `ffmpeg -version`

2. **LibreOffice**: Download from https://www.libreoffice.org/download/
   - Install normally
   - Add to PATH: `C:\Program Files\LibreOffice\program`
   - Verify: `soffice --version`

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install -y ffmpeg libreoffice
```

#### macOS:
```bash
brew install ffmpeg libreoffice
```

### 3. File Structure Check

Ensure your project has this structure:
```
Image-Converter/
├── server/
│   ├── index.js
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   └── utils/
├── public/
│   ├── index.html
│   ├── tool.html
│   ├── styles/
│   └── js/
├── package.json
└── README.md
```

### 4. Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

Server will start on http://localhost:3000

### 5. Test the Application

1. Open http://localhost:3000 in your browser
2. You should see the ConvertHub homepage with tool categories
3. Click on any tool (e.g., "PNG to JPG")
4. Upload a file and test conversion

## Tool Implementation Status

### ✅ Fully Implemented
- All image conversion tools (PNG, JPG, WebP, etc.)
- Image resize, crop, compress, rotate
- Image to PDF conversion
- PDF merge, split, compress
- ZIP creation and extraction

### ⚙️ Requires External Tools
- **Video tools**: Requires FFmpeg installed
- **Audio tools**: Requires FFmpeg installed
- **Document tools**: Requires LibreOffice installed
- **PDF to images**: Requires Ghostscript and pdf2pic

### 🔧 Configuration Notes

#### Video/Audio Processing
If FFmpeg is not installed, video and audio tools will fail. The error will be caught and displayed to users. Install FFmpeg to enable these tools.

#### Document Conversion
LibreOffice must be installed and accessible via command line. The `libreoffice-convert` package uses it in headless mode.

#### PDF to Image Conversion
Requires both Ghostscript and pdf2pic. On some systems, this may require additional setup:
- Windows: Install Ghostscript separately
- Linux: `sudo apt install ghostscript`
- macOS: `brew install ghostscript`

## API Testing

Test endpoints using curl or Postman:

### Test Image Conversion
```bash
curl -X POST http://localhost:3000/api/image/convert \
  -F "files=@test-image.png" \
  -F "format=jpg" \
  -F "quality=90" \
  --output converted.jpg
```

### Test PDF Merge
```bash
curl -X POST http://localhost:3000/api/pdf/merge \
  -F "files=@file1.pdf" \
  -F "files=@file2.pdf" \
  --output merged.pdf
```

### Get Available Tools
```bash
curl http://localhost:3000/api/tools
```

### Health Check
```bash
curl http://localhost:3000/api/health
```

## Frontend Components

### Tool Page Flow
1. User visits `/tools/{toolId}` (e.g., `/tools/png-to-jpg`)
2. `tool-page.js` loads tool configuration from API
3. User uploads files via drag-drop or browse
4. Options are displayed based on tool config (quality, dimensions, etc.)
5. User clicks "Convert"
6. Progress bar shows conversion status
7. File downloads automatically when complete

### Homepage Components
- Hero section with quick upload
- Tool category sections with cards
- Feature highlights
- Footer with tool links

## Customization

### Add New Tool Category
Edit `server/config/tools.config.js`:
```javascript
{
  id: 'your-category',
  name: 'Your Category',
  icon: 'icon-name',
  description: 'Category description',
  tools: [...]
}
```

### Add New Tool
Add to appropriate category in `tools.config.js`:
```javascript
{
  id: 'your-tool',
  name: 'Tool Name',
  description: 'Tool description',
  endpoint: '/api/category/your-tool',
  inputFormats: ['ext1', 'ext2'],
  outputFormat: 'ext3',
  hasQuality: true,
  icon: 'icon-name'
}
```

Then implement the service, controller, and route.

### Styling Customization
Edit CSS variables in `public/styles/design-system.css`:
```css
:root {
  --color-primary: #your-color;
  --font-sans: your-font-stack;
  --radius-lg: your-radius;
}
```

## Production Deployment

### 1. Set Environment Variables
```bash
export NODE_ENV=production
export PORT=3000
```

### 2. Use Process Manager
```bash
npm install -g pm2
pm2 start server/index.js --name converthub
pm2 save
pm2 startup
```

### 3. Set Up Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. SSL Certificate
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 5. Monitoring
Set up logging and monitoring:
- Use PM2 logs: `pm2 logs converthub`
- Set up error tracking (Sentry, etc.)
- Monitor server resources

## Troubleshooting

### Common Issues

**Issue**: "Cannot find module 'sharp'"
- Solution: `npm rebuild sharp`

**Issue**: FFmpeg not found
- Solution: Ensure FFmpeg is in PATH and restart terminal

**Issue**: Port 3000 in use
- Solution: `PORT=3001 npm start`

**Issue**: File upload fails
- Solution: Check write permissions on `uploads/` directory

**Issue**: Large files fail
- Solution: Increase limits in `upload.middleware.js`

### Logs
Check server logs for errors:
```bash
# If using PM2
pm2 logs converthub

# If using npm start
# Logs appear in terminal
```

## Performance Optimization

### 1. File Cleanup
Files are automatically deleted after 5-10 seconds. Adjust in controllers:
```javascript
setTimeout(() => {
  FileManager.cleanupFiles([...files]);
}, 5000); // Adjust time
```

### 2. Concurrent Processing
Increase Node.js max file descriptors for high concurrency:
```bash
ulimit -n 10000
```

### 3. Memory Management
For processing many large files, increase Node.js memory:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

### 4. Caching
Implement Redis or similar for frequently accessed tool configs.

## Security Considerations

1. **File Type Validation**: Implemented via multer and service layers
2. **File Size Limits**: Set to 100MB, configurable
3. **CORS**: Configured, adjust as needed
4. **Input Sanitization**: All inputs validated
5. **File Cleanup**: Automatic deletion prevents disk fill
6. **Rate Limiting**: Recommended for production (not included)

Add rate limiting for production:
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

## Support & Resources

- Node.js Docs: https://nodejs.org/docs
- Sharp Documentation: https://sharp.pixelplumbing.com/
- FFmpeg Documentation: https://ffmpeg.org/documentation.html
- Express.js Guide: https://expressjs.com/

For issues specific to this implementation, check the console logs and verify all dependencies are installed.
