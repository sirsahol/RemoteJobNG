import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import { useLogin } from '@/hooks/useLogin';

// Mock the hook to test the container's interaction with logic
vi.mock('@/hooks/useLogin', () => ({
  useLogin: vi.fn(),
}));

describe('LoginPage Integration', () => {
  it('integrates logic with UI and handles user interaction', async () => {
    const mockHandleSubmit = vi.fn((e) => e.preventDefault());
    const mockSetUsername = vi.fn();
    const mockSetPassword = vi.fn();

    useLogin.mockReturnValue({
      username: '',
      setUsername: mockSetUsername,
      password: '',
      setPassword: mockSetPassword,
      loading: false,
      error: null,
      handleSubmit: mockHandleSubmit,
    });

    render(<LoginPage />);

    // Check if components are rendered
    expect(screen.getByText(/Initiate/i)).toBeInTheDocument();
    
    const usernameInput = screen.getByLabelText(/Neural ID/i);
    const passwordInput = screen.getByLabelText(/Access Key/i);
    const submitButton = screen.getByRole('button', { name: /Commit Session/i });

    // Simulate typing
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    expect(mockSetUsername).toHaveBeenCalledWith('testuser');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(mockSetPassword).toHaveBeenCalledWith('password123');

    // Simulate submission
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('displays error messages from the hook', () => {
    useLogin.mockReturnValue({
      username: '',
      setUsername: vi.fn(),
      password: '',
      setPassword: vi.fn(),
      loading: false,
      error: 'Invalid credentials',
      handleSubmit: vi.fn(),
    });

    render(<LoginPage />);
    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
  });

  it('shows loading state during authentication', () => {
    useLogin.mockReturnValue({
      username: '',
      setUsername: vi.fn(),
      password: '',
      setPassword: vi.fn(),
      loading: true,
      error: null,
      handleSubmit: vi.fn(),
    });

    render(<LoginPage />);
    // Button component should show loading text or be disabled
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
