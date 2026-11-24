import { useState, useEffect } from 'react';
import { CATS, SIZES, SIZE_CHART } from '../data';
import { tiltProps, Reveal, SmartImg } from '../hooks.jsx';

const COL = { ethnic: ['#D6B25E', '#8F6F26'], office: ['#6B7C85', '#2F3A40'], night: ['#3A2F70', '#0F0B22'], wedding: ['#9A2F57', '#4B1228'] };
const OFFICE_LIMIT = 2; // how many Office Wear pieces to show per gender
const cap = s => s[0].toUpperCase() + s.slice(1);

function Card({ p, onAdd, i, onZoom }) {
  return (
    <Reveal className="col-6 col-md-4 col-xl-3" delay={(i % 4) * 90}>
      <article className="pcard tilt" {...tiltProps(9)}>
        <div className="img" style={{ background: `linear-gradient(160deg,${COL[p.category][0]},${COL[p.category][1]})` }}>
          <span className="dress" aria-hidden="true"></span>
          <SmartImg className="bgimg" src={p.image} alt={p.name} loading="lazy" />
          <button className="zoom-hit" aria-label={`View ${p.name} larger`} onClick={e => { e.currentTarget.classList.remove('pulse'); void e.currentTarget.offsetWidth; e.currentTarget.classList.add('pulse'); setTimeout(() => onZoom(p), 220); }}><i className="bi bi-arrows-fullscreen"></i></button>
          {p.tag && <span className="tag">{p.tag}</span>}
          <span className="glare"></span>
          <button className="btn btn-gold add" onClick={() => onZoom(p)}>Select size</button>
        </div>
        <h3>{p.name}</h3>
        <div className="meta">{cap(p.gender)} · {CATS.find(c => c[0] === p.category)[1]}</div>
        <div><span className="price">₹{p.price.toLocaleString('en-IN')}</span> <span className="rate">★ {p.rating}</span></div>
      </article>
    </Reveal>);
}

function Lightbox({ p, onClose, onAdd }) {
  const [zoom, setZoom] = useState(false);
  const [size, setSize] = useState('');
  const [chart, setChart] = useState(false);
  const [warn, setWarn] = useState(false);
  const sc = SIZE_CHART[p.gender];
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', k); document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [onClose]);
  const pan = e => {
    if (!zoom) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--ox', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--oy', `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <div className="lb" onClick={onClose} role="dialog" aria-modal="true" aria-label={p.name}>
      <div className="lb-card" onClick={e => e.stopPropagation()}>
        <button className="lb-close" onClick={onClose} aria-label="Close"><i className="bi bi-x-lg"></i></button>
        <div className={`lb-img ${zoom ? 'zoomed' : ''}`} onClick={() => setZoom(!zoom)} onMouseMove={pan} style={{ background: `linear-gradient(160deg,${COL[p.category][0]},${COL[p.category][1]})` }}>
          <SmartImg src={p.image} alt={p.name} />
          <span className="lb-shine"></span>
          <span className="lb-hint">{zoom ? 'Click to zoom out' : 'Click to zoom in'}</span>
        </div>
        <div className="lb-info">
          <h3>{p.name}</h3>
          <div className="meta">{cap(p.gender)} · {CATS.find(c => c[0] === p.category)[1]}</div>
          <div className="my-2"><span className="price">₹{p.price.toLocaleString('en-IN')}</span> <span className="rate">★ {p.rating}</span></div>
          <div className="size-head"><b>Select size</b><button type="button" className="link-btn" onClick={() => setChart(!chart)}><i className="bi bi-rulers"></i> {chart ? 'Hide' : 'Size'} chart</button></div>
          <div className={`sizes ${warn ? 'warn' : ''}`} role="radiogroup" aria-label="Size">
            {SIZES.map(z => <button key={z} type="button" role="radio" aria-checked={size === z} className={`size ${size === z ? 'active' : ''}`} onClick={() => { setSize(z); setWarn(false); }}>{z}</button>)}
          </div>
          {warn && <div className="small text-danger mb-2" role="alert">Please choose a size first.</div>}
          {chart && <div className="chart-wrap"><table className="size-table"><thead><tr>{sc.head.map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{sc.rows.map(r => <tr key={r[0]} className={r[0] === size ? 'hl' : ''}>{r.map((c, i) => i ? <td key={i}>{c}</td> : <th key={i}>{c}</th>)}</tr>)}</tbody></table>
            <small className="text-muted">Measurements in inches. Between sizes? Choose the larger one.</small></div>}
          <button className="btn btn-gold mt-2" onClick={() => { if (!size) { setWarn(true); return; } onAdd(p, size); onClose(); }}>Add to bag{size && ` · ${size}`}</button>
        </div>
      </div>
    </div>);
}

export default function Shop({ id, title, items, filter, setFilter, onAdd }) {
  const [zoomed, setZoomed] = useState(null);
  let list = filter ? items.filter(p =>
    (filter.gender === 'all' || p.gender === filter.gender) && (filter.category === 'all' || p.category === filter.category) &&
    (!filter.q || (p.name + p.gender + p.category).toLowerCase().includes(filter.q.toLowerCase()))) : items;
  if (filter && filter.category === 'office' && !filter.q) { const seen = {}; list = list.filter(p => (seen[p.gender] = (seen[p.gender] || 0) + 1) <= OFFICE_LIMIT); }
  const label = filter && `${filter.gender === 'all' ? 'All collections' : cap(filter.gender) + "'s"}${filter.category !== 'all' ? ' · ' + CATS.find(c => c[0] === filter.category)[1] : ''}${filter.q ? ` · “${filter.q}”` : ''}`;
  return (
    <section id={id} className="container-xl section">
      <Reveal className="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-2">
        <h2 className="sec-title">{title} {label && <small>{label}</small>}</h2>
        {filter && <div className="chips">
          {[['all', 'All'], ...CATS].map(([k, l]) =>
            <button key={k} className={`chip ${filter.category === k ? 'active' : ''}`} onClick={() => setFilter({ ...filter, category: k, q: '' })}>{l}</button>)}
        </div>}
      </Reveal>
      {!list.length && <p className="text-muted py-4">No pieces match. Try another word or clear the filters.</p>}
      <div className="row g-4">{list.map((p, i) => <Card key={p.id} p={p} i={i} onAdd={onAdd} onZoom={setZoomed} />)}</div>
      {zoomed && <Lightbox p={zoomed} onAdd={onAdd} onClose={() => setZoomed(null)} />}
    </section>);
}
