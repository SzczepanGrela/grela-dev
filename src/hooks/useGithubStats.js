import { useState, useEffect } from 'react';

const FALLBACK_STATS = {
  loading: false,
  mock: true,
  repos: 16,
  stars: 0,
  languages: [
    { name: "C#", pct: 0.42 },
    { name: "Python", pct: 0.35 },
    { name: "Dart", pct: 0.08 },
    { name: "JS", pct: 0.08 },
    { name: "HTML", pct: 0.07 },
  ],
  top: { name: "SmakoszWebApp", desc: "NCF recommender · Clean Arch backend" },
};

export function useGithubStats(handle) {
  const [data, setData] = useState(() => {
    try {
      const cached = sessionStorage.getItem(`gh_stats_${handle}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // ignore
    }
    return { loading: true, mock: false, repos: 0, stars: 0, languages: [], top: null };
  });

  useEffect(() => {
    let active = true;

    async function fetchStats() {
      try {
        const cached = sessionStorage.getItem(`gh_stats_${handle}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (active) setData(parsed);
          return;
        }
      } catch {
        // ignore
      }

      try {
        const res = await fetch(`https://api.github.com/users/${handle}/repos?per_page=100&sort=updated`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const repos = await res.json();
        if (!active || !Array.isArray(repos)) return;

        const langMap = {};
        let stars = 0;
        const publicRepos = repos.filter(p => !p.fork);
        publicRepos.forEach(p => {
          if (p.language) langMap[p.language] = (langMap[p.language] || 0) + 1;
          stars += p.stargazers_count || 0;
        });

        const total = Object.values(langMap).reduce((a, b) => a + b, 0) || 1;
        const languages = Object.entries(langMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, count]) => ({ name, pct: count / total }));

        const top = publicRepos.find(p => p.name === "SmakoszWebApp") || publicRepos[0] || null;

        const result = {
          loading: false,
          mock: false,
          repos: publicRepos.length,
          stars,
          languages,
          top: top ? { name: top.name, desc: top.description || "" } : null,
        };

        if (active) {
          setData(result);
          try {
            sessionStorage.setItem(`gh_stats_${handle}`, JSON.stringify(result));
          } catch {
            // ignore
          }
        }
      } catch {
        if (active) {
          setData(FALLBACK_STATS);
        }
      }
    }

    fetchStats();

    return () => {
      active = false;
    };
  }, [handle]);

  return data;
}
