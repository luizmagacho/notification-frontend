import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusBanner from '../StatusBanner';

describe('StatusBanner', () => {
  it('renders nothing when status is null', () => {
    const { container } = render(<StatusBanner status={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders success banner with correct text and styling', () => {
    render(<StatusBanner status={{ type: 'success', text: 'Notification sent!' }} />);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Notification sent!');
    expect(alert.className).toContain('bg-emerald-50');
  });

  it('renders error banner with correct text and styling', () => {
    render(<StatusBanner status={{ type: 'error', text: 'Something went wrong' }} />);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Something went wrong');
    expect(alert.className).toContain('bg-rose-50');
  });
});
