import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import PostAdd from './PostAdd';

// Mock dependencies
vi.mock('@/hooks/use-listings', () => ({
  useCreateListing: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));
vi.mock('@/hooks/use-user', () => ({
  useUser: () => ({ data: { id: '1', name: 'Test User' }, isLoading: false }),
}));

describe('PostAdd', () => {
  it('renders the form and allows submission', async () => {
    const { useCreateListing } = require('@/hooks/use-listings');
    const mockMutate = useCreateListing().mutate;
    render(<PostAdd />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Listing' } });
    // You would continue to fill out other fields here...

    // Mock file upload
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/photos/i);
    await waitFor(() =>
      fireEvent.drop(input, {
        dataTransfer: {
          files: [file],
        },
      })
    );

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /publish/i }));

    await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled();
    });
  });
});
