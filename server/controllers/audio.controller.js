const AudioService = require('../services/audio.service');
const FileManager = require('../utils/file-manager');
const ResponseHelper = require('../utils/response');
const path = require('path');

class AudioController {
  static async convertToMp3(req, res, next) {
    const file = req.file;
    const { bitrate = '192k' } = req.body;

    try {
      const outputPath = path.join(__dirname, '../../uploads', `converted_${Date.now()}.mp3`);
      await AudioService.convertToMp3(file.path, outputPath, bitrate);

      ResponseHelper.sendFile(res, outputPath, 'converted.mp3', 'audio/mpeg');

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
    const { quality = 'medium' } = req.body;

    try {
      const outputPath = path.join(__dirname, '../../uploads', `compressed_${Date.now()}.mp3`);
      await AudioService.compress(file.path, outputPath, quality);

      ResponseHelper.sendFile(res, outputPath, 'compressed.mp3', 'audio/mpeg');

      setTimeout(() => {
        FileManager.cleanupFiles([file.path, outputPath]);
      }, 5000);
    } catch (error) {
      await FileManager.cleanupFile(file.path);
      next(error);
    }
  }
}

module.exports = AudioController;
