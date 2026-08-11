import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import apiRoutes from './routes';

const app = express();

// Permissive CORS for cross-origin frontend requests
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.options('*', cors());

app.use(express.json());
app.use(morgan('dev'));
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Welcome & Health check endpoints
app.get(['/', '/api', '/health'], (_req, res) => {
  res.json({ status: 'ok', message: 'Career 360 Host API with Course Planner Module Online.' });
});

// Mount API routes under both /api and /
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

export default app;
