import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';

const LINKS = {
  Shop: [
    { label: 'All Products', to: '/products' },
    { label: 'Clothing', to: '/products?category=clothing' },
    { label: 'Shoes', to: '/products?category=shoes' },
    { label: 'Bags', to: '/products?category=bags' },
    { label: 'New Arrivals', to: '/products?new=true' },
  ],
  Features: [
    { label: 'Virtual Try-On', to: '/try-on' },
    { label: 'AI Styling', to: '/try-on' },
    { label: 'My Orders', to: '/orders' },
    { label: 'Profile', to: '/profile' },
  ],
  Company: [
    { label: 'About Us', to: '/' },
    { label: 'Blog', to: '/' },
    { label: 'Careers', to: '/' },
    { label: 'Press', to: '/' },
  ],
};

export default function Footer() {
  return (
    <footer style={{
      background: '#000000',
      borderTop: '3px solid #000',
      color: '#ffffff',
    }}>
      {/* Yellow CTA band */}
      <div style={{
        background: '#f5af19',
        borderBottom: '2px solid #000',
        padding: '20px 0',
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 24,
          flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: '#000' }}>
              Never miss a drop.
            </div>
            <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.6)', marginTop: 2 }}>
              Subscribe and get early access to new arrivals.
            </div>
          </div>
          <form
            onSubmit={e => e.preventDefault()}
            style={{ display: 'flex', gap: 0, flex: '0 0 auto' }}
          >
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                padding: '12px 20px',
                border: '2px solid #000',
                borderRight: 'none',
                background: '#fff',
                fontSize: 13,
                fontFamily: 'var(--font-body)',
                color: '#000',
                outline: 'none',
                width: 240,
              }}
            />
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                background: '#000',
                border: '2px solid #000',
                color: '#fff',
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Subscribe <ArrowRight size={13} />
            </button>
          </form>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container" style={{ padding: '60px 48px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              fontWeight: 900,
              letterSpacing: '0.1em',
              color: '#fff',
              marginBottom: 16,
            }}>
              BLOOMAIR
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 260, marginBottom: 24 }}>
              AI-powered fashion platform. Try on anything virtually, discover your perfect style, and shop with confidence.
            </p>
            {/* Social links */}
            <div style={{ display: 'flex', gap: 8 }}>
              {['IG', 'TW', 'TK', 'YT'].map(icon => (
                <a
                  key={icon}
                  href="#"
                  style={{
                    width: 36, height: 36,
                    border: '2px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 800,
                    color: 'rgba(255,255,255,0.6)',
                    transition: 'all 0.15s',
                    textDecoration: 'none',
                    letterSpacing: '0.05em',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#f5af19'; e.currentTarget.style.color = '#f5af19'; e.currentTarget.style.background = 'rgba(245,175,25,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'none'; }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <div style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
                marginBottom: 20,
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                paddingBottom: 10,
              }}>
                {title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(link => (
                  <Link
                    key={link.label}
                    to={link.to}
                    style={{
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.55)',
                      textDecoration: 'none',
                      transition: 'color 0.15s',
                      fontWeight: 500,
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
            © 2025 Bloomair. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
              <a
                key={t}
                href="#"
                style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontWeight: 600, letterSpacing: '0.04em' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
