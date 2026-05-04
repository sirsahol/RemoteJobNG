import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders correctly with different variants', () => {
    const { rerender } = render(<Badge variant="blue">Blue Badge</Badge>);
    expect(screen.getByText('Blue Badge')).toBeInTheDocument();
    expect(screen.getByText('Blue Badge').className).toContain('text-blue-400');

    rerender(<Badge variant="emerald">Emerald Badge</Badge>);
    expect(screen.getByText('Emerald Badge').className).toContain('text-emerald-400');
  });
});
