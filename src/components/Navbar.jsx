import { useState } from 'react';
import { CATS } from '../data';
import Logo from './Logo.jsx';

export default function Navbar({ user, cart, onFilter, onLogin, onLogout, onCart }) {
  const [open, setOpen] = useState(false);
  const [dd, setDd] = useState(null);
  const [q, setQ] = useState('');
  const pick = (g, c) => { setQ(''); onFilter(g, c); setDd(null); setOpen(false); };
  const clearSearch = () => { setQ(''); onFilter('all', 'all', ''); };
  const search = e => { e.preventDefault(); onFilter('all', 'all', q.trim()); setOpen(false); };

  return (<>
    <div className="announce">Free shipping across India &nbsp;|&nbsp; 14-day easy returns &nbsp;|&nbsp; <i className="bi bi-geo-alt-fill"></i> Bangalore, India</div>
    <nav className="navbar navbar-expand-xl sticky-top vastra-nav">
      <div className="container-xl">
        <a className="navbar-brand" href="#home" aria-label="Vastra, Bangalore India"><Logo /></a>
        <button className="navbar-toggler" onClick={() => setOpen(!open)} aria-label="Menu"><i className="bi bi-list fs-2"></i></button>
        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-xl-0">
            {['men', 'women'].map(g => (
              <li key={g} className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#shop" role="button" aria-expanded={dd === g}
                   onClick={e => { e.preventDefault(); setDd(dd === g ? null : g); }}>{g[0].toUpperCase() + g.slice(1)}</a>
                <ul className={`dropdown-menu ${dd === g ? 'show' : ''}`}>
                  {CATS.map(([k, l]) => <li key={k}><a className="dropdown-item" href="#shop" onClick={e => { e.preventDefault(); pick(g, k); }}>{l}</a></li>)}
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#shop" onClick={e => { e.preventDefault(); pick(g, 'all'); }}>All {g === 'men' ? "Men's" : "Women's"}</a></li>
                </ul>
              </li>))}
            {[['bestsellers', 'Best Sellers'], ['offers', 'Offers'], ['story', 'About Us'], ['reviews', 'Customer Reviews']].map(([id, l]) =>
              <li key={id} className="nav-item"><a className="nav-link" href={'#' + id} onClick={() => setOpen(false)}>{l}</a></li>)}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#contact" role="button" aria-expanded={dd === 'contact'}
                 onClick={e => { e.preventDefault(); setDd(dd === 'contact' ? null : 'contact'); }}><i className="bi bi-geo-alt-fill"></i> Contact</a>
              <ul className={`dropdown-menu ${dd === 'contact' ? 'show' : ''}`}>
                <li><span className="dropdown-item-text contact-line"><i className="bi bi-geo-alt-fill"></i> Bangalore, India</span></li>
                <li><span className="dropdown-item-text contact-line"><i className="bi bi-envelope"></i> care@vastra.in</span></li>
                <li><span className="dropdown-item-text contact-line"><i className="bi bi-telephone"></i> +91 80 0000 0000</span></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#contact" onClick={() => { setDd(null); setOpen(false); }}>Go to contact section</a></li>
              </ul>
            </li>
          </ul>
          <form className="search-box me-xl-3" onSubmit={search} role="search">
            <input className="form-control" type="text" placeholder="Search sherwanis, sarees…" value={q} onChange={e => setQ(e.target.value)} aria-label="Search" />
            {q && <button type="button" className="btn clear-btn" aria-label="Clear search" onClick={clearSearch}><i className="bi bi-x-lg"></i></button>}
            <button type="submit" className="btn" aria-label="Search"><i className="bi bi-search"></i></button>
          </form>
          <div className="d-flex align-items-center gap-3 mt-2 mt-xl-0">
            {user
              ? <><span className="small">Hi, {user.name.split(' ')[0]}</span><button className="btn btn-gold-outline" onClick={onLogout}>Logout</button></>
              : <button className="btn btn-gold-outline" onClick={onLogin}><i className="bi bi-person"></i> Login / Sign up</button>}
            <button type="button" className="cart-link" aria-label={`Bag, ${cart} items`} onClick={onCart}><i className="bi bi-bag fs-5"></i><span className="badge">{cart}</span></button>
          </div>
        </div>
      </div>
    </nav>
  </>);
}
