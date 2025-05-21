import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LogHistory from './LogHistory';
import { LogEntry } from '@common/types/logAnalysis';
import { ObjectId } from 'mongodb';

describe('LogHistory', () => {
  const mockLogs: LogEntry[] = [
    {
      _id: new ObjectId(),
      content: 'Test log 1',
      timestamp: new Date('2024-03-20T10:00:00Z'),
      analysis: {
        severity: 'high',
        confidence: 'high',
        problem: 'Test problem 1',
        solution: 'Test solution 1'
      }
    },
    {
      _id: new ObjectId(),
      content: 'Test log 2',
      timestamp: new Date('2024-03-20T11:00:00Z'),
      analysis: {
        severity: 'low',
        confidence: 'medium',
        problem: 'Test problem 2',
        solution: 'Test solution 2'
      }
    }
  ];

  const mockOnLogSelect = vi.fn();
  const mockOnLogsUpdate = vi.fn();

  it('renders the component with logs', () => {
    render(
      <LogHistory 
        logs={mockLogs} 
        onLogSelect={mockOnLogSelect} 
        onLogsUpdate={mockOnLogsUpdate} 
      />
    );

    expect(screen.getByText('Log History')).toBeInTheDocument();
    expect(screen.getByText('Test log 1')).toBeInTheDocument();
    expect(screen.getByText('Test log 2')).toBeInTheDocument();
  });

  it('filters logs based on search query', () => {
    render(
      <LogHistory 
        logs={mockLogs} 
        onLogSelect={mockOnLogSelect} 
        onLogsUpdate={mockOnLogsUpdate} 
      />
    );

    const searchInput = screen.getByPlaceholderText('Search logs...');
    fireEvent.change(searchInput, { target: { value: 'Test log 1' } });

    expect(screen.getByText('Test log 1')).toBeInTheDocument();
    expect(screen.queryByText('Test log 2')).not.toBeInTheDocument();
  });

  it('filters logs based on severity', () => {
    render(
      <LogHistory 
        logs={mockLogs} 
        onLogSelect={mockOnLogSelect} 
        onLogsUpdate={mockOnLogsUpdate} 
      />
    );

    const severitySelect = screen.getByDisplayValue('All Severities');
    fireEvent.change(severitySelect, { target: { value: 'high' } });

    expect(screen.getByText('Test log 1')).toBeInTheDocument();
    expect(screen.queryByText('Test log 2')).not.toBeInTheDocument();
  });

  it('calls onLogSelect when a log is clicked', () => {
    render(
      <LogHistory 
        logs={mockLogs} 
        onLogSelect={mockOnLogSelect} 
        onLogsUpdate={mockOnLogsUpdate} 
      />
    );

    const logItem = screen.getByText('Test log 1');
    fireEvent.click(logItem);

    expect(mockOnLogSelect).toHaveBeenCalledWith(mockLogs[0].analysis);
  });

  it('displays timestamps in local format', () => {
    render(
      <LogHistory 
        logs={mockLogs} 
        onLogSelect={mockOnLogSelect} 
        onLogsUpdate={mockOnLogsUpdate} 
      />
    );

    const timestamp = new Date('2024-03-20T10:00:00Z').toLocaleString();
    expect(screen.getByText(timestamp)).toBeInTheDocument();
  });
}); 