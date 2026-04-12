# 🚀 ResumeAI — AI Resume Builder

> ₹49 માં Professional, ATS-Optimized Resume

---

## 📂 Project Structure

```
resume-builder/
├── pages/
│   ├── _app.js          → App wrapper
│   ├── index.js         → Landing page (homepage)
│   ├── builder.js       → Form + PDF upload page
│   ├── preview.js       → Resume preview + Razorpay payment
│   └── api/
│       ├── generate-resume.js  → Claude AI call (form data)
│       ├── upload-resume.js    → PDF upload + Claude AI call
│       ├── create-order.js     → Razorpay order create
│       ├── verify-payment.js   → Payment verification
│       └── download-pdf.js     → PDF generation + download
├── lib/
│   ├── claude.js        → Claude API helper + prompt
│   ├── razorpay.js      → Razorpay helper
│   └── pdf-generator.js → HTML → PDF converter
├── styles/
│   └── globals.css      → All CSS styles
├── scripts/
│   ├── deploy.sh        → VPS deployment script
│   └── nginx.conf       → Nginx configuration
├── .env.example         → Environment variables template
├── package.json         → Dependencies
└── README.md            → આ file
```

---

## 🛠️ STEP-BY-STEP DEPLOYMENT GUIDE (Gujarati)

### Step 0: પહેલા આ 3 account બનાવ

1. **Anthropic** → https://console.anthropic.com
   - Sign up → API Key generate કર → copy કર
   - Minimum $5 credits add કર

2. **Razorpay** → https://dashboard.razorpay.com
   - Sign up → KYC complete કર (PAN + Bank)
   - Settings → API Keys → Generate Key
   - Key ID અને Key Secret copy કર

3. **VPS Provider** (KVM2)
   - Ubuntu 24.04 select કર
   - Minimum 2GB RAM, 40GB SSD
   - IP address અને SSH password note કર

4. **Domain** → GoDaddy / Namecheap
   - .in domain ખરીદ (~₹500)
   - DNS માં A Record add કર: `@` → તારા VPS નો IP

---

### Step 1: VPS માં Login કર

```bash
ssh root@TARO_VPS_IP
```
(password enter કર)

---

### Step 2: Project files VPS પર upload કર

તારા computer થી (new terminal):
```bash
scp -r ./resume-builder root@TARO_VPS_IP:/root/
```

---

### Step 3: Environment variables set કર

```bash
cd /root/resume-builder
cp .env.example .env.local
nano .env.local
```

આ values ભર:
- `ANTHROPIC_API_KEY` → Anthropic થી મળેલી key
- `RAZORPAY_KEY_ID` → Razorpay key ID
- `RAZORPAY_KEY_SECRET` → Razorpay secret
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` → Same as RAZORPAY_KEY_ID
- `NEXT_PUBLIC_SITE_URL` → https://tari-domain.in

Save: `Ctrl+O` → Enter → `Ctrl+X`

---

### Step 4: Deploy script run કર

```bash
chmod +x scripts/deploy.sh
bash scripts/deploy.sh
```

આ script automatically install કરશે:
- Node.js 20
- Nginx
- Chromium (PDF માટે)
- PM2 (process manager)
- npm packages
- Build + Start

---

### Step 5: Nginx configure કર

```bash
sudo nano /etc/nginx/sites-available/resumeai
```

`scripts/nginx.conf` નો content paste કર, "yourdomain.in" ને તારા domain થી replace કર.

```bash
sudo ln -s /etc/nginx/sites-available/resumeai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### Step 6: SSL Certificate (HTTPS) setup

```bash
sudo certbot --nginx -d tari-domain.in -d www.tari-domain.in
```

Email enter કર, agree to terms, auto-redirect select કર.

---

### Step 7: Firewall setup

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

---

### Step 8: Test કર! 🎉

Browser માં open કર: `https://tari-domain.in`

---

## 🔧 USEFUL COMMANDS

```bash
# App status check
pm2 status

# Logs જોવા
pm2 logs resume-builder

# App restart
pm2 restart resume-builder

# App stop
pm2 stop resume-builder

# Code update પછી rebuild
cd /root/resume-builder
git pull
npm run build
pm2 restart resume-builder
```

---

## 💳 RAZORPAY TESTING

Live જતા પહેલા TEST mode માં test કર:

- Test Key ID: `rzp_test_` prefix હશે
- Test UPI ID: `success@razorpay` (always succeeds)
- Test Card: `4111 1111 1111 1111`, Expiry: any future, CVV: any 3 digits

Live mode માટે Razorpay Dashboard → Settings → Live mode activate કર.

---

## ⚠️ IMPORTANT NOTES

1. **Razorpay Live mode** activate કરવા KYC complete હોવી જોઈએ
2. **Claude API** credits ખતમ થાય તો site error આપશે — balance check કર
3. **PDF generation** માટે Chromium/Puppeteer ની જરૂર છે — deploy script install કરે છે
4. **Backup** — regularly `.env.local` અને database backup લે
5. **SSL** — certbot auto-renew કરે, manually check: `sudo certbot renew --dry-run`

---

## 💰 MONTHLY COSTS

| Item | Cost |
|------|------|
| VPS | ~₹700/mo |
| Domain | ~₹42/mo |
| Claude API (100 resumes) | ~₹400/mo |
| Razorpay | 2% per txn |
| **Total** | **~₹1,150/mo** |
| **Revenue (100 resumes)** | **₹4,900/mo** |
| **Profit** | **₹3,750/mo** ✅ |

---

Built with ❤️ for Indian job seekers.
