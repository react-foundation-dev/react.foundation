import { beforeEach, describe, expect, it, vi } from 'vitest';

const getServerSession = vi.fn();
const saveSubmission = vi.fn();

vi.mock('next-auth', () => ({
  getServerSession,
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

vi.mock('@/lib/redis-community-submissions', () => ({
  saveSubmission,
}));

describe('POST /api/communities/submit', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    getServerSession.mockResolvedValue({
      user: { email: 'organizer@example.com' },
    });
    saveSubmission.mockResolvedValue(undefined);
  });

  it('returns the generated submission ID on successful submission', async () => {
    const randomUUID = vi.spyOn(crypto, 'randomUUID').mockReturnValue('abc-123');
    const { POST } = await import('./route');

    const request = new Request('http://localhost/api/communities/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'React Michigan',
        address: '123 Main St',
        city: 'Detroit',
        country: 'United States',
        description: 'A React meetup in Michigan',
        organizer_name: 'Ada Lovelace',
        organizer_email: 'ada@example.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      success: true,
      message: 'Community submitted successfully. We will review and add it soon!',
      submissionId: 'submission-abc-123',
    });
    expect(saveSubmission).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'submission-abc-123',
        submitted_by: 'organizer@example.com',
      })
    );

    randomUUID.mockRestore();
  });

  it('keeps the existing failure payload when saving fails', async () => {
    saveSubmission.mockRejectedValue(new Error('redis unavailable'));
    const { POST } = await import('./route');

    const request = new Request('http://localhost/api/communities/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'React Michigan',
        address: '123 Main St',
        city: 'Detroit',
        country: 'United States',
        description: 'A React meetup in Michigan',
        organizer_name: 'Ada Lovelace',
        organizer_email: 'ada@example.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ success: false, error: 'Submission failed' });
  });
});
