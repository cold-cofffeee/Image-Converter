const express = require('express');
const router = express.Router();
const ImageController = require('../controllers/image.controller');
const upload = require('../middleware/upload.middleware');

router.post('/convert', upload.multiple, ImageController.convert);
router.post('/resize', upload.single, ImageController.resize);
router.post('/crop', upload.single, ImageController.crop);
router.post('/compress', upload.single, ImageController.compress);
router.post('/rotate', upload.single, ImageController.rotate);
router.post('/to-pdf', upload.multiple, ImageController.imageToPdf);

module.exports = router;
