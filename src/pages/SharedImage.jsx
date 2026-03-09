import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

export default function SharedImage() {
  const { token } = useParams();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await api.get(`/images/share/${token}`);
        setImage(res.data);
      } catch {
        setError('Image not found or link is invalid.');
      } finally {
        setLoading(false);
      }
    };
    fetchImage();
  }, [token]);

  if (loading) return (
    <div style={styles.fullCenter}>
      <div style={styles.spinner} />
    </div>
  );

  if (error) return (
    <div style={styles.fullCenter}>
      <h2 style={{ color: '#dc2626', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Invalid Link</h2>
      <p style={{ color: '#6b6560' }}>{error}</p>
    </div>
  );

  return (
    <div style={styles.page}>
     

      <div style={styles.imageContainer}>
        <div style={styles.imageWrapper}>
          <img
            src={image.imageUrl}
            alt={image.title}
            style={styles.image}
          />
          <div style={styles.watermarkLayer}>
            {Array.from({ length: 40 }).map((_, i) => (
              <span key={i} style={styles.watermarkTile}>© {image.uploaderName}</span>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0d0d0d',
    display: 'flex',
    flexDirection: 'column',
  },
  fullCenter: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f7f4',
    gap: '0.5rem',
  },
  topBar: {
    padding: '0.75rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    flexWrap: 'wrap',
  },
  brand: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '1rem',
    fontWeight: 400,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: '-0.2px',
    marginRight: '0.5rem',
  },
  imageTitle: {
    flex: 1,
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.7)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  uploader: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.45)',
    fontWeight: 400,
  },
  imageContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  imageWrapper: {
    position: 'relative',
    maxWidth: '1000px',
    width: '100%',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
  },
  image: {
    width: '100%',
    display: 'block',
    maxHeight: '85vh',
    objectFit: 'contain',
  },
  watermarkLayer: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'space-around',
    justifyContent: 'space-around',
    gap: '1.5rem',
    padding: '1.5rem',
    pointerEvents: 'none',
    userSelect: 'none',
    overflow: 'hidden',
  },
  watermarkTile: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.9rem',
    fontWeight: 700,
    transform: 'rotate(-35deg)',
    whiteSpace: 'nowrap',
    letterSpacing: '0.05em',
    textShadow: '0 1px 3px rgba(0,0,0,0.4)',
    display: 'inline-block',
  },
  footer: {
    padding: '0.75rem 1.5rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: '0.78rem',
  },
  spinner: {
    width: '32px', height: '32px',
    border: '2.5px solid #e5e3de',
    borderTop: '2.5px solid #1a1a1a',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};