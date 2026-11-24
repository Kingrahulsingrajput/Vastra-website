import { useState } from 'react';
import { auth } from '../data';

export default function AuthModal({ onClose, onSuccess }) {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const set = k => e => setForm({ ...form, [k]: e.target.value });
  const submit = e => {
    e.preventDefault(); setErr('');
    try { onSuccess(tab === 'login' ? auth.login(form) : auth.register(form)); } catch (ex) { setErr(ex.message); }
  };
  return (<>
    <div className="modal-backdrop show" onClick={onClose}></div>
    <div className="modal d-block" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content auth">
          <div className="modal-header border-0">
            <ul className="nav nav-tabs border-0">
              {[['login', 'Login'], ['signup', 'Sign up']].map(([k, l]) =>
                <li key={k} className="nav-item"><button className={`nav-link ${tab === k ? 'active' : ''}`} onClick={() => { setTab(k); setErr(''); }}>{l}</button></li>)}
            </ul>
            <button className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <form className="modal-body" onSubmit={submit}>
            {tab === 'signup' && <input className="form-control mb-3" placeholder="Full name" value={form.name} onChange={set('name')} required />}
            <input className="form-control mb-3" type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
            <input className="form-control mb-3" type="password" placeholder="Password" minLength={6} value={form.password} onChange={set('password')} required />
            {err && <div className="text-danger small mb-3" role="alert">{err}</div>}
            <button className="btn btn-gold w-100">{tab === 'login' ? 'Login' : 'Create account'}</button>
          </form>
        </div>
      </div>
    </div>
  </>);
}
