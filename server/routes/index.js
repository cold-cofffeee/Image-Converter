const express = require('express');
const router = express.Router();
const toolsConfig = require('../config/tools.config');

const imageRoutes = require('./image.routes');
const pdfRoutes = require('./pdf.routes');
const videoRoutes = require('./video.routes');
const audioRoutes = require('./audio.routes');
const documentRoutes = require('./document.routes');
const archiveRoutes = require('./archive.routes');

router.use('/image', imageRoutes);
router.use('/pdf', pdfRoutes);
router.use('/video', videoRoutes);
router.use('/audio', audioRoutes);
router.use('/document', documentRoutes);
router.use('/archive', archiveRoutes);

router.get('/tools', (req, res) => {
  res.json({
    success: true,
    data: toolsConfig.categories
  });
});

router.get('/tools/:toolId', (req, res) => {
  const tool = toolsConfig.getToolById(req.params.toolId);
  if (tool) {
    res.json({ success: true, data: tool });
  } else {
    res.status(404).json({ success: false, error: 'Tool not found' });
  }
});

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Conversion API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
