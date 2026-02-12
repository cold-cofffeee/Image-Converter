const express = require('express');
const router = express.Router();
const PDFController = require('../controllers/pdf.controller');
const upload = require('../middleware/upload.middleware');

router.post('/merge', upload.multiple, PDFController.merge);
router.post('/split', upload.single, PDFController.split);
router.post('/compress', upload.single, PDFController.compress);
router.post('/to-images', upload.single, PDFController.toImages);
router.post('/from-images', upload.multiple, PDFController.fromImages);

module.exports = router;
