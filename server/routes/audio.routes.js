const express = require('express');
const router = express.Router();
const AudioController = require('../controllers/audio.controller');
const upload = require('../middleware/upload.middleware');

router.post('/to-mp3', upload.single, AudioController.convertToMp3);
router.post('/compress', upload.single, AudioController.compress);

module.exports = router;
