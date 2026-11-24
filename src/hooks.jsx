import { useEffect, useRef, useState } from 'react';

// 3D tilt: sets --rx/--ry (rotation) and --mx/--my (glare position) on the element
export const tiltProps = (max = 10) => ({
  onMouseMove(e) {
    const r = e.currentTarget.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    const s = e.currentTarget.style;
    s.setProperty('--rx', `${(0.5 - y) * max * 2}deg`); s.setProperty('--ry', `${(x - 0.5) * max * 2}deg`);
    s.setProperty('--mx', `${x * 100}%`); s.setProperty('--my', `${y * 100}%`);
  },
  onMouseLeave(e) { const s = e.currentTarget.style; s.setProperty('--rx', '0deg'); s.setProperty('--ry', '0deg'); }
});

// Scroll reveal with a 3D rotate-in
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const ref = useRef();
  useEffect(() => {
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { ref.current.classList.add('in'); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(ref.current); return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={`reveal ${className}`} style={{ '--d': `${delay}ms` }}>{children}</Tag>;
}

// Image that tries .jpg first, then .png, and disappears (showing the gradient placeholder) if neither exists
export function SmartImg({ src, ...rest }) {
  const [s, setS] = useState(src);
  useEffect(() => setS(src), [src]);
  if (!s) return null;
  return <img src={s} {...rest} onError={() => setS(s.endsWith('.jpg') ? s.replace(/\.jpg$/, '.png') : null)} />;
}
