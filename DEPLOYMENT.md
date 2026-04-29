# Deployment Guide

## Backend Deployment (Heroku/Railway)

1. **Prepare for Deployment**
```bash
# Create Procfile
echo "web: node server.js" > Procfile

# Create .gitignore
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
```

2. **Deploy to Heroku**
```bash
heroku create mbabazi-closet-api
heroku config:set MONGODB_URI=your_mongodb_connection
heroku config:set JWT_SECRET=your_secret_key
git push heroku main
```

3. **Deploy to Railway**
- Connect GitHub repository
- Add environment variables in Railway dashboard
- Auto-deploys on git push

## Frontend Deployment (Vercel)

1. **Build the app**
```bash
cd frontend
npm run build
```

2. **Deploy to Vercel**
```bash
npm i -g vercel
vercel
```

3. **Configure Environment**
- Set `REACT_APP_API_URL` to your backend URL
- Example: `https://mbabazi-closet-api.railway.app/api`

## Database Setup (MongoDB Atlas)

1. Create account at mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Add to `.env` in backend

## Payment Gateway Integration

### MTN MoMo
1. Register at MTN Developer Portal
2. Get API keys
3. Add to `.env`:
   - MTN_MOMO_API_KEY
   - MTN_MOMO_SECRET

### Airtel
1. Register at Airtel Developer Portal
2. Get API keys
3. Add to `.env`:
   - AIRTEL_API_KEY
   - AIRTEL_SECRET

## Custom Domain Setup

1. Buy domain (namecheap, godaddy, etc.)
2. Point DNS to Vercel/Heroku
3. Add domain in deployment platform settings
