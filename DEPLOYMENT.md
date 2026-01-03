# Deployment Guide 🚀

This guide will help you deploy NoteX to production.

## Deployment Options

### Option 1: Full Stack on One Platform
- Render (Recommended for beginners)
- Railway
- Heroku

### Option 2: Separated Deployment
- Frontend: Vercel, Netlify
- Backend: Render, Railway, Heroku
- Database: MongoDB Atlas

## Quick Deployment (Render + MongoDB Atlas)

### Step 1: Setup MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Save this connection string for later

### Step 2: Deploy Backend to Render

1. Push your code to GitHub (if not already)
2. Go to [Render](https://render.com)
3. Sign up/Login
4. Click "New +" → "Web Service"
5. Connect your GitHub repository
6. Configure:
   - **Name**: notex-backend
   - **Region**: Choose closest to you
   - **Branch**: main
   - **Root Directory**: server
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
7. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a secure random string
   - `PORT`: 5000
8. Click "Create Web Service"
9. Wait for deployment (5-10 minutes)
10. Copy your backend URL (e.g., `https://notex-backend.onrender.com`)

### Step 3: Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "Add New" → "Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
6. Add Environment Variable (if needed):
   - `VITE_API_URL`: Your Render backend URL
7. Click "Deploy"
8. Wait for deployment (2-5 minutes)

### Step 4: Update Frontend API URL

Update all API calls in your frontend to use your backend URL:

```javascript
// In all frontend files, replace:
http://localhost:5000

// With:
https://notex-backend.onrender.com
```

Or better, use environment variables:

```javascript
// Create frontend/.env.production
VITE_API_URL=https://notex-backend.onrender.com

// Then in your code:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### Step 5: Update CORS

Update your backend CORS configuration:

```javascript
// server/index.js
app.use(cors({
    origin: ['https://your-frontend.vercel.app', 'http://localhost:5173'],
    credentials: true
}));
```

## Environment Variables Summary

### Backend (Render)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notex
JWT_SECRET=your-super-secure-random-string-here
PORT=5000
```

### Frontend (Vercel) - Optional
```
VITE_API_URL=https://notex-backend.onrender.com
```

## Alternative Deployment Options

### Option A: Railway

**Backend:**
1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables
5. Deploy

**Frontend:**
- Same as Vercel deployment above

### Option B: Netlify

**Frontend Only:**
1. Go to [Netlify](https://netlify.com)
2. Drag and drop your `frontend/dist` folder
3. Or connect to GitHub for continuous deployment

### Option C: Full Docker Deployment

Create `docker-compose.yml` in root:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/notex
      - JWT_SECRET=your-secret-key
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongo-data:
```

## Post-Deployment Checklist

- [ ] Backend is accessible at your deployed URL
- [ ] MongoDB Atlas connection is working
- [ ] Frontend can communicate with backend
- [ ] CORS is properly configured
- [ ] Environment variables are set correctly
- [ ] User registration works
- [ ] User login works
- [ ] Notes CRUD operations work
- [ ] SSL/HTTPS is enabled (automatic on Vercel/Render)

## Monitoring & Maintenance

### Render Dashboard
- Check logs for errors
- Monitor service health
- View usage metrics

### MongoDB Atlas
- Monitor database performance
- Check storage usage
- Review connection logs

### Vercel Dashboard
- View deployment logs
- Monitor bandwidth
- Check build status

## Troubleshooting

### CORS Errors
```javascript
// Backend: Update CORS origin
app.use(cors({
    origin: process.env.FRONTEND_URL || '*'
}));
```

### MongoDB Connection Timeout
- Check IP whitelist in MongoDB Atlas
- Add `0.0.0.0/0` to allow all IPs (development only)

### Environment Variables Not Working
- Restart your service after adding variables
- Check for typos in variable names
- Ensure no spaces around `=` in .env files

### Build Failures
- Check build logs in dashboard
- Ensure all dependencies are in package.json
- Verify Node version compatibility

## Custom Domain (Optional)

### Vercel
1. Go to project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Render
1. Go to service settings
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records

## Cost Estimates

### Free Tier Limits (as of 2026)
- **MongoDB Atlas**: 512MB storage, shared cluster
- **Render**: 750 hours/month, 0.1 CPU, 512MB RAM
- **Vercel**: Unlimited websites, 100GB bandwidth
- **Total**: $0/month for small projects

### Paid Tiers (if needed)
- **MongoDB Atlas**: $9+/month for dedicated cluster
- **Render**: $7+/month for upgraded instances
- **Vercel**: $20+/month for Pro features

## Security Best Practices

1. **Never commit secrets to GitHub**
   - Use `.gitignore` for `.env` files
   - Use platform environment variables

2. **Use strong JWT secrets**
   ```bash
   # Generate secure secret:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Enable HTTPS** (automatic on most platforms)

4. **Implement rate limiting**
   ```javascript
   // server/index.js
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use(limiter);
   ```

5. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```

## Continuous Deployment

Both Vercel and Render support automatic deployments:
1. Push to GitHub
2. Service automatically rebuilds and deploys
3. Changes go live in minutes

## Backup Strategy

1. **MongoDB Atlas** has automatic backups
2. **Code** is backed up on GitHub
3. **Environment variables** - Document in a secure location

## Support & Resources

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Express Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

Good luck with your deployment! 🚀
