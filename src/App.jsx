import { useState, useEffect, useRef } from 'react';
import { PRODUCTS } from './data';
import Navbar from './components/Navbar';
import { Hero, Story, Offers, Reviews, Footer } from './components/Sections';
import Shop from './components/Shop';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';

export default function App() {
  const [filter, setFilter] = useState({ gender: 'all', category: 'all', q: '' });
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('vastra_user') || 'null'));
  const [items, setItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [toast, setToast] = useState('');
  const pending = useRef(null);
  const key = u => `vastra_bag_${u.email}`;
  const load = u => { try { return JSON.parse(localStorage.getItem(key(u)) || '[]'); } catch { return []; } };
  const save = (u, list) => { setItems(list); localStorage.setItem(key(u), JSON.stringify(list)); };
  useEffect(() => { setItems(user ? load(user) : []); }, []); // restore the bag of a logged-in user on reload

  const notify = m => { setToast(m); setTimeout(() => setToast(''), 2200); };
  const addTo = (u, p, size) => {
    const list = load(u), hit = list.find(i => i.id === p.id && i.size === size);
    if (hit) hit.qty += 1; else list.push({ id: p.id, name: p.name, price: p.price, image: p.image, size, qty: 1 });
    save(u, list); setCartOpen(true);
  };
  const addToCart = (p, size) => {
    if (!user) { pending.current = { p, size }; setAuthOpen(true); notify('Please login to add to your bag'); return; }
    addTo(user, p, size);
  };
  const onAuth = u => {
    localStorage.setItem('vastra_user', JSON.stringify(u)); setUser(u); setAuthOpen(false); notify(`Welcome, ${u.name}`);
    setItems(load(u));
    if (pending.current) { const { p, size } = pending.current; pending.current = null; addTo(u, p, size); }
  };
  const logout = () => { localStorage.removeItem('vastra_user'); setUser(null); setItems([]); setCartOpen(false); notify('Logged out'); };
  const openCart = () => { if (!user) { setAuthOpen(true); notify('Please login to view your bag'); } else setCartOpen(true); };
  const changeQty = (it, d) => save(user, load(user).map(i => i.id === it.id && i.size === it.size ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  const removeItem = it => save(user, load(user).filter(i => !(i.id === it.id && i.size === it.size)));
  const count = items.reduce((t, i) => t + i.qty, 0);
  const applyFilter = (gender, category = 'all', q = '') => {
    setFilter({ gender, category, q });
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (<>
    <Navbar user={user} cart={count} onCart={openCart} onFilter={applyFilter} onLogin={() => setAuthOpen(true)} onLogout={logout} />
    <Hero onFilter={applyFilter} />
    <Story />
    <Shop id="shop" title="Curated Edits" filter={filter} setFilter={setFilter} items={PRODUCTS} onAdd={addToCart} />
    <Shop id="bestsellers" title="Best Sellers" items={PRODUCTS.filter(p => p.tag === 'Bestseller')} onAdd={addToCart} />
    <Offers onJoin={() => setAuthOpen(true)} />
    <Reviews />
    <Footer onFilter={applyFilter} />
    {cartOpen && user && <CartDrawer items={items} onClose={() => setCartOpen(false)} onQty={changeQty} onRemove={removeItem} />}
    {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onSuccess={onAuth} />}
    {toast && <div className="toast-lite">{toast}</div>}
  </>);
}



