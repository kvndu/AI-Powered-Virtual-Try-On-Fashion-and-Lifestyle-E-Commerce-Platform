import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';

export default function ImageGallery({ images = [], productName = '' }) {
  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrent(i => (i + 1) % images.length);

  if (!images.length) return (
    <div style={{
      aspectRatio: '3/4',
      background: 'var(--bg-elevated)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--text-muted)', fontSize: 14
    }}>
      No image available
    </div>
  );

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {/* Main image */}
        <div style={{
          position: 'relative',
          aspectRatio: '3/4',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          background: 'var(--bg-elevated)',
          cursor: 'zoom-in'
        }} onClick={() => setZoomed(true)}>
          <img
            src={images[current]}
            alt={`${productName} - ${current + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.4s ease' }}
          />

          {/* Zoom hint */}
          <div style={{
            position: 'absolute', bottom: 12, right: 12,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 10px',
            fontSize: 11, color: 'rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', gap: 4
          }}>
            <ZoomIn size={12} /> Click to zoom
          </div>

          {/* Navigation arrows (only if multiple images) */}
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }} style={{
                position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all var(--transition-fast)'
              }}>
                <ChevronLeft size={18} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all var(--transition-fast)'
              }}>
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: 72, height: 72,
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: i === current ? '2px solid var(--primary)' : '2px solid var(--glass-border)',
                  padding: 0, cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  boxShadow: i === current ? 'var(--shadow-purple)' : 'none'
                }}
              >
                <img src={img} alt={`thumb ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {zoomed && (
        <div className="modal-overlay" onClick={() => setZoomed(false)}>
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img
              src={images[current]}
              alt={productName}
              style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 'var(--radius-lg)' }}
              onClick={e => e.stopPropagation()}
            />
            <button
              onClick={() => setZoomed(false)}
              style={{
                position: 'absolute', top: -16, right: -16,
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
