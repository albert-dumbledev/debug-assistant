import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { LogsDao } from './dao/logsDao';
import { LLMService } from './llm/llmService';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const mongoUri = process.env.ATLAS_CONNECTION_STRING;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!mongoUri) {
  throw new Error('ATLAS_CONNECTION_STRING is not defined in environment variables');
}

if (!geminiApiKey) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

// MongoDB client
const client = new MongoClient(mongoUri);
const logsDao = new LogsDao(client);
const llmService = new LLMService(geminiApiKey);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for large log files

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Get all logs
app.get('/api/logs', async (req, res) => {
  try {
    await client.connect();
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const sort = req.query.sort === 'asc' ? 'asc' : 'desc';

    const logs = await logsDao.getAllLogs({ limit, sort });
    res.json({ status: 'ok', logs });
  } catch (error) {
    console.error('Error retrieving logs:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve logs' });
  }
});

// Log ingestion endpoint
app.post('/api/logs', async (req, res) => {
  const { logs } = req.body;
  
  try {
    await client.connect();
    
    // Save logs to database
    const id = await logsDao.saveLog(logs);
    console.log('Saved log entry with ID:', id);

    // Analyze logs with LLM
    const analysis = await llmService.explainLogs(logs);
    
    res.json({ 
      status: 'ok', 
      message: 'Logs saved and analyzed successfully', 
      id,
      analysis 
    });
  } catch (error) {
    console.error('Error processing logs:', error);
    res.status(500).json({ status: 'error', message: 'Failed to process logs' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 