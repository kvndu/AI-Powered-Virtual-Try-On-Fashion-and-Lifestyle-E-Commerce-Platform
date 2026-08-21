import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, RotateCcw, ZoomIn, ZoomOut, Sparkles, AlertCircle } from 'lucide-react';

export default function VirtualTryOn({ product }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayImgRef = useRef(null);
  const animFrameRef = useRef(null);
  const streamRef = useRef(null);

  const [status, setStatus] = useState('idle'); // idle | starting | active | error | noCam
  const [scale, setScale] = useState(1);
  const [offsetY, setOffsetY] = useState(0);
  const [overlayLoaded, setOverlayLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0]);

  // Draw loop
  const draw = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayImgRef.current;

    if (!video || !canvas || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(draw);
      return;
    }

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Mirror the video feed
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Overlay garment image
    if (overlay && overlayLoaded) {
      const garmentW = canvas.width * 0.55 * scale;
      const garmentH = garmentW * (overlay.naturalHeight / overlay.naturalWidth);
      const x = (canvas.width - garmentW) / 2;
      const y = canvas.height * 0.12 + offsetY;

      ctx.globalAlpha = 0.85;
      ctx.drawImage(overlay, x, y, garmentW, garmentH);
      ctx.globalAlpha = 1;
    }

    animFrameRef.current = requestAnimationFrame(draw);
  };

  const startCamera = async () => {
    setStatus('starting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus('active');
      draw();
    } catch (err) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') setStatus('denied');
      else if (err.name === 'NotFoundError') setStatus('noCam');
      else setStatus('error');
    }
  };

  const stopCamera = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus('idle');
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (product?.images?.[0]) setSelectedImage(product.images[0]);
  }, [product]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Canvas / Preview Area */}
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--glass-border)',
        aspectRatio: '4/3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Hidden video element */}
        <video
          ref={videoRef}
          style={{ display: 'none' }}
          playsInline
          muted
        />

        {/* Hidden overlay image */}
        <img
          ref={overlayImgRef}
          src={selectedImage}
          style={{ display: 'none' }}
          onLoad={() => setOverlayLoaded(true)}
          crossOrigin="anonymous"
          alt=""
        />

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: status === 'active' ? 'block' : 'none',
            borderRadius: 'var(--radius-lg)'
          }}
        />

        {/* Idle / Error State */}
        {status !== 'active' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-4)',
            padding: 'var(--space-8)',
            textAlign: 'center'
          }}>
            {status === 'idle' && (
              <>
                <div style={{
                  width: 80, height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.2))',
                  border: '2px solid rgba(168,85,247,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Camera size={36} color="var(--primary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Virtual Try-On</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 280 }}>
                    Enable your camera and see how this outfit looks on you in real-time!
                  </p>
                </div>
                <button className="btn btn-primary" onClick={startCamera}>
                  <Camera size={16} /> Enable Camera
                </button>
              </>
            )}

            {status === 'starting' && (
              <>
                <div className="spinner" />
                <p style={{ color: 'var(--text-secondary)' }}>Starting camera...</p>
              </>
            )}

            {(status === 'denied' || status === 'error' || status === 'noCam') && (
              <>
                <div style={{
                  width: 64, height: 64,
                  borderRadius: '50%',
                  background: 'rgba(239,68,68,0.1)',
                  border: '2px solid rgba(239,68,68,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <AlertCircle size={28} color="var(--error)" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: 'var(--error)' }}>
                    {status === 'denied' ? 'Camera Permission Denied' :
                     status === 'noCam' ? 'No Camera Found' : 'Camera Error'}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 260 }}>
                    {status === 'denied'
                      ? 'Please allow camera access in your browser settings and try again.'
                      : status === 'noCam'
                      ? 'No camera device was detected on this device.'
                      : 'An error occurred while accessing the camera.'}
                  </p>
                </div>
                <button className="btn btn-outline" onClick={startCamera}>
                  <RotateCcw size={14} /> Try Again
                </button>

                {/* Static preview fallback */}
                <div style={{ marginTop: 'var(--space-4)', width: '100%' }}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textAlign: 'center' }}>
                    Product Preview:
                  </p>
                  <img
                    src={selectedImage}
                    alt={product?.name}
                    style={{ width: '60%', margin: '0 auto', borderRadius: 'var(--radius-md)', display: 'block' }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Active overlay controls */}
        {status === 'active' && (
          <div style={{
            position: 'absolute',
            bottom: 'var(--space-4)',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 'var(--space-2)',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 12px'
          }}>
            <button className="btn btn-icon btn-ghost" title="Zoom in" onClick={() => setScale(s => Math.min(s + 0.1, 2))} style={{ width: 36, height: 36 }}>
              <ZoomIn size={16} />
            </button>
            <button className="btn btn-icon btn-ghost" title="Zoom out" onClick={() => setScale(s => Math.max(s - 0.1, 0.5))} style={{ width: 36, height: 36 }}>
              <ZoomOut size={16} />
            </button>
            <button className="btn btn-icon btn-ghost" title="Move up" onClick={() => setOffsetY(o => o - 10)} style={{ width: 36, height: 36, fontSize: 16 }}>↑</button>
            <button className="btn btn-icon btn-ghost" title="Move down" onClick={() => setOffsetY(o => o + 10)} style={{ width: 36, height: 36, fontSize: 16 }}>↓</button>
            <button className="btn btn-icon btn-ghost" title="Reset" onClick={() => { setScale(1); setOffsetY(0); }} style={{ width: 36, height: 36 }}>
              <RotateCcw size={14} />
            </button>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.15)', margin: '4px 4px' }} />
            <button className="btn btn-icon" onClick={stopCamera} style={{
              width: 36, height: 36,
              background: 'rgba(239,68,68,0.3)',
              border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: 'var(--radius-sm)'
            }}>
              <CameraOff size={15} />
            </button>
          </div>
        )}

        {/* AR badge */}
        {status === 'active' && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(168,85,247,0.2)',
            border: '1px solid rgba(168,85,247,0.4)',
            borderRadius: 'var(--radius-full)',
            padding: '4px 12px',
            fontSize: 12, fontWeight: 600, color: 'var(--primary-light)'
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--primary)',
              animation: 'pulse 1.5s infinite'
            }} />
            <Sparkles size={12} /> LIVE AR
          </div>
        )}
      </div>

      {/* Product Image Selector */}
      {product?.images && product.images.length > 1 && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', width: '100%', marginBottom: 4 }}>
            Select overlay image:
          </p>
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => { setSelectedImage(img); setOverlayLoaded(false); }}
              style={{
                width: 56, height: 56,
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                border: selectedImage === img ? '2px solid var(--primary)' : '2px solid var(--glass-border)',
                padding: 0,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                boxShadow: selectedImage === img ? 'var(--shadow-purple)' : 'none'
              }}
            >
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}

      {/* Tips */}
      <div style={{
        background: 'rgba(168,85,247,0.05)',
        border: '1px solid rgba(168,85,247,0.15)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)'
      }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary-light)', marginBottom: 8 }}>
          💡 Tips for best results:
        </p>
        <ul style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.8, paddingLeft: 16 }}>
          <li>Stand 1–2 meters away from the camera</li>
          <li>Ensure good lighting (face a window or light source)</li>
          <li>Wear a tight-fitting top for accurate overlay</li>
          <li>Use the zoom/position controls to fine-tune the fit</li>
        </ul>
      </div>
    </div>
  );
}
