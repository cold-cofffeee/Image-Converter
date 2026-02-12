const archiver = require('archiver');
const unzipper = require('unzipper');
const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

class ArchiveService {
  static async createZip(filePaths, outputPath) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => resolve(outputPath));
      archive.on('error', reject);

      archive.pipe(output);

      filePaths.forEach(filePath => {
        const filename = path.basename(filePath);
        archive.file(filePath, { name: filename });
      });

      archive.finalize();
    });
  }

  static async extractZip(zipPath, outputDir) {
    await fsPromises.mkdir(outputDir, { recursive: true });

    return new Promise((resolve, reject) => {
      fs.createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: outputDir }))
        .on('close', () => resolve(outputDir))
        .on('error', reject);
    });
  }

  static async listZipContents(zipPath) {
    const directory = await unzipper.Open.file(zipPath);
    return directory.files.map(file => ({
      path: file.path,
      size: file.uncompressedSize,
      type: file.type
    }));
  }
}

module.exports = ArchiveService;
