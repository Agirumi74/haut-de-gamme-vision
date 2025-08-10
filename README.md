# Haut de Gamme Vision - Beauty Services Platform

A professional beauty services platform with booking system and admin dashboard.

## Project info

**URL**: https://lovable.dev/projects/be365338-bf63-4260-8f6a-7ddd278fe2bc

## Technologies Used

This project is built with:

**Frontend:**
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Router
- React Hook Form

**Backend:**
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- JWT Authentication
- bcrypt for password hashing

## Development Setup

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Copy environment variables
cp .env.example .env
# Edit .env file with your configurations

# Start the development servers
npm run dev:full
```

### Development Commands

```sh
# Start frontend only
npm run dev

# Start backend only
npm run dev:backend

# Start both frontend and backend
npm run dev:full

# Build for production
npm run build:production

# Start production server
npm start
```

## Production Deployment

### Render Deployment

This project is configured for deployment on [Render](https://render.com/) with automatic build and deployment.

#### Prerequisites

Before deploying, ensure you have:
- A GitHub account with this repository
- A Render account (free tier available)
- A PostgreSQL database (Render provides free PostgreSQL databases)

#### Step-by-Step Deployment Guide

1. **Create a Render Account**
   - Go to [render.com](https://render.com) and sign up
   - Connect your GitHub account

2. **Set Up PostgreSQL Database**
   - In Render Dashboard, click "New +" → "PostgreSQL"
   - Choose a name (e.g., `makeup-neill-db`)
   - Select the free plan
   - Note down the database URL from the "Info" tab

3. **Deploy the Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `Agirumi74/haut-de-gamme-vision`
   - Choose the branch you want to deploy (usually `main`)
   - Render will automatically detect the `render.yaml` configuration

4. **Configure Environment Variables**
   - In the web service settings, go to "Environment"
   - Verify these variables are set (most are automatic from `render.yaml`):

#### Environment Variables Required

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Sets the application to production mode |
| `PORT` | `10000` | Port for the web service (auto-set by Render) |
| `RENDER` | `true` | Indicates deployment on Render platform |
| `JWT_SECRET` | *auto-generated* | Secure token for JWT authentication (auto-generated) |
| `DATABASE_URL` | *your-db-url* | PostgreSQL connection string from step 2 |

**Important:** Replace the `DATABASE_URL` in `render.yaml` with your actual PostgreSQL database URL from step 2.

#### Build Process

The deployment uses an optimized build command defined in `render.yaml`:

```bash
npm install && npx vite build && cd backend && npm install && npm run build
```

This process:
1. **Frontend Build**: `npm install && npx vite build`
   - Installs frontend dependencies
   - Builds React app to `dist/` folder at project root
   
2. **Backend Build**: `cd backend && npm install && npm run build`
   - Installs backend dependencies
   - Compiles TypeScript to `backend/dist/` folder

**Build Order is Critical:** The frontend must be built before the backend, as the backend server references the frontend's built files for static serving.

#### Application Architecture

After deployment, the server structure is:

```
/opt/render/project/src/
├── dist/                  # Frontend build (React app)
│   ├── index.html        # Main entry point
│   ├── assets/           # CSS, JS, images
│   └── ...
├── backend/
│   ├── dist/             # Backend build (Node.js)
│   │   ├── index.js      # Main server file
│   │   └── ...
│   └── src/              # Backend source
└── ...
```

The server:
- Serves the React frontend at the root URL (`/`)
- Provides API endpoints at `/api/*`
- Handles React Router fallback for SPA routing
- Serves static assets from the built frontend
- Uses enhanced path resolution for Render environment

#### Deployment Monitoring

1. **Build Logs**: Monitor the "Deploy" tab for build progress
2. **Runtime Logs**: Check "Logs" tab for application runtime
3. **Health Check**: The service uses `/api/health` endpoint for monitoring

#### Troubleshooting

**Common Issues and Solutions:**

- **Static Files Not Found**: The recent deployment fixes include enhanced path resolution. If you see "index.html not found" errors, the build process ensures proper file placement.

- **Database Connection Issues**: 
  - Verify the `DATABASE_URL` is correctly set in environment variables
  - Ensure the PostgreSQL database is running and accessible

- **Build Failures**:
  - Check that both frontend and backend dependencies install correctly
  - Verify the build command completes both frontend and backend builds

- **CORS Errors**: The backend is configured to accept requests from Render domains (`*.onrender.com`)

#### Custom Domain (Optional)

To use a custom domain:
1. In Render Dashboard, go to your web service
2. Navigate to "Settings" → "Custom Domains"
3. Add your domain and configure DNS settings as instructed

#### Deployment Verification

After deployment, verify everything works:

1. **Frontend Access**: Visit your Render URL (e.g., `https://makeup-neill.onrender.com`)
2. **API Health Check**: Test `https://your-app.onrender.com/api/health`
3. **Authentication**: Try creating an account and logging in
4. **Database Connectivity**: Verify user registration and data persistence

#### Important Notes

- **First Deploy**: Initial deployment may take 5-10 minutes
- **Cold Starts**: Free tier services sleep after 15 minutes of inactivity
- **Database**: Free PostgreSQL database expires after 90 days
- **Logs**: Monitor logs for any runtime issues in the Render dashboard

#### Alternative Deployment Options

Besides Render, you can also deploy using:

1. **Lovable**: Open [Lovable](https://lovable.dev/projects/be365338-bf63-4260-8f6a-7ddd278fe2bc) and click Share → Publish
2. **Manual Deployment**: Build with `npm run build:production` and deploy to any Node.js hosting service

## How to Edit This Code

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/be365338-bf63-4260-8f6a-7ddd278fe2bc) and start prompting.

**Use your preferred IDE**

Clone this repo and push changes. Pushed changes will also be reflected in Lovable.

**Edit directly in GitHub**

Navigate to files and click the "Edit" button to make changes directly.

**Use GitHub Codespaces**

Click "Code" -> "Codespaces" -> "New codespace" for a cloud development environment.

## Project Structure

```
├── src/                    # Frontend React application
├── backend/               # Backend API server
│   ├── src/              # TypeScript source files
│   ├── prisma/           # Database schema and migrations
│   └── dist/             # Compiled JavaScript files
├── dist/                 # Built frontend files (production)
├── public/              # Static frontend assets
├── render.yaml          # Render deployment configuration
├── package.json         # Frontend dependencies and scripts
└── .env.example        # Environment variables template
```

## Deployment Options

This application can be deployed using several methods:

### 1. Render (Recommended for Production)
Full production deployment with PostgreSQL database - see detailed [Render Deployment](#render-deployment) guide above.

### 2. Lovable Platform (Quick Testing)
Quick deployment for testing and sharing:
- Open [Lovable Project](https://lovable.dev/projects/be365338-bf63-4260-8f6a-7ddd278fe2bc)
- Click Share → Publish
- Get instant deployed URL

### 3. Manual Deployment (Custom Hosting)
For custom hosting providers:
```bash
# Build the application
npm run build:production

# Deploy the following files to your server:
# - dist/ (frontend build)
# - backend/dist/ (backend build)
# - package.json files
# - Set environment variables
# - Start with: node backend/dist/index.js
```

## Custom Domain Setup

### For Render Deployment
1. In Render Dashboard, go to your web service
2. Navigate to "Settings" → "Custom Domains"  
3. Add your domain and configure DNS settings as instructed by Render

### For Lovable Deployment
- Navigate to Project > Settings > Domains in Lovable
- Click Connect Domain
- Follow the [custom domain guide](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
