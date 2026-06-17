import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Camera } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import video1 from '../assets/video1.mp4';
import { supabase } from '../lib/supabase';
import salesDealzImg from '../assets/sales.png';
import photo1 from '../assets/photo1.jpeg';


/* ── Marquee items ── */
const MARQUEE = [
  '✦ VIRTUAL TRY-ON', '✦ AI STYLING', '✦ FREE RETURNS', '✦ LUXURY FASHION',
  '✦ NEW ARRIVALS', '✦ BLOOMAIR', '✦ DIGITAL COUTURE', '✦ SMART WARDROBE',
  '✦ VIRTUAL TRY-ON', '✦ AI STYLING', '✦ FREE RETURNS', '✦ LUXURY FASHION',
  '✦ NEW ARRIVALS', '✦ BLOOMAIR', '✦ DIGITAL COUTURE', '✦ SMART WARDROBE',
];

const FEEDBACKS = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    location: 'New York, USA',
    initials: 'SM',
    stars: 5,
    text: 'The virtual try-on feature is a game changer. I knew exactly how the dress would fit before it even arrived — no more guesswork!',
  },
  {
    id: 2,
    name: 'Amara Khan',
    location: 'London, UK',
    initials: 'AK',
    stars: 5,
    text: 'I love the AI styling suggestions — they actually matched my body type and taste. Shopping here feels personal, not generic.',
  },
  {
    id: 3,
    name: 'Priya Raina',
    location: 'Mumbai, India',
    initials: 'PR',
    stars: 5,
    text: 'Returns used to be such a hassle for me. Since the fit accuracy here is so good, I genuinely have not needed to return anything yet.',
  },
];

const COLLECTION_IMAGES = [
  { img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80', label: 'Gown Collection', tag: 'Clothing', link: '/products?category=clothing', size: 'large' },
  { img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80', label: 'Heels & Sandals', tag: 'Shoes', link: '/products?category=shoes', size: 'small' },
  { img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', label: 'Bags & Accessories', tag: 'Bags', link: '/products?category=bags', size: 'small' },
];



export default function HomePage() {
  const heroVideo = video1;

  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  
  const [activeFeedback, setActiveFeedback] = useState(1); // Default to middle card (index 1)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
  loadProducts();
  
}, []);


const loadProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  console.log("DATA =", data);
  console.log("ERROR =", error);

  if (error) {
    console.error(error);
    return;
  }

  setFeatured(data.slice(0,5));
  setNewArrivals(data.slice(3, 8));
};

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeedback((prev) => (prev + 1) % FEEDBACKS.length);
    }, 4000); // Auto-slide every 4 seconds
    return () => clearInterval(timer);
  }, []);

  const isMobile = windowWidth < 768;
  const translateVal = isMobile ? 120 : (windowWidth >= 1400 ? 340 : (windowWidth >= 1200 ? 300 : 260));

  const getDiff = (idx) => {
    let diff = idx - activeFeedback;
    const len = FEEDBACKS.length;
    if (diff < -len / 2) diff += len;
    if (diff > len / 2) diff -= len;
    return diff;
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* ════════════════════════════════════════
          HERO — full-screen video background
          ════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        width: '100%',
        minHeight: 'calc(100vh - var(--navbar-h))',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'var(--navbar-h)',
      }}>

        {/* Full-width background video */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
         <video
  autoPlay
  muted
  loop
  playsInline
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center'
  }}
>
  <source src={heroVideo} type="video/mp4" />
