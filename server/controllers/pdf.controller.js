const PDFService = require('../services/pdf.service');
const FileManager = require('../utils/file-manager');
const ResponseHelper = require('../utils/response');
const path = require('path');
const archiver = require('archiver');
const fs = require('fs');

class PDFController {
  static async merge(req, res, next) {
    const uploadedFiles = req.files;

    try {
      if (!uploadedFiles || uploadedFiles.length < 2) {
        return ResponseHelper.error(res, 'At least 2 PDF files are required');
      }

      const outputPath = path.join(__dirname, '../../uploads', `merged_${Date.now()}.pdf`);
      await PDFService.mergePdfs(uploadedFiles.map(f => f.path), outputPath);

      ResponseHelper.sendFile(res, outputPath, 'merged.pdf', 'application/pdf');

      setTimeout(() => {
        FileManager.cleanupFiles([...uploadedFiles.map(f => f.path), outputPath]);
      }, 5000);
    } catch (error) {
      await FileManager.cleanupFiles(uploadedFiles.map(f => f.path));
      next(error);
    }
  }

  static async split(req, res, next) {
    const file = req.file;
    const { pageRanges } = req.body;

    try {
      if (!pageRanges) {
        return ResponseHelper.error(res, 'Page ranges are required');
      }

      const ranges = JSON.parse(pageRanges);
      const outputDir = path.join(__dirname, '../../uploads', `split_${Date.now()}`);
      await FileManager.ensureDir(outputDir);

      const outputPaths = await PDFService.splitPdf(file.path, ranges, outputDir);

      if (outputPaths.length === 1) {
        ResponseHelper.sendFile(res, outputPaths[0], 'split.pdf', 'application/pdf');
      } else {
        const archive = archiver('zip', { zlib: { level: 9 } });
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename="split_pdfs.zip"');

        archive.pipe(res);
        outputPaths.forEach(filePath => {
          archive.file(filePath, { name: path.basename(filePath) });
        });
        archive.finalize();
      }

      setTimeout(() => {
        FileManager.cleanupFiles([file.path, ...outputPaths]);
      }, 5000);
    } catch (error) {
      await FileManager.cleanupFile(file.path);
      next(error);
    }
  }

  static async compress(req, res, next) {
    const file = req.file;

    try {
      const outputPath = path.join(__dirname, '../../uploads', `compressed_${Date.now()}.pdf`);
      await PDFService.compressPdf(file.path, outputPath);

      ResponseHelper.sendFile(res, outputPath, 'compressed.pdf', 'application/pdf');

      setTimeout(() => {
        FileManager.cleanupFiles([file.path, outputPath]);
      }, 5000);
    } catch (error) {
      await FileManager.cleanupFile(file.path);
      next(error);
    }
  }

  static async toImages(req, res, next) {
    const file = req.file;
    const { format = 'jpg', quality = 80 } = req.body;

    try {
      const outputDir = path.join(__dirname, '../../uploads', `pdf_to_images_${Date.now()}`);
      await FileManager.ensureDir(outputDir);

      const outputPaths = await PDFService.pdfToImages(file.path, outputDir, format, quality);

      const archive = archiver('zip', { zlib: { level: 9 } });
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="pdf_images.zip"');

      archive.pipe(res);
      outputPaths.forEach(filePath => {
        archive.file(filePath, { name: path.basename(filePath) });
      });
      archive.finalize();

      setTimeout(() => {
        FileManager.cleanupFiles([file.path, ...outputPaths]);
      }, 5000);
    } catch (error) {
      await FileManager.cleanupFile(file.path);
      next(error);
    }
  }

  static async fromImages(req, res, next) {
    const uploadedFiles = req.files;

    try {
      if (!uploadedFiles || uploadedFiles.length === 0) {
        return ResponseHelper.error(res, 'At least 1 image file is required');
      }

      const outputPath = path.join(__dirname, '../../uploads', `images_to_pdf_${Date.now()}.pdf`);
      await PDFService.imagesToPdf(uploadedFiles.map(f => f.path), outputPath);

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

module.exports = PDFController;
