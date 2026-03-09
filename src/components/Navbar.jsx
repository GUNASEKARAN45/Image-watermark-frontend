import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      {/* Left - Logo */}
      <div style={styles.left}>
        <Link to="/upload" style={styles.brand}>Switch Mobility</Link>
      </div>

      {/* Center - Nav links */}
      <div style={styles.center}>
        <NavLink to="/upload" active={location.pathname === '/upload'}>Upload</NavLink>
        <NavLink to="/gallery" active={location.pathname === '/gallery'}>Gallery</NavLink>
      </div>

      {/* Right - User + Logout */}
      <div style={styles.right}>
        <button
          onClick={handleLogout}
          style={styles.logoutBtn}
          onMouseOver={e => e.currentTarget.style.background = '#fef2f2'}
          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      style={{
        padding: '0.4rem 1.2rem',
        borderRadius: '7px',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: 500,
        background: active ? '#1a1a1a' : 'transparent',
        color: active ? '#ffffff' : '#6b6560',
        transition: 'all 0.15s',
      }}
      onMouseOver={e => { if (!active) { e.currentTarget.style.color = '#1a1a1a'; e.currentTarget.style.background = '#f0ede8'; } }}
      onMouseOut={e => { if (!active) { e.currentTarget.style.color = '#6b6560'; e.currentTarget.style.background = 'transparent'; } }}
    >
      {children}
    </Link>
  );
}

const styles = {
  nav: {
    background: '#ffffff',
    borderBottom: '1px solid #e5e3de',
    height: '62px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    padding: '0 2.5rem',
  },
  left: { display: 'flex', alignItems: 'center', justifyContent: 'flex-start' },
  brand: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '1.25rem',
    fontWeight: 400,
    color: '#1a1a1a',
    textDecoration: 'none',
    letterSpacing: '-0.3px',
  },
  center: { display: 'flex', alignItems: 'center', gap: '0.25rem' },
  right: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' },
  userLabel: { fontSize: '0.875rem', color: '#6b6560', fontWeight: 500 },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #fca5a5',
    color: '#dc2626',
    padding: '0.38rem 1rem',
    borderRadius: '7px',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
};