// @vitest-environment jsdom
import React from 'react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot } from 'react-dom/client';

const push = vi.fn();
const mockUseSession = vi.fn();

vi.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

vi.mock('@/components/rfds', () => ({
  RFDS: {
    Input: ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => <input className={className} {...props} />,
    Textarea: ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea className={className} {...props} />,
    SemanticButton: ({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button className={className} {...props}>
        {children}
      </button>
    ),
  },
}));

vi.mock('@/components/ui/country-select', () => ({
  CountrySelect: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <label>
      Country
      <select aria-label="Country" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Select a country</option>
        <option value="United States">United States</option>
      </select>
    </label>
  ),
}));

describe('AddCommunityForm', () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot> | null;

  beforeEach(() => {
    vi.useFakeTimers();
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    push.mockReset();
    mockUseSession.mockReturnValue({
      data: {
        user: { email: 'organizer@example.com' },
      },
    });
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        success: true,
        submissionId: 'submission-abc-123',
      }),
    } as Response);
    container = document.createElement('div');
    document.body.appendChild(container);
    root = null;
  });

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    container.remove();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('shows the confirmation ID returned by the API after a successful submission', async () => {
    const { AddCommunityForm } = await import('./AddCommunityForm');
    root = createRoot(container);

    await act(async () => {
      root!.render(<AddCommunityForm />);
    });

    fillField('Community Name *', 'React Michigan');
    fillField('Full Address *', '123 Main St');
    fillField('City *', 'Detroit');
    fillField('Description *', 'A React meetup in Michigan');
    fillField('Your Name *', 'Ada Lovelace');
    fillField('Email *', 'ada@example.com');
    setSelect('Country', 'United States');

    await act(async () => {
      container.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(await screenText()).toContain('Community submitted!');
    expect(await screenText()).toContain('Confirmation ID:');
    expect(await screenText()).toContain('submission-abc-123');
  });
});

function fillField(labelText: string, value: string) {
  const label = [...document.querySelectorAll('label')].find((node) =>
    node.textContent?.replace(/\s+/g, ' ').includes(labelText)
  );

  if (!label) {
    throw new Error(`Label not found: ${labelText}`);
  }

  const field = label.parentElement?.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement | null;

  if (!field) {
    throw new Error(`Field not found for label: ${labelText}`);
  }

  act(() => {
    field.value = value;
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

function setSelect(labelText: string, value: string) {
  const label = [...document.querySelectorAll('label')].find((node) =>
    node.textContent?.replace(/\s+/g, ' ').includes(labelText)
  );

  if (!label) {
    throw new Error(`Select label not found: ${labelText}`);
  }

  const select = label.querySelector('select');

  if (!select) {
    throw new Error(`Select not found for label: ${labelText}`);
  }

  act(() => {
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

async function screenText() {
  await act(async () => {
    await Promise.resolve();
  });

  return containerText();
}

function containerText() {
  return containerGlobal().textContent?.replace(/\s+/g, ' ').trim() ?? '';
}

function containerGlobal() {
  const node = document.body.lastElementChild;

  if (!node) {
    throw new Error('Missing rendered container');
  }

  return node;
}
