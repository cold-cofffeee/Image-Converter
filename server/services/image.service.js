const sharp = require('sharp');
const path = require('path');
const FileManager = require('../utils/file-manager');
const PDFDocument = require('pdfkit');
const fs = require('fs');

class ImageService {
  static async convert(inputPath, outputFormat, options = {}) {
    const quality = options.quality || 80;
    const outputPath = inputPath.replace(path.extname(inputPath), `.${outputFormat}`);

    let pipeline = sharp(inputPath);

    switch (outputFormat.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        pipeline = pipeline.jpeg({ quality });
        break;
      case 'png':
        pipeline = pipeline.png({ compressionLevel: 9 });
        break;
      case 'webp':
        pipeline = pipeline.webp({ quality });
        break;
      case 'avif':
        pipeline = pipeline.avif({ quality });
        break;
      case 'tiff':
        pipeline = pipeline.tiff({ quality });
        break;
      case 'gif':
        pipeline = pipeline.gif();
        break;
      case 'bmp':
        pipeline = pipeline.toFormat('bmp');
        break;
      default:
        throw new Error(`Unsupported output format: ${outputFormat}`);
    }

    await pipeline.toFile(outputPath);
    return outputPath;
  }

  static async resize(inputPath, width, height, options = {}) {
    const fit = options.fit || 'inside';
    const outputPath = inputPath.replace(path.extname(inputPath), `_resized${path.extname(inputPath)}`);

    await sharp(inputPath)
      .resize(parseInt(width), parseInt(height), { fit })
      .toFile(outputPath);

    return outputPath;
  }

  static async crop(inputPath, left, top, width, height) {
    const outputPath = inputPath.replace(path.extname(inputPath), `_cropped${path.extname(inputPath)}`);

    await sharp(inputPath)
      .extract({
        left: parseInt(left),
        top: parseInt(top),
        width: parseInt(width),
        height: parseInt(height)
      })
      .toFile(outputPath);

    return outputPath;
  }

  static async compress(inputPath, quality = 80) {
    const ext = path.extname(inputPath).toLowerCase();
    const outputPath = inputPath.replace(ext, `_compressed${ext}`);

    let pipeline = sharp(inputPath);

    switch (ext) {
      case '.jpg':
      case '.jpeg':
        pipeline = pipeline.jpeg({ quality });
        break;
      case '.png':
        pipeline = pipeline.png({ compressionLevel: 9, quality });
        break;
      case '.webp':
        pipeline = pipeline.webp({ quality });
        break;
      default:
        throw new Error('Compression not supported for this format');
    }

    await pipeline.toFile(outputPath);
    return outputPath;
  }

  static async rotate(inputPath, angle) {
    const outputPath = inputPath.replace(path.extname(inputPath), `_rotated${path.extname(inputPath)}`);

    await sharp(inputPath)
      .rotate(parseInt(angle))
      .toFile(outputPath);

    return outputPath;
  }

  static async imageToPdf(imagePaths, outputPath) {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({ autoFirstPage: false });
        const stream = fs.createWriteStream(outputPath);

        doc.pipe(stream);

        for (const imagePath of imagePaths) {
          const metadata = await sharp(imagePath).metadata();
          const { width, height } = metadata;

          doc.addPage({ size: [width, height] });
          doc.image(imagePath, 0, 0, { width, height });
        }

        doc.end();

        stream.on('finish', () => resolve(outputPath));
        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  static async getMetadata(inputPath) {
    return await sharp(inputPath).metadata();
  }
}

module.exports = ImageService;
