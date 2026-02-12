// File list component

class FileList {
  constructor(container) {
    this.container = container;
    this.files = [];
  }

  render(files) {
    this.files = files;
    this.container.innerHTML = '';

    if (files.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📂</div>
          <h3 class="empty-state-title">No files selected</h3>
          <p class="empty-state-description">Upload files to get started</p>
        </div>
      `;
      return;
    }

    files.forEach((file, index) => {
      const item = this.createFileItem(file, index);
      this.container.appendChild(item);
    });
  }

  createFileItem(file, index) {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.setAttribute('data-index', index);

    item.innerHTML = `
      <div class="file-item-icon">${getFileIcon(file.name)}</div>
      <div class="file-item-info">
        <div class="file-item-name">${file.name}</div>
        <div class="file-item-meta">${formatFileSize(file.size)}</div>
      </div>
      <button class="file-item-remove" data-index="${index}">
        ✕
      </button>
    `;

    const removeBtn = item.querySelector('.file-item-remove');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.removeFile(index);
    });

    return item;
  }

  removeFile(index) {
    this.files.splice(index, 1);
    this.render(this.files);
    
    if (this.onFilesChanged) {
      this.onFilesChanged(this.files);
    }
  }

  getFiles() {
    return this.files;
  }

  clear() {
    this.files = [];
    this.render([]);
  }

  setOnFilesChanged(callback) {
    this.onFilesChanged = callback;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FileList;
}
