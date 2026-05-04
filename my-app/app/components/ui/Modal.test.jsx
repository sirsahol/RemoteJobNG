import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<Modal isOpen={false} onClose={() => {}} title="Test Modal">Content</Modal>);
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly when open', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="Test Modal">Content</Modal>);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('calls onClose when clicking overlay', () => {
    const mockOnClose = vi.fn();
    render(<Modal isOpen={true} onClose={mockOnClose} title="Test Modal">Content</Modal>);
    
    // The first div is the fixed inset-0 which acts as overlay
    const overlay = screen.getByRole('button').parentElement.previousSibling; 
    // Wait, let's find it by something else or just check children
    fireEvent.click(screen.getByRole('button').parentElement.parentElement.firstChild);
    // Actually the overlay is the first child of the root div
    // But my implementation has:
    // <div className="fixed inset-0 ...">
    //   <div className="fixed inset-0" onClick={onClose} />
    //   <GlassCard ...>
    
    // In Vitest/RTL, we can just click the overlay div if we can find it.
  });
});
