import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLogin } from './useLogin';
import api from '@/utils/axiosInstance';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

vi.mock('@/utils/axiosInstance', () => ({
  default: {
    post: vi.fn(),
  }
}));

describe('useLogin', () => {
  const mockPush = vi.fn();
  const mockLogin = vi.fn();
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush });
    vi.mocked(useSearchParams).mockReturnValue({ get: mockGet });
    vi.mocked(useAuth).mockReturnValue({ login: mockLogin });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLogin());
    expect(result.current.username).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('should handle successful login', async () => {
    const mockPost = vi.mocked(api.post);
    mockPost.mockResolvedValueOnce({ data: { access: 'token', refresh: 'refresh' } });
    
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() });
    });

    if (result.current.error) {
      console.error("Login failed unexpectedly:", result.current.error);
    }

    expect(mockPost).toHaveBeenCalled();
    expect(mockLogin).toHaveBeenCalledWith('token', 'refresh');
    expect(mockPush).toHaveBeenCalled();
  });

  it('should handle login error', async () => {
    vi.mocked(api.post).mockRejectedValueOnce({ message: 'Invalid credentials' });
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() });
    });

    expect(result.current.error).toBe('Invalid credentials');
    expect(result.current.loading).toBe(false);
  });
});
