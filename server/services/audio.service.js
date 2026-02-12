const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

class AudioService {
  static async convertToMp3(inputPath, outputPath, bitrate = '192k') {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .output(outputPath)
        .audioCodec('libmp3lame')
        .audioBitrate(bitrate)
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .run();
    });
  }

  static async compress(inputPath, outputPath, quality = 'medium') {
    return new Promise((resolve, reject) => {
      let bitrate;
      switch (quality) {
        case 'high': bitrate = '192k'; break;
        case 'medium': bitrate = '128k'; break;
        case 'low': bitrate = '96k'; break;
        default: bitrate = '128k';
      }

      ffmpeg(inputPath)
        .output(outputPath)
        .audioCodec('libmp3lame')
        .audioBitrate(bitrate)
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

module.exports = AudioService;
