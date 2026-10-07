import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppProvider } from '../context/AppContext';
import { ProjectMosaic } from '../components/sections/ProjectMosaic';
import { ThumbStripes } from '../components/common/ThumbStripes';

function renderWithProvider(ui) {
  return render(<AppProvider>{ui}</AppProvider>);
}

describe('Project filtering and faceted search', () => {
  it('renders all 7 projects initially', () => {
    renderWithProvider(
      <ProjectMosaic wrapWithSidebar={true} ThumbComp={ThumbStripes} onOpenDetail={() => {}} />
    );

    expect(screen.getByRole('heading', { name: /SmakoszWebApp/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /UrlShortenerSystem/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /narzedzia-ai-pipeline/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /AudioMaster/i })).toBeInTheDocument();
  });

  it('filters projects by text query', () => {
    renderWithProvider(
      <ProjectMosaic wrapWithSidebar={true} ThumbComp={ThumbStripes} onOpenDetail={() => {}} />
    );

    const input = screen.getByPlaceholderText(/Search projects, tags, technologies…/i);
    fireEvent.change(input, { target: { value: 'AudioMaster' } });

    expect(screen.getByRole('heading', { name: /AudioMaster/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /UrlShortenerSystem/i })).not.toBeInTheDocument();

    // Clear search
    const clearBtn = screen.getByText(/Clear filters/i);
    fireEvent.click(clearBtn);

    expect(screen.getByRole('heading', { name: /UrlShortenerSystem/i })).toBeInTheDocument();
  });

  it('shows no results message when search query has no match', () => {
    renderWithProvider(
      <ProjectMosaic wrapWithSidebar={true} ThumbComp={ThumbStripes} onOpenDetail={() => {}} />
    );

    const input = screen.getByPlaceholderText(/Search projects, tags, technologies…/i);
    fireEvent.change(input, { target: { value: 'xyznonexistent123' } });

    expect(screen.getByText(/No projects match these filters./i)).toBeInTheDocument();
  });
});
