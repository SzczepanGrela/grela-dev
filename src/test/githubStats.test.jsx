import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGithubStats } from '../hooks/useGithubStats';

function StatsConsumer({ handle }) {
  const stats = useGithubStats(handle);
  return (
    <div>
      <span data-testid="status">{stats.loading ? 'loading' : stats.mock ? 'mock' : 'live'}</span>
      <span data-testid="repos">{stats.repos}</span>
      <span data-testid="languages">{stats.languages.map(l => l.name).join(', ')}</span>
    </div>
  );
}

describe('useGithubStats hook', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('uses fallback mock data when fetch fails or is rejected', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Rate limit exceeded'));

    render(<StatsConsumer handle="test-user" />);

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('mock');
    });

    expect(Number(screen.getByTestId('repos').textContent)).toBeGreaterThan(0);
    expect(screen.getByTestId('languages').textContent).toContain('C#');
  });

  it('loads and processes live repos successfully when fetch succeeds', async () => {
    const fakeRepos = [
      { name: 'repo-1', fork: false, language: 'Python', stargazers_count: 5 },
      { name: 'repo-2', fork: false, language: 'C#', stargazers_count: 3 },
      { name: 'repo-3', fork: true, language: 'Go', stargazers_count: 0 },
    ];

    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => fakeRepos,
    });

    render(<StatsConsumer handle="test-user-success" />);

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('live');
    });

    expect(screen.getByTestId('repos').textContent).toBe('2');
    expect(screen.getByTestId('languages').textContent).toContain('Python');
    expect(screen.getByTestId('languages').textContent).toContain('C#');
  });
});
