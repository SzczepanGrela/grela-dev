import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CustomCursor } from './components/layout/CustomCursor';
import { TopBar } from './components/layout/TopBar';
import { Hero } from './components/sections/Hero';
import { ProjectMosaic } from './components/sections/ProjectMosaic';
import { Skills } from './components/sections/Skills';
import { About } from './components/sections/About';
import { Experience } from './components/sections/Experience';
import { Contact } from './components/sections/Contact';
import { ThumbStripes } from './components/common/ThumbStripes';
import { DetailSplit } from './components/detail/DetailSplit';

function Landing({ onOpenDetail }) {
  return (
    <main>
      <Hero />
      <ProjectMosaic wrapWithSidebar={true} ThumbComp={ThumbStripes} onOpenDetail={onOpenDetail} />
      <Skills />
      <About />
      <Experience />
      <Contact />
    </main>
  );
}

function Page() {
  const { theme } = useApp();
  const [page, setPage] = useState('home');
  const [projectId, setProjectId] = useState('smakosz');

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#project-')) {
        const id = hash.replace('#project-', '');
        setProjectId(id);
        setPage('detail');
        window.scrollTo(0, 0);
      } else {
        setPage('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateToDetail = (id) => {
    window.location.hash = `project-${id}`;
    setProjectId(id);
    setPage('detail');
  };

  const navigateToHome = () => {
    window.location.hash = '';
    setPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="cv-root" data-theme={theme} data-screen-label={page === 'home' ? 'Landing' : `Project · ${projectId}`}>
      <TopBar artboardId={page === 'home' ? 'home' : projectId} />
      {page === 'home' && <Landing onOpenDetail={navigateToDetail} />}
      {page === 'detail' && <DetailSplit projectId={projectId} onBack={navigateToHome} />}
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <CustomCursor />
      <Page />
    </AppProvider>
  );
}
