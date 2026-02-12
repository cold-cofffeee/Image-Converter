// Main app initialization

const App = {
  init() {
    Toast.init();
    this.checkHealth();
  },

  async checkHealth() {
    try {
      const isHealthy = await api.healthCheck();
      if (!isHealthy) {
        console.warn('API health check failed');
      }
    } catch (error) {
      console.error('Health check error:', error);
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
