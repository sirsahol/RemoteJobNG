import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Select from './Select';

describe('Select Component', () => {
  const options = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
  ];

  it('renders correctly with options', () => {
    render(<Select options={options} data-testid="select" />);
    const select = screen.getByTestId('select');
    expect(select).toBeDefined();
    expect(screen.getByText('Option 1')).toBeDefined();
    expect(screen.getByText('Option 2')).toBeDefined();
  });

  it('displays label when provided', () => {
    render(<Select label="Test Label" options={options} />);
    expect(screen.getByText('Test Label')).toBeDefined();
  });

  it('displays error message when provided', () => {
    render(<Select error="Error message" options={options} />);
    expect(screen.getByText('Error message')).toBeDefined();
  });
});
