import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TextArea from './TextArea';

describe('TextArea Component', () => {
  it('renders correctly', () => {
    render(<TextArea placeholder="Test Placeholder" />);
    expect(screen.getByPlaceholderText('Test Placeholder')).toBeDefined();
  });

  it('displays label when provided', () => {
    render(<TextArea label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeDefined();
  });

  it('displays error message when provided', () => {
    render(<TextArea error="Error message" />);
    expect(screen.getByText('Error message')).toBeDefined();
  });
});
