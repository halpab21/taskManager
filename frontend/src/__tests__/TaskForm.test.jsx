import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskForm from '../components/TaskForm';

global.fetch = jest.fn();

test('renders TaskForm and submits', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ id: 1, title: 'Test task' })
  });

  const onCreate = jest.fn();
  render(<TaskForm onCreate={onCreate} />);

  const input = screen.getByLabelText(/Title/i);
  fireEvent.change(input, { target: { value: 'Test task' } });

  fireEvent.click(screen.getByRole('button', { name: /add/i }));

  await waitFor(() => expect(onCreate).toHaveBeenCalledWith(expect.objectContaining({ title: 'Test task' })));
});

