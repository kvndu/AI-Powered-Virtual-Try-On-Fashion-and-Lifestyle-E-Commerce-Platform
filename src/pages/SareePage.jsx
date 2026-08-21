import { useState, useEffect, useMemo, useRef } from 'react';
import {
  ChevronDown, ChevronUp, ShoppingBag, Heart,
  SlidersHorizontal, X, Search, Grid3X3, LayoutList,
  Sparkles, Star, Filter, Flame, TrendingUp, ArrowRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductDetailPage from './ProductDetailPage';
import { useCart } from '../context/CartContext';

/* ─── Constants ───────────────────────────────────────────────── */
const VIDEO_URL = 'https://nliaslftsujgvuwwnltx.supabase.co/storage/v1/object/public/product-images/video1.mp4';
const SAREE_SUBCATEGORIES = [
  'All', 'Silk Saree', 'Cotton Saree', 'Georgette Saree', 'Chiffon Saree',
  'Linen Saree', 'Banarasi', 'Kanchipuram', 'Designer Saree',
  'Printed Saree', 'Embroidered Saree', 'Party Wear', 'Wedding Saree',
  'Festival Saree', 'Casual Saree', 'Saree',
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

const COLORS = [
  { name: 'Black',   hex: '#1a1a1a' },
  { name: 'White',   hex: '#f0f0f0', border: '#555' },
  { name: 'Nude',    hex: '#c9a88a' },
  { name: 'Pink',    hex: '#f4a7b9' },
  { name: 'Red',     hex: '#e05a6a' },
  { name: 'Blue',    hex: '#5b8ed6' },
  { name: 'Navy',    hex: '#1e3a5f' },
  { name: 'Green',   hex: '#6aab7e' },
  { name: 'Yellow',  hex: '#f5c842' },
  { name: 'Purple',  hex: '#9b72cf' },
  { name: 'Orange',  hex: '#f08040' },
  { name: 'Brown',   hex: '#8b5e3c' },
  { name: 'Grey',    hex: '#aaaaaa' },
  { name: 'Cream',   hex: '#f8f0e0', border: '#555' },
  { name: 'Maroon',  hex: '#800000' },
  { name: 'Gold',    hex: '#FFD700' },
];

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured' },
  { value: 'newest',     label: 'Newest First' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'popular',    label: 'Most Popular' },
];

const MARQUEE_ITEMS = [
  'SAREE COLLECTION 2025  ✦',
  'FREE SHIPPING ON LKR 5000+  ✦',
  'VIRTUAL TRY-ON ENABLED  ✦',
  'HANDPICKED DRAPES  ✦',
  'EXCLUSIVE FESTIVAL PICKS  ✦',
  'EASY RETURNS & EXCHANGES  ✦',
];

const SAREE_COLLECTIONS = [
  { label: 'New Arrivals',   desc: 'Fresh drapes this week' },
  { label: 'Best Sellers',   desc: 'Most loved sarees' },
  { label: 'Festival Edit',  desc: 'Festive season picks' },
  { label: 'Wedding Edit',   desc: 'Bridal & occasion' },
];

const fmt = (n) => parseInt(n).toLocaleString('en-LK');

/* ═══════════════════════════════════════════════════════════════ */
export default function SareePage() {
  const { addItem } = useCart();
  const [products,         setProducts]        = useState([]);
  const [loading,          setLoading]         = useState(true);
  const [selectedCats,     setSelectedCats]    = useState(['All']);
  const [priceRange,       setPriceRange]      = useState([0, 30000]);
  const [selectedSizes,    setSelectedSizes]   = useState([]);
  const [selectedColors,   setSelectedColors]  = useState([]);
  const [wishlist,         setWishlist]        = useState([]);
  const [hoveredProduct,   setHoveredProduct]  = useState(null);
  const [sidebarOpen,      setSidebarOpen]     = useState(true);
  const [sortBy,           setSortBy]          = useState('default');
  const [gridCols,         setGridCols]        = useState(3);
  const [search,           setSearch]          = useState('');
  const [catSearch,        setCatSearch]       = useState('');
  const [openSection,      setOpenSection]     = useState({
    category: true, price: true, sizes: true, colors: true,
  });
  const [addedToCart,      setAddedToCart]     = useState({});
  const [selectedProduct,  setSelectedProduct] = useState(null);
  const [activeCollection, setActiveCollection] = useState(null);
  const searchRef = useRef(null);

  /* fetch — Women gender + Saree category */
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('gender_category', 'Women')
        .eq('category', 'Saree');
      if (data) setProducts(data);
      setLoading(false);
    })();
  }, []);

  const maxProductPrice = useMemo(
    () => Math.max(...products.map(p => p.price_lkr), 30000),
    [products]
  );

  const filteredProducts = useMemo(() => {
    let r = [...products];
    if (!selectedCats.includes('All'))
      r = r.filter(p => selectedCats.includes(p.sub_category || p.category));
    r = r.filter(p => p.price_lkr >= priceRange[0] && p.price_lkr <= priceRange[1]);

    if (activeCollection === 'New Arrivals') {
      r = r.filter(p => !p.created_at || (Date.now() - new Date(p.created_at)) < 1000 * 60 * 60 * 24 * 30);
    } else if (activeCollection === 'Best Sellers') {
      r = r.filter(p => p.original_price && p.price_lkr < p.original_price);
    } else if (activeCollection === 'Festival Edit') {
      r = r.filter(p => {
        const n = (p.name || '').toLowerCase();
        return n.includes('festival') || n.includes('silk') || n.includes('kanchi');
      });
    } else if (activeCollection === 'Wedding Edit') {
      r = r.filter(p => {
        const n = (p.name || '').toLowerCase();
        return n.includes('wedding') || n.includes('bridal') || n.includes('banarasi') || n.includes('kanchi');
      });
    }

    if (search.trim())
      r = r.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === 'price-asc')  r.sort((a, b) => a.price_lkr - b.price_lkr);
    if (sortBy === 'price-desc') r.sort((a, b) => b.price_lkr - a.price_lkr);
    if (sortBy === 'newest')     r.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return r;
  }, [products, selectedCats, priceRange, search, sortBy, activeCollection]);

  const toggleCat   = (c) => {
    if (c === 'All') { setSelectedCats(['All']); return; }
    setSelectedCats(prev => {
      const without = prev.filter(x => x !== 'All');
      return without.includes(c) ? (without.filter(x => x !== c) || ['All']) : [...without, c];
    });
  };
  const toggleSize  = s => setSelectedSizes(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const toggleColor = c => setSelectedColors(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
  const toggleWish  = id => setWishlist(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleSection = k => setOpenSection(p => ({ ...p, [k]: !p[k] }));

  const clearAll = () => {
    setSelectedCats(['All']); setPriceRange([0, 30000]);
    setSelectedSizes([]); setSelectedColors([]); setSearch('');
    setActiveCollection(null);
  };

  const activeFilterCount = [
    !selectedCats.includes('All'),
    priceRange[0] > 0 || priceRange[1] < maxProductPrice,
    selectedSizes.length > 0,
    selectedColors.length > 0,
    search.trim().length > 0,
    activeCollection !== null,
  ].filter(Boolean).length;

  const handleAddToCart = (id, e, size = 'M', color = 'Black', quantity = 1) => {
    e?.stopPropagation();
    const product = products.find(p => p.id === id);
    if (product) {
      addItem({
        id: product.id,
        product_id: product.id,
        name: product.name,
        price: product.price_lkr,
        price_lkr: product.price_lkr,
        image: product.images_array?.[0] || '',
        size,
        color,
        quantity,
      });
    }
    setAddedToCart(p => ({ ...p, [id]: true }));
    setTimeout(() => setAddedToCart(p => ({ ...p, [id]: false })), 1800);
  };

  const visibleCats = catSearch
    ? SAREE_SUBCATEGORIES.filter(c => c.toLowerCase().includes(catSearch.toLowerCase()))
    : SAREE_SUBCATEGORIES;

  /* ─── Sidebar Section ─────────────────────────────────────── */
  const SidebarSection = ({ id, label, children }) => (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '18px 0' }}>
      <div
        onClick={() => toggleSection(id)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: openSection[id] ? '14px' : '0' }}
      >
        <span style={{ fontSize: '9px', fontWeight: '900', letterSpacing: '3px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>{label}</span>
        {openSection[id]
          ? <ChevronUp size={12} color="#C9A96E" />
          : <ChevronDown size={12} color="#C9A96E" />}
      </div>
      {openSection[id] && children}
    </div>
  );

  /* ─── Product Card ────────────────────────────────────────── */
  const ProductCard = ({ p, onProductClick }) => {
    const isHovered = hoveredProduct === p.id;
    const isWished  = wishlist.includes(p.id);
    const inCart    = addedToCart[p.id];
    const discount  = p.original_price && p.original_price > p.price_lkr
      ? Math.round((1 - p.price_lkr / p.original_price) * 100) : 0;
    const isNew = !p.created_at || (Date.now() - new Date(p.created_at)) < 1000 * 60 * 60 * 24 * 30;

    const images = (p.images_array && p.images_array.length > 0)
      ? p.images_array
      : [`https://via.placeholder.com/400x400/111111/C9A96E?text=${encodeURIComponent(p.name || 'Saree')}`];
    const [imgIdx, setImgIdx] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
      if (isHovered && images.length > 1) {
        intervalRef.current = setInterval(() => {
          setImgIdx(i => (i + 1) % images.length);
        }, 1200);
      } else {
        clearInterval(intervalRef.current);
        if (!isHovered) setImgIdx(0);
      }
      return () => clearInterval(intervalRef.current);
    }, [isHovered, images.length]);

    return (
      <div
        onMouseEnter={() => setHoveredProduct(p.id)}
        onMouseLeave={() => setHoveredProduct(null)}
        onClick={() => onProductClick && onProductClick(p)}
        style={{
          background: isHovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
          border: isHovered ? '1px solid rgba(201,169,110,0.45)' : '1px solid rgba(255,255,255,0.07)',
          overflow: 'hidden',
          boxShadow: isHovered
            ? '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,169,110,0.15)'
            : '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'all 0.35s cubic-bezier(0.25,0.8,0.25,1)',
          transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
          cursor: 'pointer', position: 'relative',
        }}
      >
        {/* Image area */}
        <div style={{ position: 'relative', height: gridCols === 1 ? '280px' : '340px', overflow: 'hidden', background: '#0d0d0d' }}>
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={p.name + ' ' + (idx + 1)}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%', objectFit: 'cover',
                objectPosition: 'top center',
                opacity: imgIdx === idx ? 1 : 0,
                transition: 'opacity 0.5s ease, transform 0.7s ease',
                transform: isHovered ? 'scale(1.06)' : 'scale(1)',
              }}
            />
          ))}

          {/* Dots */}
          {images.length > 1 && (
            <div style={{
              position: 'absolute', bottom: '52px', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: '5px', zIndex: 4,
              opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s',
            }}>
              {images.map((_, idx) => (
                <div
                  key={idx}
                  onClick={e => { e.stopPropagation(); setImgIdx(idx); }}
                  style={{
                    width: imgIdx === idx ? '20px' : '6px', height: '6px',
                    borderRadius: '10px',
                    background: imgIdx === idx ? '#C9A96E' : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.3s ease', cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          )}

          {/* Nav buttons */}
          {images.length > 1 && isHovered && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setImgIdx(i => (i - 1 + images.length) % images.length); }}
                style={{
                  position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(201,169,110,0.4)',
                  width: '30px', height: '30px', cursor: 'pointer', zIndex: 5,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', color: '#C9A96E',
                }}
              >&#8249;</button>
              <button
                onClick={e => { e.stopPropagation(); setImgIdx(i => (i + 1) % images.length); }}
                style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(201,169,110,0.4)',
                  width: '30px', height: '30px', cursor: 'pointer', zIndex: 5,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', color: '#C9A96E',
                }}
              >&#8250;</button>
            </>
          )}

          {/* Badges */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '5px', zIndex: 4 }}>
            {discount > 0 && (
              <span style={{ background: '#C9A96E', color: '#000', fontSize: '9px', fontWeight: '900', padding: '3px 8px', letterSpacing: '0.5px' }}>
                -{discount}%
              </span>
            )}
            {isNew && (
              <span style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', color: 'white', fontSize: '9px', fontWeight: '900', padding: '3px 8px', letterSpacing: '0.5px', border: '1px solid rgba(255,255,255,0.2)' }}>
                NEW
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={e => { e.stopPropagation(); toggleWish(p.id); }}
            style={{
              position: 'absolute', top: '12px', right: '12px', zIndex: 5,
              background: isWished ? '#C9A96E' : 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              border: isWished ? 'none' : '1px solid rgba(255,255,255,0.15)',
              width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              opacity: isHovered || isWished ? 1 : 0,
              transition: 'all 0.25s',
            }}
          >
            <Heart size={14} fill={isWished ? '#000' : 'none'} color={isWished ? '#000' : '#C9A96E'} />
          </button>

          {/* Add to Cart */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 4,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(201,169,110,0.3)',
            padding: '13px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(14px)',
            transition: 'all 0.28s ease',
          }}>
            <button
              onClick={e => handleAddToCart(p.id, e)}
              style={{
                flex: 1, padding: '10px',
                background: inCart ? '#C9A96E' : 'transparent',
                border: inCart ? 'none' : '1px solid rgba(201,169,110,0.5)',
                color: inCart ? '#000' : '#C9A96E',
                fontSize: '9px', fontWeight: '900', letterSpacing: '2px',
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                fontFamily: '"Outfit",sans-serif',
              }}
            >
              <ShoppingBag size={12} />
              {inCart ? 'ADDED ✓' : 'ADD TO BAG'}
            </button>
          </div>
        </div>

        {/* Card Info */}
        <div style={{ padding: '16px 18px 18px' }}>
          {p.category && (
            <span style={{ fontSize: '8px', color: '#C9A96E', letterSpacing: '3px', fontWeight: '900', textTransform: 'uppercase' }}>
              {p.sub_category || p.category}
            </span>
          )}
          <h3 style={{
            fontSize: '13px', fontWeight: '400', color: 'rgba(255,255,255,0.85)',
            margin: '6px 0 10px', lineHeight: '1.5',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            fontFamily: '"Tenor Sans","Georgia",serif',
          }}>
            {p.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#C9A96E', fontFamily: '"Outfit",sans-serif' }}>
              LKR {fmt(p.price_lkr)}
            </span>
            {discount > 0 && (
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through' }}>
                LKR {fmt(p.original_price)}
              </span>
            )}
          </div>
          {gridCols === 1 && (
            <div style={{ display: 'flex', gap: '5px', marginTop: '10px', flexWrap: 'wrap' }}>
              {SIZES.slice(0, 5).map(sz => (
                <span key={sz} style={{ fontSize: '9px', fontWeight: '700', padding: '3px 8px', border: '1px solid rgba(201,169,110,0.3)', color: 'rgba(201,169,110,0.7)', letterSpacing: '1px' }}>
                  {sz}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ─── Product Detail ──────────────────────────────────────── */
  if (selectedProduct) {
    return (
      <ProductDetailPage
        product={selectedProduct}
        allProducts={products}
        onBack={() => setSelectedProduct(null)}
        wishlist={wishlist}
        onWish={toggleWish}
        onAddToCart={handleAddToCart}
        addedToCart={addedToCart}
      />
    );
  }

  return (
    <div style={{ backgroundColor: '#080808', minHeight: '100vh', fontFamily: '"Outfit",sans-serif', color: '#fff', overflowX: 'hidden' }}>

      {/* HERO */}
      <section style={{
        position: 'relative', height: '480px', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 40px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <video autoPlay loop muted playsInline style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center 25%',
          filter: 'brightness(0.65) saturate(1.15)',
          zIndex: 0,
        }}>
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(8,8,8,0.5) 0%, rgba(8,8,8,0.1) 40%, rgba(8,8,8,0.1) 60%, rgba(8,8,8,0.85) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(8,8,8,0.55) 100%)',
        }} />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '900px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '32px', height: '1px', background: '#C9A96E' }} />
            <span style={{ fontSize: '9px', fontWeight: '900', letterSpacing: '5px', color: '#C9A96E', textTransform: 'uppercase' }}>
              Bloomair · Saree Collection 2025
            </span>
            <div style={{ width: '32px', height: '1px', background: '#C9A96E' }} />
          </div>

          <h1 style={{
            fontFamily: '"Bebas Neue",sans-serif',
            fontSize: 'clamp(52px, 9vw, 120px)',
            fontWeight: 400,
            letterSpacing: '0.08em',
            lineHeight: 0.9,
            margin: '0 0 20px',
            color: '#fff',
            textShadow: '0 8px 32px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.98)',
          }}>
            SA<span style={{ color: '#C9A96E' }}>REE</span>
          </h1>

          <p style={{
            fontFamily: '"Tenor Sans","Georgia",serif',
            fontSize: '15px',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.8)',
            letterSpacing: '0.04em',
            maxWidth: '440px',
            margin: '0 auto 36px',
            textShadow: '0 2px 12px rgba(0,0,0,0.9)',
          }}>
            Where tradition meets grace. Discover handpicked sarees crafted for every occasion — from festival to wedding to everyday elegance.
          </p>

          <div style={{ display: 'flex', gap: '28px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {SAREE_COLLECTIONS.map(item => (
              <span
                key={item.label}
                onClick={() => {
                  setActiveCollection(activeCollection === item.label ? null : item.label);
                  window.scrollTo({ top: document.getElementById('saree-products')?.offsetTop - 80, behavior: 'smooth' });
                }}
                style={{
                  fontSize: '10px',
                  color: activeCollection === item.label ? '#C9A96E' : 'rgba(255,255,255,0.75)',
                  letterSpacing: '3px',
                  cursor: 'pointer',
                  borderBottom: activeCollection === item.label ? '2px solid #C9A96E' : '1px solid rgba(201,169,110,0.4)',
                  paddingBottom: '4px', fontWeight: '700', transition: 'all 0.2s',
                  textTransform: 'uppercase',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#C9A96E'; }}
                onMouseLeave={e => { if (activeCollection !== item.label) e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
        }}>
          <div style={{ width: '1px', height: '12px', background: 'linear-gradient(to bottom,#C9A96E,transparent)' }} />
          <span style={{ fontSize: '8px', color: '#C9A96E', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: '700' }}>Scroll</span>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background: '#C9A96E', overflow: 'hidden', padding: '14px 0' }}>
        <div className="saree-marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{ padding: '0 40px', fontSize: '10px', fontWeight: '900', letterSpacing: '3px', color: '#000', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* STICKY TOOLBAR */}
      <div id="saree-products" style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '14px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setSidebarOpen(p => !p)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: sidebarOpen ? '#C9A96E' : 'rgba(255,255,255,0.05)',
              color: sidebarOpen ? '#000' : 'rgba(255,255,255,0.7)',
              border: sidebarOpen ? 'none' : '1px solid rgba(255,255,255,0.12)',
              padding: '9px 18px',
              cursor: 'pointer', fontWeight: '900', letterSpacing: '2px',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
              fontFamily: '"Bebas Neue",sans-serif', fontSize: '15px',
            }}
          >
            <Filter size={13} />
            {sidebarOpen ? 'HIDE FILTERS' : 'SHOW FILTERS'}
            {activeFilterCount > 0 && (
              <span style={{
                background: sidebarOpen ? '#000' : '#C9A96E',
                color: sidebarOpen ? '#C9A96E' : '#000',
                borderRadius: '50%', width: '18px', height: '18px', fontSize: '9px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900',
              }}>
                {activeFilterCount}
              </span>
            )}
          </button>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={13} color="#C9A96E" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search sarees..."
              style={{
                paddingLeft: '34px', paddingRight: search ? '32px' : '14px',
                paddingTop: '9px', paddingBottom: '9px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                fontSize: '11px', color: 'rgba(255,255,255,0.8)',
                outline: 'none', width: '220px', fontFamily: '"Outfit",sans-serif',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#C9A96E' }}>
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.28)', letterSpacing: '2px', whiteSpace: 'nowrap', fontFamily: '"Bebas Neue",sans-serif' }}>
          {loading ? '...' : filteredProducts.length + ' / ' + products.length + ' SAREES'}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              border: '1px solid rgba(255,255,255,0.1)', padding: '9px 14px',
              fontSize: '11px', letterSpacing: '0.5px', cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.65)', fontWeight: '600', fontFamily: '"Outfit",sans-serif', outline: 'none',
            }}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value} style={{ background: '#111', color: '#fff' }}>{o.label}</option>
            ))}
          </select>

          <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            {[3, 2, 1].map(n => (
              <button
                key={n}
                onClick={() => setGridCols(n)}
                style={{
                  padding: '9px 12px', border: 'none', cursor: 'pointer',
                  background: gridCols === n ? '#C9A96E' : 'rgba(255,255,255,0.04)',
                  color: gridCols === n ? '#000' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.15s',
                  borderRight: n !== 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}
              >
                {n === 3 ? <Grid3X3 size={13} /> : <LayoutList size={13} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter chips */}
      {activeFilterCount > 0 && (
        <div style={{ padding: '10px 40px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', background: 'rgba(8,8,8,0.98)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {!selectedCats.includes('All') && selectedCats.map(c => (
            <FilterChip key={c} label={c} onRemove={() => toggleCat(c)} />
          ))}
          {selectedSizes.map(s => (
            <FilterChip key={s} label={'Size: ' + s} onRemove={() => toggleSize(s)} />
          ))}
          {selectedColors.map(c => (
            <FilterChip key={c} label={c} onRemove={() => toggleColor(c)} />
          ))}
          {search && <FilterChip label={'"' + search + '"'} onRemove={() => setSearch('')} />}
          {activeCollection && <FilterChip label={'Collection: ' + activeCollection} onRemove={() => setActiveCollection(null)} />}
          <button onClick={clearAll} style={{ fontSize: '14px', color: '#C9A96E', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '900', letterSpacing: '2px', fontFamily: '"Bebas Neue",sans-serif' }}>
            CLEAR ALL
          </button>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={{ display: 'flex', gap: '0', padding: '0 40px 100px' }}>

        {/* Sidebar */}
        <div style={{
          width: sidebarOpen ? '280px' : '0',
          minWidth: sidebarOpen ? '280px' : '0',
          overflow: 'hidden',
          transition: 'all 0.35s cubic-bezier(0.25,0.8,0.25,1)',
          paddingRight: sidebarOpen ? '40px' : '0',
          paddingTop: '36px',
        }}>
          {sidebarOpen && (
            <div>
              <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '16px', height: '1px', background: '#C9A96E' }} />
                  <span style={{ fontSize: '8px', fontWeight: '900', letterSpacing: '4px', color: '#C9A96E' }}>REFINE BY</span>
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAll}
                    style={{
                      marginTop: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.35)',
                      background: 'none', border: '1px solid rgba(255,255,255,0.08)',
                      padding: '6px 14px', cursor: 'pointer', letterSpacing: '1px',
                      fontFamily: '"Outfit",sans-serif', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A96E'; e.currentTarget.style.color = '#C9A96E'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
                  >
                    Clear All ({activeFilterCount})
                  </button>
                )}
              </div>

              <SidebarSection id="category" label="STYLE">
                <div style={{ position: 'relative', marginBottom: '12px' }}>
                  <Search size={11} color="#C9A96E" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    value={catSearch}
                    onChange={e => setCatSearch(e.target.value)}
                    placeholder="Search styles..."
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      paddingLeft: '28px', padding: '8px 10px 8px 28px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.04)',
                      fontSize: '11px', color: 'rgba(255,255,255,0.7)',
                      outline: 'none', fontFamily: '"Outfit",sans-serif',
                    }}
                  />
                </div>
                <div style={{ maxHeight: '260px', overflowY: 'auto', paddingRight: '4px' }}>
                  {visibleCats.map(c => {
                    const active = selectedCats.includes(c) || (c === 'All' && selectedCats.includes('All'));
                    return (
                      <div
                        key={c}
                        onClick={() => toggleCat(c)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '8px 0', cursor: 'pointer',
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                        }}
                      >
                        <span style={{ fontSize: '12px', color: active ? '#C9A96E' : 'rgba(255,255,255,0.42)', fontWeight: active ? '700' : '400', transition: 'color 0.15s' }}>
                          {c}
                        </span>
                        {active && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#C9A96E', flexShrink: 0 }} />}
                      </div>
                    );
                  })}
                </div>
              </SidebarSection>

              <SidebarSection id="price" label="PRICE RANGE">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>LKR {fmt(priceRange[0])}</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#C9A96E' }}>LKR {fmt(priceRange[1])}</span>
                </div>
                <input
                  type="range" min="0" max="30000" value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                  style={{
                    width: '100%', appearance: 'none', height: '2px',
                    background: 'linear-gradient(to right,#C9A96E ' + (priceRange[1] / 300) + '%,rgba(255,255,255,0.1) ' + (priceRange[1] / 300) + '%)',
                    outline: 'none', border: 'none', cursor: 'pointer',
                  }}
                />
                <div style={{ display: 'flex', gap: '6px', marginTop: '16px', flexWrap: 'wrap' }}>
                  {[[0, 5000, 'Under 5K'], [5000, 15000, '5K–15K'], [15000, 30000, '15K+']].map(([mn, mx, lbl]) => (
                    <button
                      key={lbl}
                      onClick={() => setPriceRange([mn, mx])}
                      style={{
                        fontSize: '9px', padding: '5px 12px', cursor: 'pointer',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.03)',
                        color: 'rgba(255,255,255,0.45)',
                        fontFamily: '"Outfit",sans-serif', fontWeight: '600', letterSpacing: '1px',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A96E'; e.currentTarget.style.color = '#C9A96E'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </SidebarSection>

              <SidebarSection id="sizes" label="SIZE">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {SIZES.map(sz => {
                    const sel = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        onClick={() => toggleSize(sz)}
                        style={{
                          minWidth: '42px', height: '42px', padding: '0 8px',
                          border: sel ? '1px solid #C9A96E' : '1px solid rgba(255,255,255,0.1)',
                          background: sel ? '#C9A96E' : 'rgba(255,255,255,0.03)',
                          color: sel ? '#000' : 'rgba(255,255,255,0.5)',
                          cursor: 'pointer',
                          fontSize: '10px', fontWeight: '900', fontFamily: '"Outfit",sans-serif',
                          transition: 'all 0.18s', letterSpacing: '0.5px',
                        }}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </SidebarSection>

              <SidebarSection id="colors" label="COLOR">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {COLORS.map(({ name, hex, border }) => {
                    const sel = selectedColors.includes(name);
                    return (
                      <div
                        key={name}
                        onClick={() => toggleColor(name)}
                        title={name}
                        style={{
                          width: '28px', height: '28px', borderRadius: '50%', background: hex,
                          cursor: 'pointer', flexShrink: 0,
                          outline: sel ? '2px solid #C9A96E' : '2px solid transparent',
                          outlineOffset: '3px',
                          border: '1.5px solid ' + (border || 'transparent'),
                          boxShadow: '0 1px 6px rgba(0,0,0,0.5)',
                          transition: 'all 0.18s',
                          transform: sel ? 'scale(1.18)' : 'scale(1)',
                        }}
                      />
                    );
                  })}
                </div>
                {selectedColors.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {selectedColors.map(c => (
                      <span key={c} style={{ fontSize: '9px', color: '#C9A96E', background: 'rgba(201,169,110,0.1)', padding: '2px 10px', border: '1px solid rgba(201,169,110,0.2)', letterSpacing: '1px' }}>
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </SidebarSection>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div style={{ flexGrow: 1, paddingTop: '36px' }}>
          {loading ? (
            <SkeletonGrid cols={gridCols} />
          ) : filteredProducts.length === 0 ? (
            <EmptyState onClear={clearAll} />
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(' + gridCols + ',1fr)',
                gap: '20px',
              }}>
                {filteredProducts.map(p => <ProductCard key={p.id} p={p} onProductClick={setSelectedProduct} />)}
              </div>

              <div style={{ marginTop: '60px', textAlign: 'center', paddingBottom: '20px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '60px', height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', letterSpacing: '3px', fontWeight: '900', fontFamily: '"Bebas Neue",sans-serif' }}>
                    {filteredProducts.length} SAREES DISPLAYED
                  </span>
                  <div style={{ width: '60px', height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Tenor+Sans&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700;900&display=swap');
        @keyframes sareeMarqueeLoop {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .saree-marquee-track {
          display: flex;
          width: max-content;
          animation: sareeMarqueeLoop 28s linear infinite;
        }
        @keyframes sareeShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px; height: 16px; border-radius: 50%;
          background: #C9A96E; cursor: pointer;
          border: 2px solid #080808;
          box-shadow: 0 1px 8px rgba(201,169,110,0.5);
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(201,169,110,0.3); border-radius: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        select option { background: #111; color: #fff; }
      `}</style>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────── */
function FilterChip({ label, onRemove }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      background: 'rgba(201,169,110,0.12)', color: '#C9A96E',
      fontSize: '9px', fontWeight: '700', letterSpacing: '1.5px',
      padding: '5px 12px', border: '1px solid rgba(201,169,110,0.3)',
    }}>
      {label}
      <button onClick={onRemove} style={{ background: 'none', border: 'none', color: 'rgba(201,169,110,0.6)', cursor: 'pointer', padding: '0', lineHeight: 1 }}>
        <X size={10} />
      </button>
    </div>
  );
}

function SkeletonGrid({ cols }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + cols + ',1fr)', gap: '20px' }}>
      {[...Array(cols * 2)].map((_, i) => (
        <div key={i} style={{ overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ height: '340px', background: 'linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%)', backgroundSize: '200% 100%', animation: 'sareeShimmer 1.6s infinite' }} />
          <div style={{ padding: '18px' }}>
            <div style={{ height: '8px', background: 'rgba(201,169,110,0.12)', marginBottom: '10px', width: '40%' }} />
            <div style={{ height: '13px', background: 'rgba(255,255,255,0.05)', marginBottom: '7px', width: '80%' }} />
            <div style={{ height: '13px', background: 'rgba(255,255,255,0.04)', width: '50%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div style={{ textAlign: 'center', padding: '120px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ width: '80px', height: '80px', border: '1px solid rgba(201,169,110,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Search size={32} color="rgba(201,169,110,0.4)" />
      </div>
      <div>
        <p style={{ color: 'rgba(255,255,255,0.2)', margin: '0 0 8px', fontFamily: '"Bebas Neue",sans-serif', fontSize: '22px', letterSpacing: '3px' }}>NO SAREES FOUND</p>
        <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '12px', margin: 0 }}>Try adjusting your filters</p>
      </div>
      <button
        onClick={onClear}
        style={{
          marginTop: '8px', padding: '13px 36px',
          background: 'transparent', color: '#C9A96E',
          border: '1px solid rgba(201,169,110,0.5)',
          cursor: 'pointer', letterSpacing: '3px', fontWeight: '900',
          fontFamily: '"Bebas Neue",sans-serif', fontSize: '16px',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#C9A96E'; e.currentTarget.style.color = '#000'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C9A96E'; }}
      >
        CLEAR ALL FILTERS
      </button>
    </div>
  );
}
