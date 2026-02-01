import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { agentRouter } from './routes/agent';
import { servicesRouter } from './routes/services';
import { demandsRouter } from './routes/demands';
import { ordersRouter } from './routes/orders';
import { adminRouter } from './routes/admin';
import { erc8004Router } from './routes/erc8004';
import { erc8004WriteRouter } from './routes/erc8004Write';
import { hostedJsonRouter } from './routes/hostedJson';
import { messagesRouter } from './routes/messages';

// Load server-specific .env using __dirname so it works regardless of CWD
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// ⚠️ CRITICAL for Render deployment: Service MUST listen on process.env.PORT
// Render automatically sets PORT environment variable
// If PORT is not set (local dev), fallback to 3001
// process.env.PORT is always a string, so we need to parse it to a number
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// Middleware
// CORS configuration: For monolith deployment (same origin), allow all origins
// For separate frontend/backend, use FRONTEND_URL environment variable
const corsOrigin = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? true : 'http://localhost:3000');
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// API Routes
app.use('/api/v1/agent', agentRouter);
app.use('/api/v1/services', servicesRouter);
app.use('/api/v1/demands', demandsRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/orders', messagesRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/erc8004', erc8004Router);
app.use('/api/v1/erc8004', erc8004WriteRouter);
app.use('/', hostedJsonRouter);

// --- Serve frontend static files (production monolith) ---
const frontendDistPath = path.join(__dirname, '../../dist');
app.use(express.static(frontendDistPath));

// SPA catch-all: any non-API, non-static route returns index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.code || 'INTERNAL_ERROR',
    message: err.message || 'Internal server error'
  });
});

// Listen on PORT (provided by Render in production, or 3001 in local dev)
// This MUST use process.env.PORT for Render health checks to pass
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 LocalLife Backend running on port ${PORT}`);
  console.log(`📡 API available at http://0.0.0.0:${PORT}/api/v1`);
  console.log(`🏥 Health check: http://0.0.0.0:${PORT}/health`);
});
