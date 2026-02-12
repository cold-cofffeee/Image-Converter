// File uploader component

class FileUploader {
  constructor(zoneElement, inputElement, options = {}) {
    this.zone = zoneElement;
    this.input = inputElement;
    this.options = {
      multiple: true,
      accept: '*',
      maxSize: 100 * 1024 * 1024, // 100MB
      onFilesSelected: () => {},
      ...options
    };
    this.files = [];
    this.init();
  }

  init() {
    this.zone.addEventListener('click', () => this.input.click());
    this.input.addEventListener('change', (e) => this.handleFileSelect(e.target.files));
    
    this.zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.zone.classList.add('dragover');
    });

    this.zone.addEventListener('dragleave', () => {
      this.zone.classList.remove('dragover');
    });

    this.zone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.zone.classList.remove('dragover');
      this.handleFileSelect(e.dataTransfer.files);
    });

    if (this.options.accept !== '*') {
      this.input.setAttribute('accept', this.options.accept);
    }

    if (this.options.multiple) {
      this.input.setAttribute('multiple', 'multiple');
    }
  }

  handleFileSelect(fileList) {
    const filesArray = Array.from(fileList);
    const validFiles = [];
    const errors = [];

    filesArray.forEach(file => {
      if (file.size > this.options.maxSize) {
        errors.push(`${file.name} exceeds maximum size of ${formatFileSize(this.options.maxSize)}`);
        return;
      }

      if (this.options.accept !== '*' && !this.validateFileType(file)) {
        errors.push(`${file.name} is not a supported file type`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      errors.forEach(error => Toast.error(error));
    }

    if (validFiles.length > 0) {
      this.files = validFiles;
      this.options.onFilesSelected(validFiles);
    }
  }

  validateFileType(file) {
    if (this.options.accept === '*') return true;
    const ext = getFileExtension(file.name);
    const acceptedTypes = this.options.accept.split(',').map(t => t.trim());
    return acceptedTypes.some(type => {
      if (type.startsWith('.')) return ext === type.substring(1);
      if (type.endsWith('/*')) return file.type.startsWith(type.replace('/*', ''));
      return file.type === type;
    });
  }

  getFiles() {
    return this.files;
  }

  clear() {
    this.files = [];
    this.input.value = '';
  }

  reset() {
    this.clear();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FileUploader;
}
