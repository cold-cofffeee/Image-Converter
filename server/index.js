const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/index');
const errorHandler = require('./middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/tools/:toolId', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/tool.html'));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Conversion Platform running on http://localhost:${PORT}`);
  console.log(`📁 API Docs: http://localhost:${PORT}/api/tools`);
});

module.exports = app;
