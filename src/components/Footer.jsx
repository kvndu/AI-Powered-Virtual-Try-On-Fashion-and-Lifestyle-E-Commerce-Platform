import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, Phone, Globe, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const IgIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const TwIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const YtIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
  </svg>
);

const LINKS = {
  Shop: [
    { label: 'All Products', to: '/products' },
    { label: "Women's Fashion", to: '/products?category=women' },
    { label: "Men's Fashion", to: '/products?category=men' },
    { label: 'Accessories', to: '/products?category=accessories' },
    { label: 'New Arrivals', to: '/products?new=true' },
    { label: 'Sale Specials', to: '/products?sale=true' },
  ],
  Discover: [
    { label: 'Virtual Try-On Fitting', to: '/try-on' },
    { label: 'AI Styling Assistant', to: '/try-on' },
    { label: 'Digital Lookbook', to: '/' },
    { label: 'Saree Draping Guides', to: '/' },
  ],
  Account: [
    { label: 'My Style Profile', to: '/profile' },
    { label: 'My Orders & Try-Ons', to: '/profile' },
    { label: 'Wishlist & Favorites', to: '/profile' },
    { label: 'Gift Card Balance', to: '/gift-cards' },
  ],
  Help: [
    { label: 'Frequently Asked Questions', to: '/' },
    { label: 'AI Sizing Calculator', to: '/' },
    { label: 'Worldwide Shipping', to: '/' },
    { label: 'Hassle-Free Returns', to: '/' },
    { label: 'Contact Stylist support', to: '/' },
  ],
};

