# Fly.io Deployment Guide for Mbabazi Closet

This guide will help you deploy your MERN stack application to Fly.io.

## Prerequisites

1. **Fly.io Account**: Sign up at [fly.io](https://fly.io)
2. **Fly CLI**: Install the Fly CLI:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```
3. **Docker**: Make sure Docker is installed on your machine

## Step 1: Login to Fly.io

```bash
fly auth login
```

## Step 2: Configure and Deploy Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a new Fly.io app:
   ```bash
   fly apps create mbabazi-closet-backend
   ```

3. Set environment variables:
   ```bash
   fly secrets set NODE_ENV=production
   fly secrets set MONGODB_URI=your_mongodb_connection_string
   fly secrets set JWT_SECRET=your_jwt_secret
   fly secrets set CLOUDINARY_CLOUD_NAME=your_cloud_name
   fly secrets set CLOUDINARY_API_KEY=your_api_key
   fly secrets set CLOUDINARY_API_SECRET=your_api_secret
   fly secrets set EMAIL_USER=your_email
   fly secrets set EMAIL_PASS=your_email_password
   fly secrets set GEMINI_API_KEY=your_gemini_key
   fly secrets set OPENAI_API_KEY=your_openai_key
   fly secrets set GROQ_API_KEY=your_groq_key
   ```

4. Deploy the backend:
   ```bash
   fly deploy
   ```

## Step 3: Configure and Deploy Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Create a new Fly.io app:
   ```bash
   fly apps create mbabazi-closet
   ```

3. Update the nginx.conf to point to your backend URL:
   - Replace `http://mbabazi-closet-backend:5000` with your actual backend URL (e.g., `https://mbabazi-closet-backend.fly.dev`)

4. Deploy the frontend:
   ```bash
   fly deploy
   ```

## Step 4: Configure Internal Networking

To allow the frontend to communicate with the backend:

```bash
fly ips allocate-v4 --app mbabazi-closet-backend
fly ips allocate-v6 --app mbabazi-closet-backend
```

## Step 5: Verify Deployment

1. Check the backend status:
   ```bash
   fly status -a mbabazi-closet-backend
   ```

2. Check the frontend status:
   ```bash
   fly status -a mbabazi-closet
   ```

3. View logs:
   ```bash
   fly logs -a mbabazi-closet-backend
   fly logs -a mbabazi-closet
   ```

## Troubleshooting

### SSL Certificate Issues
Fly.io provides free SSL certificates. If you encounter SSL errors:
1. Wait a few minutes for the certificate to provision
2. Check your app's status at `https://fly.io/apps/<app-name>`

### Connection Issues
If the frontend can't reach the backend:
1. Make sure both apps are in the same organization
2. Check the internal port configuration in fly.toml
3. Verify the proxy configuration in nginx.conf

### MongoDB Connection
Use MongoDB Atlas or another cloud provider. Set the connection string as a secret:
```bash
fly secrets set MONGODB_URI=mongodb+srv://...
```

## Useful Commands

- `fly dashboard` - Open Fly.io dashboard
- `fly scale show` - Show current scaling info
- `fly scale memory 512` - Scale memory to 512MB
- `fly redeploy` - Redeploy the app
- `fly ssh console` - SSH into the container

## Cost

Fly.io offers:
- 3 shared VMs for free
- 160GB outbound bandwidth for free
- SSL certificates included

This should be sufficient for a small to medium-sized application.