</video>
          {/* gradient overlay — dark left, lighter right */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.08) 100%)',
          }} />
        </div>

        {/* Text content — floats over video */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: '50%',
          padding: '60px 48px 60px 64px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          {/* Brand tag */}
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.7)', borderLeft: '3px solid #f5af19', paddingLeft: 12,
            marginBottom: 28, animation: 'fadeUp 0.5s 0.1s both ease',
          }}>
            AI-Powered Fashion Platform
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(64px, 8vw, 120px)',
            fontWeight: 900, lineHeight: 0.9, color: '#ffffff',
            letterSpacing: '-0.02em', marginBottom: 0, animation: 'fadeUp 0.55s 0.15s both ease',
          }}>
            Bloom<span style={{ fontStyle: 'italic' }}>air</span>
          </h1>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.5vw, 52px)',
            fontWeight: 700, lineHeight: 1.15, color: '#ffffff',
            marginBottom: 24, animation: 'fadeUp 0.55s 0.22s both ease',
          }}>
            We Believe<br />in <em>Fashion</em>
          </h2>

          {/* Accent badge */}
          <div style={{
            display: 'inline-block', background: '#f2ead2', transform: 'rotate(-1.5deg)',
            padding: '8px 24px', border: '1.5px solid rgba(0,0,0,0.15)',
            marginBottom: 32, alignSelf: 'flex-start', animation: 'fadeUp 0.55s 0.28s both ease',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16, fontWeight: 600, color: '#27272a', letterSpacing: '0.02em' }}>
              Pop Art Energy
            </span>
          </div>

          <p style={{
            fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.75,
            maxWidth: 360, marginBottom: 40, animation: 'fadeUp 0.55s 0.3s both ease',
          }}>
            Our collections fuse the daring vibrance of pop art with sleek, minimalist design — dressed for the future.
          </p>

          {/* CTA card */}
          <div style={{
            border: '2px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(10px)', width: '100%', maxWidth: 320,
            animation: 'fadeUp 0.55s 0.35s both ease',
          }}>
            {[
              { label: 'Shop the Drop', to: '/products', accent: true },
              { label: 'View Lookbook', to: '#lookbook' },
              { label: 'Virtual Try-On', to: '/try-on' },
            ].map((item, i) => (
              <Link key={i} to={item.to} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.15)' : 'none',
                fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                color: item.accent ? '#000' : '#fff',
                background: item.accent ? '#f5af19' : 'transparent',
                transition: 'background 0.18s', textDecoration: 'none',
              }}
                onMouseEnter={e => { if (!item.accent) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={e => { if (!item.accent) e.currentTarget.style.background = 'transparent'; }}
              >
                {item.label} <ArrowRight size={14} />
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, marginTop: 40, animation: 'fadeUp 0.55s 0.4s both ease' }}>
            {[
              { val: '50K+', label: 'Happy Customers' },
              { val: '4.9★', label: 'Avg Rating' },
              { val: '98%', label: 'Fit Accuracy' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900, color: '#fff' }}>{s.val}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating star accent */}
        <div style={{ position: 'absolute', bottom: 40, right: 48, fontSize: 32, color: '#f5af19', zIndex: 2, animation: 'float 4s ease-in-out infinite' }}>✦</div>
      </section>

      {/* ════════════════════════════════════════
          MARQUEE STRIP
          ════════════════════════════════════════ */}
      <div className="marquee-wrapper" style={{ background: '#f5af19', borderColor: '#000' }}>
        <div className="marquee-track" style={{ padding: '14px 0' }}>
          {MARQUEE.map((item, i) => (
            <span key={i} style={{ padding: '0 28px', fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', color: '#000000', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          FEATURED PRODUCTS
          ════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '1560px', padding: '0 36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, borderBottom: '3px solid #000', paddingBottom: 24 }}>
            <div>
              <div className="section-tag">Curated for You</div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Picks</h2>
            </div>
            <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#000', border: '2px solid #000', padding: '8px 20px', boxShadow: '3px 3px 0px #000', background: '#fff', transition: 'all 0.15s', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
            >
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid-5">
            {featured.map((product, i) => (
              <div key={product.id} style={{ animation: `fadeUp 0.5s ${i * 0.08}s both ease` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ════════════════════════════════════════
          COLLECTION GRID
          ════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '80px 0 0 0' }}>
        <div className="container" style={{ maxWidth: '1560px', padding: '0 36px' }}>
          <div style={{ marginBottom: 40 }}>
            <div className="section-tag">Exclusive Offers</div>
            <h2 className="section-title">Sales Dealz</h2>
          </div>
        </div>

        {/* Sales Dealz Banner (One Full-Width Image) */}
        <div style={{ position: 'relative', overflow: 'hidden', borderTop: '2px solid #000', borderBottom: '2px solid #000', width: '100%' }}>
          <Link to="/products" style={{ display: 'block', position: 'relative', width: '100%', height: isMobile ? '320px' : '580px', textDecoration: 'none' }}>
            <img
              src={salesDealzImg}
              alt="Sales Dealz Banner"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
            <div style={{ position: 'absolute', bottom: isMobile ? 20 : 40, left: isMobile ? 20 : 40, right: isMobile ? 20 : 40, display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'flex-end', justifyContent: 'space-between', gap: isMobile ? 16 : 0 }}>
              <div>
                <div style={{ display: 'inline-block', background: '#f5af19', border: '1.5px solid #000', padding: '4px 12px', fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#000', marginBottom: 12 }}>Limited Time Promo</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '22px' : 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>UP TO 50% OFF FOR NEW STYLES</div>
              </div>
              <div style={{ background: '#fff', border: '2px solid #000', padding: '12px 32px', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#000', display: 'flex', alignItems: 'center', gap: 8, alignSelf: isMobile ? 'stretch' : 'auto', justifyContent: 'center' }}>
                Shop The Deals <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════
          NEW ARRIVALS
          ════════════════════════════════════════ */}
      <section style={{ background: '#f4f1eb', padding: '80px 0', borderTop: '2px solid #000', borderBottom: '2px solid #000' }}>
        <div className="container" style={{ maxWidth: '1560px', padding: '0 36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
            <div>
              <div className="section-tag">Fresh In</div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>New Arrivals</h2>
            </div>
            <Link to="/products" style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#000', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
            >
              See All New <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid-5">
            {newArrivals.map((product, i) => (
              <div key={product.id} style={{ animation: `fadeUp 0.5s ${i * 0.08}s both ease` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          VIRTUAL TRY-ON PROMO
          ════════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `url(${photo1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#0a0a0c',
          width: '100%',
          aspectRatio: isMobile ? 'auto' : '2.2 / 1',
          minHeight: isMobile ? '520px' : '640px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '70px 0' : '0',
          borderTop: '2px solid #000',
          borderBottom: '2px solid #000'
        }}
      >
        {/* Layered overlay — darker base + bottom-weighted gradient for text contrast */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10,10,12,0.38)',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(10,10,12,0.05) 0%, rgba(10,10,12,0.35) 55%, rgba(10,10,12,0.75) 100%)',
          zIndex: 1
        }} />

        {/* Decorative pop-art accents */}
        <div style={{
          position: 'absolute', top: isMobile ? 24 : 36, left: isMobile ? 24 : 40,
          fontSize: isMobile ? 24 : 34, color: '#f5af19', zIndex: 2,
          animation: 'float 4s ease-in-out infinite'
        }}>✦</div>
        <div style={{
          position: 'absolute', bottom: isMobile ? 24 : 40, right: isMobile ? 24 : 48,
          fontSize: isMobile ? 20 : 28, color: '#f5af19', zIndex: 2,
          animation: 'float 5s ease-in-out infinite'
        }}>✦</div>

        {/* Content Layer */}
        <div className="container" style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1560px',
          padding: '0 36px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-block',
            background: '#f5af19',
            border: '2px solid #000',
            boxShadow: '4px 4px 0px rgba(0,0,0,0.45)',
            transform: 'rotate(-1.5deg)',
            padding: '6px 18px',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#000',
            marginBottom: isMobile ? 22 : 32
          }}>
            Powered by AI
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: isMobile ? 'clamp(38px, 10vw, 56px)' : 'clamp(56px, 7vw, 104px)',
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.02,
            letterSpacing: '-0.02em',
            marginBottom: isMobile ? 16 : 26,
            textShadow: '0 6px 28px rgba(0,0,0,0.4)'
          }}>
            Try Before<br /><em>You Buy</em>
          </h2>
          <p style={{
            fontSize: isMobile ? 14 : 18,
            color: 'rgba(255,255,255,0.92)',
            lineHeight: 1.75,
            marginBottom: isMobile ? 30 : 52,
            maxWidth: '660px'
          }}>
            Our AI-powered virtual fitting room lets you see exactly how any outfit looks on you — no changing room required.
          </p>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/try-on" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: '#f5af19',
              color: '#000',
              border: '2px solid #000',
              padding: isMobile ? '14px 28px' : '18px 42px',
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              boxShadow: '5px 5px 0px rgba(0,0,0,0.55)',
              transition: 'all 0.15s',
              textDecoration: 'none'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-3px,-3px)'; e.currentTarget.style.boxShadow = '8px 8px 0px rgba(0,0,0,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '5px 5px 0px rgba(0,0,0,0.55)'; }}
            >
              <Camera size={18} /> Start Try-On
            </Link>
            <Link to="/products" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(6px)',
              color: '#fff',
              border: '2px solid rgba(255,255,255,0.6)',
              padding: isMobile ? '14px 28px' : '18px 42px',
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'all 0.15s',
              textDecoration: 'none'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            >
              Browse Collection <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECOND MARQUEE
          ════════════════════════════════════════ */}
      <div className="marquee-wrapper" style={{ background: '#ffffff', borderColor: '#000' }}>
        <div className="marquee-track" style={{ padding: '12px 0', animationDirection: 'reverse' }}>
          {MARQUEE.map((item, i) => (
            <span key={i} style={{ padding: '0 28px', fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', color: '#000000', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          DELIGHTED CUSTOMERS WITH FEEDBACK (SLIDER)
          ════════════════════════════════════════ */}
      <section style={{ background: 'var(--secondary)', padding: '56px 0', margin: '48px 0', overflow: 'hidden' }}>
        <div className="container" style={{ maxWidth: '1560px', padding: '0 36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="section-tag" style={{ borderBottom: '2px solid #000', color: 'rgba(0,0,0,0.6)' }}>
              Loved By Thousands
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(22px, 3vw, 38px)',
              fontWeight: '800',
              color: '#000000',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              margin: 0,
            }}>
              Delighted Customers
            </h2>
          </div>

          <div style={{
            position: 'relative',
            width: '100%',
            height: '260px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {FEEDBACKS.map((item, i) => {
              const diff = getDiff(i);
              
              // Calculate style properties based on active state
              let transform = 'translateX(0) scale(0.7)';
              let opacity = 0;
              let zIndex = 1;
              let pointerEvents = 'none';

              if (diff === 0) {
                transform = 'translateX(0) translateY(-12px) scale(1.04)';
                opacity = 1;
                zIndex = 3;
                pointerEvents = 'auto';
              } else if (diff === -1) {
                transform = `translateX(${-translateVal}px) translateY(10px) scale(0.88)`;
                opacity = isMobile ? 0 : 0.55;
                zIndex = 2;
                pointerEvents = 'auto';
              } else if (diff === 1) {
                transform = `translateX(${translateVal}px) translateY(10px) scale(0.88)`;
                opacity = isMobile ? 0 : 0.55;
                zIndex = 2;
                pointerEvents = 'auto';
              } else {
                transform = `translateX(${diff * translateVal * 1.15}px) translateY(10px) scale(0.7)`;
                opacity = 0;
                zIndex = 1;
                pointerEvents = 'none';
              }

              return (
                <div
                  key={i}
                  onClick={() => {
                    if (diff === -1) {
                      setActiveFeedback((prev) => (prev - 1 + FEEDBACKS.length) % FEEDBACKS.length);
                    } else if (diff === 1) {
                      setActiveFeedback((prev) => (prev + 1) % FEEDBACKS.length);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    width: isMobile ? '86vw' : '440px',
                    minHeight: '210px',
                    background: '#ffffff',
                    color: '#000000',
                    padding: isMobile ? '24px 22px' : '28px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRadius: '14px',
                    boxShadow: diff === 0 ? '0 20px 40px rgba(0, 0, 0, 0.14)' : '0 10px 20px rgba(0, 0, 0, 0.06)',
                    transform,
                    opacity,
                    zIndex,
                    pointerEvents,
                    cursor: diff !== 0 ? 'pointer' : 'default',
                    transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  }}
                >
                  {/* Quote mark + stars */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '38px', lineHeight: 1, color: '#f5af19', fontWeight: 900 }}>
                      &ldquo;
                    </div>
                    <div style={{ fontSize: '14px', color: '#f5af19', letterSpacing: '3px' }}>
                      {'★'.repeat(item.stars)}
                    </div>
                  </div>

                  {/* Review text */}
                  <p style={{
                    fontSize: isMobile ? '13px' : '14px',
                    lineHeight: 1.65,
                    color: 'var(--text-secondary)',
                    margin: 0,
                    flexGrow: 1,
                  }}>
                    {item.text}
                  </p>

                  {/* Reviewer info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      background: '#000000', color: '#f5af19',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
                      flexShrink: 0,
                    }}>
                      {item.initials}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#000000' }}>{item.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.location}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '16px',
          }}>
            {FEEDBACKS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveFeedback(i)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: activeFeedback === i ? '#000000' : 'rgba(0, 0, 0, 0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>

        </div>
      </section>

    </div>
 
);
}