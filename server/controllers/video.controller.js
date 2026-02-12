const VideoService = require('../services/video.service');
const FileManager = require('../utils/file-manager');
const ResponseHelper = require('../utils/response');
const path = require('path');

class VideoController {
  static async convertToMp4(req, res, next) {
    const file = req.file;
    const { quality = 'medium' } = req.body;

    try {
      const outputPath = path.join(__dirname, '../../uploads', `converted_${Date.now()}.mp4`);
      await VideoService.convertToMp4(file.path, outputPath, quality);

      ResponseHelper.sendFile(res, outputPath, 'converted.mp4', 'video/mp4');

      setTimeout(() => {
        FileManager.cleanupFiles([file.path, outputPath]);
      }, 10000);
    } catch (error) {
      await FileManager.cleanupFile(file.path);
      next(error);
    }
  }

  static async compress(req, res, next) {
    const file = req.file;
    const { compressionLevel = 'medium' } = req.body;

    try {
      const outputPath = path.join(__dirname, '../../uploads', `compressed_${Date.now()}.mp4`);
      await VideoService.compress(file.path, outputPath, compressionLevel);

      ResponseHelper.sendFile(res, outputPath, 'compressed.mp4', 'video/mp4');

      setTimeout(() => {
        FileManager.cleanupFiles([file.path, outputPath]);
      }, 10000);
    } catch (error) {
      await FileManager.cleanupFile(file.path);
      next(error);
    }
  }

  static async videoToGif(req, res, next) {
    const file = req.file;
    const { width, fps, duration } = req.body;

    try {
      const outputPath = path.join(__dirname, '../../uploads', `converted_${Date.now()}.gif`);
      await VideoService.videoToGif(file.path, outputPath, { width, fps, duration });

      ResponseHelper.sendFile(res, outputPath, 'converted.gif', 'image/gif');

      setTimeout(() => {
        FileManager.cleanupFiles([file.path, outputPath]);
      }, 10000);
    } catch (error) {
      await FileManager.cleanupFile(file.path);
      next(error);
    }
  }
}

module.exports = VideoController;
