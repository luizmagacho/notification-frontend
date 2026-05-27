import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import NotificationForm from '../NotificationForm';
import type { Category } from '@/lib/api';

const mockCategories: Category[] = ['SPORTS', 'FINANCE', 'MOVIES'];

describe('NotificationForm', () => {
  it('renders category dropdown with all options', () => {
    render(
      <NotificationForm
        categories={mockCategories}
        loading={false}
        status={null}
        onSubmit={vi.fn()}
      />
    );

    const select = screen.getByLabelText('Category');
    expect(select).toBeInTheDocument();

    // Default + 3 categories = 4 options
    const options = select.querySelectorAll('option');
    expect(options).toHaveLength(4);
    expect(options[1]).toHaveTextContent('SPORTS');
    expect(options[2]).toHaveTextContent('FINANCE');
    expect(options[3]).toHaveTextContent('MOVIES');
  });

  it('renders message textarea with placeholder', () => {
    render(
      <NotificationForm
        categories={mockCategories}
        loading={false}
        status={null}
        onSubmit={vi.fn()}
      />
    );

    const textarea = screen.getByLabelText('Message');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('placeholder', 'Enter the notification content...');
  });

  it('calls onSubmit with category and message when form is submitted', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <NotificationForm
        categories={mockCategories}
        loading={false}
        status={null}
        onSubmit={onSubmit}
      />
    );

    await user.selectOptions(screen.getByLabelText('Category'), 'FINANCE');
    await user.type(screen.getByLabelText('Message'), 'Test notification message');
    await user.click(screen.getByRole('button', { name: /dispatch notifications/i }));

    expect(onSubmit).toHaveBeenCalledWith('FINANCE', 'Test notification message');
  });

  it('shows loading state on submit button', () => {
    render(
      <NotificationForm
        categories={mockCategories}
        loading={true}
        status={null}
        onSubmit={vi.fn()}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Sending...');
    expect(button).toBeDisabled();
  });

  it('renders status banner when status is provided', () => {
    render(
      <NotificationForm
        categories={mockCategories}
        loading={false}
        status={{ type: 'success', text: 'Sent successfully!' }}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Sent successfully!');
  });

  it('clears form fields after submission', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <NotificationForm
        categories={mockCategories}
        loading={false}
        status={null}
        onSubmit={onSubmit}
      />
    );

    const categorySelect = screen.getByLabelText('Category') as HTMLSelectElement;
    const messageTextarea = screen.getByLabelText('Message') as HTMLTextAreaElement;

    await user.selectOptions(categorySelect, 'SPORTS');
    await user.type(messageTextarea, 'Hello world');
    await user.click(screen.getByRole('button', { name: /dispatch notifications/i }));

    expect(categorySelect.value).toBe('');
    expect(messageTextarea.value).toBe('');
  });
});
