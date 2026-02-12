// Local storage utilities

const storage = {
  KEYS: {
    RECENT_TOOLS: 'recent_tools',
    PREFERENCES: 'user_preferences'
  },

  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  addRecentTool(toolId) {
    const recentTools = this.get(this.KEYS.RECENT_TOOLS) || [];
    const filtered = recentTools.filter(id => id !== toolId);
    filtered.unshift(toolId);
    const limited = filtered.slice(0, 10);
    this.set(this.KEYS.RECENT_TOOLS, limited);
  },

  getRecentTools() {
    return this.get(this.KEYS.RECENT_TOOLS) || [];
  },

  getPreferences() {
    return this.get(this.KEYS.PREFERENCES) || {
      defaultQuality: 90,
      autoDownload: true
    };
  },

  setPreference(key, value) {
    const prefs = this.getPreferences();
    prefs[key] = value;
    this.set(this.KEYS.PREFERENCES, prefs);
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = storage;
}