const SOCIALS = [
  { icon: <IgIcon />, label: 'Instagram', href: '#' },
  { icon: <TwIcon />, label: 'Twitter', href: '#' },
  { icon: <YtIcon />, label: 'YouTube', href: '#' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [currency, setCurrency] = useState('LKR');
  const [lang, setLang] = useState('English');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer style={{ background: '#050505', color: '#fff', borderTop: '1px solid rgba(255,255,255,0.06)', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Decorative Blur */}
      <div style={{
        position: 'absolute', bottom: -100, right: -100,
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1
      }} />

      {/* ── Newsletter Section ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: 1400, margin: '0 auto',
        padding: '80px 80px 40px',
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '50px 60px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 60,
          alignItems: 'center',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.35em', color: '#C9A96E', textTransform: 'uppercase' }}>BLOOMAIR PRIVÉ</span>
              <div style={{ width: 30, height: 1, background: '#C9A96E' }} />
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 3vw, 40px)',
              fontWeight: 400, color: '#fff', lineHeight: 1.2, margin: '0 0 14px',
            }}>
              Join the future of <em style={{ fontStyle: 'italic', color: '#C9A96E' }}>Digital Couture</em>
            </h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: 0, maxWidth: 440 }}>
              Receive exclusive access to new designer collections, AI sizing recommendations, and early launch invitations directly to your inbox.
            </p>
          </div>

          <div>
            {subscribed ? (
              <div style={{
                padding: '24px',
                background: 'rgba(201,169,110,0.06)',
                border: '1px solid rgba(201,169,110,0.25)',
                textAlign: 'center',
                animation: 'fadeIn 0.5s ease both'
              }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>✨</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#C9A96E', marginBottom: 4 }}>
                  Subscription Confirmed
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                  Welcome to Bloomair. A styling guide will arrive shortly.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe}>
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.12)', padding: '10px 0', position: 'relative' }}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    style={{
                      flex: 1, padding: '10px 0',
                      background: 'transparent', border: 'none',
                      color: '#fff', fontSize: 13,
                      fontFamily: 'var(--font-body)', outline: 'none',
                    }}
                  />
                  <button type="submit" style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: '#C9A96E', display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase',
                    transition: 'all 0.3s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#C9A96E'}
                  >
                    Subscribe <ArrowRight size={13} />
                  </button>
                </div>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 12, margin: '12px 0 0' }}>
                  By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Footer Content ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: 1400, margin: '0 auto',
        padding: '60px 80px 40px',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 60, marginBottom: 80 }}>
          
          {/* Brand Info */}
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32, fontWeight: 900,
              color: '#fff', letterSpacing: '0.08em',
              marginBottom: 4,
            }}>
              BLOOM<span style={{ color: '#C9A96E', fontStyle: 'italic' }}>AIR</span>
            </div>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 28 }}>
              DIGITAL FITTING ROOM & DESIGNER HUBS
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, maxWidth: 260, marginBottom: 32 }}>
              Redefining e-commerce through immersive neural draping technology. Elevating Sri Lankan heritage weaves into global digital luxury.
            </p>

            {/* Direct Contact Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
              {[
                { icon: <Mail size={12} />, text: 'contact@bloomair.fashion' },
                { icon: <Phone size={12} />, text: '+94 11 987 6543' },
                { icon: <MapPin size={12} />, text: 'Flagship Store, Colombo 03, SL' }
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
                  <span style={{ color: '#C9A96E' }}>{c.icon}</span> {c.text}
                </div>
              ))}
            </div>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: 12 }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} aria-label={s.label} style={{
                  width: 36, height: 36,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.01)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.45)',
                  transition: 'all 0.3s', textDecoration: 'none',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#C9A96E';
                    e.currentTarget.style.color = '#C9A96E';
                    e.currentTarget.style.background = 'rgba(201,169,110,0.06)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Grids */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 style={{
                fontSize: 10, fontWeight: 900, letterSpacing: '0.25em',
                textTransform: 'uppercase', color: '#C9A96E',
                marginBottom: 24, paddingBottom: 10,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                fontFamily: 'var(--font-body)',
              }}>{title}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {links.map(link => (
                  <Link key={link.label} to={link.to} style={{
                    fontSize: 13, color: 'rgba(255,255,255,0.4)',
                    textDecoration: 'none', transition: 'all 0.2s',
                    position: 'relative', width: 'fit-content'
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.paddingLeft = '4px';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                      e.currentTarget.style.paddingLeft = '0px';
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Lower Utility Strip (Currency & Lang Selection) ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '30px 0 20px',
          flexWrap: 'wrap', gap: 24,
        }}>
          
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Globe size={11} /> Regional Settings:
            </div>
            
            {/* Language Selector */}
            <div style={{ position: 'relative' }}>
              <select
                value={lang}
                onChange={e => setLang(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: 11,
                  padding: '6px 12px',
                  borderRadius: 0,
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  paddingRight: 28,
                  fontFamily: 'var(--font-body)',
                }}
              >
                <option value="English" style={{ background: '#0a0a0a', color: '#fff' }}>English (US)</option>
                <option value="Sinhala" style={{ background: '#0a0a0a', color: '#fff' }}>සිංහල (Sri Lanka)</option>
                <option value="Tamil" style={{ background: '#0a0a0a', color: '#fff' }}>தமிழ் (Sri Lanka)</option>
              </select>
              <ChevronDown size={11} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>

            {/* Currency Selector */}
            <div style={{ position: 'relative' }}>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: 11,
                  padding: '6px 12px',
                  borderRadius: 0,
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  paddingRight: 28,
                  fontFamily: 'var(--font-body)',
                }}
              >
                <option value="LKR" style={{ background: '#0a0a0a', color: '#fff' }}>LKR (Rs.)</option>
                <option value="USD" style={{ background: '#0a0a0a', color: '#fff' }}>USD ($)</option>
                <option value="GBP" style={{ background: '#0a0a0a', color: '#fff' }}>GBP (£)</option>
                <option value="EUR" style={{ background: '#0a0a0a', color: '#fff' }}>EUR (€)</option>
              </select>
              <ChevronDown size={11} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 24, fontSize: 11, color: 'rgba(255,255,255,0.3)', flexWrap: 'wrap' }}>
            {['Privacy & Neural Data Policy', 'Terms of Virtual Try-on Service', 'Cookie Settings'].map(t => (
              <a key={t} href="#" style={{ textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              >{t}</a>
            ))}
          </div>
        </div>

        {/* ── Copyright & Made In Info ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 0 20px', fontSize: 11, color: 'rgba(255,255,255,0.2)'
        }}>
          <div>
            &copy; 2026 BLOOMAIR Fashion Inc. All rights reserved.
          </div>
          <div>
            Powered by Neural Fitting Core &bull; Crafted with pride in Sri Lanka
          </div>
        </div>

      </div>
    </footer>
  );
}
