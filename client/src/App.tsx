import LogIngester from './components/LogIngester';
import LogHistory from './components/LogHistory';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { LogAnalysis, LogEntry } from '@common/types/logAnalysis';

const Container = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  height: 99vh;
  width: 99vw;
  overflow: hidden;
  background-color: #white;
  font-color: #000500;
`;

// Determine API URL based on environment (This could be a config file)
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://debug-assistant.onrender.com'
  : 'http://localhost:3001';

function App() {
  const [analysis, setAnalysis] = useState<LogAnalysis | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/logs`);
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      const data = await response.json();
      setLogs(data.logs);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <Container>
      <LogIngester analysis={analysis} onLogSelect={setAnalysis} onLogSubmit={fetchLogs} />
      <LogHistory onLogSelect={setAnalysis} logs={logs} onLogsUpdate={fetchLogs} />
    </Container>
  );
}

export default App; 