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

This project is configured for deployment on [Render](https://render.com/).

#### Automatic Deployment

The project includes a `render.yaml` file for automatic deployment:

1. Connect your GitHub repository to Render
2. The deployment will automatically use the configuration in `render.yaml`
3. Set up the required environment variables in Render dashboard

#### Environment Variables Required

- `NODE_ENV`: production
- `PORT`: 10000 (automatically set by Render)
- `JWT_SECRET`: A secure random string for JWT token signing
- `DATABASE_URL`: PostgreSQL connection string

#### Build Process

1. `npm install` - Install dependencies
2. `npm run build:production` - Build both frontend and backend
3. `node backend/dist/index.js` - Start the production server

The server will:
- Serve the React frontend at the root URL
- Provide API endpoints at `/api/*`
- Handle React Router fallback for SPA routing
- Serve static assets from the built frontend

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

## Deployment

You can deploy this project using:

1. **Lovable**: Open [Lovable](https://lovable.dev/projects/be365338-bf63-4260-8f6a-7ddd278fe2bc) and click Share -> Publish
2. **Render**: Use the included `render.yaml` configuration
3. **Manual**: Build with `npm run build:production` and deploy the built files

## Custom Domain

To connect a custom domain:
- Navigate to Project > Settings > Domains in Lovable
- Click Connect Domain
- Follow the [custom domain guide](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
