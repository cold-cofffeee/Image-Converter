// API utility functions

const API_BASE_URL = '/api';

const api = {
  async getTools() {
    try {
      const response = await fetch(`${API_BASE_URL}/tools`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    } catch (error) {
      console.error('Failed to fetch tools:', error);
      throw error;
    }
  },

  async getToolById(toolId) {
    try {
      const response = await fetch(`${API_BASE_URL}/tools/${toolId}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    } catch (error) {
      console.error(`Failed to fetch tool ${toolId}:`, error);
      throw error;
    }
  },

  async convert(endpoint, files, options = {}) {
    try {
      const formData = new FormData();
      
      if (Array.isArray(files)) {
        files.forEach(file => formData.append('files', file));
      } else {
        formData.append('file', files);
      }

      Object.keys(options).forEach(key => {
        formData.append(key, options[key]);
      });

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Conversion failed');
      }

      return response;
    } catch (error) {
      console.error('Conversion error:', error);
      throw error;
    }
  },

  async downloadConvertedFile(response, filename) {
    try {
      const blob = await response.blob();
      const contentDisposition = response.headers.get('content-disposition');
      
      let downloadFilename = filename;
      if (contentDisposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          downloadFilename = matches[1].replace(/['"]/g, '');
        }
      }

      downloadFile(blob, downloadFilename);
      return true;
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  },

  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = api;
}
