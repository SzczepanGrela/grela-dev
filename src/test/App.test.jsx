import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { App } from '../App';

describe('App component', () => {
  beforeEach(() => {
    window.location.hash = '';
    localStorage.clear();
  });

  it('renders landing page with hero, navigation, projects, and skills', () => {
    render(<App />);

    expect(screen.getAllByText(/SZCZEPAN GRELA/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /SmakoszWebApp/i })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
  });

  it('toggles language between English and Polish', () => {
    render(<App />);

    // Default is English
    expect(screen.getByRole('button', { name: /switch language to english/i })).toBeInTheDocument();

    // Switch to Polish
    const plBtn = screen.getByRole('button', { name: /przełącz język na polski/i });
    fireEvent.click(plBtn);

    // Polish content should appear
    expect(screen.getByText(/SZUKAM PRACY/i)).toBeInTheDocument();

    // Switch back to English
    const enBtn = screen.getByRole('button', { name: /switch language to english/i });
    fireEvent.click(enBtn);
    expect(screen.getByText(/OPEN TO ROLES/i)).toBeInTheDocument();
  });

  it('toggles theme between dark and light mode', () => {
    render(<App />);

    const lightBtn = screen.getByRole('button', { name: /switch to light theme/i });
    fireEvent.click(lightBtn);

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.body.getAttribute('data-theme')).toBe('light');

    const darkBtn = screen.getByRole('button', { name: /switch to dark theme/i });
    fireEvent.click(darkBtn);

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.body.getAttribute('data-theme')).toBe('dark');
  });

  it('navigates to project detail via hash change and returns to home', async () => {
    render(<App />);

    // Trigger hashchange to project detail
    act(() => {
      window.location.hash = '#project-smakosz';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    const matches = await screen.findAllByText(/Neural Collaborative Filtering/i);
    expect(matches.length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /← work/i })).toBeInTheDocument();

    // Click back button
    const backBtn = screen.getByRole('button', { name: /← work/i });
    fireEvent.click(backBtn);

    // Should return to home
    expect(screen.getByRole('heading', { name: /SmakoszWebApp/i })).toBeInTheDocument();
  });

  it('renders 404 not-found view when navigating to an unknown project hash', async () => {
    render(<App />);

    act(() => {
      window.location.hash = '#project-nonexistent-project';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(await screen.findByText(/404 · Project not found/i)).toBeInTheDocument();
    expect(screen.getByText(/"nonexistent-project"/i)).toBeInTheDocument();

    const returnBtn = screen.getByRole('button', { name: /← back to projects/i });
    fireEvent.click(returnBtn);

    expect(screen.getByRole('heading', { name: /SmakoszWebApp/i })).toBeInTheDocument();
  });
});
