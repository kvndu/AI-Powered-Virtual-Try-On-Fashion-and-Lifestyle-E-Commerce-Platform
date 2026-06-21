import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Camera, Sparkles, ChevronLeft, ChevronRight, Star, Sparkle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { supabase } from '../lib/supabase';

// Assets
import saree1 from '../assets/saree1.jpg';
import saree2 from '../assets/saree2.jpg';
import saree3 from '../assets/saree3.jpg';
import saree4 from '../assets/saree4.jpg';
import saree5 from '../assets/saree5.jpg';
import photo1 from '../assets/photo1.jpeg';

// Supabase video URL (no local asset needed)
const VIDEO_URL = 'https://nliaslftsujgvuwwnltx.supabase.co/storage/v1/object/public/product-images/video3.mp4';

const SAREE_BG_IMAGES = [
  { id: 0, img: saree1, title: 'Blooming Pink silk', subtitle: 'Intricate floral weave' },
  { id: 1, img: saree2, title: 'Mauve Chiffon', subtitle: 'Sequin-laced twilight' },
  { id: 2, img: saree3, title: 'Pure White Shimmer', subtitle: 'Silver thread perfection' },
  { id: 3, img: saree4, title: 'Sculpted Peacock', subtitle: 'Lightweight sequin art' },
  { id: 4, img: saree5, title: 'Crimson Gold Zari', subtitle: 'Royal heritage weave' },
];

