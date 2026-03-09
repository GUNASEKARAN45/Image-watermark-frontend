import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword)
      return toast.error('All fields are required');
    if (form.password !== form.confirmPassword)
      return toast.error('Passwords do not match');
    if (form.password.length < 6)
      return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { name: form.name, email: form.email, password: form.password });
      login(res.data.user, res.data.token);
      toast.success(`Welcome, ${res.data.user.name}`);
      navigate('/upload');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Weak', color: '#dc2626', w: '30%' };
    if (p.length < 10) return { label: 'Moderate', color: '#d97706', w: '60%' };
    return { label: 'Strong', color: '#16a34a', w: '100%' };
  };
  const s = strength();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create account</h2>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <Field label="Full Name">
            <input type="text" name="name" value={form.name} onChange={handleChange}
               style={styles.input}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = '#e5e3de'} />
          </Field>

          <Field label="Email">
            <input type="email" name="email" value={form.email} onChange={handleChange}
               style={styles.input}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = '#e5e3de'} />
          </Field>

          <Field label="Password">
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} name="password" value={form.password}
                onChange={handleChange} placeholder="Min. 6 characters"
                style={{ ...styles.input, paddingRight: '3.5rem' }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e5e3de'} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
            {s && (
              <div style={{ marginTop: '0.35rem' }}>
                <div style={{ background: '#f0ede8', borderRadius: '3px', height: '3px' }}>
                  <div style={{ height: '100%', width: s.w, background: s.color, borderRadius: '3px', transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: '0.72rem', color: s.color, display: 'block', marginTop: '0.2rem', fontWeight: 500 }}>{s.label}</span>
              </div>
            )}
          </Field>

          <Field label="Confirm Password">
            <div style={{ position: 'relative' }}>
              <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword}
                onChange={handleChange} placeholder="Re enter password"
                style={{ ...styles.input, paddingRight: '3.5rem', borderColor: form.confirmPassword && form.confirmPassword !== form.password ? '#dc2626' : '#e5e3de' }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = form.confirmPassword && form.confirmPassword !== form.password ? '#dc2626' : '#e5e3de'} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
            {form.confirmPassword && form.confirmPassword !== form.password &&
              <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 500 }}>Passwords do not match</span>}
            {form.confirmPassword && form.confirmPassword === form.password &&
              <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 500 }}>Passwords match</span>}
          </Field>

          <button type="submit" disabled={loading} style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>Sign in</Link>
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
    maxWidth: '440px',
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
  form: { display: 'flex', flexDirection: 'column', gap: '1.1rem' },
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
  },
  footer: { textAlign: 'center', marginTop: '1.5rem', color: '#6b6560', fontSize: '0.875rem' },
};