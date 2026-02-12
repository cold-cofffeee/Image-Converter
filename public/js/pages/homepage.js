// Homepage JavaScript

const Homepage = {
  tools: [],

  async init() {
    try {
      this.tools = await api.getTools();
      this.renderToolCategories();
      this.renderFooterLinks();
      this.setupQuickUpload();
    } catch (error) {
      Toast.error('Failed to load tools. Please refresh the page.');
      console.error(error);
    }
  },

  renderToolCategories() {
    const container = document.getElementById('toolsContainer');
    if (!container) return;

    container.innerHTML = '';

    this.tools.forEach(category => {
      const section = document.createElement('div');
      section.className = 'category-section';
      section.innerHTML = `
        <div class="category-header">
          <div class="category-icon">${this.getCategoryIcon(category.icon)}</div>
          <div class="category-info">
            <h2 class="category-name">${category.name}</h2>
            <p class="category-description">${category.description}</p>
          </div>
        </div>
        <div class="category-tools" id="category-${category.id}"></div>
      `;

      container.appendChild(section);

      const toolsContainer = section.querySelector(`#category-${category.id}`);
      ToolCard.renderGrid(category.tools, toolsContainer);
    });
  },

  renderFooterLinks() {
    const imageCategory = this.tools.find(c => c.id === 'image');
    const pdfCategory = this.tools.find(c => c.id === 'pdf');
    const videoCategory = this.tools.find(c => c.id === 'video');
    const audioCategory = this.tools.find(c => c.id === 'audio');
    const documentCategory = this.tools.find(c => c.id === 'document');
    const archiveCategory = this.tools.find(c => c.id === 'archive');

    if (imageCategory) {
      this.renderFooterCategory('footerImageTools', imageCategory.tools);
    }

    if (pdfCategory) {
      this.renderFooterCategory('footerPdfTools', pdfCategory.tools);
    }

    const mediaTools = [...(videoCategory?.tools || []), ...(audioCategory?.tools || [])];
    if (mediaTools.length > 0) {
      this.renderFooterCategory('footerMediaTools', mediaTools);
    }

    const docTools = [...(documentCategory?.tools || []), ...(archiveCategory?.tools || [])];
    if (docTools.length > 0) {
      this.renderFooterCategory('footerDocTools', docTools);
    }
  },

  renderFooterCategory(containerId, tools) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    tools.slice(0, 6).forEach(tool => {
      const link = document.createElement('a');
      link.href = `/tools/${tool.id}`;
      link.className = 'footer-link';
      link.textContent = tool.name;
      container.appendChild(link);
    });
  },

  setupQuickUpload() {
    const uploadZone = document.getElementById('quickUploadZone');
    const fileInput = document.getElementById('quickFileInput');

    if (!uploadZone || !fileInput) return;

    uploadZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        this.handleQuickUpload(files);
      }
    });

    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handleQuickUpload(files);
      }
    });
  },

  handleQuickUpload(files) {
    const firstFile = files[0];
    const ext = getFileExtension(firstFile.name).toLowerCase();

    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'avif', 'heif'];
    const pdfExts = ['pdf'];
    const videoExts = ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv'];
    const audioExts = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'];

    let toolId = null;

    if (imageExts.includes(ext)) {
      toolId = 'png-to-jpg';
    } else if (pdfExts.includes(ext)) {
      toolId = 'compress-pdf';
    } else if (videoExts.includes(ext)) {
      toolId = 'video-compress';
    } else if (audioExts.includes(ext)) {
      toolId = 'audio-compress';
    }

    if (toolId) {
      storage.set('pending_files', Array.from(files).map(f => ({ name: f.name, size: f.size })));
      window.location.href = `/tools/${toolId}`;
    } else {
      Toast.info('Please select a tool for this file type');
      const toolsSection = document.getElementById('tools');
      if (toolsSection) {
        toolsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },

  getCategoryIcon(iconName) {
    const icons = {
      image: '🖼️',
      video: '🎬',
      music: '🎵',
      'file-text': '📄',
      archive: '📦'
    };
    return icons[iconName] || '📄';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Homepage.init();
});
