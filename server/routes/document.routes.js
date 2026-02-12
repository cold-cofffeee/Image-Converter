const express = require('express');
const router = express.Router();
const DocumentController = require('../controllers/document.controller');
const upload = require('../middleware/upload.middleware');

router.post('/docx-to-pdf', upload.single, DocumentController.docxToPdf);
router.post('/pdf-to-docx', upload.single, DocumentController.pdfToDocx);

module.exports = router;
