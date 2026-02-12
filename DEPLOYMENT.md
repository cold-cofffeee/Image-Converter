# 🚀 Render.com Deployment Guide

## Quick Deploy (5 Minutes)

### Step 1: Prepare Your Repository
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ConvertHub"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/converthub.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

1. **Go to Render Dashboard**
   - Visit https://render.com
   - Sign up/Login with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `converthub` repository

3. **Configure Service** (Auto-detected from render.yaml)
   - Name: `converthub` (or your choice)
   - Region: Oregon (or closest to you)
   - Branch: `main`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: **Free**

4. **Use Docker (Recommended for Full Features)**
   - In "Environment" dropdown, select: **Docker**
   - This enables FFmpeg, LibreOffice, Ghostscript automatically
   - Dockerfile is already configured!

5. **Click "Create Web Service"**

### Step 3: Wait for Deployment
- Takes 2-5 minutes
- Watch build logs
- Success: You'll get a URL like: `https://converthub.onrender.com`

---

## 🎯 What Works Out of the Box

### ✅ With Node.js Deployment (Default)
- All Image Tools (Sharp works natively)
- PDF Tools (pdf-lib works natively)
- Archive Tools (ZIP/unzip)

### ✅ With Docker Deployment (Use Dockerfile)
- **Everything!** All 28 tools
- FFmpeg for video/audio
- LibreOffice for documents
- Ghostscript for PDF to images

---

## ⚙️ Configuration Options

### Custom Domain
1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records as shown

### Environment Variables (if needed)
```
NODE_ENV=production
PORT=3000
MAX_FILE_SIZE=104857600
```

Add in Render dashboard: Settings → Environment

### Scale Up (if needed)
Free tier limits:
- 750 hours/month
- Auto-sleeps after 15 min inactivity
- Takes 30-60s to wake up

Upgrade to paid ($7/month) for:
- No sleep
- Faster instance
- More memory

---

## 🐛 Troubleshooting

### Build Fails
**Check logs for specific errors:**
- Missing dependencies: Run `npm install` locally first
- Node version: Ensure 16+ (specified in package.json)

### FFmpeg Not Found
**Solution:** Use Docker deployment
- Settings → Environment → Select "Docker"
- Redeploy

### LibreOffice Not Found
**Solution:** Use Docker deployment
- Dockerfile includes LibreOffice installation

### 502 Bad Gateway on First Request
**Normal behavior on free tier:**
- Service sleeps after inactivity
- First request wakes it up (30-60s)
- Subsequent requests are fast

### Large File Uploads Fail
**Check file size limits:**
- Current limit: 100MB per file
- Render free tier: Network timeout after 5 minutes
- For larger files: Upgrade plan or reduce limits

---

## 📊 Monitoring

### Health Check
Your app includes health endpoint:
```
https://your-app.onrender.com/api/health
```

Render automatically monitors this endpoint.

### Logs
View real-time logs in Render dashboard:
- Dashboard → Your Service → Logs
- Shows all console.log outputs
- Errors appear in red

### Metrics
Free tier includes:
- Request count
- Response times
- Memory usage
- CPU usage

---

## 🔒 Security Best Practices

### 1. Add Rate Limiting
Consider adding express-rate-limit for production:
```bash
npm install express-rate-limit
```

### 2. File Upload Security
Already configured:
- File type validation
- Size limits (100MB)
- Automatic cleanup

### 3. CORS Configuration
Update if needed in `server/index.js`:
```javascript
app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true
}));
```

---

## 💰 Cost Estimates

### Free Tier
- **Cost:** $0
- **Hours:** 750/month
- **Instance:** Shared
- **Sleep:** After 15 min inactivity

Perfect for:
- Development
- Testing
- Low traffic apps

### Starter ($7/month)
- **Always On:** No sleep
- **Faster:** Dedicated resources
- **Better:** For production use

---

## 🚀 Going Live Checklist

- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] Docker environment selected (for full features)
- [ ] Build successful
- [ ] Health check passing
- [ ] Tested image conversion
- [ ] Tested multiple file upload
- [ ] Tested video/audio (if using Docker)
- [ ] Custom domain configured (optional)
- [ ] Monitoring enabled

---

## 📈 Post-Deployment

### Test Your Deployment
```bash
# Health check
curl https://your-app.onrender.com/api/health

# Get tools list
curl https://your-app.onrender.com/api/tools

# Test image conversion
curl -X POST https://your-app.onrender.com/api/image/convert \
  -F "files=@test.png" \
  -F "format=jpg" \
  --output converted.jpg
```

### Update Your App
1. Push changes to GitHub
2. Render auto-deploys (if enabled)
3. Or manually deploy from dashboard

---

## 🎉 You're Live!

Your conversion platform is now available at:
**https://your-app-name.onrender.com**

Share it, use it, and scale as needed!

---

## Need Help?

- **Render Docs:** https://render.com/docs
- **Support:** https://render.com/support
- **Community:** https://community.render.com
