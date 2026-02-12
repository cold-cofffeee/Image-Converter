# Architecture Overview - ConvertHub

## System Architecture

### High-Level Architecture
```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │ HTTP/HTTPS
       │
┌──────▼──────────────────────────────────┐
│         Express.js Server               │
│  ┌──────────────────────────────────┐  │
│  │     Middleware Layer              │  │
│  │  - CORS                           │  │
│  │  - Body Parser                    │  │
│  │  - Multer (File Upload)           │  │
│  │  - Error Handler                  │  │
│  └──────────┬───────────────────────┘  │
│             │                           │
│  ┌──────────▼───────────────────────┐  │
│  │     Routes Layer                  │  │
│  │  - /api/image                     │  │
│  │  - /api/pdf                       │  │
│  │  - /api/video                     │  │
│  │  - /api/audio                     │  │
│  │  - /api/document                  │  │
│  │  - /api/archive                   │  │
│  └──────────┬───────────────────────┘  │
│             │                           │
│  ┌──────────▼───────────────────────┐  │
│  │   Controllers Layer               │  │
│  │  - Request validation             │  │
│  │  - Response formatting            │  │
│  │  - Error handling                 │  │
│  └──────────┬───────────────────────┘  │
│             │                           │
│  ┌──────────▼───────────────────────┐  │
│  │    Services Layer                 │  │
│  │  - Business logic                 │  │
│  │  - File processing                │  │
│  │  - Format conversion              │  │
│  └──────────┬───────────────────────┘  │
│             │                           │
│  ┌──────────▼───────────────────────┐  │
│  │   External Libraries              │  │
│  │  - Sharp (Images)                 │  │
│  │  - FFmpeg (Video/Audio)           │  │
│  │  - pdf-lib (PDFs)                 │  │
│  │  - LibreOffice (Documents)        │  │
│  │  - Archiver (Archives)            │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Request Flow

### Typical Conversion Request
```
1. User uploads file(s) via drag-drop or browse
   ↓
2. FileUploader component validates files
   ↓
3. User configures options (format, quality, etc.)
   ↓
4. User clicks "Convert"
   ↓
5. Frontend sends POST to /api/{category}/{tool}
   ↓
6. Multer middleware handles file upload to temp storage
   ↓
7. Router directs to appropriate controller
   ↓
8. Controller validates request and calls service
   ↓
9. Service processes file(s) using external library
   ↓
10. Service returns converted file path(s)
    ↓
11. Controller sends file(s) as response
    ↓
12. Frontend receives file and triggers download
    ↓
13. Server cleans up temp files after delay
```

## Frontend Architecture

### Component Structure
```
App
├── Header
│   ├── Logo
│   └── Navigation
│
├── Pages
│   ├── Homepage
│   │   ├── Hero Section
│   │   ├── Quick Upload
│   │   ├── Tool Categories
│   │   │   └── Tool Cards
│   │   ├── Features Section
│   │   └── Footer
│   │
│   └── Tool Page
│       ├── Tool Header
│       ├── Upload Section
│       │   ├── Upload Zone
│       │   └── File List
│       ├── Options Section
│       ├── Progress Section
│       └── Result Section
│
└── Global Components
    ├── Toast Notifications
    ├── Modal
    └── Loader
```

### State Management
- No framework required
- Local component state
- LocalStorage for persistence
- Event-driven updates

### Data Flow
```
User Action → Component Handler → API Call → Update UI → Toast Feedback
```

## Backend Architecture

### Layered Architecture

#### **1. Routes Layer**
- Define API endpoints
- Map routes to controllers
- Apply middleware

#### **2. Controllers Layer**
- Handle HTTP requests
- Validate input
- Call services
- Format responses
- Handle errors

#### **3. Services Layer**
- Business logic
- File processing
- Format conversion
- Library integration

#### **4. Middleware Layer**
- File upload handling (Multer)
- Error catching
- CORS handling

#### **5. Utils Layer**
- File management
- Response helpers
- Common utilities

### Directory Structure Logic

```
server/
├── index.js              # Express app setup
├── config/               # Configuration files
│   └── tools.config.js   # Tool definitions
├── routes/               # API route definitions
│   ├── index.js          # Main router
│   └── *.routes.js       # Category-specific routes
├── controllers/          # Request handlers
│   └── *.controller.js   # Category-specific controllers
├── services/             # Business logic
│   └── *.service.js      # Processing services
├── middleware/           # Express middleware
│   ├── upload.middleware.js
│   └── error.middleware.js
└── utils/                # Utilities
    ├── file-manager.js
    └── response.js
