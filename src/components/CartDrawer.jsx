import { useEffect } from 'react';
import { SmartImg } from '../hooks.jsx';

export default function CartDrawer({ items, onClose, onQty, onRemove }) {
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k);
  }, [onClose]);
  const total = items.reduce((t, i) => t + i.price * i.qty, 0);
  return (
    <div className="cart-overlay" onClick={onClose}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Your bag" onClick={e => e.stopPropagation()}>
        <div className="cart-head"><h3>Your Bag</h3><button className="btn-close" onClick={onClose} aria-label="Close"></button></div>
        <div className="cart-body">
          {!items.length && <p className="text-muted py-4">Your bag is empty. Pick a piece, choose a size and add it here.</p>}
          {items.map(i => (
            <div className="cart-item" key={i.id + i.size}>
              <div className="cart-thumb"><SmartImg src={i.image} alt={i.name} /></div>
              <div className="cart-info">
                <b>{i.name}</b>
                <small>Size: {i.size}</small>
                <span className="price">₹{(i.price * i.qty).toLocaleString('en-IN')}</span>
                <div className="qty">
                  <button onClick={() => onQty(i, -1)} aria-label="Decrease quantity">−</button><span>{i.qty}</span><button onClick={() => onQty(i, 1)} aria-label="Increase quantity">+</button>
                  <button className="rm" onClick={() => onRemove(i)} aria-label={`Remove ${i.name}`}><i className="bi bi-trash"></i></button>
                </div>
              </div>
            </div>))}
        </div>
        {!!items.length && <div className="cart-foot"><div className="d-flex justify-content-between mb-3"><span>Subtotal</span><b>₹{total.toLocaleString('en-IN')}</b></div><button className="btn btn-gold w-100">Checkout</button></div>}
      </aside>
    </div>);
}
