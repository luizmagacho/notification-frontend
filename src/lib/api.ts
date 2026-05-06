export type Category = 'SPORTS' | 'FINANCE' | 'MOVIES';
export type Channel = 'SMS' | 'EMAIL' | 'PUSH';

export interface NotificationLog {
  id: number;
  message: string;
  category: Category;
  channel: Channel;
  userEmail: string;
  userName: string;
  timestamp: string;
}

const API_BASE_URL = 'http://localhost:8080/api/notifications';

export const api = {
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getHistory(): Promise<NotificationLog[]> {
    const res = await fetch(`${API_BASE_URL}/history`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
  },

  async sendNotification(category: Category, message: string): Promise<{ message?: string; error?: string }> {
    const res = await fetch(`${API_BASE_URL}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, message }),
    });
    return res.json();
  },
};
