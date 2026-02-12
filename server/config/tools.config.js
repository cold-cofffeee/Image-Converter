const toolsConfig = {
  categories: [
    {
      id: 'image',
      name: 'Image Tools',
      icon: 'image',
      description: 'Convert, resize, compress and edit images',
      tools: [
        {
          id: 'png-to-jpg',
          name: 'PNG to JPG',
          description: 'Convert PNG images to JPG format',
          endpoint: '/api/image/png-to-jpg',
          inputFormats: ['png'],
          outputFormat: 'jpg',
          hasQuality: true,
          icon: 'convert'
        },
        {
          id: 'jpg-to-png',
          name: 'JPG to PNG',
          description: 'Convert JPG images to PNG format',
          endpoint: '/api/image/jpg-to-png',
          inputFormats: ['jpg', 'jpeg'],
          outputFormat: 'png',
          hasQuality: false,
          icon: 'convert'
        },
        {
          id: 'webp-converter',
          name: 'WebP Converter',
          description: 'Convert images to/from WebP format',
          endpoint: '/api/image/webp-converter',
          inputFormats: ['jpg', 'jpeg', 'png', 'webp'],
          outputFormat: 'webp',
          hasQuality: true,
          icon: 'convert'
        },
        {
          id: 'image-resize',
          name: 'Image Resize',
          description: 'Resize images to custom dimensions',
          endpoint: '/api/image/resize',
          inputFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
          hasWidth: true,
          hasHeight: true,
          icon: 'resize'
        },
        {
          id: 'image-crop',
          name: 'Image Crop',
          description: 'Crop images to specific dimensions',
          endpoint: '/api/image/crop',
          inputFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
          hasCrop: true,
          icon: 'crop'
        },
        {
          id: 'image-compress',
          name: 'Image Compress',
          description: 'Compress images to reduce file size',
          endpoint: '/api/image/compress',
          inputFormats: ['jpg', 'jpeg', 'png', 'webp'],
          hasQuality: true,
          icon: 'compress'
        },
        {
          id: 'image-rotate',
          name: 'Image Rotate',
          description: 'Rotate images by degrees',
          endpoint: '/api/image/rotate',
          inputFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
          hasRotation: true,
          icon: 'rotate'
        },
        {
          id: 'image-to-pdf',
          name: 'Image to PDF',
          description: 'Convert images to PDF document',
          endpoint: '/api/image/to-pdf',
          inputFormats: ['jpg', 'jpeg', 'png', 'webp'],
          outputFormat: 'pdf',
          icon: 'file'
        }
      ]
    },
    {
      id: 'pdf',
      name: 'PDF Tools',
      icon: 'file-text',
      description: 'Merge, split, compress and convert PDFs',
      tools: [
        {
          id: 'merge-pdf',
          name: 'Merge PDF',
          description: 'Combine multiple PDF files into one',
          endpoint: '/api/pdf/merge',
          inputFormats: ['pdf'],
          outputFormat: 'pdf',
          multipleFiles: true,
          icon: 'merge'
        },
        {
          id: 'split-pdf',
          name: 'Split PDF',
          description: 'Split a PDF into multiple files',
          endpoint: '/api/pdf/split',
          inputFormats: ['pdf'],
          outputFormat: 'pdf',
          hasPageRange: true,
          icon: 'split'
        },
        {
          id: 'compress-pdf',
          name: 'Compress PDF',
          description: 'Reduce PDF file size',
          endpoint: '/api/pdf/compress',
          inputFormats: ['pdf'],
          outputFormat: 'pdf',
          hasCompression: true,
          icon: 'compress'
        },
        {
          id: 'pdf-to-jpg',
          name: 'PDF to JPG',
          description: 'Convert PDF pages to JPG images',
          endpoint: '/api/pdf/to-jpg',
          inputFormats: ['pdf'],
          outputFormat: 'jpg',
          hasQuality: true,
          icon: 'image'
        },
        {
          id: 'jpg-to-pdf',
          name: 'JPG to PDF',
          description: 'Convert JPG images to PDF',
          endpoint: '/api/pdf/from-jpg',
          inputFormats: ['jpg', 'jpeg'],
          outputFormat: 'pdf',
          multipleFiles: true,
          icon: 'file'
        }
      ]
    },
    {
      id: 'video',
      name: 'Video Tools',
      icon: 'video',
      description: 'Convert and compress video files',
      tools: [
        {
          id: 'mp4-converter',
          name: 'MP4 Converter',
          description: 'Convert videos to MP4 format',
          endpoint: '/api/video/to-mp4',
          inputFormats: ['avi', 'mov', 'wmv', 'flv', 'mkv'],
          outputFormat: 'mp4',
          hasQuality: true,
          icon: 'video'
        },
        {
          id: 'video-compress',
          name: 'Video Compressor',
          description: 'Compress video files',
          endpoint: '/api/video/compress',
          inputFormats: ['mp4', 'avi', 'mov', 'mkv'],
          hasCompression: true,
          icon: 'compress'
        },
        {
          id: 'video-to-gif',
          name: 'Video to GIF',
          description: 'Convert video to animated GIF',
          endpoint: '/api/video/to-gif',
          inputFormats: ['mp4', 'avi', 'mov'],
          outputFormat: 'gif',
          hasQuality: true,
          icon: 'image'
        }
      ]
    },
    {
      id: 'audio',
      name: 'Audio Tools',
      icon: 'music',
      description: 'Convert and compress audio files',
      tools: [
        {
          id: 'mp3-converter',
          name: 'MP3 Converter',
          description: 'Convert audio to MP3 format',
          endpoint: '/api/audio/to-mp3',
          inputFormats: ['wav', 'flac', 'aac', 'ogg', 'm4a'],
          outputFormat: 'mp3',
          hasQuality: true,
          icon: 'music'
        },
        {
          id: 'audio-compress',
          name: 'Audio Compressor',
          description: 'Compress audio files',
          endpoint: '/api/audio/compress',
          inputFormats: ['mp3', 'wav', 'flac'],
          hasCompression: true,
          icon: 'compress'
        }
      ]
    },
    {
      id: 'document',
      name: 'Document Tools',
      icon: 'file-text',
      description: 'Convert document formats',
      tools: [
        {
          id: 'docx-to-pdf',
          name: 'DOCX to PDF',
          description: 'Convert Word documents to PDF',
          endpoint: '/api/document/docx-to-pdf',
          inputFormats: ['docx', 'doc'],
          outputFormat: 'pdf',
          icon: 'file'
        },
        {
          id: 'pdf-to-docx',
          name: 'PDF to DOCX',
          description: 'Convert PDF to Word document',
          endpoint: '/api/document/pdf-to-docx',
          inputFormats: ['pdf'],
          outputFormat: 'docx',
          icon: 'file-text'
        }
      ]
    },
    {
      id: 'archive',
      name: 'Archive Tools',
      icon: 'archive',
      description: 'Compress and extract archives',
      tools: [
        {
          id: 'zip-extractor',
          name: 'ZIP Extractor',
          description: 'Extract files from ZIP archives',
          endpoint: '/api/archive/extract',
          inputFormats: ['zip'],
          icon: 'extract'
        },
        {
          id: 'create-zip',
          name: 'Create ZIP',
          description: 'Create ZIP archives from files',
          endpoint: '/api/archive/create',
          inputFormats: ['*'],
          outputFormat: 'zip',
          multipleFiles: true,
          icon: 'archive'
        }
      ]
    }
  ],

  getToolById(toolId) {
    for (const category of this.categories) {
      const tool = category.tools.find(t => t.id === toolId);
      if (tool) {
        return { ...tool, category: category.id };
      }
    }
    return null;
  },

  getToolsByCategory(categoryId) {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.tools : [];
  },

  getAllTools() {
    return this.categories.flatMap(cat => 
      cat.tools.map(tool => ({ ...tool, category: cat.id }))
    );
  }
};

module.exports = toolsConfig;
