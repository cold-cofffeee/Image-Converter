// Toast notification component

let toastId = 0;

const Toast = {
  container: null,

  init() {
    this.container = document.getElementById('toastContainer');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toastContainer';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', duration = 5000) {
    if (!this.container) this.init();

    const id = `toast-${toastId++}`;
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    const toast = document.createElement('div');
    toast.id = id;
    toast.className = `toast toast-${type} animate-slide-in-right`;
    toast.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-content">
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="Toast.close('${id}')">✕</button>
    `;

    this.container.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => this.close(id), duration);
    }

    return id;
  },

  success(message, duration) {
    return this.show(message, 'success', duration);
  },

  error(message, duration) {
    return this.show(message, 'error', duration);
  },

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  },

  info(message, duration) {
    return this.show(message, 'info', duration);
  },

  close(id) {
    const toast = document.getElementById(id);
    if (toast) {
      toast.classList.remove('animate-slide-in-right');
      toast.classList.add('animate-slide-out-right');
      setTimeout(() => toast.remove(), 200);
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Toast;
}
