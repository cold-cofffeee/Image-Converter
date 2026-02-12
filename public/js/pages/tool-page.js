// Tool page JavaScript

const ToolPage = {
  toolId: null,
  toolConfig: null,
  uploader: null,
  fileListComponent: null,
  progressBar: null,
  selectedFiles: [],

  async init() {
    this.toolId = parseToolId();
    if (!this.toolId) {
      Toast.error('Invalid tool');
      window.location.href = '/';
      return;
    }

    try {
      this.toolConfig = await api.getToolById(this.toolId);
      this.renderToolHeader();
      this.setupUploader();
      this.setupFileList();
      this.setupOptions();
      this.setupEventListeners();
      this.loadRelatedTools();
    } catch (error) {
      Toast.error('Failed to load tool. Please try again.');
      console.error(error);
    }
  },

  renderToolHeader() {
    document.getElementById('toolTitle').textContent = this.toolConfig.name;
    document.getElementById('toolDescription').textContent = this.toolConfig.description;
    document.getElementById('toolIcon').textContent = ToolCard.getIcon(this.toolConfig.icon);
    document.title = `${this.toolConfig.name} - ConvertHub`;

    const acceptFormats = this.toolConfig.inputFormats.map(f => `.${f}`).join(',');
    document.getElementById('uploadHint').textContent = 
      `Supported formats: ${this.toolConfig.inputFormats.join(', ').toUpperCase()}`;
  },

  setupUploader() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    
    const accept = this.toolConfig.inputFormats[0] === '*' 
      ? '*' 
      : this.toolConfig.inputFormats.map(f => `.${f}`).join(',');

    this.uploader = new FileUploader(uploadZone, fileInput, {
      accept: accept,
      multiple: this.toolConfig.multipleFiles !== false,
      onFilesSelected: (files) => this.handleFilesSelected(files)
    });
  },

  setupFileList() {
    const filesList = document.getElementById('filesList');
    this.fileListComponent = new FileList(filesList);
    this.fileListComponent.setOnFilesChanged((files) => {
      this.selectedFiles = files;
      this.updateUIState();
    });
  },

  setupOptions() {
    const optionsGrid = document.getElementById('optionsGrid');
    optionsGrid.innerHTML = '';

    if (this.toolConfig.outputFormat) {
      const formatGroup = document.createElement('div');
      formatGroup.className = 'option-group';
      formatGroup.innerHTML = `
        <label class="option-label">Output Format</label>
        <select class="select" id="outputFormat">
          <option value="${this.toolConfig.outputFormat}">${this.toolConfig.outputFormat.toUpperCase()}</option>
        </select>
      `;
      optionsGrid.appendChild(formatGroup);
    }

    if (this.toolConfig.hasQuality) {
      const qualityGroup = document.createElement('div');
      qualityGroup.className = 'option-group';
      qualityGroup.innerHTML = `
        <label class="option-label">Quality: <span id="qualityValue">80</span>%</label>
        <input type="range" class="input" id="quality" min="1" max="100" value="80">
      `;
      optionsGrid.appendChild(qualityGroup);

      const qualitySlider = document.getElementById('quality');
      const qualityValue = document.getElementById('qualityValue');
      qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value;
      });
    }

    if (this.toolConfig.hasWidth || this.toolConfig.hasHeight) {
      if (this.toolConfig.hasWidth) {
        const widthGroup = document.createElement('div');
        widthGroup.className = 'option-group';
        widthGroup.innerHTML = `
          <label class="option-label">Width (px)</label>
          <input type="number" class="input" id="width" placeholder="800" min="1">
        `;
        optionsGrid.appendChild(widthGroup);
      }

      if (this.toolConfig.hasHeight) {
        const heightGroup = document.createElement('div');
        heightGroup.className = 'option-group';
        heightGroup.innerHTML = `
          <label class="option-label">Height (px)</label>
          <input type="number" class="input" id="height" placeholder="600" min="1">
        `;
        optionsGrid.appendChild(heightGroup);
      }
    }

    if (this.toolConfig.hasRotation) {
      const rotationGroup = document.createElement('div');
      rotationGroup.className = 'option-group';
      rotationGroup.innerHTML = `
        <label class="option-label">Rotation Angle</label>
        <select class="select" id="angle">
          <option value="90">90° Clockwise</option>
          <option value="180">180°</option>
          <option value="270">270° Clockwise</option>
          <option value="-90">90° Counter-clockwise</option>
        </select>
      `;
      optionsGrid.appendChild(rotationGroup);
    }

    if (this.toolConfig.hasCompression) {
      const compressionGroup = document.createElement('div');
      compressionGroup.className = 'option-group';
      compressionGroup.innerHTML = `
        <label class="option-label">Compression Level</label>
        <select class="select" id="compressionLevel">
          <option value="low">Low (Best Quality)</option>
          <option value="medium" selected>Medium</option>
          <option value="high">High (Smallest Size)</option>
        </select>
      `;
      optionsGrid.appendChild(compressionGroup);
    }
  },

  setupEventListeners() {
    document.getElementById('convertBtn').addEventListener('click', () => this.convert());
    document.getElementById('clearBtn').addEventListener('click', () => this.clear());
    document.getElementById('convertAnotherBtn').addEventListener('click', () => this.reset());
    
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        if (this.convertedBlob) {
          downloadFile(this.convertedBlob, this.convertedFilename || 'converted');
        }
      });
    }
  },

  handleFilesSelected(files) {
    this.selectedFiles = files;
    this.fileListComponent.render(files);
    this.updateUIState();
  },

  updateUIState() {
    const hasFiles = this.selectedFiles.length > 0;
    
    document.getElementById('filesListContainer').classList.toggle('hidden', !hasFiles);
    document.getElementById('optionsSection').classList.toggle('hidden', !hasFiles);
    document.getElementById('uploadSection').classList.toggle('hidden', false);
    document.getElementById('progressSection').classList.add('hidden');
    document.getElementById('resultSection').classList.add('hidden');
  },

  getOptions() {
    const options = {};

    if (this.toolConfig.outputFormat) {
      options.format = this.toolConfig.outputFormat;
    }

    const quality = document.getElementById('quality');
    if (quality) {
      options.quality = quality.value;
    }

    const width = document.getElementById('width');
    if (width && width.value) {
      options.width = width.value;
    }

    const height = document.getElementById('height');
    if (height && height.value) {
      options.height = height.value;
    }

    const angle = document.getElementById('angle');
    if (angle) {
      options.angle = angle.value;
    }

    const compressionLevel = document.getElementById('compressionLevel');
    if (compressionLevel) {
      options.compressionLevel = compressionLevel.value;
    }

    return options;
  },

  async convert() {
    if (this.selectedFiles.length === 0) {
      Toast.warning('Please select files first');
      return;
    }

    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('optionsSection').classList.add('hidden');
    document.getElementById('progressSection').classList.remove('hidden');

    const progressBar = document.getElementById('progressBar');
    const progressStatus = document.getElementById('progressStatus');
    this.progressBar = new ProgressBar(progressBar, progressStatus);

    try {
      this.progressBar.start('Uploading files...');
      
      const options = this.getOptions();
      const response = await api.convert(
        this.toolConfig.endpoint,
        this.selectedFiles,
        options
      );

      this.progressBar.update(90, 'Processing...');

      const blob = await response.blob();
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'converted';
      
      if (contentDisposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      this.convertedBlob = blob;
      this.convertedFilename = filename;

      this.progressBar.complete('Conversion complete!');

      setTimeout(() => {
        document.getElementById('progressSection').classList.add('hidden');
        document.getElementById('resultSection').classList.remove('hidden');
        
        downloadFile(blob, filename);
        Toast.success('Files converted successfully!');
      }, 500);

    } catch (error) {
      console.error('Conversion error:', error);
      Toast.error(error.message || 'Conversion failed. Please try again.');
      this.reset();
    }
  },

  clear() {
    this.selectedFiles = [];
    this.uploader.clear();
    this.fileListComponent.clear();
    this.updateUIState();
  },

  reset() {
    this.clear();
    this.convertedBlob = null;
    this.convertedFilename = null;
    document.getElementById('uploadSection').classList.remove('hidden');
    document.getElementById('optionsSection').classList.add('hidden');
    document.getElementById('progressSection').classList.add('hidden');
    document.getElementById('resultSection').classList.add('hidden');
  },

  async loadRelatedTools() {
    try {
      const allTools = await api.getTools();
      const currentCategory = this.toolConfig.category;
      const categoryData = allTools.find(c => c.id === currentCategory);
      
      if (categoryData) {
        const relatedTools = categoryData.tools
          .filter(t => t.id !== this.toolId)
          .slice(0, 4);
        
        const container = document.getElementById('relatedTools');
        if (container && relatedTools.length > 0) {
          ToolCard.renderGrid(relatedTools, container);
        }
      }
    } catch (error) {
      console.error('Failed to load related tools:', error);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ToolPage.init();
});
