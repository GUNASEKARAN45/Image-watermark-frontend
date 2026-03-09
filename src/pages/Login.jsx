import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('All fields required');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}`);
      navigate('/upload');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back</h2>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <Field label="Email">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder=""
              style={styles.input}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = '#e5e3de'}
            />
          </Field>

          <Field label="Password">
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder=""
                style={{ ...styles.input, paddingRight: '3rem' }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e5e3de'}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </Field>

          <button type="submit" disabled={loading} style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          No account? <Link to="/signup" style={{ color: '#2563eb', fontWeight: 600 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f7f4',
    padding: '2rem',
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e5e3de',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
  },
  header: { textAlign: 'center', marginBottom: '2rem' },
  brand: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '1.8rem',
    fontWeight: 400,
    color: '#1a1a1a',
    marginBottom: '1.2rem',
    letterSpacing: '-0.5px',
  },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.4rem' },
  subtitle: { color: '#6b6560', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  label: { fontSize: '0.8rem', fontWeight: 600, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.06em' },
  input: {
    background: '#fafaf8',
    border: '1px solid #e5e3de',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#1a1a1a',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.15s',
    width: '100%',
  },
  eyeBtn: {
    position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', color: '#9c9690', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
  },
  btn: {
    background: '#1a1a1a',
    border: 'none',
    borderRadius: '8px',
    padding: '0.85rem',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '0.25rem',
    transition: 'opacity 0.15s',
    letterSpacing: '0.01em',
  },
  footer: { textAlign: 'center', marginTop: '1.5rem', color: '#6b6560', fontSize: '0.875rem' },
};