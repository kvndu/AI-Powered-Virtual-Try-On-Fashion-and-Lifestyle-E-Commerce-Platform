import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartSidebar from './CartSidebar';
import { ShoppingBag, Search, Heart, User, X, LogOut, Package, Sparkles, AlignJustify, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, profile, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [cartOpen, setCartOpen]         = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen]     = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Screenshot eke thiyana main nav layout links tika
  const navLinks = [
    { to: '/', label: 'HOME' },
    { to: '/products?category=women', label: 'WOMEN' },
    { to: '/products?category=men', label: 'MEN' },
    { to: '/products?category=beauty', label: 'BEAUTY' },
    { to: '/products?category=kids', label: 'KIDS' },
    { to: '/products?category=accessories', label: 'ACCESSORIES' },
    { to: '/products?category=toys', label: 'TOYS' },
    { to: '/products?category=homeware', label: 'HOMEWARE' },
    { to: '/gift-cards', label: 'GIFT CARDS' },
    { to: '/offers', label: 'OFFERS' },
  ];

  const isLinkActive = (linkTo) => {
    const [path, search] = linkTo.split('?');
    if (location.pathname !== path) return false;
    if (!search) return !location.search;
    return location.search.includes(search);
  };

  return (
    <>
      {/* ── Search Overlay ── */}
      {searchOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'flex-start',
            paddingTop: '120px',
            justifyContent: 'center',
          }}
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
        >
          <div style={{ width: '100%', maxWidth: 680, padding: '0 24px' }}>
            <form onSubmit={handleSearch} style={{ position: 'relative' }}>
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search styles, collections..."
                style={{
                  width: '100%',
                  padding: '16px 60px 16px 24px',
                  fontSize: 18,
                  background: '#ffffff',
                  border: 'none',
                  borderRadius: '30px',
                  color: '#000000',
                  outline: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  fontWeight: 500,
                }}
              />
              <button type="submit" style={{
                position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center',
              }}>
                <Search size={18} color="#555" />
              </button>
            </form>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em' }}>
                Press <kbd style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: 11 }}>Esc</kbd> to close
              </p>
              <button
                onClick={() => setSearchOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 12, letterSpacing: '1px' }}
              >
                CLOSE ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Navbar ── */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 800,
        height: '64px',
        // Screenshot matte gradient code
        background: scrolled ? 'rgba(50,50,50,0.96)' : 'linear-gradient(to bottom, #4f4f4f, #606060)',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        transition: 'background 0.3s, backdrop-filter 0.3s',
      }}>
        <div style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 40px',
        }}>

          {/* ── Left: Logo Section ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Mobile Hamburger Icon */}
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'none' }}
              className="mobile-menu-trigger"
            >
              <AlignJustify size={20} />
            </button>

            <Link to="/" style={{ textDecoration: 'none' }}>
              <span style={{
                fontFamily: "'Playfair Display', serif", // Screenshot font match
                fontWeight: 700,
                fontSize: 24,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#ffffff',
                userSelect: 'none',
              }}>
                BLOOMAIR
              </span>
            </Link>
          </div>

          {/* ── Center: Desktop Nav Links ── */}
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }} className="desktop-nav">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: isLinkActive(link.to) ? '#ffffff' : 'rgba(255,255,255,0.8)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  borderBottom: isLinkActive(link.to) ? '1px solid #fff' : '1px solid transparent',
                  paddingBottom: 4,
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={e => {
                  if (!isLinkActive(link.to)) {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Right Actions ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              style={{
                background: 'none', border: 'none',
                color: '#ffffff', cursor: 'pointer',
                display: 'flex', alignItems: 'center',
                padding: 4, opacity: 0.9
              }}
              title="Search"
            >
              <Search size={18} />
            </button>

            {/* Wishlist */}
            {user && (
              <Link
                to="/profile?tab=wishlist"
                style={{ color: '#ffffff', display: 'flex', alignItems: 'center', padding: 4, opacity: 0.9 }}
                title="Wishlist"
              >
                <Heart size={18} />
              </Link>
            )}

            {/* User Dropdown Button / Capsule Style Sign In */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.5)',
                    borderRadius: '20px',
                    padding: '6px 16px',
                    cursor: 'pointer',
                    color: '#ffffff',
                    fontSize: 11, fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#ffffff'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'}
                >
                  <User size={13} />
                  <span>{profile?.full_name?.split(' ')[0] || 'Account'}</span>
                  <ChevronDown size={10} style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {userMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    background: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    minWidth: 200,
                    zIndex: 100,
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f1f1' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>
                        {profile?.full_name || 'Welcome!'}
                      </div>
                      <div style={{ fontSize: 11, color: '#777', wordBreak: 'break-all', marginTop: 2 }}>
                        {user.email}
                      </div>
                    </div>

                    {[
                      { to: '/profile', label: 'My Profile', icon: <User size={13} /> },
                      { to: '/orders', label: 'My Orders', icon: <Package size={13} /> },
                      ...(isAdmin ? [{ to: '/admin', label: 'Admin Dashboard', icon: <Sparkles size={13} /> }] : [])
                    ].map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '11px 16px',
                          fontSize: 12, fontWeight: 500,
                          color: '#333333',
                          textDecoration: 'none',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          borderBottom: '1px solid #f8f8f8',
                          transition: 'background 0.2s',
                        }}
                        onClick={() => setUserMenuOpen(false)}
                        onMouseEnter={e => e.currentTarget.style.background = '#f9f9f9'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}

                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        width: '100%',
                        padding: '11px 16px',
                        fontSize: 12, fontWeight: 500,
                        color: '#df4759',
                        background: 'none', border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <LogOut size={13} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.6)',
                  padding: '7px 18px',
                  borderRadius: '20px', // Full Capsule Look
                  transition: 'all 0.2s',
                  background: 'transparent',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#333333'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ffffff'; }}
              >
                Sign In
              </Link>
            )}

            {/* Bag Button Capsule Style */}
            <button
              onClick={() => setCartOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.6)',
                padding: '7px 18px',
                borderRadius: '20px',
                cursor: 'pointer',
                color: '#ffffff',
                fontSize: 11, fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#333333'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ffffff'; }}
            >
              <ShoppingBag size={13} />
              <span>BAG</span>
              {itemCount > 0 && (
                <span style={{
                  background: '#ffffff',
                  color: '#333333',
                  borderRadius: '50%',
                  width: 16, height: 16,
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginLeft: 2,
                }}>
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Drawer ── */}
      {mobileOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 798, background: 'rgba(0,0,0,0.4)' }}
            onClick={() => setMobileOpen(false)}
          />
          <div style={{
            position: 'fixed', top: 0, left: 0, width: 280, height: '100vh',
            background: '#ffffff', zIndex: 799,
            paddingTop: '80px', paddingLeft: 24, paddingRight: 24,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding: '12px 0', fontSize: 15, fontWeight: 600,
                  color: '#333333', textDecoration: 'none',
                  borderBottom: '1px solid #eee'
                }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </>
      )}

      {/* ── Cart Sidebar ── */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ── Click outside overlay ── */}
      {userMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setUserMenuOpen(false)} />
      )}
    </>
  );
}