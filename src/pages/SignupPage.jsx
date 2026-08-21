import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const strength = (() => {
    const p = form.password; let s = 0;
    if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#dc2626', '#ca8a04', '#2563eb', '#16a34a'][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password || !form.confirm) { toast.error('Please fill in all fields'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (!agreed) { toast.error('Please agree to the terms'); return; }
    setLoading(true);
    try {
      await register({ email: form.email, password: form.password, full_name: form.full_name });
      toast.success('Welcome to Bloomair! 🌸');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const iStyle = { width: '100%', padding: '13px 16px', fontSize: 14, border: '1.5px solid #e4e4e7', borderRadius: 10, background: '#fafafa', color: '#0a0a0a', outline: 'none', fontFamily: "'Inter', sans-serif", transition: 'border-color 0.2s, box-shadow 0.2s' };
  const lStyle = { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3f3f46', marginBottom: 8 };
  const onF = (e) => { e.currentTarget.style.borderColor = '#f5af19'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,175,25,0.12)'; e.currentTarget.style.background = '#fff'; };
  const onB = (e) => { e.currentTarget.style.borderColor = '#e4e4e7'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = '#fafafa'; };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#fff', fontFamily: "'Inter', sans-serif" }}>

      {/* ── LEFT: Visual Panel ── */}
      <div style={{ flex: '0 0 46%', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="auth-visual-panel">
        
        {/* Decorative elements */}
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,175,25,0.08) 0%, transparent 70%)', top: '10%', right: '-10%' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,175,25,0.05) 0%, transparent 70%)', bottom: '10%', left: '-10%' }} />
        
        {/* Decorative lines */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', opacity: 0.3 }}>
          <div style={{ position: 'absolute', width: '100%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(245,175,25,0.3), transparent)', top: '20%' }} />
          <div style={{ position: 'absolute', width: '100%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(245,175,25,0.2), transparent)', top: '50%' }} />
          <div style={{ position: 'absolute', width: '100%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(245,175,25,0.3), transparent)', top: '80%' }} />
          <div style={{ position: 'absolute', width: 1, height: '100%', background: 'linear-gradient(180deg, transparent, rgba(245,175,25,0.2), transparent)', left: '30%' }} />
          <div style={{ position: 'absolute', width: 1, height: '100%', background: 'linear-gradient(180deg, transparent, rgba(245,175,25,0.3), transparent)', left: '70%' }} />
        </div>

        {/* Logo */}
        <div style={{ position: 'absolute', top: 36, left: 40, zIndex: 10 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 26, letterSpacing: '0.22em', color: '#ffffff', textTransform: 'uppercase', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>BLOOMAIR</span>
          </Link>
          <div style={{ width: 28, height: 2, background: '#f5af19', marginTop: 8, borderRadius: 1 }} />
        </div>

        {/* Center content */}
        <div style={{ textAlign: 'center', zIndex: 5, padding: '40px' }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ width: 60, height: 60, margin: '0 auto 16px', borderRadius: '50%', background: 'rgba(245,175,25,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245,175,25,0.3)' }}>
              <div style={{ width: 24, height: 24, border: '2px solid #f5af19', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f5af19' }} />
              </div>
            </div>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: '#ffffff', marginBottom: 12, lineHeight: 1.2 }}>
            Start Your Journey
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 320, margin: '0 auto', lineHeight: 1.6 }}>
            Join Bloomair today and discover a world of style, elegance, and inspiration.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f5af19' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Premium Quality</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f5af19' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Secure Shopping</span>
            </div>
          </div>
        </div>

        {/* Bottom glass card */}
        <div style={{ position: 'absolute', bottom: 40, left: 40, right: 40, zIndex: 10, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 16, padding: '22px 26px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(245,175,25,0.2)', border: '1px solid rgba(245,175,25,0.4)', borderRadius: 20, padding: '4px 12px', marginBottom: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f5af19' }} />
            <span style={{ fontSize: 10, color: '#f5af19', letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase' }}>Join Bloomair</span>
          </div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#ffffff', lineHeight: 1.3, margin: 0, textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}>
            Your style,<br /><em style={{ color: '#f5af19', fontStyle: 'italic' }}>elevated.</em>
          </p>
        </div>
      </div>

      {/* ── RIGHT: Form Panel ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '48px 48px', background: '#ffffff', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ width: 32, height: 3, background: '#f5af19', borderRadius: 2, marginBottom: 18 }} />
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: '#0a0a0a', marginBottom: 8, lineHeight: 1.2 }}>
              Create Account
            </h1>
            <p style={{ fontSize: 13, color: '#71717a', letterSpacing: '0.01em' }}>
              Already a member?{' '}
              <Link to="/login" style={{ color: '#0a0a0a', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 }}>Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Full Name */}
            <div>
              <label style={lStyle}>Full Name</label>
              <input type="text" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Your full name" required style={iStyle} onFocus={onF} onBlur={onB} />
            </div>

            {/* Email */}
            <div>
              <label style={lStyle}>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required style={iStyle} onFocus={onF} onBlur={onB} />
            </div>

            {/* Password */}
            <div>
              <label style={lStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required style={{ ...iStyle, padding: '13px 48px 13px 16px' }} onFocus={onF} onBlur={onB} />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a1a1aa', display: 'flex', alignItems: 'center' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[1,2,3,4].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColor : '#e4e4e7', transition: 'background 0.3s' }} />)}
                  </div>
                  <span style={{ fontSize: 11, color: strengthColor, fontWeight: 700, letterSpacing: '0.05em' }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label style={lStyle}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showConfirm ? 'text' : 'password'} name="confirm" value={form.confirm} onChange={handleChange} placeholder="Re-enter password" required
                  style={{ ...iStyle, padding: '13px 48px 13px 16px', borderColor: form.confirm && form.confirm !== form.password ? '#dc2626' : '#e4e4e7' }}
                  onFocus={onF} onBlur={onB} />
                <button type="button" onClick={() => setShowConfirm(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a1a1aa', display: 'flex', alignItems: 'center' }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {form.confirm && form.confirm === form.password && (
                  <div style={{ position: 'absolute', right: 44, top: '50%', transform: 'translateY(-50%)' }}>
                    <Check size={15} color="#16a34a" />
                  </div>
                )}
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p style={{ fontSize: 11, color: '#dc2626', marginTop: 5, letterSpacing: '0.02em' }}>Passwords don't match</p>
              )}
            </div>

            {/* Terms */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }} onClick={() => setAgreed(a => !a)}>
              <div style={{ width: 18, height: 18, flexShrink: 0, borderRadius: 5, border: agreed ? 'none' : '1.5px solid #d4d4d8', background: agreed ? '#0a0a0a' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1, transition: 'all 0.15s' }}>
                {agreed && <Check size={11} color="#ffffff" strokeWidth={3} />}
              </div>
              <span style={{ fontSize: 12, color: '#71717a', lineHeight: 1.5 }}>
                I agree to Bloomair's{' '}
                <Link to="/terms" style={{ color: '#0a0a0a', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 2 }} onClick={e => e.stopPropagation()}>Terms</Link>
                {' '}&{' '}
                <Link to="/privacy" style={{ color: '#0a0a0a', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 2 }} onClick={e => e.stopPropagation()}>Privacy Policy</Link>
              </span>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '15px 24px', background: loading ? '#d4d4d8' : '#0a0a0a', color: '#ffffff', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s, transform 0.1s', fontFamily: "'Inter', sans-serif" }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
              onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = '#0a0a0a'; e.currentTarget.style.transform = 'translateY(0)'; }}}
            >
              {loading ? (
                <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Creating Account...</>
              ) : (
                <>Create Account <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          <div style={{ width: 40, height: 2, background: 'linear-gradient(90deg, #f5af19, #f0c060)', borderRadius: 1, margin: '32px auto 0' }} />
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 800px) { .auth-visual-panel { display: none !important; } }
      `}</style>
    </div>
  );
}