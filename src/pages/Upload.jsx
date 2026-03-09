import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return toast.error('Please select a valid image');
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select an image');
    if (!title.trim()) return toast.error('Please enter a title');

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title.trim());

    try {
      await api.post('/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Image uploaded successfully');
      navigate('/gallery');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        

        <form onSubmit={handleSubmit} style={styles.form}>
          <div
            style={{
              ...styles.dropzone,
              borderColor: dragOver ? '#2563eb' : preview ? '#2563eb' : '#c9c5bc',
              background: dragOver ? '#eff6ff' : '#fafaf8',
            }}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            {preview ? (
              <div style={styles.previewWrap}>
                <img src={preview} alt="preview" style={styles.previewImg} />
                <div style={styles.watermarkOverlay}>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <span key={i} style={styles.watermarkTile}>© {user?.name}</span>
                  ))}
                </div>
                <button type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                  style={styles.removeBtn}>
                  Remove
                </button>
              </div>
            ) : (
              <div style={styles.dropContent}>
                <div style={styles.uploadIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9c9690" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p style={{ color: '#1a1a1a', fontWeight: 600, fontSize: '1rem', marginBottom: '0.3rem' }}>
                  Drop your image here
                </p>
                <p style={{ color: '#9c9690', fontSize: '0.875rem' }}>or click to browse</p>
                <p style={{ color: '#c9c5bc', fontSize: '0.8rem', marginTop: '0.5rem' }}>PNG, JPG, WEBP up to 10MB</p>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*"
            onChange={e => handleFile(e.target.files[0])} style={{ display: 'none' }} />

          <div style={styles.field}>
            <label style={styles.label}>Image Title</label>
            <input
              type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Give your image a title..."
              style={styles.input}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = '#e5e3de'}
            />
          </div>

          <div style={styles.infoBanner}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>A watermark <strong>© {user?.name}</strong> will be embedded across the entire image</span>
          </div>

          <button type="submit" disabled={loading || !file || !title.trim()} style={{
            ...styles.btn,
            opacity: (loading || !file || !title.trim()) ? 0.45 : 1,
            cursor: (loading || !file || !title.trim()) ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 60px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: '#f8f7f4',
  },
  container: { width: '100%', maxWidth: '540px' },
  heading: { textAlign: 'center', marginBottom: '2rem' },
  title: { fontFamily: "'DM Serif Display', serif", fontSize: '2rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.5rem', letterSpacing: '-0.5px' },
  subtitle: { color: '#6b6560', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  dropzone: {
    border: '1.5px dashed',
    borderRadius: '12px',
    minHeight: '260px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    overflow: 'hidden',
    position: 'relative',
  },
  dropContent: { textAlign: 'center', padding: '2rem' },
  uploadIcon: {
    width: '56px', height: '56px', borderRadius: '12px',
    background: '#f0ede8', display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 1rem',
  },
  previewWrap: { position: 'relative', width: '100%' },
  previewImg: { width: '100%', maxHeight: '300px', objectFit: 'contain', display: 'block' },
  watermarkOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    padding: '1rem',
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  watermarkTile: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: '0.85rem',
    fontWeight: 700,
    transform: 'rotate(-35deg)',
    whiteSpace: 'nowrap',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
    letterSpacing: '0.03em',
  },
  removeBtn: {
    position: 'absolute', top: '10px', right: '10px',
    background: '#ffffff', color: '#dc2626',
    border: '1px solid #fca5a5', borderRadius: '6px',
    padding: '0.3rem 0.8rem', cursor: 'pointer',
    fontSize: '0.8rem', fontWeight: 600,
  },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.8rem', fontWeight: 600, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.06em' },
  input: {
    background: '#fafaf8', border: '1px solid #e5e3de', borderRadius: '8px',
    padding: '0.75rem 1rem', color: '#1a1a1a', fontSize: '0.95rem',
    outline: 'none', transition: 'border-color 0.15s',
  },
  infoBanner: {
    display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
    background: '#eff6ff', border: '1px solid #bfdbfe',
    borderRadius: '8px', padding: '0.75rem 1rem',
    color: '#1e40af', fontSize: '0.85rem', lineHeight: 1.5,
  },
  btn: {
    background: '#1a1a1a', border: 'none', borderRadius: '8px',
    padding: '0.9rem', color: '#fff', fontSize: '0.95rem',
    fontWeight: 600, letterSpacing: '0.01em', transition: 'opacity 0.15s',
  },
};