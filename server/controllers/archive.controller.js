const ArchiveService = require('../services/archive.service');
const FileManager = require('../utils/file-manager');
const ResponseHelper = require('../utils/response');
const path = require('path');
const archiver = require('archiver');
const fs = require('fs');

class ArchiveController {
  static async createZip(req, res, next) {
    const uploadedFiles = req.files;

    try {
      if (!uploadedFiles || uploadedFiles.length === 0) {
        return ResponseHelper.error(res, 'At least 1 file is required');
      }

      const outputPath = path.join(__dirname, '../../uploads', `archive_${Date.now()}.zip`);
      await ArchiveService.createZip(uploadedFiles.map(f => f.path), outputPath);

      ResponseHelper.sendFile(res, outputPath, 'archive.zip', 'application/zip');

      setTimeout(() => {
        FileManager.cleanupFiles([...uploadedFiles.map(f => f.path), outputPath]);
      }, 5000);
    } catch (error) {
      await FileManager.cleanupFiles(uploadedFiles.map(f => f.path));
      next(error);
    }
  }

  static async extractZip(req, res, next) {
    const file = req.file;

    try {
      const outputDir = path.join(__dirname, '../../uploads', `extracted_${Date.now()}`);
      await ArchiveService.extractZip(file.path, outputDir);

      const files = await fs.promises.readdir(outputDir);
      const filePaths = files.map(f => path.join(outputDir, f));

      if (filePaths.length === 1) {
        const singleFile = filePaths[0];
        ResponseHelper.sendFile(res, singleFile, path.basename(singleFile), 'application/octet-stream');
      } else {
        const archive = archiver('zip', { zlib: { level: 9 } });
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename="extracted_files.zip"');

        archive.pipe(res);
        filePaths.forEach(filePath => {
          archive.file(filePath, { name: path.basename(filePath) });
        });
        archive.finalize();
      }

      setTimeout(() => {
        FileManager.cleanupFiles([file.path, ...filePaths]);
      }, 5000);
    } catch (error) {
      await FileManager.cleanupFile(file.path);
      next(error);
    }
  }
}

module.exports = ArchiveController;
