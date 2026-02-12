// Tool card component

const ToolCard = {
  create(tool) {
    const card = document.createElement('a');
    card.href = `/tools/${tool.id}`;
    card.className = 'tool-card stagger-item';
    card.innerHTML = `
      <div class="tool-card-icon">${this.getIcon(tool.icon)}</div>
      <h3 class="tool-card-title">${tool.name}</h3>
      <p class="tool-card-description">${tool.description}</p>
    `;
    
    card.addEventListener('click', (e) => {
      e.preventDefault();
      this.navigateToTool(tool.id);
    });

    return card;
  },

  getIcon(iconName) {
    const icons = {
      convert: '🔄',
      resize: '↔️',
      crop: '✂️',
      compress: '🗜️',
      rotate: '↻',
      file: '📄',
      image: '🖼️',
      video: '🎬',
      music: '🎵',
      merge: '📎',
      split: '✂️',
      extract: '📂',
      archive: '📦'
    };
    return icons[iconName] || '📄';
  },

  navigateToTool(toolId) {
    storage.addRecentTool(toolId);
    window.location.href = `/tools/${toolId}`;
  },

  renderGrid(tools, container) {
    container.innerHTML = '';
    tools.forEach(tool => {
      container.appendChild(this.create(tool));
    });
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ToolCard;
}
