const express = require('express');
const router = express.Router();
const VideoController = require('../controllers/video.controller');
const upload = require('../middleware/upload.middleware');

router.post('/to-mp4', upload.single, VideoController.convertToMp4);
router.post('/compress', upload.single, VideoController.compress);
router.post('/to-gif', upload.single, VideoController.videoToGif);

module.exports = router;
