import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NotificationHistory from '../NotificationHistory';
import type { NotificationLog } from '@/lib/api';

const mockHistory: NotificationLog[] = [
  {
    id: 1,
    message: 'Stock market update',
    category: 'FINANCE',
    channel: 'EMAIL',
    userEmail: 'alice@example.com',
    userName: 'Alice',
    timestamp: '2026-05-26T12:00:00',
  },
  {
    id: 2,
    message: 'New movie release',
    category: 'MOVIES',
    channel: 'SMS',
    userEmail: 'bob@example.com',
    userName: 'Bob',
    timestamp: '2026-05-26T13:00:00',
  },
  {
    id: 3,
    message: 'Game highlights',
    category: 'SPORTS',
    channel: 'PUSH',
    userEmail: 'carol@example.com',
    userName: 'Carol',
    timestamp: '2026-05-26T14:00:00',
  },
];

describe('NotificationHistory', () => {
  it('renders empty state when history is empty', () => {
    render(<NotificationHistory history={[]} />);

    expect(screen.getByText('No notification history recorded yet.')).toBeInTheDocument();
    expect(screen.getByText('0 Entries')).toBeInTheDocument();
  });

  it('renders the correct number of history rows', () => {
    render(<NotificationHistory history={mockHistory} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Carol')).toBeInTheDocument();
  });

  it('displays the entry count badge', () => {
    render(<NotificationHistory history={mockHistory} />);

    expect(screen.getByText('3 Entries')).toBeInTheDocument();
  });

  it('renders user email alongside name', () => {
    render(<NotificationHistory history={mockHistory} />);

    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
  });

  it('renders category badges', () => {
    render(<NotificationHistory history={mockHistory} />);

    expect(screen.getByText('FINANCE')).toBeInTheDocument();
    expect(screen.getByText('MOVIES')).toBeInTheDocument();
    expect(screen.getByText('SPORTS')).toBeInTheDocument();
  });

  it('renders channel labels in lowercase', () => {
    render(<NotificationHistory history={mockHistory} />);

    expect(screen.getByText('email')).toBeInTheDocument();
    expect(screen.getByText('sms')).toBeInTheDocument();
    expect(screen.getByText('push')).toBeInTheDocument();
  });

  it('renders message content', () => {
    render(<NotificationHistory history={mockHistory} />);

    expect(screen.getByText('Stock market update')).toBeInTheDocument();
    expect(screen.getByText('New movie release')).toBeInTheDocument();
    expect(screen.getByText('Game highlights')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    render(<NotificationHistory history={mockHistory} />);

    expect(screen.getByText('Timestamp')).toBeInTheDocument();
    expect(screen.getByText('Recipient')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Channel')).toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
  });
});
