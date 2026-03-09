import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sharePopup, setSharePopup] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { user } = useAuth();

  useEffect(() => { fetchImages(); }, []);

  const fetchImages = async () => {
    try {
      const res = await api.get('/images/my');
      setImages(res.data);
    } catch {
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const getShareUrl = (token) => `${window.location.origin}/share/${token}`;

  const copyLink = async (token, id) => {
    try {
      await navigator.clipboard.writeText(getShareUrl(token));
      setCopiedId(id);
      toast.success('Link copied');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const openInNewTab = (token) => {
    window.open(getShareUrl(token), '_blank');
  };

  const handleDelete = async (imageId, cloudinaryId) => {
    if (!window.confirm('Delete this image? This cannot be undone.')) return;
    setDeletingId(imageId);
    try {
      await api.delete(`/images/${imageId}`);
      setImages(prev => prev.filter(img => img._id !== imageId));
      if (sharePopup?._id === imageId) setSharePopup(null);
      toast.success('Image deleted');
    } catch {
      toast.error('Failed to delete image');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 62px)' }}>
      <div style={styles.spinner} />
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Gallery</h1>
          <p style={styles.subtitle}>{images.length} image{images.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/upload" style={styles.uploadBtn}>+ Upload</Link>
      </div>

      {images.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9c5bc" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <h2 style={{ color: '#1a1a1a', fontWeight: 600, marginBottom: '0.4rem' }}>No images yet</h2>
          <p style={{ color: '#9c9690', marginBottom: '1.5rem' }}>Upload your first image to get started</p>
          <Link to="/upload" style={styles.uploadBtn}>Upload Image</Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {images.map((img, i) => (
            <div
              key={img._id}
              style={{ ...styles.card, animationDelay: `${i * 0.05}s` }}
              className="image-card"
            >
              <div style={styles.imageWrap}>
                <img src={img.imageUrl} alt={img.title} style={styles.image} loading="lazy" />
                <div style={styles.overlay} className="card-overlay">
                  <div style={styles.overlayActions}>
                    <button onClick={() => setSharePopup(img)} style={styles.actionBtn} title="Share">
                      <ShareIcon />
                    </button>
                    <button onClick={() => openInNewTab(img.shareToken)} style={styles.actionBtn} title="Open in new tab">
                      <ExternalIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(img._id, img.cloudinaryId)}
                      style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                      title="Delete image"
                      disabled={deletingId === img._id}
                    >
                      {deletingId === img._id ? <SpinnerSmall /> : <TrashIcon />}
                    </button>
                  </div>
                </div>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.cardTop}>
                  <h3 style={styles.imageTitle}>{img.title}</h3>
                  <button
                    onClick={() => handleDelete(img._id, img.cloudinaryId)}
                    style={styles.deleteIconBtn}
                    title="Delete"
                    disabled={deletingId === img._id}
                  >
                    {deletingId === img._id ? <SpinnerSmall /> : <TrashIcon color="#dc2626" />}
                  </button>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      )}

      {sharePopup && (
        <div style={styles.modalOverlay} onClick={() => setSharePopup(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ color: '#1a1a1a', fontSize: '1.1rem', fontWeight: 700 }}>Share Image</h2>
              <button onClick={() => setSharePopup(null)} style={styles.closeBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <img src={sharePopup.imageUrl} alt={sharePopup.title} style={styles.modalImg} />
            <p style={{ color: '#6b6560', marginBottom: '1rem', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Share <strong style={{ color: '#1a1a1a' }}>{sharePopup.title}</strong> — opens as a standalone image page.
            </p>
            <div style={styles.linkBox}>
              <span style={styles.linkText}>{getShareUrl(sharePopup.shareToken)}</span>
              <button
                onClick={() => copyLink(sharePopup.shareToken, sharePopup._id)}
                style={{ ...styles.copyBtn, background: copiedId === sharePopup._id ? '#16a34a' : '#1a1a1a' }}
              >
                {copiedId === sharePopup._id ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
              <button onClick={() => openInNewTab(sharePopup.shareToken)} style={styles.openBtn}>
                Open in new tab
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent('Check out this image: ' + getShareUrl(sharePopup.shareToken))}`}
                target="_blank" rel="noreferrer" style={styles.socialBtn}
              >WhatsApp</a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(getShareUrl(sharePopup.shareToken))}&text=${encodeURIComponent(sharePopup.title)}`}
                target="_blank" rel="noreferrer" style={{ ...styles.socialBtn, background: '#1da1f2' }}
              >X / Twitter</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShareIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function TrashIcon({ color = 'currentColor' }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}

function SpinnerSmall() {
  return <div style={{ width: 14, height: 14, border: '2px solid #e5e3de', borderTop: '2px solid #1a1a1a', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />;
}

const styles = {
  page: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem',
  },
  title: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '1.8rem', fontWeight: 400, color: '#1a1a1a', letterSpacing: '-0.3px',
  },
  subtitle: { color: '#9c9690', fontSize: '0.875rem', marginTop: '0.2rem' },
  uploadBtn: {
    background: '#1a1a1a', color: '#fff',
    padding: '0.55rem 1.2rem', borderRadius: '8px',
    textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
  },
  empty: { textAlign: 'center', padding: '5rem 2rem' },
  emptyIcon: {
    width: '72px', height: '72px', borderRadius: '16px',
    background: '#f0ede8', display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 1.2rem',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
  card: {
    background: '#ffffff', border: '1px solid #e5e3de',
    borderRadius: '12px', overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  imageWrap: { position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#f0ede8' },
  image: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' },
  overlay: {
    position: 'absolute', inset: 0,
    background: 'rgba(0,0,0,0.38)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: 0, transition: 'opacity 0.2s',
  },
  overlayActions: { display: 'flex', gap: '0.5rem' },
  actionBtn: {
    background: 'rgba(255,255,255,0.95)', border: 'none', color: '#1a1a1a',
    width: '36px', height: '36px', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  deleteBtn: { color: '#dc2626' },
  cardBody: { padding: '0.9rem 1rem' },
  cardTop: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.4rem' },
  imageTitle: { color: '#1a1a1a', fontWeight: 600, fontSize: '0.95rem', flex: 1 },
  deleteIconBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '2px', display: 'flex', alignItems: 'center', flexShrink: 0,
    opacity: 0.6, transition: 'opacity 0.15s',
  },
  meta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  uploaderBadge: { fontSize: '0.78rem', color: '#6b6560', fontWeight: 500 },
  date: { fontSize: '0.75rem', color: '#c9c5bc' },
  spinner: {
    width: '36px', height: '36px',
    border: '2.5px solid #e5e3de', borderTop: '2.5px solid #1a1a1a',
    borderRadius: '50%', animation: 'spin 0.8s linear infinite',
  },
  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '1rem', backdropFilter: 'blur(4px)',
  },
  modal: {
    background: '#ffffff', border: '1px solid #e5e3de',
    borderRadius: '16px', padding: '1.5rem', width: '100%', maxWidth: '460px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
  },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  closeBtn: { background: 'none', border: 'none', color: '#9c9690', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px' },
  modalImg: { width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e5e3de' },
  linkBox: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    background: '#fafaf8', border: '1px solid #e5e3de',
    borderRadius: '8px', padding: '0.5rem 0.75rem',
  },
  linkText: { flex: 1, color: '#6b6560', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  copyBtn: {
    border: 'none', color: '#fff', padding: '0.35rem 0.9rem',
    borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem',
    fontWeight: 600, transition: 'background 0.2s', whiteSpace: 'nowrap',
  },
  openBtn: {
    flex: 1, background: '#f0ede8', color: '#1a1a1a',
    border: 'none', borderRadius: '8px', padding: '0.55rem',
    textAlign: 'center', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
  },
  socialBtn: {
    flex: 1, background: '#25d366', color: '#fff',
    border: 'none', borderRadius: '8px', padding: '0.55rem',
    textAlign: 'center', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600,
  },
};