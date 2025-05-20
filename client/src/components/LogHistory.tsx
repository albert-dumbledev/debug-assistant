import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LogEntry, LogAnalysis } from '@common/types/logAnalysis';
import Badge from './Badge';
import { severityColors, confidenceColors } from '@common/utils/colors';

interface LogHistoryProps {
  onLogSelect: (analysis: LogAnalysis | null) => void;
  logs: LogEntry[];
  onLogsUpdate: () => Promise<void>;
}

const Container = styled.div`
  height: 97vh;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  overflow: hidden;
  background-color: #F4F4F4;
  color: #000500;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  position: sticky;
  top: 0;
  z-index: 1;
  color: #000500;
`;

const LogList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  flex: 1;
  padding-right: 0.5rem;
`;

const LogItem = styled.div<{ isSelected: boolean }>`
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: ${props => props.isSelected ? '#89C2FA' : 'white'};
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;

  &:hover {
    background-color: #B1D6FC;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  &:focus {
    outline: none;
    border-color: #EF767A;
    box-shadow: 0 0 0 2px rgba(239, 118, 122, 0.1);
  }
`;

const LogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
`;

const Timestamp = styled.div`
  font-size: 0.75rem;
  color: #000500;
  white-space: nowrap;
`;

const Summary = styled.div`
  font-size: 0.875rem;
  color: #000500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: monospace;
  line-height: 1.25;
  width: 22rem;
  max-width: 22rem;
`;

const MetricsContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  font-size: 0.75rem;
  flex-shrink: 0;
`;

const LoadingContainer = styled.div`
  padding: 2rem;
  text-align: center;
  color: #000500;
  font-size: 0.875rem;
`;

const ErrorContainer = styled.div`
  padding: 1rem;
  background-color: #EF767A;
  color: #000500;
  border-radius: 0.5rem;
  font-size: 0.875rem;
`;

function LogHistory({ onLogSelect, logs, onLogsUpdate }: LogHistoryProps) {
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onLogsUpdate().catch(err => {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    }).finally(() => {
      setLoading(false);
    });
  }, [onLogsUpdate]);

  const handleLogSelect = (log: LogEntry) => {
    setSelectedLog(log);
    onLogSelect(log.analysis || null);
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Loading logs...</LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>Error: {error}</ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Log History</Title>
      <LogList>
        {logs.map((log) => (
          <LogItem
            key={log._id?.toString()}
            isSelected={selectedLog?._id?.toString() === log._id?.toString()}
            onClick={() => handleLogSelect(log)}
          >
            <LogHeader>
              <Timestamp>
                {new Date(log.timestamp).toLocaleString()}
              </Timestamp>
              {log.analysis && (
                <MetricsContainer>
                  <Badge 
                    color={severityColors[log.analysis.severity]} 
                    text={log.analysis.severity}
                  />
                  <Badge 
                    color={confidenceColors[log.analysis.confidence]} 
                    text={log.analysis.confidence}
                  />
                </MetricsContainer>
              )}
            </LogHeader>
            <Summary>{log.content.split('\n')[0]}</Summary>
          </LogItem>
        ))}
      </LogList>
    </Container>
  );
}

export default LogHistory;