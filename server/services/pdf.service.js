const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const { fromPath } = require('pdf2pic');

class PDFService {
  static async mergePdfs(pdfPaths, outputPath) {
    const mergedPdf = await PDFDocument.create();

    for (const pdfPath of pdfPaths) {
      const pdfBytes = await fs.readFile(pdfPath);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    await fs.writeFile(outputPath, mergedPdfBytes);
    return outputPath;
  }

  static async splitPdf(pdfPath, pageRanges, outputDir) {
    const pdfBytes = await fs.readFile(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const outputPaths = [];

    for (let i = 0; i < pageRanges.length; i++) {
      const newPdf = await PDFDocument.create();
      const { start, end } = pageRanges[i];
      
      for (let pageNum = start - 1; pageNum < end; pageNum++) {
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNum]);
        newPdf.addPage(copiedPage);
      }

      const outputPath = path.join(outputDir, `split_${i + 1}.pdf`);
      const newPdfBytes = await newPdf.save();
      await fs.writeFile(outputPath, newPdfBytes);
      outputPaths.push(outputPath);
    }

    return outputPaths;
  }

  static async compressPdf(pdfPath, outputPath) {
    const pdfBytes = await fs.readFile(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 50
    });

    await fs.writeFile(outputPath, compressedPdfBytes);
    return outputPath;
  }

  static async pdfToImages(pdfPath, outputDir, format = 'jpg', quality = 80) {
    const basename = path.basename(pdfPath, '.pdf');
    const outputPaths = [];

    const options = {
      density: 300,
      saveFilename: basename,
      savePath: outputDir,
      format: format,
      width: 2000,
      height: 2000
    };

    const converter = fromPath(pdfPath, options);
    const pdfBytes = await fs.readFile(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pageCount = pdfDoc.getPageCount();

    for (let i = 1; i <= pageCount; i++) {
      const result = await converter(i, { responseType: 'image' });
      outputPaths.push(result.path);
    }

    return outputPaths;
  }

  static async imagesToPdf(imagePaths, outputPath) {
    const pdfDoc = await PDFDocument.create();

    for (const imagePath of imagePaths) {
      const imageBytes = await fs.readFile(imagePath);
      const ext = path.extname(imagePath).toLowerCase();

      let image;
      if (ext === '.jpg' || ext === '.jpeg') {
        image = await pdfDoc.embedJpg(imageBytes);
      } else if (ext === '.png') {
        image = await pdfDoc.embedPng(imageBytes);
      } else {
        const convertedBuffer = await sharp(imagePath).jpeg().toBuffer();
        image = await pdfDoc.embedJpg(convertedBuffer);
      }

      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height
      });
    }

    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);
    return outputPath;
  }
}

module.exports = PDFService;
