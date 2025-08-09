import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { authRoutes } from './routes/auth.js';
import { formationRoutes } from './routes/formations.js';
import { serviceRoutes } from './routes/services.js';
import { reservationRoutes } from './routes/reservations.js';
import { clientRoutes } from './routes/clients.js';

// Load .env file but don't override existing environment variables
// This ensures Render's environment variables take precedence
dotenv.config({ override: false });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:8080', 
    'http://localhost:3000',
    'https://makeup-neill.onrender.com',
    'https://*.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Determine the correct path for static files
function getStaticPath() {
  // Try multiple possible locations for the frontend build files
  const possiblePaths = [
    path.join(__dirname, '../../dist'),           // For local development
    path.join(process.cwd(), '../dist'),          // For Render deployment (backend runs from backend/ subdirectory)
    path.join(process.cwd(), 'dist'),             // Alternative: if backend runs from project root
    path.join(__dirname, '../../../dist'),        // Alternative path
    path.join(process.cwd(), 'frontend/build'),   // Alternative frontend structure
    path.join(process.cwd(), 'client/build'),     // Alternative client structure
  ];
  
  for (const staticPath of possiblePaths) {
    try {
      const indexPath = path.join(staticPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        console.log(`✓ Found static files at: ${staticPath}`);
        return staticPath;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`✗ Checking path ${staticPath}: ${errorMessage}`);
    }
  }
  
  // Fallback to the default path
  const fallbackPath = path.join(__dirname, '../../dist');
  console.warn(`⚠️  No static files found, using fallback path: ${fallbackPath}`);
  return fallbackPath;
}

// Serve static files from the React app build directory
const staticPath = getStaticPath();
console.log(`📁 Serving static files from: ${staticPath}`);
app.use(express.static(staticPath));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/formations', formationRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/clients', clientRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Smart routing: API 404s vs React Router support
app.use((req, res, next) => {
  // Handle unknown API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  
  // For all other routes, serve the React app
  const indexPath = path.join(staticPath, 'index.html');
  
  // Check if index.html exists before trying to serve it
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error(`❌ index.html not found at: ${indexPath}`);
    res.status(404).json({ 
      error: 'Frontend files not found',
      staticPath: staticPath,
      indexPath: indexPath,
      cwd: process.cwd(),
      dirname: __dirname
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 Static files: ${staticPath}`);
  console.log(`💻 Working directory: ${process.cwd()}`);
  console.log(`📍 Backend location: ${__dirname}`);
});

export default app;