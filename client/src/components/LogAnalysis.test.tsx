import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LogAnalysisDisplay from './LogAnalysis';
import { LogAnalysis } from '@common/types/logAnalysis';

describe('LogAnalysis', () => {
  const mockAnalysis: LogAnalysis = {
    severity: 'high',
    confidence: 'high',
    problem: 'Test problem description',
    solution: 'Test solution description'
  };

  it('renders the analysis results with correct content', () => {
    render(<LogAnalysisDisplay analysis={mockAnalysis} />);
    
    // Check title
    expect(screen.getByText('Analysis Results')).toBeInTheDocument();
    
    // Check severity and confidence badges
    expect(screen.getAllByText('HIGH')).toHaveLength(2);
    
    // Check problem and solution sections
    expect(screen.getByText('Problem')).toBeInTheDocument();
    expect(screen.getByText('Test problem description')).toBeInTheDocument();
    expect(screen.getByText('Solution')).toBeInTheDocument();
    expect(screen.getByText('Test solution description')).toBeInTheDocument();
  });

  it('renders with different severity levels', () => {
    const lowSeverityAnalysis: LogAnalysis = {
      ...mockAnalysis,
      severity: 'low'
    };
    
    render(<LogAnalysisDisplay analysis={lowSeverityAnalysis} />);
    expect(screen.getByText('LOW')).toBeInTheDocument();
  });

  it('renders with different confidence levels', () => {
    const lowConfidenceAnalysis: LogAnalysis = {
      ...mockAnalysis,
      confidence: 'low'
    };
    
    render(<LogAnalysisDisplay analysis={lowConfidenceAnalysis} />);
    expect(screen.getByText('LOW')).toBeInTheDocument();
  });
}); 