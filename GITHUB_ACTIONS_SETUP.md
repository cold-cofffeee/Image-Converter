# GitHub Actions Keep-Alive Setup

## ✅ Workflow Created

The GitHub Actions workflow will ping your Render app **every 14 minutes** to keep it awake.

## 🔧 Setup Instructions

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add GitHub Actions keep-alive workflow"
git push
```

### Step 2: Deploy to Render
Deploy your app on Render and get your URL (e.g., `https://converthub.onrender.com`)

### Step 3: Add GitHub Secret
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add secret:
   - **Name:** `RENDER_APP_URL`
   - **Value:** `https://your-app-name.onrender.com` (no trailing slash)
5. Click **Add secret**

### Step 4: Enable Workflow
1. Go to **Actions** tab in your repository
2. Click on "Keep Render App Alive" workflow
3. Click **Enable workflow** (if needed)
4. Optional: Click **Run workflow** to test immediately

## 🎯 How It Works

- ✅ Pings every **14 minutes** (before 15-min sleep timeout)
- ✅ Checks `/api/health` endpoint
- ✅ Monitors HTTP status codes
- ✅ Runs 24/7 automatically
- ✅ Uses ~2000 minutes/month (within GitHub free tier: 2000 min/month)

## 📊 Monitoring

View workflow runs:
1. Go to **Actions** tab
2. Click "Keep Render App Alive"
3. See all ping logs and status

## 🐛 Troubleshooting

### Workflow not running?
- Check if you added `RENDER_APP_URL` secret
- Ensure workflow is enabled in Actions tab
- Check GitHub Actions quota (Settings → Billing)

### Getting 404 errors?
- Verify `RENDER_APP_URL` is correct (no `/` at end)
- Make sure Render app is deployed

### Want to change frequency?
Edit `.github/workflows/keep-alive.yml`:
```yaml
- cron: '*/14 * * * *'  # Every 14 minutes
# or
- cron: '*/10 * * * *'  # Every 10 minutes (uses more Actions minutes)
```

## 📈 Cost Analysis

**GitHub Actions Free Tier:**
- 2000 minutes/month free
- Each ping takes ~10 seconds
- 14-min interval = ~3000 pings/month = ~500 minutes/month
- **Well within free limits!** ✅

**Render Free Tier:**
- 750 hours/month
- With keep-alive = ~720 hours (always on)
- **Perfectly fine!** ✅

## 🎉 You're All Set!

Your app will stay awake 24/7 automatically once you:
1. ✅ Push code with workflow
2. ✅ Add `RENDER_APP_URL` secret
3. ✅ First workflow run triggers

**No monitoring dashboards needed - GitHub Actions handles everything!**
