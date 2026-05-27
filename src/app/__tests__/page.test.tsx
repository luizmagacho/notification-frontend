import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Home from '../page';
import { api } from '@/lib/api';
import type { Category, NotificationLog } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  api: {
    getCategories: vi.fn(),
    getHistory: vi.fn(),
    sendNotification: vi.fn(),
    subscribeToHistory: vi.fn(),
  },
}));

const mockCategories: Category[] = ['SPORTS', 'FINANCE', 'MOVIES'];
const mockHistory: NotificationLog[] = [
  {
    id: 1,
    message: 'Test message',
    category: 'FINANCE',
    channel: 'EMAIL',
    userEmail: 'test@example.com',
    userName: 'Test User',
    timestamp: '2026-05-26T12:00:00',
  },
];

describe('Home Page', () => {
  beforeEach(() => {
    vi.mocked(api.getCategories).mockResolvedValue(mockCategories);
    vi.mocked(api.getHistory).mockResolvedValue(mockHistory);
    vi.mocked(api.subscribeToHistory).mockReturnValue(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches and renders categories on mount', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(api.getCategories).toHaveBeenCalledOnce();
    });

    const select = screen.getByLabelText('Category');
    await waitFor(() => {
      const options = select.querySelectorAll('option');
      expect(options).toHaveLength(4);
    });
  });

  it('fetches and renders history on mount', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(api.getHistory).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  it('subscribes to SSE on mount', async () => {
    render(<Home />);

    expect(api.subscribeToHistory).toHaveBeenCalledOnce();
    expect(api.subscribeToHistory).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function)
    );

    await waitFor(() => {
      expect(api.getCategories).toHaveBeenCalled();
    });
  });

  it('submits notification and shows success message', async () => {
    const user = userEvent.setup();
    vi.mocked(api.sendNotification).mockResolvedValue({ message: 'Notifications sent successfully!' });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByLabelText('Category').querySelectorAll('option')).toHaveLength(4);
    });

    await user.selectOptions(screen.getByLabelText('Category'), 'FINANCE');
    await user.type(screen.getByLabelText('Message'), 'Test notification');
    await user.click(screen.getByRole('button', { name: /dispatch notifications/i }));

    await waitFor(() => {
      expect(api.sendNotification).toHaveBeenCalledWith('FINANCE', 'Test notification');
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Notifications sent successfully!');
    });
  });

  it('shows error message when API returns error', async () => {
    const user = userEvent.setup();
    vi.mocked(api.sendNotification).mockResolvedValue({ error: 'No subscribers found' });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByLabelText('Category').querySelectorAll('option')).toHaveLength(4);
    });

    await user.selectOptions(screen.getByLabelText('Category'), 'SPORTS');
    await user.type(screen.getByLabelText('Message'), 'Test error');
    await user.click(screen.getByRole('button', { name: /dispatch notifications/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('No subscribers found');
    });
  });

  it('shows connection error when fetch throws', async () => {
    const user = userEvent.setup();
    vi.mocked(api.sendNotification).mockRejectedValue(new Error('Network error'));

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByLabelText('Category').querySelectorAll('option')).toHaveLength(4);
    });

    await user.selectOptions(screen.getByLabelText('Category'), 'MOVIES');
    await user.type(screen.getByLabelText('Message'), 'Test connection');
    await user.click(screen.getByRole('button', { name: /dispatch notifications/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to connect to the server');
    });
  });

  it('renders the page header', async () => {
    render(<Home />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Notification System');
    expect(screen.getByText('Send messages to subscribed users across multiple channels.')).toBeInTheDocument();

    await waitFor(() => {
      expect(api.getCategories).toHaveBeenCalled();
    });
  });
});
