import LogIngester from './pages/LogIngester';
import LogHistory from './components/LogHistory';
import styled from 'styled-components';
import { useState } from 'react';
import { LogAnalysis, LogEntry } from '@common/types/logAnalysis';

const Container = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  height: 100vh;
  width: 100vw;
  font-family: 'Helvetica Neue', sans-serif;
  overflow: hidden;
  background-color: #white;
  font-color: #000500;
`;

function App() {
  const [analysis, setAnalysis] = useState<LogAnalysis | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/logs');
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      const data = await response.json();
      setLogs(data.logs);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  };

  return (
    <Container>
      <LogIngester analysis={analysis} onLogSelect={setAnalysis} onLogSubmit={fetchLogs} />
      <LogHistory onLogSelect={setAnalysis} logs={logs} onLogsUpdate={fetchLogs} />
    </Container>
  );
}

export default App; 