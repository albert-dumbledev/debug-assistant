import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { LogEntry, LogAnalysis } from '@common/types/logAnalysis';
import Badge from './Badge';
import { severityColors, confidenceColors } from '@common/utils/colors';
import { FilterSelect } from '@common/utils/styledComponents';

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

const Toolbar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: white;
  border-radius: 0.5rem;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #000500;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  flex: 1;
  min-width: 0;
  background-color: white;
  color: #000500;

  &:focus {
    outline: none;
    border-color: #89C2FA;
    box-shadow: 0 0 0 2px rgba(137, 194, 250, 0.1);
  }
`;

function LogHistory({ onLogSelect, logs, onLogsUpdate }: LogHistoryProps) {
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<LogAnalysis['severity'] | 'all'>('all');
  const [confidenceFilter, setConfidenceFilter] = useState<LogAnalysis['confidence'] | 'all'>('all');

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeverity = severityFilter === 'all' || log.analysis?.severity === severityFilter;
      const matchesConfidence = confidenceFilter === 'all' || log.analysis?.confidence === confidenceFilter;
      return matchesSearch && matchesSeverity && matchesConfidence;
    });
  }, [logs, searchQuery, severityFilter, confidenceFilter]);

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
      <Toolbar>
        <SearchInput
          type="text"
          placeholder="Search logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FilterSelect
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value as LogAnalysis['severity'] | 'all')}
        >
          <option value="all">All Severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </FilterSelect>
        <FilterSelect
          value={confidenceFilter}
          onChange={(e) => setConfidenceFilter(e.target.value as LogAnalysis['confidence'] | 'all')}
        >
          <option value="all">All Confidence Levels</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
          <option value="unknown">Unknown</option>
        </FilterSelect>
      </Toolbar>
      <LogList>
        {filteredLogs.map((log) => (
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