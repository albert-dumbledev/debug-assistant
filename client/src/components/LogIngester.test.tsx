import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LogIngester from './LogIngester';
import { LogAnalysis } from '@common/types/logAnalysis';

describe('LogIngester', () => {
  const mockAnalysis: LogAnalysis = {
    severity: 'high',
    confidence: 'high',
    problem: 'Test problem',
    solution: 'Test solution'
  };

  const mockOnLogSelect = vi.fn();
  const mockOnLogSubmit = vi.fn();

  it('renders the component with initial state', () => {
    render(
      <LogIngester 
        analysis={null} 
        onLogSelect={mockOnLogSelect} 
        onLogSubmit={mockOnLogSubmit} 
      />
    );

    expect(screen.getByText('Bug Busterroo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Paste your error logs here...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Analyze Logs 🪃' })).toBeInTheDocument();
  });

  it('disables submit button when textarea is empty', () => {
    render(
      <LogIngester 
        analysis={null} 
        onLogSelect={mockOnLogSelect} 
        onLogSubmit={mockOnLogSubmit} 
      />
    );

    const submitButton = screen.getByRole('button', { name: 'Analyze Logs 🪃' });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when textarea has content', () => {
    render(
      <LogIngester 
        analysis={null} 
        onLogSelect={mockOnLogSelect} 
        onLogSubmit={mockOnLogSubmit} 
      />
    );

    const textarea = screen.getByPlaceholderText('Paste your error logs here...');
    fireEvent.change(textarea, { target: { value: 'Test log content' } });

    const submitButton = screen.getByRole('button', { name: 'Analyze Logs 🪃' });
    expect(submitButton).not.toBeDisabled();
  });

  it('displays analysis results when available', () => {
    render(
      <LogIngester 
        analysis={mockAnalysis} 
        onLogSelect={mockOnLogSelect} 
        onLogSubmit={mockOnLogSubmit} 
      />
    );

    expect(screen.getByText('Analysis Results')).toBeInTheDocument();
    expect(screen.getByText('Test problem')).toBeInTheDocument();
    expect(screen.getByText('Test solution')).toBeInTheDocument();
  });

  it('shows loading state during analysis', () => {
    render(
      <LogIngester 
        analysis={null} 
        onLogSelect={mockOnLogSelect} 
        onLogSubmit={mockOnLogSubmit} 
      />
    );

    const textarea = screen.getByPlaceholderText('Paste your error logs here...');
    fireEvent.change(textarea, { target: { value: 'Test log content' } });

    const submitButton = screen.getByRole('button', { name: 'Analyze Logs 🪃' });
    fireEvent.click(submitButton);

    expect(screen.getByRole('button', { name: 'Analyzing... 🪃' })).toBeInTheDocument();
  });
}); 