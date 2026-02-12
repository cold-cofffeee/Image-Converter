const fs = require('fs').promises;
const path = require('path');

class FileManager {
  static async cleanupFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  static async cleanupFiles(filePaths) {
    await Promise.all(filePaths.map(fp => this.cleanupFile(fp)));
  }

  static async ensureDir(dirPath) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }

  static getOutputFilename(originalName, outputFormat) {
    const basename = path.basename(originalName, path.extname(originalName));
    return `${basename}.${outputFormat}`;
  }

  static async readFile(filePath) {
    return await fs.readFile(filePath);
  }

  static async writeFile(filePath, data) {
    await fs.writeFile(filePath, data);
  }
}

module.exports = FileManager;
