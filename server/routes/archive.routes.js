const express = require('express');
const router = express.Router();
const ArchiveController = require('../controllers/archive.controller');
const upload = require('../middleware/upload.middleware');

router.post('/create', upload.multiple, ArchiveController.createZip);
router.post('/extract', upload.single, ArchiveController.extractZip);

module.exports = router;
