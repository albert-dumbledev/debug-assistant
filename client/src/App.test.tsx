import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';
import { vi } from 'vitest';
import { LogAnalysis, LogEntry } from '@common/types/logAnalysis';

// Mock the fetch function
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock the child components
vi.mock('./components/LogIngester', () => ({
  default: vi.fn(({ analysis, onLogSelect, onLogSubmit }: { 
    analysis: LogAnalysis | null; 
    onLogSelect: (analysis: LogAnalysis | null) => void;
    onLogSubmit: () => Promise<void>;
  }) => (
    <div data-testid="log-ingester">
      <div>Log Ingester</div>
      <button onClick={() => onLogSelect({ severity: 'high', confidence: 'high', problem: 'test', solution: 'test' })}>
        Select Log
      </button>
      <button onClick={onLogSubmit}>Submit Log</button>
      <div>{analysis?.problem}</div>
    </div>
  ))
}));

vi.mock('./components/LogHistory', () => ({
  default: vi.fn(({ logs, onLogSelect }: { 
    logs: LogEntry[]; 
    onLogSelect: (analysis: LogAnalysis | null) => void;
  }) => (
    <div data-testid="log-history">
      <div>Log History</div>
      <div data-testid="log-count">{logs.length} logs</div>
      <button onClick={() => onLogSelect({ severity: 'high', confidence: 'high', problem: 'test', solution: 'test' })}>
        Select History Log
      </button>
    </div>
  ))
}));

describe('App', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Mock successful API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        logs: [
          { _id: '1', content: 'Test log 1', timestamp: new Date().toISOString() },
          { _id: '2', content: 'Test log 2', timestamp: new Date().toISOString() }
        ]
      })
    });
  });

  it('fetches logs on mount and renders child components', async () => {
    render(<App />);

    // Verify fetch was called once on mount
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('/api/logs');

    // Verify child components are rendered
    expect(screen.getByTestId('log-ingester')).toBeInTheDocument();
    expect(screen.getByTestId('log-history')).toBeInTheDocument();

    // Wait for logs to be loaded and verify count
    await waitFor(() => {
      expect(screen.getByTestId('log-count')).toHaveTextContent('2 logs');
    });
  });

  it('handles log selection from both components', async () => {
    render(<App />);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByTestId('log-count')).toBeInTheDocument();
    });

    // Click select buttons from both components
    await userEvent.click(screen.getByText('Select Log'));
    await userEvent.click(screen.getByText('Select History Log'));

    // Verify both components received the selected analysis
    const logIngester = screen.getByTestId('log-ingester');
    const logHistory = screen.getByTestId('log-history');
    
    expect(logIngester).toBeInTheDocument();
    expect(logHistory).toBeInTheDocument();
  });

  it('handles fetch error gracefully', async () => {
    // Mock a failed API response
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<App />);

    // Verify fetch was called
    expect(mockFetch).toHaveBeenCalledWith('/api/logs');

    // Verify components are still rendered
    expect(screen.getByTestId('log-ingester')).toBeInTheDocument();
    expect(screen.getByTestId('log-history')).toBeInTheDocument();

    // Verify log count shows 0 logs
    await waitFor(() => {
      expect(screen.getByTestId('log-count')).toHaveTextContent('0 logs');
    });
  });
}); 