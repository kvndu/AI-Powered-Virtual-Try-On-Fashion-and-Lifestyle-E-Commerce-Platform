import { useState } from 'react';
import { Ruler, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

const SIZE_CHART = {
  clothing: {
    XS: { chest: [76, 80], waist: [60, 64], hip: [84, 88] },
    S:  { chest: [80, 84], waist: [64, 68], hip: [88, 92] },
    M:  { chest: [84, 88], waist: [68, 72], hip: [92, 96] },
    L:  { chest: [88, 94], waist: [72, 78], hip: [96, 102] },
    XL: { chest: [94, 100], waist: [78, 84], hip: [102, 108] },
    XXL:{ chest: [100, 110], waist: [84, 92], hip: [108, 116] },
  },
  shoes: {
    36: { foot_length: [22.5, 23] },
    37: { foot_length: [23, 23.5] },
    38: { foot_length: [23.5, 24] },
    39: { foot_length: [24, 24.5] },
    40: { foot_length: [24.5, 25] },
    41: { foot_length: [25, 25.5] },
    42: { foot_length: [25.5, 26] },
    43: { foot_length: [26, 26.5] },
    44: { foot_length: [26.5, 27] },
  }
};

function recommendSize(measurements, category) {
  if (category === 'shoes') {
    const fl = measurements.foot_length;
    if (!fl) return null;
    for (const [size, range] of Object.entries(SIZE_CHART.shoes)) {
      const [min, max] = range.foot_length;
      if (fl >= min && fl <= max) return { size, confidence: 95 };
    }
    return null;
  }

  const chart = SIZE_CHART.clothing;
  const scores = {};
  for (const [size, ranges] of Object.entries(chart)) {
    let score = 0;
    let checks = 0;
    if (measurements.chest) {
      const [min, max] = ranges.chest;
      if (measurements.chest >= min && measurements.chest <= max) score += 3;
      else score -= Math.abs(measurements.chest - (min + max) / 2) * 0.1;
      checks++;
    }
    if (measurements.waist) {
      const [min, max] = ranges.waist;
      if (measurements.waist >= min && measurements.waist <= max) score += 3;
      else score -= Math.abs(measurements.waist - (min + max) / 2) * 0.1;
      checks++;
    }
    if (measurements.hip) {
      const [min, max] = ranges.hip;
      if (measurements.hip >= min && measurements.hip <= max) score += 2;
      else score -= Math.abs(measurements.hip - (min + max) / 2) * 0.1;
      checks++;
    }
    if (checks > 0) scores[size] = score;
  }

  if (Object.keys(scores).length === 0) return null;
  const best = Object.entries(scores).sort(([,a], [,b]) => b - a)[0];
  const maxScore = Object.values(scores).reduce((a, b) => Math.max(a, b), 0);
  const confidence = Math.min(95, Math.max(50, Math.round((best[1] / maxScore) * 95)));
  return { size: best[0], confidence };
}

export default function SizeRecommender({ category = 'clothing', onSelectSize }) {
  const [open, setOpen] = useState(false);
  const [measurements, setMeasurements] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fields = category === 'shoes'
    ? [{ key: 'foot_length', label: 'Foot Length (cm)', placeholder: '24.5' }]
    : [
        { key: 'chest', label: 'Chest / Bust (cm)', placeholder: '88' },
        { key: 'waist', label: 'Waist (cm)', placeholder: '70' },
        { key: 'hip', label: 'Hip (cm)', placeholder: '96' },
        { key: 'height', label: 'Height (cm)', placeholder: '165' },
      ];

  const handleChange = (key, val) => {
    setMeasurements(prev => ({ ...prev, [key]: parseFloat(val) || '' }));
  };

  const handleRecommend = () => {
    setLoading(true);
    setTimeout(() => {
      const res = recommendSize(measurements, category);
      setResult(res);
      setLoading(false);
    }, 800);
  };

  const hasAny = Object.values(measurements).some(v => v);

  return (
    <div style={{
      background: 'rgba(168,85,247,0.05)',
      border: '1px solid rgba(168,85,247,0.2)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: 'var(--space-4) var(--space-5)',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          color: 'var(--text-primary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Ruler size={16} color="#fff" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 14, fontWeight: 600 }}>AI Size Recommender</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Enter your measurements for the perfect fit</p>
          </div>
        </div>
        {open ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
      </button>

      {/* Form */}
      {open && (
        <div style={{
          padding: '0 var(--space-5) var(--space-5)',
          borderTop: '1px solid rgba(168,85,247,0.1)',
          paddingTop: 'var(--space-4)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            {fields.map(field => (
              <div key={field.key} className="input-group">
                <label className="input-label">{field.label}</label>
                <input
                  type="number"
                  className="input"
                  placeholder={field.placeholder}
                  value={measurements[field.key] || ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                />
              </div>
            ))}
          </div>

          <button
            className="btn btn-primary"
            onClick={handleRecommend}
            disabled={!hasAny || loading}
            style={{ width: '100%', justifyContent: 'center', opacity: (!hasAny || loading) ? 0.6 : 1 }}
          >
            {loading ? (
              <>
                <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Get Size Recommendation
              </>
            )}
          </button>

          {/* Result */}
          {result && (
            <div style={{
              marginTop: 'var(--space-4)',
              padding: 'var(--space-4)',
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              animation: 'scaleIn 0.3s ease'
            }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Recommended Size</p>
              <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--success)', fontFamily: 'var(--font-display)', marginBottom: 4 }}>
                {result.size}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  height: 6, flex: 1,
                  background: 'var(--bg-elevated)',
                  borderRadius: 3, overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${result.confidence}%`,
                    background: 'linear-gradient(90deg, var(--success), #34d399)',
                    borderRadius: 3,
                    transition: 'width 0.8s ease'
                  }} />
                </div>
                <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600, flexShrink: 0 }}>
                  {result.confidence}% match
                </span>
              </div>
              {onSelectSize && (
                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => onSelectSize(result.size)}
                >
                  Select Size {result.size}
                </button>
              )}
            </div>
          )}

          {result === null && hasAny && !loading && (
            <p style={{ fontSize: 13, color: 'var(--error)', marginTop: 'var(--space-3)', textAlign: 'center' }}>
              Couldn't determine size. Please check your measurements.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
