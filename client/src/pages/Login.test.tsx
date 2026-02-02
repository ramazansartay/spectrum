import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { LoginPage } from './Login';

// Mock the useLogin hook
vi.mock('@/hooks/use-auth', () => ({
  useLogin: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

describe('LoginPage', () => {
  it('renders the login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('submits the form with email and password', () => {
    const { useLogin } = require('@/hooks/use-auth');
    const mockMutate = useLogin().mutate;
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(mockMutate).toHaveBeenCalledWith(
      { email: 'test@example.com', password: 'password123', remember: false },
      expect.any(Object)
    );
  });
});
