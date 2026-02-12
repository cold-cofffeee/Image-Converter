const ImageService = require('../services/image.service');
const FileManager = require('../utils/file-manager');
const ResponseHelper = require('../utils/response');
const path = require('path');
const archiver = require('archiver');
const fs = require('fs');

class ImageController {
  static async convert(req, res, next) {
    const uploadedFiles = req.files || [req.file];
    const { format, quality } = req.body;
    const convertedFiles = [];

    try {
      if (!format) {
        return ResponseHelper.error(res, 'Output format is required');
      }

      for (const file of uploadedFiles) {
        const outputPath = await ImageService.convert(file.path, format, { quality });
        convertedFiles.push(outputPath);
      }

      if (convertedFiles.length === 1) {
        const filename = FileManager.getOutputFilename(uploadedFiles[0].originalname, format);
        ResponseHelper.sendFile(res, convertedFiles[0], filename, `image/${format}`);
        
        setTimeout(() => {
          FileManager.cleanupFiles([...uploadedFiles.map(f => f.path), ...convertedFiles]);
        }, 5000);
      } else {
        const archive = archiver('zip', { zlib: { level: 9 } });
        const zipFilename = `converted_images_${Date.now()}.zip`;

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`);

        archive.pipe(res);

        convertedFiles.forEach((filePath, index) => {
          const filename = FileManager.getOutputFilename(uploadedFiles[index].originalname, format);
          archive.file(filePath, { name: filename });
        });

        archive.finalize();

        archive.on('end', () => {
          setTimeout(() => {
            FileManager.cleanupFiles([...uploadedFiles.map(f => f.path), ...convertedFiles]);
          }, 5000);
        });
      }
    } catch (error) {
      await FileManager.cleanupFiles([...uploadedFiles.map(f => f.path), ...convertedFiles]);
      next(error);
    }
  }

  static async resize(req, res, next) {
    const file = req.file;
    const { width, height, fit } = req.body;

    try {
      if (!width || !height) {
        return ResponseHelper.error(res, 'Width and height are required');
      }

      const outputPath = await ImageService.resize(file.path, width, height, { fit });
      const filename = FileManager.getOutputFilename(file.originalname, path.extname(file.originalname).slice(1));

      ResponseHelper.sendFile(res, outputPath, filename, file.mimetype);

      setTimeout(() => {
        FileManager.cleanupFiles([file.path, outputPath]);
      }, 5000);
    } catch (error) {
      await FileManager.cleanupFile(file.path);
      next(error);
    }
  }

  static async crop(req, res, next) {
    const file = req.file;
    const { left, top, width, height } = req.body;

    try {
      if (!left || !top || !width || !height) {
        return ResponseHelper.error(res, 'Crop coordinates are required');
      }

      const outputPath = await ImageService.crop(file.path, left, top, width, height);
      const filename = FileManager.getOutputFilename(file.originalname, path.extname(file.originalname).slice(1));

      ResponseHelper.sendFile(res, outputPath, filename, file.mimetype);

      setTimeout(() => {
        FileManager.cleanupFiles([file.path, outputPath]);
      }, 5000);
    } catch (error) {
      await FileManager.cleanupFile(file.path);
      next(error);
    }
  }

  static async compress(req, res, next) {
    const file = req.file;
    const { quality } = req.body;

    try {
      const outputPath = await ImageService.compress(file.path, quality);
      const filename = FileManager.getOutputFilename(file.originalname, path.extname(file.originalname).slice(1));

      ResponseHelper.sendFile(res, outputPath, filename, file.mimetype);

      setTimeout(() => {
        FileManager.cleanupFiles([file.path, outputPath]);
      }, 5000);
    } catch (error) {
      await FileManager.cleanupFile(file.path);
      next(error);
    }
  }

  static async rotate(req, res, next) {
    const file = req.file;
    const { angle } = req.body;

    try {
      if (!angle) {
        return ResponseHelper.error(res, 'Rotation angle is required');
      }

      const outputPath = await ImageService.rotate(file.path, angle);
      const filename = FileManager.getOutputFilename(file.originalname, path.extname(file.originalname).slice(1));

      ResponseHelper.sendFile(res, outputPath, filename, file.mimetype);

      setTimeout(() => {
        FileManager.cleanupFiles([file.path, outputPath]);
      }, 5000);
    } catch (error) {
      await FileManager.cleanupFile(file.path);
      next(error);
    }
  }

  static async imageToPdf(req, res, next) {
    const uploadedFiles = req.files || [req.file];

    try {
      const outputPath = path.join(__dirname, '../../uploads', `converted_${Date.now()}.pdf`);
      await ImageService.imageToPdf(uploadedFiles.map(f => f.path), outputPath);

      ResponseHelper.sendFile(res, outputPath, 'converted.pdf', 'application/pdf');

      setTimeout(() => {
        FileManager.cleanupFiles([...uploadedFiles.map(f => f.path), outputPath]);
      }, 5000);
    } catch (error) {
      await FileManager.cleanupFiles(uploadedFiles.map(f => f.path));
      next(error);
    }
  }
}

module.exports = ImageController;
