import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Server } from 'http';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import kindnessRoutes from './routes/kindness.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();
const port = process.env.PORT || 5000;

// CORS setup: Restrict to custom origin if specified, otherwise default to local frontend
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// Payload limit to prevent DoS attacks
app.use(express.json({ limit: '10kb' }));

// API Routes
app.use('/api/kindness', kindnessRoutes);
app.use('/api/users', userRoutes);

// Fallback for unmatched routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Centralized error handler middleware
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[server]: Unhandled error:', err);
  res.status(500).json({ message: 'An internal server error occurred.' });
});

let server: Server;

async function startServer() {
  try {
    await connectDatabase();
    server = app.listen(port, () => {
      console.log(`[server]: Backend API running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('[server]: Error starting server:', error);
    process.exit(1);
  }
}

// Graceful shutdown coordination
async function handleShutdown(signal: string) {
  console.log(`[server]: Received ${signal}. Starting graceful shutdown...`);
  if (server) {
    server.close(async (err) => {
      if (err) {
        console.error('[server]: Error closing HTTP server:', err);
      } else {
        console.log('[server]: HTTP server closed.');
      }
      try {
        await disconnectDatabase();
        process.exit(0);
      } catch (dbErr) {
        console.error('[server]: Error during database disconnection:', dbErr);
        process.exit(1);
      }
    });
  } else {
    try {
      await disconnectDatabase();
      process.exit(0);
    } catch (dbErr) {
      console.error('[server]: Error during database disconnection:', dbErr);
      process.exit(1);
    }
  }
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

startServer();
