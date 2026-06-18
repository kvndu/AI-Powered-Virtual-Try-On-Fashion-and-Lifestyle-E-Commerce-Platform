import { useState, useEffect, useMemo, useRef } from 'react';
import {
  ChevronDown, ChevronUp, ShoppingBag, Heart,
  SlidersHorizontal, X, Search, Grid3X3, LayoutList,
  Star, Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/* ─── Constants ───────────────────────────────────────────────── */
const CATEGORIES = [
  'All', 'Home Decor', 'Bedding', 'Cushions & Throws', 'Curtains', 'Rugs & Carpets',
  'Kitchenware', 'Dining Essentials', 'Bathroom Accessories', 'Storage & Organization', 'Lighting & Lamps'
];

const SIZES = ['Standard', 'Single', 'Double', 'Queen', 'King', 'Pack of 2', 'Pack of 4'];

const COLORS = [
  { name:'Black',   hex:'#1a1a1a' },
  { name:'White',   hex:'#f0f0f0', border:'#ccc' },
  { name:'Nude',    hex:'#c9a88a' },
  { name:'Pink',    hex:'#f4a7b9' },
  { name:'Red',     hex:'#e05a6a' },
  { name:'Blue',    hex:'#5b8ed6' },
  { name:'Navy',    hex:'#1e3a5f' },
  { name:'Green',   hex:'#6aab7e' },
  { name:'Yellow',  hex:'#f5c842' },
  { name:'Purple',  hex:'#9b72cf' },
  { name:'Orange',  hex:'#f08040' },
  { name:'Brown',   hex:'#8b5e3c' },
  { name:'Grey',    hex:'#aaaaaa' },
  { name:'Cream',   hex:'#f8f0e0', border:'#ccc' },
];

const SORT_OPTIONS = [
  { value:'default',    label:'Featured' },
  { value:'newest',     label:'Newest First' },
  { value:'price-asc',  label:'Price: Low → High' },
  { value:'price-desc', label:'Price: High → Low' },
  { value:'popular',    label:'Most Popular' },
];

/* ─── Helpers ─────────────────────────────────────────────────── */
const fmt = (n) => parseInt(n).toLocaleString('en-LK');

const isHomewareProduct = (p) => {
  const genderCategory = p.gender_category?.toLowerCase() || '';
  const category = p.category?.toLowerCase() || '';
  const subcategory = p.subcategory?.toLowerCase() || '';
  const name = p.name?.toLowerCase() || '';
  const tag = p.tag?.toLowerCase() || '';

  if (genderCategory === 'home' || genderCategory === 'homeware' || category === 'home' || category === 'homeware') {
    return true;
  }

  const homewareKeywords = [
    'decor', 'vase', 'candle', 'figurine', 'mirror', 'clock', 'bed sheet', 'duvet', 'comforter', 'quilt', 'pillow',
    'cushion', 'throw blanket', 'curtain', 'rug', 'carpet', 'mat', 'cookware', 'frying pan', 'saucepan', 'baking', 'utensil',
    'plate', 'bowl', 'cup', 'mug', 'glassware', 'cutlery', 'towel', 'soap dispenser', 'toothbrush holder', 'laundry basket',
    'storage box', 'storage basket', 'closet organizer', 'shelving', 'lamp', 'night light', 'string light'
  ];

  return homewareKeywords.some(kw => name.includes(kw) || subcategory.includes(kw) || tag.includes(kw));
};

/* ═══════════════════════════════════════════════════════════════ */
export default function HomewarePage() {
  const { addItem } = useCart();
  const { user, profile, updateProfile } = useAuth();

  const [products,        setProducts]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [selectedCats,    setSelectedCats]    = useState(['All']);
  const [priceRange,      setPriceRange]      = useState([0, 25000]);
  const [selectedSizes,   setSelectedSizes]   = useState([]);
  const [selectedColors,  setSelectedColors]  = useState([]);
  const [wishlist,        setWishlist]        = useState([]);
  const [hoveredProduct,  setHoveredProduct]  = useState(null);
  const [sidebarOpen,     setSidebarOpen]     = useState(true);
  const [sortBy,          setSortBy]          = useState('default');
  const [gridCols,        setGridCols]        = useState(3);
  const [search,          setSearch]          = useState('');
  const [catSearch,       setCatSearch]       = useState('');
  const [openSection,     setOpenSection]     = useState({
    category:true, price:true, sizes:true, colors:true,
  });
  const [addedToCart,     setAddedToCart]     = useState({});
  const searchRef = useRef(null);

  /* fetch */
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from('products').select('*');
      if (data) setProducts(data);
      setLoading(false);
    })();
  }, []);

  /* Sync Wishlist */
  useEffect(() => {
    if (profile?.wishlist) {
      setWishlist(profile.wishlist);
    }
  }, [profile]);

  /* derived values */
  const maxProductPrice = useMemo(() => {
    if (products.length === 0) return 25000;
    return Math.max(...products.map(p => p.price_lkr), 25000);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let r = [...products];

    // Filter to only homeware if any homeware products exist
    const homewareOnly = r.filter(isHomewareProduct);
    if (homewareOnly.length > 0) {
      r = homewareOnly;
    }

    // Category filtering
    if (!selectedCats.includes('All')) {
      r = r.filter(p => {
        const pSub = p.subcategory?.toLowerCase() || '';
        const pCat = p.category?.toLowerCase() || '';
        const pName = p.name?.toLowerCase() || '';
        
        return selectedCats.some(cat => {
          const c = cat.toLowerCase();
          
          if (c === 'home decor') {
            return pSub.includes('decor') || pSub.includes('art') || pSub.includes('frame') || pSub.includes('vase') || pSub.includes('plant') || pSub.includes('candle') || pSub.includes('tray') || pSub.includes('figurine') || pSub.includes('sculpture') || pSub.includes('mirror') || pSub.includes('clock');
          }
          if (c === 'bedding') {
            return pSub.includes('bed') || pSub.includes('duvet') || pSub.includes('comforter') || pSub.includes('quilt') || pSub.includes('mattress') || pSub.includes('pillow') || pSub.includes('runner');
          }
          if (c === 'cushions & throws') {
            return pSub.includes('cushion') || pSub.includes('throw') || pSub.includes('blanket');
          }
          if (c === 'curtains') {
            return pSub.includes('curtain') || pSub.includes('rod');
          }
          if (c === 'rugs & carpets') {
            return pSub.includes('rug') || pSub.includes('carpet') || pSub.includes('doormat');
          }
          if (c === 'kitchenware') {
            return pSub.includes('cookware') || pSub.includes('pan') || pSub.includes('pot') || pSub.includes('bake') || pSub.includes('utensil') || pSub.includes('board') || pSub.includes('container');
          }
          if (c === 'dining essentials') {
            return pSub.includes('dinner') || pSub.includes('plate') || pSub.includes('bowl') || pSub.includes('cup') || pSub.includes('mug') || pSub.includes('glass') || pSub.includes('cutlery') || pSub.includes('tray');
          }
          if (c === 'bathroom accessories') {
            return pSub.includes('towel') || pSub.includes('bath') || pSub.includes('dispenser') || pSub.includes('toothbrush') || pSub.includes('shower') || pSub.includes('basket');
          }
          if (c === 'storage & organization') {
            return pSub.includes('box') || pSub.includes('basket') || pSub.includes('organizer') || pSub.includes('shelving') || pSub.includes('laundry');
          }
          if (c === 'lighting & lamps') {
            return pSub.includes('light') || pSub.includes('lamp');
          }
          
          return pSub.includes(c) || pCat.includes(c) || pName.includes(c);
        });
      });
    }

    r = r.filter(p => p.price_lkr >= priceRange[0] && p.price_lkr <= priceRange[1]);

    if (search.trim()) {
      r = r.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));
    }

    if (sortBy === 'price-asc')  r.sort((a,b) => a.price_lkr - b.price_lkr);
    if (sortBy === 'price-desc') r.sort((a,b) => b.price_lkr - a.price_lkr);
    if (sortBy === 'newest')     r.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    return r;
  }, [products, selectedCats, priceRange, search, sortBy]);

  /* filter helpers */
  const toggleCat = (c) => {
    if (c === 'All') { setSelectedCats(['All']); return; }
    setSelectedCats(prev => prev.includes(c) ? ['All'] : [c]);
  };
  const toggleSize  = s => setSelectedSizes(p => p.includes(s)?p.filter(x=>x!==s):[...p,s]);
  const toggleColor = c => setSelectedColors(p => p.includes(c)?p.filter(x=>x!==c):[...p,c]);
  
  const toggleWish = async (id) => {
    if (!user) {
      toast.error('Please sign in to wishlist items');
      return;
    }
    const isWished = wishlist.includes(id);
    const next = isWished ? wishlist.filter(x => x !== id) : [...wishlist, id];
    setWishlist(next);
    try {
      await updateProfile({ wishlist: next });
    } catch {
      setWishlist(wishlist);
    }
  };

  const toggleSection = k => setOpenSection(p=>({...p,[k]:!p[k]}));

  const clearAll = () => {
    setSelectedCats(['All']); setPriceRange([0, maxProductPrice]);
    setSelectedSizes([]); setSelectedColors([]); setSearch('');
  };

  const activeFilterCount = [
    !selectedCats.includes('All'),
    priceRange[0]>0 || priceRange[1]<maxProductPrice,
    selectedSizes.length>0,
    selectedColors.length>0,
    search.trim().length>0,
  ].filter(Boolean).length;

  const handleAddToCart = (id, e, size = 'One Size', color = 'Default', quantity = 1) => {
    e?.stopPropagation();
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    addItem({
      id: product.id,
      product_id: product.id,
      name: product.name,
      price: product.price_lkr,
      price_lkr: product.price_lkr,
      image: product.images_array?.[0] || '',
      size,
      color,
      quantity
    });

    setAddedToCart(p => ({ ...p, [id]: true }));
    setTimeout(() => setAddedToCart(p => ({ ...p, [id]: false })), 1800);

    toast.success(`Added to bag!`, {
      style: {
        background: '#000',
        color: '#fff',
        borderRadius: '8px',
        fontSize: '12px'
      }
    });
  };

  const visibleCats = catSearch
    ? CATEGORIES.filter(c=>c.toLowerCase().includes(catSearch.toLowerCase()))
    : CATEGORIES;

  /* ─── Sidebar ─────────────────────────────────────────────── */
  const SidebarSection = ({ id, label, children }) => (
    <div style={{borderBottom:'1px solid #f0f0f0', padding:'18px 0'}}>
      <div
        onClick={()=>toggleSection(id)}
        style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',marginBottom: openSection[id]?'14px':'0'}}
      >
        <span style={{fontSize:'10px',fontWeight:'700',letterSpacing:'2.5px',color:'#111'}}>{label}</span>
        {openSection[id]
          ? <ChevronUp size={13} color="#aaa"/>
          : <ChevronDown size={13} color="#aaa"/>}
      </div>
      {openSection[id] && children}
    </div>
  );

  /* ─── Product Card ────────────────────────────────────────── */
  const ProductCard = ({ p }) => {
    const isHovered = hoveredProduct === p.id;
    const isWished  = wishlist.includes(p.id);
    const inCart    = addedToCart[p.id];
    const discount  = p.original_price && p.original_price > p.price_lkr
      ? Math.round((1 - p.price_lkr / p.original_price) * 100) : 0;
    const isNew = !p.created_at || (Date.now() - new Date(p.created_at)) < 1000*60*60*24*30;

    const images = (p.images_array && p.images_array.length > 0)
      ? p.images_array
      : [`https://via.placeholder.com/400x400/f8f8f8/aaa?text=${encodeURIComponent(p.name||'Product')}`];
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

    const [showPopup, setShowPopup] = useState(false);
    const cardRef = useRef(null);

    return (
      <>
        <div
          ref={cardRef}
          onMouseEnter={() => { setHoveredProduct(p.id); setShowPopup(true); }}
          onMouseLeave={() => { setHoveredProduct(null); setShowPopup(false); }}
          style={{
            background:'white', borderRadius:'16px', overflow:'hidden',
            boxShadow: isHovered ? '0 20px 50px rgba(0,0,0,0.13)' : '0 2px 12px rgba(0,0,0,0.05)',
            transition:'all 0.35s cubic-bezier(0.25,0.8,0.25,1)',
            transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
            cursor:'pointer', position:'relative',
          }}
        >
          <div style={{position:'relative', height: gridCols===1?'280px':'330px', overflow:'hidden', background:'#f8f8f8'}}>
            {images.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`${p.name} ${idx+1}`}
                style={{
                  position:'absolute', inset:0,
                  width:'100%', height:'100%', objectFit:'cover',
                  opacity: imgIdx === idx ? 1 : 0,
                  transition:'opacity 0.5s ease, transform 0.6s ease',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
              />
            ))}

            {images.length > 1 && (
              <div style={{
                position:'absolute', bottom:'44px', left:'50%', transform:'translateX(-50%)',
                display:'flex', gap:'5px', zIndex:4,
                opacity: isHovered ? 1 : 0, transition:'opacity 0.2s',
              }}>
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    onClick={e => { e.stopPropagation(); setImgIdx(idx); }}
                    style={{
                      width: imgIdx===idx ? '18px' : '6px', height:'6px',
                      borderRadius:'10px',
                      background: imgIdx===idx ? 'white' : 'rgba(255,255,255,0.5)',
                      transition:'all 0.3s ease', cursor:'pointer',
                    }}
                  />
                ))}
              </div>
            )}

            {images.length > 1 && isHovered && (
              <>
                <button
                  onClick={e=>{ e.stopPropagation(); setImgIdx(i=>(i-1+images.length)%images.length); }}
                  style={{
                    position:'absolute',left:'8px',top:'50%',transform:'translateY(-50%)',
                    background:'rgba(255,255,255,0.85)',border:'none',borderRadius:'50%',
                    width:'28px',height:'28px',cursor:'pointer',zIndex:5,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:'14px',color:'#333',boxShadow:'0 2px 8px rgba(0,0,0,0.15)',
                  }}
                >‹</button>
                <button
                  onClick={e=>{ e.stopPropagation(); setImgIdx(i=>(i+1)%images.length); }}
                  style={{
                    position:'absolute',right:'8px',top:'50%',transform:'translateY(-50%)',
                    background:'rgba(255,255,255,0.85)',border:'none',borderRadius:'50%',
                    width:'28px',height:'28px',cursor:'pointer',zIndex:5,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:'14px',color:'#333',boxShadow:'0 2px 8px rgba(0,0,0,0.15)',
                  }}
                >›</button>
              </>
            )}

            <div style={{position:'absolute',top:'12px',left:'12px',display:'flex',flexDirection:'column',gap:'5px',zIndex:4}}>
              {discount > 0 && (
                <span style={{background:'#e05a6a',color:'white',fontSize:'9px',fontWeight:'700',padding:'3px 7px',borderRadius:'20px',letterSpacing:'0.5px'}}>
                  -{discount}%
                </span>
              )}
              {isNew && (
                <span style={{background:'#111',color:'white',fontSize:'9px',fontWeight:'700',padding:'3px 7px',borderRadius:'20px',letterSpacing:'0.5px'}}>
                  NEW
                </span>
              )}
            </div>

            <button
              onClick={e=>{e.stopPropagation();toggleWish(p.id);}}
              style={{
                position:'absolute',top:'12px',right:'12px',zIndex:5,
                background: isWished ? '#e05a6a' : 'rgba(255,255,255,0.92)',
                border:'none', borderRadius:'50%',
                width:'36px', height:'36px',
                display:'flex', alignItems:'center', justifyContent:'center',
                cursor:'pointer', backdropFilter:'blur(4px)',
                boxShadow:'0 2px 10px rgba(0,0,0,0.12)',
                opacity: isHovered||isWished ? 1 : 0,
                transition:'all 0.2s',
              }}
            >
              <Heart size={15} fill={isWished?'white':'none'} color={isWished?'white':'#555'} />
            </button>

            <div style={{
              position:'absolute', bottom:0, left:0, right:0, zIndex:4,
              background:'rgba(17,17,17,0.88)', backdropFilter:'blur(8px)',
              padding:'13px 16px',
              display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(12px)',
              transition:'all 0.28s ease',
            }}>
              <button
                onClick={e=>handleAddToCart(p.id,e)}
                style={{
                  flex:1, padding:'9px',
                  background: inCart ? '#4caf87' : 'transparent',
                  border:'1px solid rgba(255,255,255,0.35)', borderRadius:'8px',
                  color:'white', fontSize:'10px', fontWeight:'700', letterSpacing:'1.5px',
                  cursor:'pointer', transition:'all 0.2s',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
                }}
              >
                <ShoppingBag size={12}/>
                {inCart ? 'ADDED ✓' : 'ADD TO BAG'}
              </button>
            </div>
          </div>

          <div style={{padding:'14px 16px 16px'}}>
            {p.subcategory && (
              <span style={{fontSize:'9px',color:'#bbb',letterSpacing:'2px',fontWeight:'600'}}>
                {p.subcategory.toUpperCase()}
              </span>
            )}
            <h3 style={{
              fontSize:'13px', fontWeight:'500', color:'#111',
              margin:'4px 0 10px', lineHeight:'1.45',
              display:'-webkit-box', WebkitLineClamp:2,
              WebkitBoxOrient:'vertical', overflow:'hidden',
            }}>
              {p.name}
            </h3>
            <div style={{display:'flex',alignItems:'baseline',gap:'8px'}}>
              <span style={{fontSize:'15px',fontWeight:'700',color:'#111'}}>
                LKR {fmt(p.price_lkr)}
              </span>
              {discount > 0 && (
                <span style={{fontSize:'11px',color:'#ccc',textDecoration:'line-through'}}>
                  LKR {fmt(p.original_price)}
                </span>
              )}
            </div>
          </div>
        </div>

        {showPopup && (
          <ProductPopup p={p} images={images} imgIdx={imgIdx} isWished={isWished}
            onWish={()=>toggleWish(p.id)} onCart={e=>handleAddToCart(p.id,e)}
            inCart={inCart} discount={discount}
            onClose={()=>setShowPopup(false)}
            cardRef={cardRef}
          />
        )}
      </>
    );
  };

  /* ─── Hover Popup Component ──────────────────────────────── */
  const ProductPopup = ({ p, images, imgIdx, isWished, onWish, onCart, inCart, discount, onClose, cardRef }) => {
    const [localIdx, setLocalIdx] = useState(imgIdx);
    const [pos, setPos] = useState({ top:0, left:0, side:'right' });
    const popupRef = useRef(null);

    useEffect(() => { setLocalIdx(imgIdx); }, [imgIdx]);

    useEffect(() => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const popW = 320;
      const scrollY = window.scrollY || 0;
      const viewW = window.innerWidth;
      const spaceRight = viewW - rect.right;
      const side = spaceRight >= popW + 16 ? 'right' : 'left';
      setPos({
        top: rect.top + scrollY - 20,
        left: side === 'right' ? rect.right + 12 : rect.left - popW - 12,
        side,
      });
    }, []);

    return (
      <div
        ref={popupRef}
        onMouseLeave={onClose}
        style={{
          position:'absolute',
          top: pos.top,
          left: pos.left,
          zIndex:999,
          width:'310px',
          background:'white',
          borderRadius:'20px',
          boxShadow:'0 30px 80px rgba(0,0,0,0.18)',
          overflow:'hidden',
          animation:'popupIn 0.22s cubic-bezier(0.34,1.56,0.64,1)',
          transformOrigin: pos.side === 'right' ? 'left center' : 'right center',
          pointerEvents:'auto',
        }}
      >
        <div style={{position:'relative', height:'340px', overflow:'hidden', background:'#f5f5f5'}}>
          {images.map((src,idx)=>(
            <img key={idx} src={src} alt="" style={{
              position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',
              opacity: localIdx===idx?1:0, transition:'opacity 0.4s ease',
            }}/>
          ))}
          {images.length > 1 && (
            <div style={{
              position:'absolute', bottom:'10px', left:'50%', transform:'translateX(-50%)',
              display:'flex', gap:'6px', zIndex:4,
            }}>
              {images.map((src,idx)=>(
                <div
                  key={idx}
                  onClick={()=>setLocalIdx(idx)}
                  style={{
                    width:'36px', height:'36px', borderRadius:'8px', overflow:'hidden',
                    border: localIdx===idx ? '2px solid white' : '2px solid rgba(255,255,255,0.4)',
                    cursor:'pointer', flexShrink:0, transition:'border 0.2s',
                    boxShadow:'0 2px 6px rgba(0,0,0,0.25)',
                  }}
                >
                  <img src={src} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                </div>
              ))}
            </div>
          )}
          <button onClick={e=>{e.stopPropagation();onWish();}} style={{
            position:'absolute',top:'12px',right:'12px',
            background: isWished?'#e05a6a':'rgba(255,255,255,0.9)',
            border:'none',borderRadius:'50%',width:'36px',height:'36px',
            display:'flex',alignItems:'center',justifyContent:'center',
            cursor:'pointer',boxShadow:'0 2px 8px rgba(0,0,0,0.15)',
          }}>
            <Heart size={15} fill={isWished?'white':'none'} color={isWished?'white':'#555'}/>
          </button>
          <div style={{position:'absolute',top:'12px',left:'12px',display:'flex',flexDirection:'column',gap:'4px'}}>
            {discount>0&&<span style={{background:'#e05a6a',color:'white',fontSize:'9px',fontWeight:'700',padding:'3px 8px',borderRadius:'20px'}}>-{discount}%</span>}
          </div>
        </div>

        <div style={{padding:'16px 18px 18px'}}>
          {p.subcategory && (
            <span style={{fontSize:'9px',color:'#bbb',letterSpacing:'2px',fontWeight:'600'}}>
              {p.subcategory.toUpperCase()}
            </span>
          )}
          <h3 style={{fontSize:'14px',fontWeight:'600',color:'#111',margin:'4px 0 6px',lineHeight:'1.4'}}>
            {p.name}
          </h3>
          {p.description && (
            <p style={{fontSize:'11px',color:'#999',margin:'0 0 10px',lineHeight:'1.6',
              display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
              {p.description}
            </p>
          )}
          <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'14px'}}>
            {SIZES.map(sz=>(
              <span key={sz} style={{
                fontSize:'10px',fontWeight:'600',padding:'4px 10px',
                border:'1px solid #e8e8e8',borderRadius:'6px',color:'#888',cursor:'pointer',
              }}>{sz}</span>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'10px'}}>
            <div>
              <span style={{fontSize:'17px',fontWeight:'700',color:'#111'}}>
                LKR {fmt(p.price_lkr)}
              </span>
              {discount>0&&(
                <span style={{fontSize:'11px',color:'#ccc',textDecoration:'line-through',marginLeft:'8px'}}>
                  LKR {fmt(p.original_price)}
                </span>
              )}
            </div>
            <button
              onClick={onCart}
              style={{
                padding:'10px 18px',
                background: inCart?'#4caf87':'#111',
                color:'white',border:'none',borderRadius:'10px',
                fontSize:'10px',fontWeight:'700',letterSpacing:'1.5px',
                cursor:'pointer',transition:'background 0.2s',whiteSpace:'nowrap',
                display:'flex',alignItems:'center',gap:'6px',
              }}
            >
              <ShoppingBag size={12}/>
              {inCart?'ADDED ✓':'ADD TO BAG'}
            </button>
          </div>
        </div>
        <style>{`
          @keyframes popupIn {
            from { opacity:0; transform:scale(0.88); }
            to   { opacity:1; transform:scale(1); }
          }
        `}</style>
      </div>
    );
  };

  /* ─── Render ──────────────────────────────────────────────── */
  return (
    <div style={{backgroundColor:'#f7f7f7',minHeight:'100vh',fontFamily:'"Outfit",sans-serif'}}>

      {/* ── Hero ── */}
      <div style={{
        position:'relative', height:'380px', overflow:'hidden',
        width:'100%',
      }}>
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:`url("https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1400&q=80&fit=crop")`,
          backgroundSize:'cover', backgroundPosition:'center 20%',
          filter:'brightness(0.72)',
        }}/>
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)',
        }}/>
        <div style={{
          position:'relative',zIndex:2,height:'100%',
          display:'flex',flexDirection:'column',
          alignItems:'center',justifyContent:'center',
          gap:'10px', textAlign:'center',
        }}>
          <span style={{fontSize:'10px',letterSpacing:'6px',color:'rgba(255,255,255,0.65)',fontWeight:'500'}}>
            BLOOMAIR · HOMEWARE EDIT
          </span>
          <h1 style={{
            color:'white',fontSize:'72px',letterSpacing:'6px',
            fontWeight:'300',margin:'0',
            fontFamily:'"Playfair Display",Georgia,serif',lineHeight:1,
          }}>
            Homeware
          </h1>
          <div style={{display:'flex',gap:'28px',marginTop:'6px'}}>
            {['New Arrivals','Best Sellers','Sale'].map(tag=>(
              <span key={tag} style={{
                fontSize:'11px',color:'rgba(255,255,255,0.8)',letterSpacing:'2.5px',
                cursor:'pointer',borderBottom:'1px solid rgba(255,255,255,0.4)',
                paddingBottom:'3px',transition:'color 0.2s',
              }}>
                {tag.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
        <div style={{
          position:'absolute',top:'24px',right:'32px',zIndex:3,
          background:'rgba(255,255,255,0.12)',backdropFilter:'blur(14px)',
          borderRadius:'12px',padding:'10px 18px',border:'1px solid rgba(255,255,255,0.18)',
          textAlign:'center',
        }}>
          <span style={{color:'white',fontSize:'22px',fontWeight:'700',display:'block',lineHeight:1}}>
            {filteredProducts.length}
          </span>
          <span style={{color:'rgba(255,255,255,0.65)',fontSize:'9px',display:'block',letterSpacing:'2px',marginTop:'4px'}}>
            STYLES
          </span>
        </div>
      </div>

      {/* ── Sticky Toolbar ── */}
      <div style={{
        position:'sticky',top:0,zIndex:50,
        background:'rgba(247,247,247,0.96)',backdropFilter:'blur(12px)',
        borderBottom:'1px solid #ebebeb',
        padding:'14px 40px',
        display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <button
            onClick={()=>setSidebarOpen(p=>!p)}
            style={{
              display:'flex',alignItems:'center',gap:'8px',
              background: sidebarOpen?'#111':'white',
              color: sidebarOpen?'white':'#444',
              border:'1px solid #ddd',padding:'8px 16px',borderRadius:'10px',
              cursor:'pointer',fontSize:'11px',fontWeight:'700',letterSpacing:'1px',
              transition:'all 0.2s', whiteSpace:'nowrap',
            }}
          >
            <SlidersHorizontal size={13}/>
            {sidebarOpen?'HIDE FILTERS':'SHOW FILTERS'}
            {activeFilterCount > 0 && (
              <span style={{
                background: sidebarOpen?'white':'#111',color:sidebarOpen?'#111':'white',
                borderRadius:'50%',width:'16px',height:'16px',fontSize:'9px',
                display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'700',
              }}>
                {activeFilterCount}
              </span>
            )}
          </button>
          <div style={{position:'relative',display:'flex',alignItems:'center'}}>
            <Search size={13} color="#aaa" style={{position:'absolute',left:'12px',pointerEvents:'none'}}/>
            <input
              ref={searchRef}
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="Search styles..."
              style={{
                paddingLeft:'32px',paddingRight:search?'32px':'12px',
                paddingTop:'8px',paddingBottom:'8px',
                border:'1px solid #e0e0e0',borderRadius:'10px',
                fontSize:'12px',color:'#333',background:'white',
                outline:'none',width:'200px',fontFamily:'"Outfit",sans-serif',
              }}
            />
            {search && (
              <button onClick={()=>setSearch('')} style={{position:'absolute',right:'10px',background:'none',border:'none',cursor:'pointer',color:'#aaa'}}>
                <X size={12}/>
              </button>
            )}
          </div>
        </div>

        <span style={{fontSize:'11px',color:'#aaa',letterSpacing:'1px',whiteSpace:'nowrap'}}>
          {loading ? '...' : `${filteredProducts.length} of ${products.length} items`}
        </span>

        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <select
            value={sortBy}
            onChange={e=>setSortBy(e.target.value)}
            style={{
              border:'1px solid #e0e0e0',padding:'8px 14px',borderRadius:'10px',
              fontSize:'11px',letterSpacing:'1px',cursor:'pointer',background:'white',
              color:'#444',fontWeight:'600',fontFamily:'"Outfit",sans-serif',outline:'none',
            }}
          >
            {SORT_OPTIONS.map(o=>(
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <div style={{display:'flex',border:'1px solid #e0e0e0',borderRadius:'10px',overflow:'hidden'}}>
            {[3,2,1].map(n=>(
              <button
                key={n}
                onClick={()=>setGridCols(n)}
                style={{
                  padding:'8px 11px',border:'none',cursor:'pointer',
                  background: gridCols===n?'#111':'white',
                  color: gridCols===n?'white':'#aaa',
                  transition:'all 0.15s', borderRight: n!==1?'1px solid #e0e0e0':'none',
                }}
              >
                {n===3?<Grid3X3 size={13}/>:n===2?<LayoutList size={13}/>:<LayoutList size={13}/>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div style={{padding:'10px 40px',display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'center',background:'#f7f7f7'}}>
          {!selectedCats.includes('All') && selectedCats.map(c=>(
            <FilterChip key={c} label={c} onRemove={()=>toggleCat(c)}/>
          ))}
          {selectedSizes.map(s=>(
            <FilterChip key={s} label={`Size: ${s}`} onRemove={()=>toggleSize(s)}/>
          ))}
          {selectedColors.map(c=>(
            <FilterChip key={c} label={c} onRemove={()=>toggleColor(c)}/>
          ))}
          {search && <FilterChip label={`"${search}"`} onRemove={()=>setSearch('')}/>}
          <button
            onClick={clearAll}
            style={{fontSize:'10px',color:'#e05a6a',background:'none',border:'none',cursor:'pointer',fontWeight:'600',letterSpacing:'1px'}}
          >
            CLEAR ALL
          </button>
        </div>
      )}

      {/* ── Main content ── */}
      <div style={{display:'flex',gap:'0',padding:'0 40px 80px'}}>

        {/* ── Sidebar ── */}
        <div style={{
          width: sidebarOpen ? '270px' : '0',
          minWidth: sidebarOpen ? '270px' : '0',
          overflow:'hidden',
          transition:'all 0.35s cubic-bezier(0.25,0.8,0.25,1)',
          paddingRight: sidebarOpen ? '36px' : '0',
          paddingTop:'28px',
        }}>
          {sidebarOpen && (
            <div>
              {/* Category */}
              <SidebarSection id="category" label="CATEGORY">
                <div style={{position:'relative',marginBottom:'10px'}}>
                  <Search size={11} color="#ccc" style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                  <input
                    value={catSearch}
                    onChange={e=>setCatSearch(e.target.value)}
                    placeholder="Search categories..."
                    style={{
                      width:'100%',boxSizing:'border-box',
                      paddingLeft:'28px',padding:'8px 10px 8px 28px',
                      border:'1px solid #ececec',borderRadius:'8px',
                      fontSize:'11px',color:'#555',background:'#fafafa',
                      outline:'none',fontFamily:'"Outfit",sans-serif',
                    }}
                  />
                </div>
                <div style={{maxHeight:'280px',overflowY:'auto',paddingRight:'4px'}}>
                  {visibleCats.map(c=>{
                    const active = selectedCats.includes(c)||(c==='All'&&selectedCats.includes('All'));
                    return (
                      <div
                        key={c}
                        onClick={()=>toggleCat(c)}
                        style={{
                          display:'flex',alignItems:'center',justifyContent:'space-between',
                          padding:'7px 0',cursor:'pointer',
                          borderRadius:'6px',
                          transition:'color 0.15s',
                        }}
                      >
                        <span style={{
                          fontSize:'12px',
                          color: active?'#111':'#999',
                          fontWeight: active?'600':'400',
                        }}>
                          {c}
                        </span>
                        {active && (
                          <div style={{width:'5px',height:'5px',borderRadius:'50%',background:'#111',flexShrink:0}}/>
                        )}
                      </div>
                    );
                  })}
                </div>
              </SidebarSection>

              {/* Price */}
              <SidebarSection id="price" label="PRICE">
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}>
                  <span style={{fontSize:'11px',color:'#aaa'}}>LKR {fmt(priceRange[0])}</span>
                  <span style={{fontSize:'11px',fontWeight:'700',color:'#111'}}>LKR {fmt(priceRange[1])}</span>
                </div>
                <input
                  type="range" min="0" max="25000" value={priceRange[1]}
                  onChange={e=>setPriceRange([priceRange[0],+e.target.value])}
                  style={{
                    width:'100%',appearance:'none',height:'3px',
                    background:`linear-gradient(to right,#111 ${(priceRange[1]/25000)*100}%,#e0e0e0 ${(priceRange[1]/25000)*100}%)`,
                    outline:'none',border:'none',cursor:'pointer',borderRadius:'2px',
                  }}
                />
                <div style={{display:'flex',gap:'6px',marginTop:'14px',flexWrap:'wrap'}}>
                  {[[0,5000,'Under 5K'],[5000,15000,'5K–15K'],[15000,25000,'15K+']].map(([min,max,lbl])=>(
                    <button
                      key={lbl}
                      onClick={()=>setPriceRange([min,max])}
                      style={{
                        fontSize:'10px',padding:'4px 10px',borderRadius:'20px',cursor:'pointer',
                        border:'1px solid #e0e0e0',background:'white',color:'#666',
                        fontFamily:'"Outfit",sans-serif',fontWeight:'500',letterSpacing:'0.5px',
                        transition:'all 0.15s',
                      }}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </SidebarSection>

              {/* Sizes */}
              <SidebarSection id="sizes" label="SIZE">
                <div style={{display:'flex',flexWrap:'wrap',gap:'7px'}}>
                  {SIZES.map(sz=>{
                    const sel = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        onClick={()=>toggleSize(sz)}
                        style={{
                          minWidth:'40px',height:'40px',padding:'0 8px',
                          border: sel?'2px solid #111':'1.5px solid #e0e0e0',
                          background: sel?'#111':'white',
                          color: sel?'white':'#777',
                          borderRadius:'8px',cursor:'pointer',
                          fontSize:'11px',fontWeight:'700',
                          transition:'all 0.18s',fontFamily:'"Outfit",sans-serif',
                        }}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </SidebarSection>

              {/* Colors */}
              <SidebarSection id="colors" label="COLOR">
                <div style={{display:'flex',flexWrap:'wrap',gap:'10px'}}>
                  {COLORS.map(({name,hex,border})=>{
                    const sel = selectedColors.includes(name);
                    return (
                      <div
                        key={name}
                        onClick={()=>toggleColor(name)}
                        title={name}
                        style={{
                          width:'28px',height:'28px',borderRadius:'50%',background:hex,
                          cursor:'pointer',flexShrink:0,
                          outline: sel?'2.5px solid #111':'2.5px solid transparent',
                          outlineOffset:'2px',
                          border:`1.5px solid ${border||'transparent'}`,
                          boxShadow:'0 1px 4px rgba(0,0,0,0.12)',
                          transition:'outline 0.15s, transform 0.15s',
                          transform: sel?'scale(1.15)':'scale(1)',
                        }}
                      />
                    );
                  })}
                </div>
                {selectedColors.length > 0 && (
                  <div style={{marginTop:'10px',display:'flex',gap:'6px',flexWrap:'wrap'}}>
                    {selectedColors.map(c=>(
                      <span key={c} style={{fontSize:'10px',color:'#888',background:'#f0f0f0',padding:'2px 8px',borderRadius:'20px'}}>
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </SidebarSection>
            </div>
          )}
        </div>

        {/* ── Products ── */}
        <div style={{flexGrow:1,paddingTop:'28px'}}>
          {loading ? (
            <SkeletonGrid cols={gridCols}/>
          ) : filteredProducts.length === 0 ? (
            <EmptyState onClear={clearAll}/>
          ) : (
            <div style={{
              display:'grid',
              gridTemplateColumns:`repeat(${gridCols},1fr)`,
              gap:'22px',
              position:'relative',
            }}>
              {filteredProducts.map(p=><ProductCard key={p.id} p={p}/>)}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500&family=Outfit:wght@300;400;500;600;700&display=swap');
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance:none;width:18px;height:18px;border-radius:50%;
          background:#111;cursor:pointer;border:2.5px solid white;
          box-shadow:0 1px 5px rgba(0,0,0,0.3);
        }
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:#ddd;border-radius:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
      `}</style>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────── */
function FilterChip({ label, onRemove }) {
  return (
    <div style={{
      display:'flex',alignItems:'center',gap:'5px',
      background:'#111',color:'white',
      fontSize:'10px',fontWeight:'600',letterSpacing:'0.5px',
      padding:'4px 10px',borderRadius:'20px',
    }}>
      {label}
      <button onClick={onRemove} style={{background:'none',border:'none',color:'rgba(255,255,255,0.7)',cursor:'pointer',padding:'0',lineHeight:1}}>
        <X size={10}/>
      </button>
    </div>
  );
}

function SkeletonGrid({ cols }) {
  return (
    <div style={{display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gap:'22px'}}>
      {[...Array(cols*2)].map((_,i)=>(
        <div key={i} style={{borderRadius:'16px',overflow:'hidden',background:'white',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
          <div style={{height:'330px',background:'linear-gradient(90deg,#f5f5f5 25%,#ececec 50%,#f5f5f5 75%)',backgroundSize:'200% 100%',animation:'shimmer 1.4s infinite'}}/>
          <div style={{padding:'16px'}}>
            <div style={{height:'10px',background:'#f0f0f0',borderRadius:'4px',marginBottom:'8px',width:'50%'}}/>
            <div style={{height:'13px',background:'#f0f0f0',borderRadius:'4px',marginBottom:'6px',width:'80%'}}/>
            <div style={{height:'13px',background:'#f0f0f0',borderRadius:'4px',width:'40%'}}/>
          </div>
        </div>
      ))}
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div style={{textAlign:'center',padding:'100px 0',display:'flex',flexDirection:'column',alignItems:'center',gap:'16px'}}>
      <div style={{width:'70px',height:'70px',background:'#f5f5f5',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Search size={28} color="#ccc"/>
      </div>
      <p style={{color:'#bbb',fontSize:'13px',letterSpacing:'2px',margin:0}}>NO STYLES FOUND</p>
      <p style={{color:'#ccc',fontSize:'12px',margin:0}}>Try adjusting your filters</p>
      <button
        onClick={onClear}
        style={{
          marginTop:'8px',padding:'11px 28px',
          background:'#111',color:'white',border:'none',borderRadius:'10px',
          cursor:'pointer',fontSize:'11px',letterSpacing:'2px',fontWeight:'600',
          fontFamily:'"Outfit",sans-serif',
        }}
      >
        CLEAR ALL FILTERS
      </button>
    </div>
  );
}
