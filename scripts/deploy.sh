#!/bin/bash
# ============================================
# ResumeAI - VPS Deployment Script
# KVM2 Ubuntu 24.04 માટે
# ============================================
# Usage: bash deploy.sh
# ============================================

set -e

echo "🚀 ResumeAI Deployment Starting..."
echo "=================================="

# ===== 1. System Update =====
echo "📦 Step 1: System update..."
sudo apt update && sudo apt upgrade -y

# ===== 2. Install Node.js 20 =====
echo "📦 Step 2: Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# ===== 3. Install essential packages =====
echo "📦 Step 3: Installing packages..."
sudo apt install -y nginx certbot python3-certbot-nginx git

# ===== 4. Install Chromium for Puppeteer =====
echo "📦 Step 4: Installing Chromium (for PDF generation)..."
sudo apt install -y chromium-browser
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# ===== 5. Install PM2 =====
echo "📦 Step 5: Installing PM2..."
sudo npm install -g pm2

# ===== 6. Setup project =====
echo "📦 Step 6: Setting up project..."
cd /home/$USER
if [ -d "resume-builder" ]; then
  cd resume-builder
  git pull || true
else
  echo "⚠️  Project folder not found. Copy your project files to /home/$USER/resume-builder/"
  echo "    Use: scp -r ./resume-builder user@your-vps-ip:/home/user/"
  exit 1
fi

# ===== 7. Install dependencies =====
echo "📦 Step 7: Installing npm packages..."
npm install

# ===== 8. Setup environment =====
if [ ! -f ".env.local" ]; then
  echo "⚠️  .env.local file not found!"
  echo "    Copy .env.example to .env.local and fill in your keys:"
  echo "    cp .env.example .env.local"
  echo "    nano .env.local"
  exit 1
fi

# ===== 9. Build Next.js =====
echo "📦 Step 8: Building project..."
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm run build

# ===== 10. Start with PM2 =====
echo "📦 Step 9: Starting with PM2..."
pm2 delete resume-builder 2>/dev/null || true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser pm2 start npm --name "resume-builder" -- start
pm2 save
pm2 startup

echo ""
echo "✅ App running on port 3000!"
echo ""
echo "=================================="
echo "NEXT STEPS:"
echo "=================================="
echo ""
echo "1. Setup Nginx (copy nginx config below)"
echo "2. Setup SSL: sudo certbot --nginx -d yourdomain.in"
echo "3. Setup Firewall:"
echo "   sudo ufw allow 22,80,443/tcp"
echo "   sudo ufw enable"
echo ""
echo "🎉 Done! Your site will be live after Nginx + SSL setup."
