import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRouter from './routes/health';
import authRouter from './routes/authRoutes';
import applicationRouter from './routes/applicationRoutes';
import dashboardRouter from './routes/dashboardRoutes';
import aiRouter from './routes/aiRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/ai', aiRouter);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to CareerTrack Lite API' });
});

// Fallback route
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