```

## Tool Configuration System

### Centralized Configuration
All tools are defined in `server/config/tools.config.js`:

```javascript
{
  id: 'tool-id',
  name: 'Tool Name',
  description: 'Tool description',
  endpoint: '/api/category/tool',
  inputFormats: ['ext1', 'ext2'],
  outputFormat: 'ext3',
  hasQuality: true,
  hasWidth: false,
  hasHeight: false,
  multipleFiles: true,
  icon: 'icon-name'
}
```

### Benefits
- Single source of truth
- Easy to add new tools
- Frontend dynamically renders based on config
- Backend validates based on config

## File Handling

### Upload Flow
1. File uploaded via Multer to `/uploads` directory
2. Unique filename generated: `{fieldname}-{timestamp}-{random}.{ext}`
3. File processed by service
4. Converted file saved to new path
5. Original and converted files cleaned up after response

### Cleanup Strategy
- Automatic cleanup after 5-10 seconds
- Prevents disk space issues
- Handles errors gracefully

### File Size Management
- Max size: 100MB per file
- Max files: 50 per request
- Configurable in middleware

## API Design

### RESTful Principles
- Resource-based URLs
- HTTP methods (POST for conversions)
- JSON responses
- Proper status codes

### Response Format
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

Error format:
```json
{
  "success": false,
  "error": "Error message"
}
```

### File Responses
- Single file: Direct file download
- Multiple files: ZIP archive
- Proper Content-Type headers
- Content-Disposition headers

## Design System

### CSS Architecture
```
reset.css          → Remove browser defaults
design-system.css  → CSS variables, tokens
layout.css         → Grid, flex utilities
components.css     → Reusable components
animations.css     → Transitions, keyframes
homepage.css       → Homepage specific
tool-page.css      → Tool page specific
```

### CSS Variables
- Colors
- Typography
- Spacing
- Shadows
- Border radius
- Transitions
- Z-index

### Benefits
- Consistent design
- Easy theming
- Maintainable
- No CSS-in-JS overhead

## Performance Optimization

### Backend
- Stream processing for large files
- Async/await patterns
- Efficient library usage
- File cleanup

### Frontend
- Minimal JavaScript
- No framework overhead
- Lazy loading via dynamic imports
- Optimized assets

## Security Measures

1. **File Type Validation**
   - Client-side: File extension check
   - Server-side: MIME type validation

2. **File Size Limits**
   - Configured in Multer middleware
   - Prevents DoS attacks

3. **Input Sanitization**
   - All inputs validated
   - No direct shell commands

4. **CORS Configuration**
   - Restrictive CORS policy
   - Configurable origins

5. **Error Handling**
   - No sensitive info in errors
   - Proper logging

## Scalability Considerations

### Current Architecture
- Single server
- Local file storage
- Synchronous processing

### Scaling Options

**Horizontal Scaling:**
- Multiple server instances
- Load balancer
- Shared file storage (S3, NFS)
- Session management

**Vertical Scaling:**
- Increase RAM/CPU
- Optimize processing
- Use worker threads

**Advanced:**
- Queue system (Bull, RabbitMQ)
- Background job processing
- Microservices architecture
- CDN for static assets

## Development Workflow

### Adding New Tool

1. **Define in config** (`tools.config.js`)
2. **Create service** (`services/{category}.service.js`)
3. **Create controller** (`controllers/{category}.controller.js`)
4. **Add route** (`routes/{category}.routes.js`)
5. **Test endpoint**
6. **Frontend automatically renders**

### Testing Strategy
- Manual endpoint testing
- Browser testing
- Different file types
- Error scenarios
- Edge cases

## Deployment Architecture

### Production Setup
```
Internet
    ↓
Nginx (Reverse Proxy + SSL)
    ↓
Node.js App (PM2)
    ↓
File System (Uploads)
```

### Recommended Stack
- **Web Server**: Nginx
- **Process Manager**: PM2
- **SSL**: Let's Encrypt
- **Monitoring**: PM2 Plus, Datadog
- **Logging**: Winston, Morgan

## Technology Stack

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Image Processing**: Sharp
- **Video/Audio**: FFmpeg via fluent-ffmpeg
- **PDF**: pdf-lib, pdfkit, pdf2pic
- **Documents**: libreoffice-convert
- **Archives**: archiver, unzipper
- **File Upload**: Multer

### Frontend
- **Vanilla JavaScript** (No framework)
- **HTML5** (Semantic markup)
- **CSS3** (Modern features, variables)

### Advantages
- Simple deployment
- Low overhead
- Easy to understand
- Highly customizable
- Framework-independent
