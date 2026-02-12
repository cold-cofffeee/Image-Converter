// Helper utility functions

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
};

const getFileIcon = (filename) => {
  const ext = getFileExtension(filename);
  const iconMap = {
    jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', webp: '🖼️',
    pdf: '📄',
    mp4: '🎬', avi: '🎬', mov: '🎬',
    mp3: '🎵', wav: '🎵', flac: '🎵',
    zip: '📦', rar: '📦',
    doc: '📝', docx: '📝', txt: '📝'
  };
  return iconMap[ext] || '📄';
};

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

const validateFileType = (file, allowedTypes) => {
  const ext = getFileExtension(file.name);
  return allowedTypes.includes('*') || allowedTypes.includes(ext);
};

const parseToolId = () => {
  const pathParts = window.location.pathname.split('/');
  return pathParts[pathParts.length - 1] || null;
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatFileSize,
    getFileExtension,
    getFileIcon,
    debounce,
    slugify,
    generateId,
    downloadFile,
    validateFileType,
    parseToolId
  };
}
