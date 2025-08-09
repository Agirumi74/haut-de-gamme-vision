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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
  optionsSuccessStatus: 200 // For older browsers
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Determine the correct path for static files
function getStaticPath() {
  // Try multiple possible locations for the frontend build files
  const possiblePaths = [
    // For local development (backend runs from backend/dist/index.js)
    path.join(__dirname, '../../dist'),
    
    // For Render deployment - when backend runs from project root
    path.join(process.cwd(), 'dist'),
    
    // For Render deployment - specific Render structure
    '/opt/render/project/src/dist',
    path.join('/opt/render/project/src', 'dist'),
    
    // For Render deployment - alternative paths
    path.join(process.cwd(), '../dist'),
    path.join(__dirname, '../../../dist'),
    
    // Additional paths for different deployment scenarios
    path.join(process.cwd(), 'frontend/build'),
    path.join(process.cwd(), 'client/build'),
    path.join(process.cwd(), 'public'),
  ];
  
  console.log(`🔍 Searching for static files...`);
  console.log(`📍 Current working directory: ${process.cwd()}`);
  console.log(`📍 Backend __dirname: ${__dirname}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏢 Platform: ${process.env.RENDER ? 'Render' : 'Local'}`);
  
  for (const staticPath of possiblePaths) {
    try {
      const resolvedPath = path.resolve(staticPath);
      const indexPath = path.join(resolvedPath, 'index.html');
      
      console.log(`🔍 Checking: ${staticPath}`);
      console.log(`   Resolved to: ${resolvedPath}`);
      console.log(`   Looking for: ${indexPath}`);
      
      if (fs.existsSync(indexPath)) {
        console.log(`✅ Found static files at: ${resolvedPath}`);
        return resolvedPath;
      } else {
        console.log(`❌ index.html not found`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`❌ Error checking path ${staticPath}: ${errorMessage}`);
    }
  }
  
  // Fallback to the default path - use resolved path for clarity
  const fallbackPath = path.resolve(__dirname, '../../dist');
  console.warn(`⚠️  No static files found in any location!`);
  console.warn(`⚠️  Using fallback path: ${fallbackPath}`);
  console.warn(`⚠️  This may cause 404 errors for static content`);
  
  // List the contents of key directories for debugging
  try {
    console.log(`📂 Contents of working directory (${process.cwd()}):`);
    const cwdContents = fs.readdirSync(process.cwd());
    console.log(`   ${cwdContents.join(', ')}`);
  } catch (e) {
    console.log(`❌ Cannot read working directory: ${e}`);
  }
  
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
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
    console.log(`📄 Serving index.html from: ${indexPath}`);
    res.sendFile(indexPath);
  } else {
    console.error(`❌ index.html not found at: ${indexPath}`);
    console.error(`📂 Contents of static directory (${staticPath}):`);
    
    try {
      const dirContents = fs.readdirSync(staticPath);
      console.error(`   Files: ${dirContents.join(', ')}`);
    } catch (dirError) {
      console.error(`   Cannot read directory: ${dirError}`);
    }
    
    console.error(`🔍 Debug info:`);
    console.error(`   Working directory: ${process.cwd()}`);
    console.error(`   Backend __dirname: ${__dirname}`);
    console.error(`   Static path: ${staticPath}`);
    console.error(`   Index path: ${indexPath}`);
    
    res.status(404).json({ 
      error: 'Frontend files not found',
      message: 'The React application build files could not be located',
      debug: {
        staticPath: staticPath,
        indexPath: indexPath,
        cwd: process.cwd(),
        dirname: __dirname,
        nodeEnv: process.env.NODE_ENV
      }
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
  
  // Additional helpful info for deployment debugging
  if (process.env.NODE_ENV === 'production') {
    console.log(`🔧 Production deployment detected`);
    console.log(`📦 Frontend files should be available at: ${path.join(staticPath, 'index.html')}`);
  }
  
  console.log(`✅ Server initialization complete`);
});

export default app;