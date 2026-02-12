const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs').promises;

class VideoService {
  static async convertToMp4(inputPath, outputPath, quality = 'medium') {
    return new Promise((resolve, reject) => {
      let crf;
      switch (quality) {
        case 'high': crf = 18; break;
        case 'medium': crf = 23; break;
        case 'low': crf = 28; break;
        default: crf = 23;
      }

      ffmpeg(inputPath)
        .output(outputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([`-crf ${crf}`])
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .run();
    });
  }

  static async compress(inputPath, outputPath, compressionLevel = 'medium') {
    return new Promise((resolve, reject) => {
      let crf, scale;
      
      switch (compressionLevel) {
        case 'high':
          crf = 28;
          scale = 'scale=iw*0.75:ih*0.75';
          break;
        case 'medium':
          crf = 28;
          scale = null;
          break;
        case 'low':
          crf = 23;
          scale = null;
          break;
        default:
          crf = 28;
          scale = null;
      }

      const command = ffmpeg(inputPath)
        .output(outputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([`-crf ${crf}`]);

      if (scale) {
        command.videoFilters(scale);
      }

      command
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .run();
    });
  }

  static async videoToGif(inputPath, outputPath, options = {}) {
    return new Promise((resolve, reject) => {
      const width = options.width || 480;
      const fps = options.fps || 15;
      const duration = options.duration || 10;

      ffmpeg(inputPath)
        .output(outputPath)
        .duration(duration)
        .videoFilters(`fps=${fps},scale=${width}:-1:flags=lanczos`)
        .outputOptions(['-loop 0'])
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .run();
    });
  }

  static async getMetadata(inputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata);
      });
    });
  }
}

module.exports = VideoService;
