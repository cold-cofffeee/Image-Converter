// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewSection = document.getElementById('previewSection');
const filesList = document.getElementById('filesList');
const fileCount = document.getElementById('fileCount');
const removeBtn = document.getElementById('removeBtn');
const conversionSection = document.getElementById('conversionSection');
const formatSelect = document.getElementById('formatSelect');
const qualitySection = document.getElementById('qualitySection');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const convertBtn = document.getElementById('convertBtn');
const progressSection = document.getElementById('progressSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const successSection = document.getElementById('successSection');
const convertAnotherBtn = document.getElementById('convertAnotherBtn');

let selectedFiles = [];

// Initialize app
async function init() {
    await loadFormats();
    setupEventListeners();
}

// Load supported formats from API
async function loadFormats() {
    try {
        const response = await fetch('/api/formats');
        const data = await response.json();
        
        data.formats.forEach(format => {
            const option = document.createElement('option');
            option.value = format;
            option.textContent = format.toUpperCase();
            formatSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading formats:', error);
        showError('Failed to load supported formats');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Upload area click
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    });

    // Remove button
    removeBtn.addEventListener('click', resetApp);

    // Format select change
    formatSelect.addEventListener('change', handleFormatChange);

    // Quality slider
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value;
    });

    // Convert button
    convertBtn.addEventListener('click', handleConversion);

    // Convert another button
    convertAnotherBtn.addEventListener('click', resetApp);
}

// Handle file selection
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    handleFiles(files);
}

// Handle files
function handleFiles(files) {
    // Filter only image files
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
        showError('Please select valid image files');
        return;
    }

    // Check file sizes (100MB max per file)
    const oversizedFiles = imageFiles.filter(file => file.size > 100 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
        showError(`Some files exceed 100MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
        return;
    }

    // Add to selected files (avoiding duplicates)
    imageFiles.forEach(file => {
        const exists = selectedFiles.some(f => f.name === file.name && f.size === file.size);
        if (!exists) {
            selectedFiles.push(file);
        }
    });

    displayFiles();
}

// Display files list
function displayFiles() {
    if (selectedFiles.length === 0) {
        uploadArea.style.display = 'block';
        previewSection.style.display = 'none';
        conversionSection.style.display = 'none';
        return;
    }

    filesList.innerHTML = '';
    fileCount.textContent = selectedFiles.length;

    selectedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        // Create thumbnail
        const thumbnail = document.createElement('img');
        thumbnail.className = 'file-thumbnail';
        
        const reader = new FileReader();
        reader.onload = (e) => {
            thumbnail.src = e.target.result;
            
            // Get image dimensions
            const img = new Image();
            img.onload = () => {
                const meta = fileItem.querySelector('.file-meta');
                if (meta) {
                    meta.textContent = `${(file.size / (1024 * 1024)).toFixed(2)} MB • ${img.width} × ${img.height} px`;
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);

        // File details
        const details = document.createElement('div');
        details.className = 'file-details';
        
        const name = document.createElement('div');
        name.className = 'file-name';
        name.textContent = file.name;
        
        const meta = document.createElement('div');
        meta.className = 'file-meta';
        meta.textContent = `${(file.size / (1024 * 1024)).toFixed(2)} MB • Loading...`;
        
        details.appendChild(name);
        details.appendChild(meta);

        // Remove button
        const removeButton = document.createElement('button');
        removeButton.className = 'file-remove';
        removeButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;
        removeButton.onclick = () => removeFile(index);

        fileItem.appendChild(thumbnail);
        fileItem.appendChild(details);
        fileItem.appendChild(removeButton);
        
        filesList.appendChild(fileItem);
    });

    // Show sections
    uploadArea.style.display = 'none';
    previewSection.style.display = 'block';
    conversionSection.style.display = 'block';
}

// Remove individual file
function removeFile(index) {
    selectedFiles.splice(index, 1);
    displayFiles();
}

// Handle format change
function handleFormatChange() {
    const format = formatSelect.value.toLowerCase();
    
    // Show quality slider for formats that support it
    const qualityFormats = ['jpeg', 'jpg', 'webp', 'avif', 'heif', 'tiff'];
    if (qualityFormats.includes(format)) {
        qualitySection.style.display = 'block';
    } else {
        qualitySection.style.display = 'none';
    }
    
    // Enable convert button if format is selected
    convertBtn.disabled = !format;
}

// Handle conversion
async function handleConversion() {
    if (selectedFiles.length === 0 || !formatSelect.value) {
        showError('Please select files and output format');
        return;
    }

    // Prepare form data
    const formData = new FormData();
    selectedFiles.forEach(file => {
        formData.append('images', file);
    });
    formData.append('format', formatSelect.value);
    formData.append('quality', qualitySlider.value);

    // Show progress
    conversionSection.style.display = 'none';
    progressSection.style.display = 'block';
    
    if (selectedFiles.length === 1) {
        progressText.textContent = 'Converting your image...';
    } else {
        progressText.textContent = `Converting ${selectedFiles.length} images...`;
    }

    try {
        const response = await fetch('/api/convert', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Conversion failed');
        }

        // Get the converted file(s) as blob
        const blob = await response.blob();
        
        // Extract filename from Content-Disposition header
        const contentDisposition = response.headers.get('Content-Disposition');
        const contentType = response.headers.get('Content-Type');
        
        let filename;
        if (contentType === 'application/zip') {
            filename = 'converted_images.zip';
        } else {
            filename = 'converted_image.' + formatSelect.value;
        }
        
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (filenameMatch) {
                filename = filenameMatch[1];
            }
        }

        // Create download link and trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Show success
        progressSection.style.display = 'none';
        successSection.style.display = 'block';

        // Update success message
        const successMessage = successSection.querySelector('p');
        if (selectedFiles.length === 1) {
            successMessage.textContent = 'Your image has been converted successfully';
        } else {
            successMessage.textContent = `${selectedFiles.length} images converted and downloaded as ZIP`;
        }

    } catch (error) {
        console.error('Conversion error:', error);
        progressSection.style.display = 'none';
        conversionSection.style.display = 'block';
        showError(error.message || 'Failed to convert images');
    }
}

// Reset app
function resetApp() {
    selectedFiles = [];
    fileInput.value = '';
    formatSelect.value = '';
    qualitySlider.value = 90;
    qualityValue.textContent = '90';
    
    uploadArea.style.display = 'block';
    previewSection.style.display = 'none';
    conversionSection.style.display = 'none';
    progressSection.style.display = 'none';
    successSection.style.display = 'none';
    qualitySection.style.display = 'none';
}

// Show error
function showError(message) {
    alert('Error: ' + message);
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
