const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB per file limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/tiff', 'image/bmp', 'image/svg+xml'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image files are allowed.'));
    }
  }
});

// Supported formats
const supportedFormats = {
  'jpeg': { quality: 90, ext: 'jpg' },
  'jpg': { quality: 90, ext: 'jpg' },
  'png': { compressionLevel: 9, ext: 'png' },
  'webp': { quality: 90, ext: 'webp' },
  'tiff': { quality: 90, ext: 'tiff' },
  'gif': { ext: 'gif' },
  'avif': { quality: 90, ext: 'avif' },
  'heif': { quality: 90, ext: 'heif' },
  'bmp': { ext: 'bmp' }
};

// Route to get supported formats
app.get('/api/formats', (req, res) => {
  res.json({
    formats: Object.keys(supportedFormats)
  });
});

// Bulk image conversion route
app.post('/api/convert', upload.array('images'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files uploaded' });
    }

    const { format, quality } = req.body;
    
    if (!format || !supportedFormats[format.toLowerCase()]) {
      return res.status(400).json({ error: 'Invalid or unsupported output format' });
    }

    const outputFormat = format.toLowerCase();
    const formatConfig = supportedFormats[outputFormat];
    const convertedFiles = [];

    // Configure output format with quality settings
    const options = {};
    
    if (quality && (outputFormat === 'jpeg' || outputFormat === 'jpg' || outputFormat === 'webp' || outputFormat === 'avif' || outputFormat === 'heif' || outputFormat === 'tiff')) {
      options.quality = parseInt(quality) || formatConfig.quality || 90;
    }
    
    if (outputFormat === 'png' && formatConfig.compressionLevel) {
      options.compressionLevel = formatConfig.compressionLevel;
    }

    // Process each image
    for (const file of req.files) {
      try {
        // Get original filename without extension
        const originalName = path.parse(file.originalname).name;
        const outputFilename = `${originalName}.${formatConfig.ext}`;

        // Process image with Sharp
        let sharpInstance = sharp(file.buffer);

        // Convert image
        let convertedBuffer;
        
        switch(outputFormat) {
          case 'jpeg':
          case 'jpg':
            convertedBuffer = await sharpInstance.jpeg(options).toBuffer();
            break;
          case 'png':
            convertedBuffer = await sharpInstance.png(options).toBuffer();
            break;
          case 'webp':
            convertedBuffer = await sharpInstance.webp(options).toBuffer();
            break;
          case 'tiff':
            convertedBuffer = await sharpInstance.tiff(options).toBuffer();
            break;
          case 'avif':
            convertedBuffer = await sharpInstance.avif(options).toBuffer();
            break;
          case 'heif':
            convertedBuffer = await sharpInstance.heif(options).toBuffer();
            break;
          case 'gif':
            convertedBuffer = await sharpInstance.gif().toBuffer();
            break;
          case 'bmp':
            convertedBuffer = await sharpInstance.png().toBuffer();
            break;
          default:
            throw new Error('Unsupported format');
        }

        convertedFiles.push({
          filename: outputFilename,
          buffer: convertedBuffer
        });

      } catch (error) {
        console.error(`Error converting ${file.originalname}:`, error);
        // Continue with other files even if one fails
      }
    }

    if (convertedFiles.length === 0) {
      return res.status(500).json({ error: 'Failed to convert any images' });
    }

    // If only one file, send it directly
    if (convertedFiles.length === 1) {
      const file = convertedFiles[0];
      res.set({
        'Content-Type': `image/${formatConfig.ext}`,
        'Content-Disposition': `attachment; filename="${file.filename}"`,
        'Content-Length': file.buffer.length
      });
      return res.send(file.buffer);
    }

    // Multiple files - create zip
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="converted_images.zip"'
    });

    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Handle archiver errors
    archive.on('error', (err) => {
      console.error('Archive error:', err);
      res.status(500).json({ error: 'Failed to create zip file' });
    });

    // Pipe archive to response
    archive.pipe(res);

    // Add each converted file to zip
    for (const file of convertedFiles) {
      archive.append(file.buffer, { name: file.filename });
    }

    // Finalize the archive
    await archive.finalize();

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ 
      error: 'Failed to convert images', 
      details: error.message 
    });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Image converter API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Image Converter Server running on http://localhost:${PORT}`);
  console.log(`📁 Upload images and convert to any format`);
});
