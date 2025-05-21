import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge from './Badge';
import { ColorType } from '@common/types/styles';

describe('Badge', () => {
  it('renders with the provided text', () => {
    render(<Badge color={ColorType.RED} text="Test Badge" />);
    expect(screen.getByText('TEST BADGE')).toBeInTheDocument();
  });

  it('applies the provided color', () => {
    render(<Badge color={ColorType.RED} text="Test Badge" />);
    const badge = screen.getByText('TEST BADGE')
    expect(badge).toHaveStyle({ backgroundColor: ColorType.RED });
  });

  it('renders with different text and colors', () => {
    const { rerender, container } = render(<Badge color={ColorType.GREEN} text="High" />);
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(container.firstChild as HTMLElement).toHaveStyle({ backgroundColor: ColorType.GREEN });

    rerender(<Badge color={ColorType.GRAY} text="unknown" />);
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
    expect(container.firstChild as HTMLElement).toHaveStyle({ backgroundColor: ColorType.GRAY });
  });
}); 