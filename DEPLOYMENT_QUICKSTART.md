# 🚀 Deploy RestToRun to Railway - Quick Start

Your app is now **ready to deploy**! Follow these simple steps:

## Step 1: Go to Railway

1. Visit: **https://railway.app**
2. Click **"Login with GitHub"** (or sign up)
3. Authorize Railway to access your GitHub

## Step 2: Create New Project

1. Click **"+ New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: **`RestToRun`** repository
4. Railway will automatically start building! ⚡

## Step 3: Add Redis Database

1. In your project, click **"+ New"**
2. Select **"Database"** → **"Redis"**
3. Done! Railway auto-configures the connection

## Step 4: Generate Domain and Configure Port ⚠️

### Generate Domain:
1. Click on your service (RestToRun, not Redis)
2. Go to **"Settings"** tab → scroll to **"Networking"**
3. Click **"Generate Domain"** under Public Networking
4. Copy your new URL: `something.up.railway.app`

### **CRITICAL: Fix Port** ⚠️
Railway may set port 3000, but the app runs on 8080:
1. In **Networking** section, find your domain
2. Click the **edit/pencil icon** (✏️)
3. **Change port from 3000 to 8080**
4. Save!

**Without this step, you'll get 502 errors!**

## Step 5: Add Environment Variables

1. In your service, click **"Variables"** tab
2. Click **"+ New Variable"** and add these:

```
NODE_ENV=production

SESSION_SECRET=<run the command below to generate>

STRAVA_CLIENT_ID=<your_strava_client_id>
STRAVA_CLIENT_SECRET=<your_strava_client_secret>
STRAVA_REDIRECT_URI=https://YOUR-DOMAIN.up.railway.app/auth/strava/callback

OURA_CLIENT_ID=<your_oura_client_id>
OURA_CLIENT_SECRET=<your_oura_client_secret>
OURA_REDIRECT_URI=https://YOUR-DOMAIN.up.railway.app/auth/oura/callback
```

**Generate SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 6: Update OAuth Apps

### Strava
1. Go to: https://www.strava.com/settings/api
2. Update **"Authorization Callback Domain"** to:
   ```
   your-app-name.up.railway.app
   ```
3. Save

### Oura
1. Go to: https://cloud.ouraring.com/oauth/applications
2. Update **"Redirect URI"** to:
   ```
   https://your-app-name.up.railway.app/auth/oura/callback
   ```
3. Save

## Step 7: Deploy! 🎉

Railway will automatically redeploy after you update variables.

1. Wait 1-2 minutes for deployment
2. Visit your domain: `https://your-app-name.up.railway.app`
3. Click **"Connect with Strava"** and **"Connect with Oura"**
4. See your data! 🏃‍♂️💤

---

## Cost

- **Railway Free Tier**: $5 credit/month
- **Estimated Usage**: ~$2-4/month (within free tier!)
- **Redis**: Free with Railway
- **Domain**: Free `.railway.app` subdomain

---

## Want a Custom Domain? (Optional)

### Buy `resttorun.com`
- **Namecheap**: ~$10/year
- **Cloudflare**: ~$10/year
- **Google Domains**: ~$12/year

### Connect to Railway
1. In Railway → **Settings** → **Domains** → **"Custom Domain"**
2. Enter: `resttorun.com`
3. Add DNS records provided by Railway to your domain registrar
4. Wait 5-60 minutes
5. Update Strava & Oura redirect URIs to use `resttorun.com`
6. Update Railway variables to use `resttorun.com`

---

## Troubleshooting

### Can't access the site?
- **502 Error?** Check port is set to 8080 (Settings → Networking → edit domain)
- Check Railway logs: Service → **"Deploy Logs"** tab
- Make sure all environment variables are set
- Verify Redis database is connected (check for REDIS_URL variable)

### OAuth errors?
- Verify redirect URIs match exactly (no trailing slashes!)
- Check that domains are correct in Strava & Oura settings

### Data not loading?
- Check browser console for errors
- Verify you completed OAuth flow for both Strava AND Oura

---

## Need More Help?

📖 **Full Guide**: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)  
🔐 **OAuth Setup**: [OAUTH_SETUP.md](./OAUTH_SETUP.md)  
📧 **Issues**: [GitHub Issues](https://github.com/dereklin23/RestToRun/issues)

---

**Your app is ready! Let's get it online! 🚀**

