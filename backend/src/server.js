import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import connectDB from './config/db.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load Environment Variables (supports server/.env, backend/.env, and root .env)
const potentialEnvPaths = [
  path.resolve(process.cwd(), 'server/.env'),
  path.resolve(process.cwd(), '../server/.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend/.env'),
];

for (const envPath of potentialEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}
dotenv.config(); // fallback

// If server/.env contains the placeholder string, allow fallback until user enters their Atlas URI
if (process.env.MONGODB_URI === '<MY_MONGODB_CONNECTION_STRING>') {
  const backendEnv = path.resolve(process.cwd(), 'backend/.env');
  const localEnv = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(backendEnv)) {
    const parsed = dotenv.parse(fs.readFileSync(backendEnv));
    if (parsed.MONGODB_URI && parsed.MONGODB_URI !== '<MY_MONGODB_CONNECTION_STRING>') {
      process.env.MONGODB_URI = parsed.MONGODB_URI;
    }
  } else if (fs.existsSync(localEnv)) {
    const parsed = dotenv.parse(fs.readFileSync(localEnv));
    if (parsed.MONGODB_URI && parsed.MONGODB_URI !== '<MY_MONGODB_CONNECTION_STRING>') {
      process.env.MONGODB_URI = parsed.MONGODB_URI;
    }
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/subcategories', collectionRoutes);
app.use('/api/marketplaces', marketplaceRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server Flow: Connect DB once at startup -> Listen
let serverInstance = null;

const startServer = async () => {
  await connectDB();

  serverInstance = app.listen(PORT, () => {
    console.log(`🚀 Nitya Yantra Backend Server running on port ${PORT}`);
    console.log(`📡 Health Check URL: http://localhost:${PORT}/api/health`);
    console.log(`🔑 Auth Login API:    http://localhost:${PORT}/api/auth/login`);
    console.log(`🏷️  Category API:      http://localhost:${PORT}/api/categories`);
    console.log(`🛍️  Product API:       http://localhost:${PORT}/api/products`);
    console.log(`📦 Collection API:    http://localhost:${PORT}/api/collections`);
    console.log(`🛒 Marketplace API:   http://localhost:${PORT}/api/marketplaces`);
  });

  serverInstance.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `❌ Port ${PORT} is already in use by another running process.\nPlease terminate the other process or terminal before restarting.`
      );
    } else {
      console.error('❌ Server error:', err.message);
    }
  });
};

// Graceful shutdown on termination / watch restart
const handleShutdown = () => {
  if (serverInstance) {
    serverInstance.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

startServer();
