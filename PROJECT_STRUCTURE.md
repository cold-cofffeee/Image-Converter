# Project Structure

```
Image-Converter/
├── server/
│   ├── index.js                    # Main server entry
│   ├── config/
│   │   └── tools.config.js         # Tool definitions and configs
│   ├── routes/
│   │   ├── index.js                # Main router
│   │   ├── image.routes.js         # Image tools routes
│   │   ├── pdf.routes.js           # PDF tools routes
│   │   ├── video.routes.js         # Video tools routes
│   │   ├── audio.routes.js         # Audio tools routes
│   │   ├── document.routes.js      # Document tools routes
│   │   └── archive.routes.js       # Archive tools routes
│   ├── controllers/
│   │   ├── image.controller.js
│   │   ├── pdf.controller.js
│   │   ├── video.controller.js
│   │   ├── audio.controller.js
│   │   ├── document.controller.js
│   │   └── archive.controller.js
│   ├── services/
│   │   ├── image.service.js
│   │   ├── pdf.service.js
│   │   ├── video.service.js
│   │   ├── audio.service.js
│   │   ├── document.service.js
│   │   └── archive.service.js
│   ├── middleware/
│   │   ├── upload.middleware.js
│   │   └── error.middleware.js
│   └── utils/
│       ├── file-manager.js
│       └── response.js
│
├── public/
│   ├── index.html                  # Homepage
│   ├── tool.html                   # Generic tool page template
│   ├── assets/
│   │   ├── icons/                  # SVG icons
│   │   └── images/                 # Images
│   ├── styles/
│   │   ├── design-system.css       # CSS variables & tokens
│   │   ├── reset.css               # CSS reset
│   │   ├── layout.css              # Layout utilities
│   │   ├── components.css          # Reusable components
│   │   ├── homepage.css            # Homepage specific
│   │   ├── tool-page.css           # Tool page specific
│   │   └── animations.css          # Animations & transitions
│   ├── js/
│   │   ├── app.js                  # App initialization
│   │   ├── router.js               # Client-side routing
│   │   ├── components/
│   │   │   ├── header.js
│   │   │   ├── footer.js
│   │   │   ├── tool-card.js
│   │   │   ├── file-uploader.js
│   │   │   ├── file-list.js
│   │   │   ├── progress-bar.js
│   │   │   ├── toast.js
│   │   │   └── modal.js
│   │   ├── pages/
│   │   │   ├── homepage.js
│   │   │   └── tool-page.js
│   │   └── utils/
│   │       ├── api.js
│   │       ├── storage.js
│   │       └── helpers.js
│   └── pages/
│       └── tools/                  # Individual tool HTML pages
│           ├── png-to-jpg.html
│           ├── jpg-to-png.html
│           └── ...
│
├── package.json
├── .env
└── README.md
```
