const libre = require('libreoffice-convert');
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');

const libreConvert = promisify(libre.convert);

class DocumentService {
  static async docxToPdf(inputPath, outputPath) {
    try {
      const docxBuffer = await fs.readFile(inputPath);
      const pdfBuffer = await libreConvert(docxBuffer, '.pdf', undefined);
      await fs.writeFile(outputPath, pdfBuffer);
      return outputPath;
    } catch (error) {
      throw new Error(`DOCX to PDF conversion failed: ${error.message}`);
    }
  }

  static async pdfToDocx(inputPath, outputPath) {
    try {
      const pdfBuffer = await fs.readFile(inputPath);
      const docxBuffer = await libreConvert(pdfBuffer, '.docx', undefined);
      await fs.writeFile(outputPath, docxBuffer);
      return outputPath;
    } catch (error) {
      throw new Error(`PDF to DOCX conversion failed: ${error.message}`);
    }
  }
}

module.exports = DocumentService;
