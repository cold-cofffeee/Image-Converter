# Use Node.js 18 on Debian (includes build tools)
FROM node:18-bullseye-slim

# Install FFmpeg, LibreOffice, and Ghostscript for full tool support
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libreoffice \
    ghostscript \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads && chmod 777 uploads

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start application
CMD ["npm", "start"]
