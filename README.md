# Professional Image Converter 🖼️

A modern, professional-grade web application for converting images between various formats. Built with Node.js, Express, and Sharp.

![Image Converter](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

## ✨ Features

- **🗂️ Bulk Upload**: Upload multiple images at once (no limit)
- **📦 ZIP Download**: Convert multiple images and download as a single ZIP file
- **Multiple Format Support**: Convert between JPEG, PNG, WebP, GIF, TIFF, AVIF, HEIF, and BMP
- **Quality Control**: Adjustable quality settings for lossy formats
- **Drag & Drop**: Intuitive drag-and-drop interface for single or multiple files
- **Image Preview**: Real-time thumbnails with file information for each image
- **Large File Support**: Handle files up to 100MB each
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Professional UI**: Modern, gradient-based design with smooth animations
- **Fast Processing**: Powered by Sharp for high-performance image processing

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd Converter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📖 Usage

1. **Upload Images**
   - Drag and drop one or multiple images onto the upload area, or
   - Click the upload area to browse and select files
   - No limit on the number of files you can upload

2. **Review Selected Files**
   - View thumbnails of all selected images
   - See file details (name, size, dimensions)
   - Remove individual files if needed

3. **Select Output Format**
   - Choose your desired output format from the dropdown menu
   - Supported formats: JPEG, PNG, WebP, GIF, TIFF, AVIF, HEIF, BMP

4. **Adjust Quality (Optional)**
   - For formats that support it (JPEG, WebP, AVIF, etc.), adjust the quality slider
   - Higher quality = larger file size, better image quality

5. **Convert**
   - Click the "Convert Image" button
   - Single file: Downloads directly as an image
   - Multiple files: Automatically downloads as a ZIP file containing all converted images

6. **Convert More**
   - Click "Convert Another Image" to start over with new files

## 🛠️ Technical Details

### Backend (Node.js)

- **Express**: Web server framework
- **Multer**: Multi-file upload handling
- **Sharp**: High-performance image processing
- **Archiver**: ZIP file creation for bulk downloads
- **CORS**: Cross-origin resource sharing support

### Frontend

- **Vanilla JavaScript**: No frameworks, pure JS for maximum performance
- **Modern CSS**: CSS3 with gradients, animations, and responsive design
- **HTML5**: Semantic markup with drag-and-drop API

### API Endpoints

#### GET `/api/formats`
Returns list of supported image formats.

**Response:**
```json
{
  "formats": ["jpeg", "jpg", "png", "webp", "tiff", "gif", "avif", "heif", "bmp"]
}
```

#### POST `/api/convert`
Converts uploaded image(s) to specified format.

**Parameters:**
- `images` (file): One or more image files to convert
- `format` (string): Output format
- `quality` (number, optional): Quality setting (1-100)

**Response:**
- For single file: Binary image data with appropriate Content-Type header
- For multiple files: ZIP archive containing all converted images
- Content-Disposition header with suggested filename

#### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Image converter API is running"
}
```

## 📁 Project Structure

```
Converter/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # CSS styling
│   └── client.js       # Frontend JavaScript
├── server.js           # Express server & API
├── package.json        # Project dependencies
└── README.md          # Documentation
```

## 🎨 Supported Formats

| Format | Input | Output | Quality Control |
|--------|-------|--------|----------------|
| JPEG   | ✅    | ✅     | ✅             |
| PNG    | ✅    | ✅     | ❌             |
| WebP   | ✅    | ✅     | ✅             |
| GIF    | ✅    | ✅     | ❌             |
| TIFF   | ✅    | ✅     | ✅             |
| AVIF   | ✅    | ✅     | ✅             |
| HEIF   | ✅    | ✅     | ✅             |
| BMP    | ✅    | ✅     | ❌             |
| SVG    | ✅    | ❌     | ❌             |

## 🔧 Configuration

### Port Configuration
By default, the server runs on port 3000. To change:

```bash
PORT=8080 npm start
```

Or set environment variable:
```bash
export PORT=8080  # Linux/Mac
set PORT=8080     # Windows CMD
$env:PORT=8080    # Windows PowerShell
```

### File Size Limit
Maximum upload size is set to 100MB per file. To modify, edit [server.js](server.js):

```javascript
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // Change this value
  }
});
```

## 🐛 Troubleshooting

### Sharp Installation Issues
If Sharp fails to install, try:
```bash
npm rebuild sharp
```

Or install with specific platform:
```bash
npm install --platform=win32 --arch=x64 sharp
```

### Port Already in Use
If port 3000 is occupied:
```bash
PORT=3001 npm start
```

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 💡 Future Enhancements

- [ ] Image resize functionality
- [ ] Crop and rotate options
- [ ] Compression level controls
- [ ] Conversion history
- [ ] Cloud storage integration
- [ ] API rate limiting
- [ ] User authentication
- [ ] Custom watermarking
- [ ] Before/after comparison view

## 👨‍💻 Author

Built with ❤️ using Node.js and Sharp

---

**Note:** This application processes images locally on your server. No data is sent to external services, ensuring privacy and security.
