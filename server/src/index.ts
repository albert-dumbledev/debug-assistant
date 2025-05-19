import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for large log files

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Log ingestion endpoint
app.post('/api/logs', (req, res) => {
  const { logs } = req.body;
  console.log('Received logs:', logs);
  res.json({ status: 'ok', message: 'Logs received' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 