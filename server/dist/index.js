"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
const logsDao_1 = require("./dao/logsDao");
const llmService_1 = require("./llm/llmService");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
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
const client = new mongodb_1.MongoClient(mongoUri);
const logsDao = new logsDao_1.LogsDao(client);
const llmService = new llmService_1.LLMService(geminiApiKey);
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' })); // Increased limit for large log files
// Basic route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});
// Get all logs
app.get('/api/logs', async (req, res) => {
    try {
        await client.connect();
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const sort = req.query.sort === 'asc' ? 'asc' : 'desc';
        const logs = await logsDao.getAllLogs({ limit, sort });
        res.json({ status: 'ok', logs });
    }
    catch (error) {
        console.error('Error retrieving logs:', error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve logs' });
    }
});
// Log ingestion endpoint
app.post('/api/logs', async (req, res) => {
    try {
        const { logs } = req.body;
        if (!logs) {
            return res.status(400).json({ error: 'Logs are required' });
        }
        // Save the log first
        const logId = await logsDao.saveLog(logs);
        // Get analysis from LLM
        const analysis = await llmService.explainLogs(logs);
        // Update the log with the analysis
        await logsDao.updateLogAnalysis(logId.toString(), analysis);
        res.json({
            message: 'Logs saved and analyzed successfully',
            id: logId,
            analysis
        });
    }
    catch (error) {
        console.error('Error processing logs:', error);
        res.status(500).json({ error: 'Failed to process logs' });
    }
});
// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
