const DocumentService = require('../services/document.service');
const FileManager = require('../utils/file-manager');
const ResponseHelper = require('../utils/response');
const path = require('path');

class DocumentController {
  static async docxToPdf(req, res, next) {
    const file = req.file;

    try {
      const outputPath = path.join(__dirname, '../../uploads', `converted_${Date.now()}.pdf`);
      await DocumentService.docxToPdf(file.path, outputPath);

      ResponseHelper.sendFile(res, outputPath, 'converted.pdf', 'application/pdf');

      setTimeout(() => {
        FileManager.cleanupFiles([file.path, outputPath]);
      }, 5000);
    } catch (error) {
      await FileManager.cleanupFile(file.path);
      next(error);
    }
  }

  static async pdfToDocx(req, res, next) {
    const file = req.file;

    try {
      const outputPath = path.join(__dirname, '../../uploads', `converted_${Date.now()}.docx`);
      await DocumentService.pdfToDocx(file.path, outputPath);

      ResponseHelper.sendFile(res, outputPath, 'converted.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

      setTimeout(() => {
        FileManager.cleanupFiles([file.path, outputPath]);
      }, 5000);
    } catch (error) {
      await FileManager.cleanupFile(file.path);
      next(error);
    }
  }
}

module.exports = DocumentController;
