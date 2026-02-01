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
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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

app.listen(PORT, () => {
  console.log(`🚀 LocalLife Backend running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api/v1`);
});
