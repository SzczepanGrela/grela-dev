import { useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { PROJECTS, TAGS, TAG_CATEGORIES } from '../data/portfolioData';

export function useProjectFilter() {
  const { lang, filterActive, setFilterActive, filterQuery, setFilterQuery } = useApp();

  const allTagIds = useMemo(() => {
    const set = new Set();
    PROJECTS.forEach(p => p.tags.forEach(tg => set.add(tg)));
    return Array.from(set);
  }, []);

  const tagsByCat = useMemo(() => {
    const out = {};
    Object.keys(TAG_CATEGORIES).forEach(c => { out[c] = []; });
    allTagIds.forEach(id => {
      const t = TAGS[id];
      if (!t) return;
      (out[t.cat] = out[t.cat] || []).push(id);
    });
    Object.values(out).forEach(arr => arr.sort((a, b) =>
      TAGS[a].label.localeCompare(TAGS[b].label)
    ));
    return out;
  }, [allTagIds]);

  const toggle = useCallback((id) => {
    setFilterActive(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, [setFilterActive]);

  const clear = useCallback(() => {
    setFilterActive(new Set());
    setFilterQuery('');
  }, [setFilterActive, setFilterQuery]);

  const filtered = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    return PROJECTS.filter(p => {
      // tag match: every active tag must be present
      for (const tg of filterActive) {
        if (!p.tags.includes(tg)) return false;
      }
      if (!q) return true;
      const hay = [
        p.name,
        p.summary[lang] || '',
        p.blurb[lang] || '',
        ...p.tags.map(tg => TAGS[tg]?.label || ''),
      ].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [filterQuery, filterActive, lang]);

  const tagCounts = useMemo(() => {
    const c = {};
    allTagIds.forEach(id => { c[id] = 0; });
    filtered.forEach(p => {
      p.tags.forEach(tg => {
        c[tg] = (c[tg] || 0) + 1;
      });
    });
    return c;
  }, [filtered, allTagIds]);

  return {
    query: filterQuery,
    setQuery: setFilterQuery,
    active: filterActive,
    toggle,
    clear,
    tagsByCat,
    tagCounts,
    filtered,
  };
}
