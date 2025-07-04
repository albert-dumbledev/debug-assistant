import { useState } from 'react';
import styled from 'styled-components';
import LogAnalysisDisplay from './LogAnalysis';
import { LogAnalysis } from '@common/types/logAnalysis';
import { Button } from '@common/utils/styledComponents';

// Determine API URL based on environment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://debug-assistant.onrender.com'
  : 'http://localhost:3001';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem 3rem;
  gap: 1rem;
  background-color: white;
  font-color: #000500;
`;

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  max-height: 40vh;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #000500;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #000500;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-family: monospace;
  font-size: 0.875rem;
  resize: none;
  background-color: white;
  color: #000500;
  flex: 1;
  min-height: 0;

  &:focus {
    outline: none;
    border-color: blue;
    box-shadow: 0 0 0 2px rgba(239, 118, 122, 0.1);
  }
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: #EF767A;
  color: #000500;
  border-radius: 0.5rem;
  font-size: 0.875rem;
`;

const AnalysisSection = styled.div`
  padding: 0.75rem;
  margin-bottom: 2rem;
  background-color: #F4F4F4;
  height: 45vh;
  overflow-y: auto;
  width: 100%;
`;

const Icon = styled.span`
  font-size: 3rem;
`;

const Loader = styled.div`
  font-size: 5rem;
  animation: spin 1s linear infinite;
  display: flex;
  justify-content: left;
  align-items: left;
  max-width: 100px ;
  max-height: 100px;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoaderSection = styled.div`
  padding: 0.75rem;
  margin-bottom: 2rem;
  height: 45vh;
  overflow-y: auto;
  width: 100%;
`;

interface LogIngesterProps {
  analysis: LogAnalysis | null;
  onLogSelect: (analysis: LogAnalysis | null) => void;
  onLogSubmit: () => Promise<void>;
}

function LogIngester({ analysis, onLogSelect, onLogSubmit }: LogIngesterProps) {
  const [logs, setLogs] = useState('');
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | null>(null);

  const validateLogs = (str: string) => {
    if (str.length > 0) {
      return str.trim();
    } else {
      throw new Error('You must enter some logs to analyze');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch(`${API_BASE_URL}/api/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs: validateLogs(logs) }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit logs');
      }

      const data = await response.json();
      setStatus('success');
      setLogs('');
      onLogSelect(data.analysis);
      await onLogSubmit();
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <Container>
      <MainSection>
        <Title>Bug Busterroo <Icon>🦘</Icon></Title>
        <Form onSubmit={handleSubmit}>
          <TextArea
            value={logs}
            onChange={(e) => setLogs(e.target.value)}
            placeholder="Paste your error logs here..."
          />
          <Button 
            type="submit" 
            disabled={status === 'loading' || !logs.trim()}
          >
            {status === 'loading' ? 'Analyzing...' : 'Analyze Logs'} 🪃
          </Button>
        </Form>

        {status === 'error' && (
          <ErrorMessage>
            Failed to analyze logs. Please try again.
          </ErrorMessage>
        )}
      </MainSection>

      {status !== 'loading' && analysis && (
        <AnalysisSection>
          <LogAnalysisDisplay analysis={analysis} />
        </AnalysisSection>
      )}

      {status === 'loading' && (
        <LoaderSection>
            <Loader>🪃</Loader>
        </LoaderSection>
      )}
    </Container>
  );
}

export default LogIngester; 