const MARQUEE_ITEMS = [
  '✦ NEURAL DRAPING AI 98% ACCURACY',
  '✦ HERITAGE CEYLON WEAVES',
  '✦ EXCLUSIVE VIRTUAL FITTING ROOM',
  '✦ BLOOMAIR PRIVÉ STYLING',
  '✦ COMPLIMENTARY GLOBE SHIPPING',
  '✦ SUSTAINABLE LUXURY TECH',
];

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Anjali Jayawardene',
    role: 'Editorial Director, Colombo Style',
    text: 'Bloomair is the first platform that gets virtual draping right. The drape is incredibly realistic, matching how silk behaves on the body.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Mineth Rathnayake',
    role: 'Luxury Fashion collector',
    text: 'The AI styling curator predicted my color preference perfectly. The white shimmer saree is a masterpiece of modern craftsmanship.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Sonia Alwis',
    role: 'Sustainable Fashion Advocate',
    text: 'Trying outfits virtually before buying saves shipping loops and carbon. This is the future of luxury commerce.',
    rating: 5,
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const lookbookReelRef = useRef(null);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) setFeatured(data.slice(0, 6));
    }
    fetchProducts();
  }, []);

  const scrollLookbook = (direction) => {
    if (lookbookReelRef.current) {
      lookbookReelRef.current.scrollBy({ left: direction === 'left' ? -340 : 340, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ background: '#080808', color: '#fff', minHeight: '100vh', fontFamily: 'var(--font-body)', overflowX: 'hidden' }}>

      {/* ═══════════════ HERO — BOLD TYPOGRAPHY OVER COLOURFUL BG PANELS ═══════════════ */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#060606',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '120px 40px 70px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>

        {/* Full-bleed background saree image panels — bright & colourful */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
        }}>
          {SAREE_BG_IMAGES.map((saree) => (
            <div key={saree.id} style={{ position: 'relative', overflow: 'hidden', borderLeft: '1px solid rgba(255,255,255,0.04)' }}>
              <img src={saree.img} alt={saree.title} style={{
                width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top',
                filter: 'brightness(0.9) saturate(1.15) contrast(1.02)',
              }} />
            </div>
          ))}
        </div>

        {/* Very light overlay — just enough for text legibility, colours stay vivid */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(6,6,6,0.35) 0%, rgba(6,6,6,0.15) 30%, rgba(6,6,6,0.15) 70%, rgba(6,6,6,0.55) 100%)',
        }} />

        {/* Giant bold word */}
        <h1 style={{
          position: 'relative', zIndex: 2,
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(90px, 16vw, 260px)',
          fontWeight: 400,
          letterSpacing: '0.02em',
          lineHeight: 1,
          margin: 0,
          color: '#fff',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          textShadow: '0 6px 24px rgba(0,0,0,0.85), 0 2px 8px rgba(0,0,0,0.9)',
        }}>
          BLOOM<span style={{ color: '#C9A96E' }}>AIR</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          position: 'relative', zIndex: 2,
          fontFamily: "'Tenor Sans', sans-serif",
          fontSize: 14.5,
          lineHeight: 1.75,
          color: 'rgba(255,255,255,0.85)',
          letterSpacing: '0.02em',
          textAlign: 'center',
          maxWidth: 460,
          margin: '28px 0 36px',
          textShadow: '0 2px 10px rgba(0,0,0,0.8)',
        }}>
          Every thread carries a century. Every drape tells your story.
        </p>

        {/* CTA Buttons */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link to="/products" style={{
            display: 'inline-flex', alignItems: 'center', gap: 12, padding: '16px 40px',
            background: '#C9A96E', color: '#000',
            fontSize: 10, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase',
            textDecoration: 'none', transition: 'all 0.3s'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#C9A96E'; }}
          >
            <Camera size={13} /> Explore Collection
          </Link>
          <Link to="/products" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 28px',
            background: 'rgba(6,6,6,0.4)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.35)',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
            textDecoration: 'none', transition: 'all 0.3s', backdropFilter: 'blur(4px)',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; }}
          >
            Browse Catalog <ArrowRight size={12} />
          </Link>
        </div>

        {/* Bottom scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
        }}>
          <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(201,169,110,0.8), transparent)' }} />
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.3em', textTransform: 'uppercase', textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>Scroll</span>
        </div>

      </section>

      {/* ═══════════════ MARQUEE ═══════════════ */}
      <div style={{ background: '#C9A96E', overflow: 'hidden', padding: '16px 0', borderTop: '1px solid rgba(0,0,0,0.1)', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{ padding: '0 40px', fontSize: 10, fontWeight: 900, letterSpacing: '0.25em', color: '#000', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>{item}</span>
          ))}
        </div>
      </div>

      {/* ═══════════════ THE LOOKBOOK ═══════════════ */}
      <section style={{ padding: '120px 80px', backgroundColor: '#080808', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 50 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 24, height: 1, background: '#C9A96E' }} />
                <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.3em', color: '#C9A96E', textTransform: 'uppercase' }}>Selected Editorial</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 400, color: '#fff', margin: 0 }}>
                The Silk <em style={{ fontStyle: 'italic', color: '#C9A96E' }}>Lookbook</em>
              </h2>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {['left', 'right'].map(dir => (
                <button key={dir} onClick={() => scrollLookbook(dir)} style={{
                  width: 44, height: 44, borderRadius: 0, background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A96E'; e.currentTarget.style.color = '#C9A96E'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
                >
                  {dir === 'left' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
              ))}
            </div>
          </div>
          <div ref={lookbookReelRef} className="lookbook-reel" style={{ display: 'flex', gap: 28, overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: 20, scrollbarWidth: 'none' }}>
            {featured.map((product) => (
              <div key={product.id} style={{ flex: '0 0 310px', scrollSnapAlign: 'start' }}>
                <ProductCard product={product} dark />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
            <Link to="/products" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontSize: 11, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#C9A96E', textDecoration: 'none', borderBottom: '1px solid #C9A96E', paddingBottom: 4, transition: 'all 0.3s'
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#C9A96E'}
            >
              View Full Designer Hub <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ VIDEO SECTION (Lookbook ට පහළින්) ═══════════════ */}
      <section style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <video autoPlay loop muted playsInline style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center center',
          zIndex: 0,
          filter: 'brightness(0.5) contrast(102%)'
        }}>
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Sparkles size={12} color="#C9A96E" />
            <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.3em', color: '#C9A96E', textTransform: 'uppercase' }}>Neural Fitting Environment</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 400, color: '#fff', lineHeight: 1.05, margin: '0 0 16px' }}>
            The Digital <em style={{ fontStyle: 'italic', color: '#C9A96E' }}>Weave</em>
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.08em', margin: '0 0 40px', maxWidth: 440, marginLeft: 'auto', marginRight: 'auto' }}>
            Allow code to meet threads. Try on any luxury catalog item virtually with real-time weave simulation.
          </p>
          <Link to="/products" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: '#C9A96E', color: '#000', padding: '16px 36px',
            fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase',
            textDecoration: 'none', transition: 'all 0.3s'
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#fff'}
            onMouseLeave={e => e.currentTarget.style.background = '#C9A96E'}
          >
            Launch Catalogs <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* ═══════════════ FEATURED ITEMS ═══════════════ */}
      <section style={{ padding: '100px 80px 120px', backgroundColor: '#0c0c0c', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>

          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 24, height: 1, background: '#C9A96E' }} />
              <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.3em', color: '#C9A96E', textTransform: 'uppercase' }}>Curated For You</span>
              <div style={{ width: 24, height: 1, background: '#C9A96E' }} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 400, color: '#fff', margin: 0 }}>
              Featured <em style={{ fontStyle: 'italic', color: '#C9A96E' }}>Items</em>
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 12, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
              Handpicked heritage weaves and luxury silks from our latest collection.
            </p>
          </div>

          {/* Products Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 32,
          }}>
            {featured.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <ProductCard product={product} dark />
              </div>
            ))}
          </div>

          {/* View All Link */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 56 }}>
            <Link to="/products" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontSize: 11, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#C9A96E', textDecoration: 'none', borderBottom: '1px solid #C9A96E',
              paddingBottom: 4, transition: 'all 0.3s'
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#C9A96E'}
            >
              View All Products <ArrowRight size={13} />
            </Link>
          </div>

        </div>
      </section>


            {/* ═══════════════ SALE BANNER ═══════════════ */}
      <section style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <img src={photo1} alt="Luxury Silk Sale" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 80px', zIndex: 2 }}>
          <div style={{
            background: 'transparent',
            padding: '50px 60px',
            maxWidth: 580,
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 24, height: 1, background: '#C9A96E' }} />
              <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.3em', color: '#C9A96E', textTransform: 'uppercase' }}>Limited Special Offer</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 400, color: '#fff', lineHeight: 1.15, margin: '0 0 20px' }}>
              Curated luxury <br />At <em style={{ fontStyle: 'italic', color: '#C9A96E' }}>50% Off</em>
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: 36 }}>
              Select high-end silks, ready-made designer blouses, and festive weaves are featured at introductory pricing. Claim your digital fit look today.
            </p>
            <Link to="/products?sale=true" style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              background: '#C9A96E', color: '#000', padding: '16px 36px',
              fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase',
              textDecoration: 'none', transition: 'all 0.3s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff'}
              onMouseLeave={e => e.currentTarget.style.background = '#C9A96E'}
            >
              Shop Sale Collections <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>


                  {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section style={{ padding: '120px 80px', backgroundColor: '#0c0c0c', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 70 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 24, height: 1, background: '#C9A96E' }} />
              <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.3em', color: '#C9A96E', textTransform: 'uppercase' }}>Reviews and Reports</span>
              <div style={{ width: 24, height: 1, background: '#C9A96E' }} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 400, color: '#fff', margin: 0 }}>
              Voice of the <em style={{ fontStyle: 'italic', color: '#C9A96E' }}>Patrons</em>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.id} style={{
                background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)',
                padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                minHeight: 280, transition: 'all 0.3s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)'; e.currentTarget.style.background = 'rgba(201,169,110,0.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; }}
              >
                <div>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
                    {[...Array(t.rating)].map((_, i) => <Star key={i} size={12} fill="#C9A96E" color="#C9A96E" />)}
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, margin: 0 }}>"{t.text}"</p>
                </div>
                <div style={{ marginTop: 32, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: '#C9A96E', marginTop: 4, letterSpacing: '0.05em' }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tenor+Sans&family=Bebas+Neue&display=swap');

        @keyframes marqueeLoop {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeLoop 30s linear infinite;
        }
        .lookbook-reel::-webkit-scrollbar { display: none; }
        .lookbook-reel { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

    </div>
  );
}