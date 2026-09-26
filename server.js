import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import Invoice from './models/Invoice.js';
import { seedDatabase } from './utils/seedData.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Body Parsers & Security Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: corsOrigin === '*' ? '*' : corsOrigin.split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// System Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    service: 'FinFlow AI Backend Engine',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'FinFlow AI - Financial Process Intelligence & Remediation Platform API',
    version: '1.0.0',
    documentationUrl: '/api/v1',
    healthCheck: '/health',
  });
});

// API Routes
app.use('/api/v1', apiRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Server initialization & startup
const startServer = async () => {
  try {
    await connectDB();

    // Check if database needs initial seeding
    const invoiceCount = await Invoice.countDocuments();
    if (invoiceCount === 0) {
      console.log('📦 Database is empty. Running initial synthetic financial data seed (100+ invoices)...');
      await seedDatabase();
    } else {
      console.log(`📊 Found ${invoiceCount} existing invoices in database.`);
    }

    const server = app.listen(PORT, () => {
      console.log('====================================================');
      console.log(`🚀 FinFlow AI Backend active on http://localhost:${PORT}`);
      console.log(`📡 API v1 Base Route: http://localhost:${PORT}/api/v1`);
      console.log(`🩺 Health Check:      http://localhost:${PORT}/health`);
      console.log(`🌍 Environment:       ${process.env.NODE_ENV || 'development'}`);
      console.log('====================================================');
    });

    return server;
  } catch (error) {
    console.error(`❌ Fatal server startup error: ${error.message}`);
    process.exit(1);
  }
};

startServer();

export default app;
