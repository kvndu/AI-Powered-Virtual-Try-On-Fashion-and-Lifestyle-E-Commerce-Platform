import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#fff', fontFamily: "'Inter', sans-serif" }}>

      {/* ── LEFT: Visual Panel ── */}
      <div style={{
        flex: '0 0 52%',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }} className="auth-visual-panel">

        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,175,25,0.08) 0%, transparent 70%)',
          top: '5%',
          right: '-15%',
        }} />
        <div style={{
          position: 'absolute',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,175,25,0.05) 0%, transparent 70%)',
          bottom: '5%',
          left: '-10%',
        }} />
        
        {/* Decorative lines */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          opacity: 0.3,
        }}>
          <div style={{
            position: 'absolute',
            width: '100%',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(245,175,25,0.3), transparent)',
            top: '25%',
          }} />
          <div style={{
            position: 'absolute',
            width: '100%',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(245,175,25,0.2), transparent)',
            top: '50%',
          }} />
          <div style={{
            position: 'absolute',
            width: '100%',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(245,175,25,0.3), transparent)',
            top: '75%',
          }} />
          <div style={{
            position: 'absolute',
            width: 1,
            height: '100%',
            background: 'linear-gradient(180deg, transparent, rgba(245,175,25,0.2), transparent)',
            left: '25%',
          }} />
          <div style={{
            position: 'absolute',
            width: 1,
            height: '100%',
            background: 'linear-gradient(180deg, transparent, rgba(245,175,25,0.3), transparent)',
            left: '50%',
          }} />
          <div style={{
            position: 'absolute',
            width: 1,
            height: '100%',
            background: 'linear-gradient(180deg, transparent, rgba(245,175,25,0.2), transparent)',
            left: '75%',
          }} />
        </div>

        {/* Logo top-left */}
        <div style={{ position: 'absolute', top: 36, left: 40, zIndex: 10 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: '0.22em',
              color: '#ffffff',
              textTransform: 'uppercase',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}>BLOOMAIR</span>
          </Link>
          <div style={{ width: 28, height: 2, background: '#f5af19', marginTop: 8, borderRadius: 1 }} />
        </div>

        {/* Center content */}
        <div style={{ textAlign: 'center', zIndex: 5, padding: '40px' }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{
              width: 70,
              height: 70,
              margin: '0 auto 20px',
              borderRadius: '50%',
              background: 'rgba(245,175,25,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(245,175,25,0.25)',
            }}>
              <div style={{
                width: 28,
                height: 28,
                border: '2px solid #f5af19',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f5af19' }} />
              </div>
            </div>
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 34,
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: 14,
            lineHeight: 1.2,
          }}>
            Welcome Back
          </h2>
          <p style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.7)',
            maxWidth: 320,
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Sign in to continue exploring premium fashion and curated style.
          </p>
          <div style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            marginTop: 28,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f5af19' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Exclusive Access</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f5af19' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Personalized</span>
            </div>
          </div>
        </div>

        {/* Bottom overlay card */}
        <div style={{
          position: 'absolute',
          bottom: 40,
          left: 40,
          right: 40,
          zIndex: 10,
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 16,
          padding: '24px 28px',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(245,175,25,0.2)',
            border: '1px solid rgba(245,175,25,0.4)',
            borderRadius: 20,
            padding: '4px 12px',
            marginBottom: 12,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f5af19' }} />
            <span style={{ fontSize: 10, color: '#f5af19', letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase' }}>
              Premium Luxury Fashion
            </span>
          </div>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.3,
            margin: 0,
            textShadow: '0 1px 8px rgba(0,0,0,0.3)',
          }}>
            Sri Lanka's finest<br />
            <em style={{ color: '#f5af19', fontStyle: 'italic' }}>curated style.</em>
          </p>
        </div>
      </div>

      {/* ── RIGHT: Form Panel ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 48px',
        background: '#ffffff',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ width: 32, height: 3, background: '#f5af19', borderRadius: 2, marginBottom: 20 }} />
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 34,
              fontWeight: 700,
              color: '#0a0a0a',
              marginBottom: 10,
              lineHeight: 1.2,
            }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 13, color: '#71717a', letterSpacing: '0.01em', lineHeight: 1.5 }}>
              New here?{' '}
              <Link to="/signup" style={{ color: '#0a0a0a', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                Create an account
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3f3f46', marginBottom: 8 }}>
                Email Address
              </label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="your@email.com" required
                style={{ width: '100%', padding: '13px 16px', fontSize: 14, border: '1.5px solid #e4e4e7', borderRadius: 10, background: '#fafafa', color: '#0a0a0a', outline: 'none', fontFamily: "'Inter', sans-serif", transition: 'border-color 0.2s, box-shadow 0.2s' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#f5af19'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,175,25,0.12)'; e.currentTarget.style.background = '#fff'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#e4e4e7'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = '#fafafa'; }}
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3f3f46' }}>
                  Password
                </label>
                <Link to="/forgot-password" style={{ fontSize: 11, color: '#a1a1aa', textDecoration: 'underline', textUnderlineOffset: 2, fontWeight: 500 }}>
                  Forgot?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••" required
                  style={{ width: '100%', padding: '13px 48px 13px 16px', fontSize: 14, border: '1.5px solid #e4e4e7', borderRadius: 10, background: '#fafafa', color: '#0a0a0a', outline: 'none', fontFamily: "'Inter', sans-serif", transition: 'border-color 0.2s, box-shadow 0.2s' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#f5af19'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,175,25,0.12)'; e.currentTarget.style.background = '#fff'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e4e4e7'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = '#fafafa'; }}
                />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a1a1aa', display: 'flex', alignItems: 'center', padding: 2 }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '15px 24px', background: loading ? '#d4d4d8' : '#0a0a0a', color: '#ffffff', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s, transform 0.1s', marginTop: 4, fontFamily: "'Inter', sans-serif" }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
              onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = '#0a0a0a'; e.currentTarget.style.transform = 'translateY(0)'; }}}
            >
              {loading ? (
                <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Signing In...</>
              ) : (
                <>Sign In <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
            <span style={{ fontSize: 11, color: '#c4c4c4', letterSpacing: '0.06em', textTransform: 'uppercase' }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
          </div>

          {/* Guest */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '13px 24px', background: 'transparent', border: '1.5px solid #e4e4e7', borderRadius: 10, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#52525b', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#d4d4d8'; e.currentTarget.style.background = '#fafafa'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e4e4e7'; e.currentTarget.style.background = 'transparent'; }}
          >
            Browse as Guest
          </Link>

          {/* Gold accent */}
          <div style={{ width: 40, height: 2, background: 'linear-gradient(90deg, #f5af19, #f0c060)', borderRadius: 1, margin: '36px auto 0' }} />
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 800px) { .auth-visual-panel { display: none !important; } }
      `}</style>
    </div>
  );
}