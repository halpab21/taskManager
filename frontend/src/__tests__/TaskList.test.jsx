import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from '../components/TaskList';

test('renders empty message', () => {
  render(<TaskList tasks={[]} onEdit={() => {}} onDelete={() => {}} />);
  expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
});

test('renders tasks and calls handlers', () => {
  const tasks = [{ id: 1, title: 'T1', description: 'd', completed: false }];
  const onEdit = jest.fn();
  const onDelete = jest.fn();
  render(<TaskList tasks={tasks} onEdit={onEdit} onDelete={onDelete} />);

  expect(screen.getByText('T1')).toBeInTheDocument();

  const editBtn = screen.getByLabelText('edit');
  fireEvent.click(editBtn);
  expect(onEdit).toHaveBeenCalledWith(tasks[0]);

  const deleteBtn = screen.getByLabelText('delete');
  fireEvent.click(deleteBtn);
  expect(onDelete).toHaveBeenCalledWith(1);
});

