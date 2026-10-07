import { useEffect } from 'react';

export function CustomCursor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = document.createElement('div');
    dot.className = 'cv-cursor-dot';
    dot.dataset.state = 'default';
    dot.setAttribute('aria-hidden', 'true');
    document.body.append(dot);

    const onMove = (e) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      // Hide if very close to the edges to prevent sticking
      if (
        e.clientX <= 2 ||
        e.clientY <= 2 ||
        e.clientX >= window.innerWidth - 2 ||
        e.clientY >= window.innerHeight - 2
      ) {
        dot.style.opacity = '0';
      } else {
        dot.style.opacity = '1';
      }
    };

    const onOver = (e) => {
      const t = e.target;
      if (t.closest?.('input, textarea')) {
        dot.dataset.state = 'text';
      } else if (t.closest?.('a, button, [data-cursor], .cv-cta, .cv-card, .cv-chip')) {
        dot.dataset.state = 'pointer';
      } else {
        dot.dataset.state = 'default';
      }
    };

    const onLeave = () => {
      dot.style.opacity = '0';
    };

    const onEnter = () => {
      dot.style.opacity = '1';
    };

    const onBlur = () => {
      dot.style.opacity = '0';
    };

    const onFocus = () => {
      dot.style.opacity = '1';
    };

    const onMouseOut = (e) => {
      if (!e.relatedTarget && !e.toElement) {
        dot.style.opacity = '0';
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseout', onMouseOut);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      dot.remove();
    };
  }, []);

  return null;
}
