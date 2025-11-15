# BAMS Deployment Guide - Free Hosting Platforms

This guide covers deploying your BAMS system on various free hosting platforms. Choose the option that best fits your needs.

## Table of Contents

1. [Vercel (Recommended for Node.js)](#vercel-recommended)
2. [Railway (Free + Simple)](#railway)
3. [Render (More Resources)](#render)
4. [Heroku Alternative - Heroku](#heroku)
5. [Replit](#replit)
6. [AWS EC2 Free Tier](#aws-ec2-free-tier)
7. [Comparison Table](#comparison-table)
8. [Common Issues & Fixes](#common-issues--fixes)

---

## ⭐ VERCEL (Recommended)

**Best for**: Full-stack Node.js applications
**Cost**: Free tier includes unlimited deployments
**Storage**: Limited to ephemeral (data resets on redeploy)
**Limits**: 5GB storage per month, automatic sleep after inactivity

### Step 1: Prepare Project for Vercel

Create a `vercel.json` file in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/index.html"
    }
  ]
}
```

### Step 2: Update Package.json for Vercel

Modify your `package.json`:

```json
{
  "name": "bams-assignment-website-blockchain",
  "version": "1.0.0",
  "description": "Blockchain-Based Attendance Management System",
  "main": "backend/index.js",
  "scripts": {
    "start": "node backend/index.js",
    "dev": "nodemon backend/index.js",
    "build": "echo 'Build complete'"
  },
  "engines": {
    "node": "18.x"
  },
  "dependencies": {
    "body-parser": "^2.2.0",
    "cors": "^2.8.5",
    "express": "^5.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.11"
  }
}
```

### Step 3: Modify Backend for Vercel

Update `backend/index.js` to use environment variables:

```javascript
const PORT = process.env.PORT || 3000;

// ... rest of code ...

// For Vercel serverless environment
if (process.env.VERCEL) {
    module.exports = app;
} else {
    const server = app.listen(PORT, () => {
        console.log(`[SERVER] Listening on port ${PORT}`);
    });
}
```

### Step 4: Create GitHub Repository

```bash
cd d:\Blockchain\BAMS-Assignment-Website-Blockchain

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - BAMS system ready for deployment"

# Create repo on GitHub and push
git remote add origin https://github.com/yourusername/BAMS-Assignment-Website-Blockchain.git
git branch -M main
git push -u origin main
```

### Step 5: Deploy to Vercel

1. Go to https://vercel.com
2. Click **"New Project"**
3. Select **"Import Git Repository"**
4. Paste your GitHub repo URL and click **Import**
5. Configure project:
   - **Framework**: Other (Node.js)
   - **Root Directory**: ./
   - Keep default build settings
6. Click **Deploy**

**Wait 2-5 minutes** for deployment to complete.

### Access Your App

```
https://your-project-name.vercel.app
```

### ⚠️ Important - Data Persistence Issue

**Problem**: Vercel uses ephemeral storage. Your JSON data files will be lost on each redeploy.

**Solutions**:

#### Option A: Use Vercel KV (Free Tier)
1. Create `.kv` database from Vercel dashboard
2. Install client: `npm install @vercel/kv`
3. Modify `fileService.js` to use KV instead of JSON files

#### Option B: Use PostgreSQL (Free)
Integrate with Railway or Supabase PostgreSQL

#### Option C: Accept Data Reset
For development/demo purposes, data resets are acceptable

---

## 🚂 RAILWAY (Free + Simple)

**Best for**: Simple deployments with some free tier
**Cost**: $5/month free credit (lasts ~2-3 months)
**Storage**: Persistent filesystem
**Limits**: 5GB storage, 512MB RAM

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Click **Sign Up**
3. Choose **GitHub** authentication
4. Authorize Railway

### Step 2: Deploy from GitHub

1. Click **Create Project**
2. Select **Deploy from GitHub Repo**
3. Select your BAMS repository
4. Railway auto-detects Node.js environment

### Step 3: Configure Environment

1. In Railway dashboard, go to **Variables**
2. Add:
   ```
   NODE_ENV=production
   PORT=3000
   ```

### Step 4: Wait for Deployment

Railway automatically builds and deploys. Takes 3-5 minutes.

### Access Your App

```
https://your-railway-app.railway.app
```

### Advantages
✅ Persistent storage (data survives redeploys)
✅ Easy GitHub integration
✅ Good free tier
✅ Simple interface

### Disadvantages
❌ Limited free credit ($5)
❌ Will eventually require payment

---

## 🎨 RENDER

**Best for**: Full-featured free hosting
**Cost**: Free tier with limited resources
**Storage**: Persistent filesystem
**Limits**: 0.5 GB RAM, 1 GB storage

### Step 1: Connect GitHub

1. Go to https://render.com
2. Click **Sign Up**
3. Use GitHub authentication
4. Authorize Render

### Step 2: Create New Service

1. Dashboard → **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: bams-system
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Set Environment Variables

1. Go to **Environment**
2. Add:
   ```
   NODE_ENV=production
   ```

### Step 4: Deploy

Click **Create Web Service**. Deployment takes 5-10 minutes.

### Access Your App

```
https://bams-system.onrender.com
```

### Notes
- Free tier apps spin down after 15 minutes of inactivity
- Can take 30 seconds to wake up on first request
- Good for low-traffic sites

---

## 🎪 HEROKU (Now Paid, But Still Options)

**Cost**: Now entirely paid (was free until Nov 2022)
**Alternative**: Use Railway or Render instead

---

## 🔗 REPLIT

**Best for**: Quick development/demo
**Cost**: Free tier available
**Storage**: Persistent
**Limits**: Limited resources

### Step 1: Import from GitHub

1. Go to https://replit.com
2. Click **Create** → **Import from GitHub**
3. Paste your repo URL
4. Click **Import**

### Step 2: Configure

Replit auto-detects Node.js project structure

### Step 3: Run

Click the **Run** button. Replit will start your server automatically.

### Access Your App

Replit provides a URL in the webview panel.

### Advantages
✅ No deployment steps needed
✅ Built-in editor and terminal
✅ Easy to share with link
✅ Good for learning

### Disadvantages
❌ Limited performance
❌ Resource restrictions
❌ Can be slow under load

---

## ☁️ AWS EC2 FREE TIER

**Best for**: Learning AWS, persistent hosting
**Cost**: Free for 12 months (1 t2.micro instance)
**Storage**: 30GB EBS storage included
**After 12 months**: Becomes paid (~$8-10/month)

### Step 1: Create AWS Account

1. Go to https://aws.amazon.com
2. Click **Create AWS Account**
3. Complete signup with payment method

### Step 2: Launch EC2 Instance

1. Go to **EC2 Dashboard**
2. Click **Launch Instance**
3. Choose **Ubuntu Server 22.04 LTS** (Free Tier eligible)
4. Instance Type: **t2.micro** (Free Tier eligible)
5. Configure:
   - **Storage**: 30 GB (free tier includes this)
   - **Security Group**: Add rule for HTTP (port 80) and HTTPS (port 443)
6. Click **Launch**

### Step 3: Connect to Instance

1. Download `.pem` key file
2. Open terminal and navigate to key location
3. Connect via SSH:
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

### Step 4: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

### Step 5: Clone and Deploy

```bash
# Clone your repository
git clone https://github.com/yourusername/BAMS-Assignment-Website-Blockchain.git
cd BAMS-Assignment-Website-Blockchain

# Install dependencies
npm install

# Start with PM2
pm2 start backend/index.js --name "bams"
pm2 startup
pm2 save
```

### Step 6: Set Up Reverse Proxy (Nginx)

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/default
```

Replace content with:

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save and restart Nginx:

```bash
sudo systemctl restart nginx
```

### Step 7: Access Your App

```
http://your-instance-ip-address
```

### Get Domain Name (Optional)

1. Buy a domain from Route 53, GoDaddy, or Namecheap
2. Point to your EC2 instance IP
3. Set up SSL with Let's Encrypt:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Advantages of EC2
✅ Persistent storage
✅ Always-on instance
✅ Full control over environment
✅ Free for 12 months
✅ Can host multiple apps
✅ Scalable as you grow

### Disadvantages
❌ Requires some Linux knowledge
❌ Manual server management
❌ Security configuration needed
❌ Becomes paid after 12 months

---

## Comparison Table

| Platform | Cost | Storage | Always On | Setup | Performance | Best For |
|----------|------|---------|-----------|-------|-------------|----------|
| **Vercel** | Free | Ephemeral | No | Easy | Fast | Frontend + API |
| **Railway** | $5 credit | Persistent | Yes | Easy | Good | Quick deploy |
| **Render** | Free | Persistent | No (sleeps) | Easy | Moderate | Hobby projects |
| **Replit** | Free | Persistent | No | Very Easy | Low | Development/Demo |
| **AWS EC2** | Free 12mo | 30GB | Yes | Hard | Excellent | Full-featured apps |

---

## Common Issues & Fixes

### Issue 1: "Port Already in Use"

**Error**: `Error: listen EADDRINUSE :::3000`

**Solution**: 
- Use environment variable: `PORT=8080 npm start`
- Or kill process: `lsof -ti:3000 | xargs kill -9`

---

### Issue 2: "Module Not Found"

**Error**: `Cannot find module 'express'`

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

---

### Issue 3: "CORS Error in Browser"

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**: Already configured in your `backend/index.js`:
```javascript
app.use(cors());
```

If still having issues, verify CORS headers:
```javascript
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
```

---

### Issue 4: "Data Loss After Redeploy"

**Problem**: JSON files reset on Vercel/Render

**Solutions**:

A) **Use Database**:
```javascript
// Instead of JSON file
// Use MongoDB (Atlas free), PostgreSQL (Railway/Supabase), or Vercel KV
```

B) **Accept Ephemeral Storage** (for demo):
```javascript
// Document that data is reset on redeploy
// Good for demos and testing
```

C) **Use Volume Storage**:
- Railway/Render have persistent storage
- EC2 has persistent EBS

---

### Issue 5: "App Sleeps and Slows Down"

**Problem**: Render free tier apps spin down after 15 min inactivity

**Solution A**: Use paid tier or Railway
**Solution B**: Use uptime monitor to keep app awake:
```bash
# Free service: https://uptime.robot.com
# Set to ping your app every 5 minutes
```

---

### Issue 6: "Can't Access App After Deploy"

**Steps to Debug**:

1. Check deployment logs:
   ```bash
   # Vercel: View in dashboard
   # Railway: Railway dashboard → Deployments
   # Render: Render dashboard → Logs
   ```

2. Check build command ran successfully

3. Verify PORT environment variable is set

4. Check if port is exposed in configuration

5. Try local test first:
   ```bash
   npm install
   npm start
   curl http://localhost:3000
   ```

---

### Issue 7: "Static Files Not Serving"

**Problem**: Frontend files return 404

**Solution**: Ensure `frontend/` folder exists and has `index.html`

Verify in deployment:
```javascript
app.use(express.static(path.join(__dirname, '..', 'frontend')));
```

---

### Issue 8: "Large File Upload Fails"

**Error**: `413 Payload Too Large`

**Solution**: Increase limit in `backend/index.js`:
```javascript
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
```

---

## Quick Deployment Checklist

Before deploying, verify:

- [ ] `npm install` works locally
- [ ] `npm start` works locally
- [ ] No hardcoded localhost URLs in frontend
- [ ] Backend listens on `process.env.PORT` or 3000
- [ ] CORS is enabled if frontend and backend are separate domains
- [ ] All dependencies in `package.json`
- [ ] No sensitive keys in code (use environment variables)
- [ ] GitHub repository created and pushed
- [ ] Static files (frontend) in correct directory

---

## Recommended Deployment Path

### For Development/Testing
```
1. Start with Replit (fastest, no setup)
2. Test all features
3. Move to Railway or Render when ready
```

### For Production (12 months free)
```
1. Use AWS EC2 Free Tier
2. Set up Nginx reverse proxy
3. Get domain name
4. Add SSL certificate
5. Monitor with PM2
```

### For Long-term (After 12 months)
```
Option A: Continue with Railway ($5-20/month)
Option B: Use DigitalOcean ($5/month - not free but cheap)
Option C: Continue EC2 (~$8-10/month)
Option D: Optimize and use Vercel + external database
```

---

## Environment Variables by Platform

### Vercel
Dashboard → Settings → Environment Variables

### Railway
Dashboard → Variables tab

### Render
Dashboard → Environment tab

### AWS EC2
Create `.env` file:
```bash
NODE_ENV=production
PORT=3000
```

Load in code:
```javascript
require('dotenv').config();
const port = process.env.PORT;
```

---

## Monitoring & Logs

### Vercel
- Dashboard → Deployments → Click deployment → Logs tab

### Railway
- Railway dashboard → Recent Deployments → Click build

### Render
- Dashboard → Service → Logs tab

### AWS EC2
```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ip

# View PM2 logs
pm2 logs bams

# View system logs
tail -f /var/log/syslog
```

---

## Final Notes

✅ **Best Overall Free Option**: Railway (easy + persistent storage)

✅ **Best Long-term Free**: AWS EC2 (12 months free, then cheap)

✅ **Best for Quick Demo**: Replit (instant deploy)

✅ **Best for Production**: AWS EC2 with domain + SSL

**Happy deploying!** 🚀
