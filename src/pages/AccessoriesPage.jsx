import { useState, useEffect, useMemo, useRef } from 'react';
import {
  ChevronDown, ChevronUp, ShoppingBag, Heart,
  SlidersHorizontal, X, Search, Grid3X3, LayoutList,
  Star, Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import photo2 from '../assets/photo2.jpeg';

/* ─── Category Tree Structure ──────────────────────────────────── */
const ACCESSORIES_TREE = [
  {
    name: "Women's Accessories",
    gender: "Women",
    children: [
      {
        name: 'Bags',
        children: ['Handbags', 'Tote Bags', 'Crossbody Bags', 'Shoulder Bags', 'Clutches', 'Mini Bags', 'Backpacks']
      },
      {
        name: 'Wallets',
        children: ['Card Holders']
      },
      {
        name: 'Belts',
        children: ['Casual Belts', 'Leather Belts', 'Waist Belts', 'Chain Belts', 'Fashion Belts']
      },
      {
        name: 'Watches',
        children: ['Analog Watches', 'Digital Watches', 'Smart Watches', 'Luxury Watches']
      },
      {
        name: 'Sunglasses & Eyewear',
        children: ['Sunglasses', 'Fashion Glasses', 'Blue-Light Glasses', 'Reading Glasses']
      },
      {
        name: 'Hats & Caps',
        children: ['Baseball Caps', 'Bucket Hats', 'Sun Hats', 'Straw Hats', 'Beanies']
      },
      {
        name: 'Hair Accessories',
        children: ['Hair Clips', 'Hair Bands', 'Headbands', 'Scrunchies', 'Hair Pins', 'Hair Bows']
      },
      {
        name: 'Scarves & Shawls',
        children: ['Scarves', 'Shawls', 'Wraps', 'Stoles']
      },
      {
        name: 'Gloves',
        children: ['Winter Gloves', 'Fashion Gloves', 'Leather Gloves']
      },
      {
        name: 'Jewelry',
        children: ['Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Anklets', 'Pendants', 'Jewelry Sets', 'Brooches']
      }
    ]
  },
  {
    name: "Men's Accessories",
    gender: "Men",
    children: [
      {
        name: 'Bags',
        children: ['Backpacks', 'Messenger Bags', 'Briefcases', 'Duffel Bags', 'Sling Bags']
      },
      {
        name: 'Wallets',
        children: ['Card Holders']
      },
      {
        name: 'Belts',
        children: ['Formal Belts', 'Casual Belts', 'Leather Belts', 'Reversible Belts']
      },
      {
        name: 'Watches',
        children: ['Analog Watches', 'Digital Watches', 'Smart Watches', 'Luxury Watches']
      },
      {
        name: 'Sunglasses & Eyewear',
        children: ['Sunglasses', 'Blue-Light Glasses', 'Reading Glasses']
      },
      {
        name: 'Hats & Caps',
        children: ['Baseball Caps', 'Bucket Hats', 'Beanies', 'Snapback Caps']
      },
      {
        name: 'Ties & Formal Accessories',
        children: ['Ties', 'Bow Ties', 'Pocket Squares', 'Tie Clips', 'Cufflinks']
      },
      {
        name: 'Scarves & Gloves',
        children: ['Scarves', 'Winter Scarves', 'Gloves', 'Leather Gloves']
      },
      {
        name: 'Jewelry',
        children: ['Chains', 'Necklaces', 'Bracelets', 'Rings', 'Pendants', 'Earrings']
      },
      {
        name: 'Small Accessories',
        children: ['Keychains', 'Lapel Pins', 'Money Clips', 'Card Holders']
      }
    ]
  }
];

// Helper to list all possible subcategories for the accessories filter
const ALL_ACCESSORIES_SUBCATS = new Set();
ACCESSORIES_TREE.forEach(genderNode => {
  genderNode.children.forEach(parentNode => {
    ALL_ACCESSORIES_SUBCATS.add(parentNode.name.toLowerCase());
    parentNode.children.forEach(sub => {
      ALL_ACCESSORIES_SUBCATS.add(sub.toLowerCase());
    });
  });
});

const getSubcategoriesForParent = (gender, parentName) => {
  const genderNode = ACCESSORIES_TREE.find(n => n.gender === gender);
  if (!genderNode) return new Set();
  const parentNode = genderNode.children.find(c => c.name === parentName);
  if (!parentNode) return new Set();
  return new Set(parentNode.children.map(s => s.toLowerCase()));
};

const getAllSubcategoriesForGender = (gender) => {
  const genderNode = ACCESSORIES_TREE.find(n => n.gender === gender);
  if (!genderNode) return new Set();
  const set = new Set();
  genderNode.children.forEach(parent => {
    set.add(parent.name.toLowerCase());
    parent.children.forEach(sub => {
      set.add(sub.toLowerCase());
    });
  });
  return set;
};

const isAccessoryProduct = (p) => {
  if (!p.subcategory) return false;
  const sub = p.subcategory.trim().toLowerCase();
  return ALL_ACCESSORIES_SUBCATS.has(sub);
};

/* ─── Constants ───────────────────────────────────────────────── */
const SIZES = ['XS','S','M','L','XL','XXL','3XL'];

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

const fmt = (n) => parseInt(n).toLocaleString('en-LK');

/* ─── Smooth Expand/Collapse Wrapper Component ─────────────────── */
const ExpandableContent = ({ isExpanded, children }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: isExpanded ? '1fr' : '0fr',
        transition: 'grid-template-rows 0.35s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease',
        opacity: isExpanded ? 1 : 0,
      }}
    >
      <div style={{ overflow: 'hidden' }}>{children}</div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
export default function AccessoriesPage() {
  const [products,          setProducts]          = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [selectedCategory,  setSelectedCategory]  = useState({ gender: null, parent: null, sub: null, level: 0 });
  const [priceRange,        setPriceRange]        = useState([0, 10000]);
  const [selectedSizes,     setSelectedSizes]     = useState([]);
  const [selectedColors,    setSelectedColors]    = useState([]);
  const [wishlist,          setWishlist]          = useState([]);
  const [hoveredProduct,    setHoveredProduct]    = useState(null);
  const [sidebarOpen,       setSidebarOpen]       = useState(true);
  const [sortBy,            setSortBy]            = useState('default');
  const [gridCols,          setGridCols]          = useState(3);
  const [search,            setSearch]            = useState('');
  const [catSearch,         setCatSearch]         = useState('');
  const [openSection,       setOpenSection]       = useState({
    category:true, price:true, sizes:true, colors:true,
  });
  const [expandedPaths,     setExpandedPaths]     = useState({ "Women's Accessories": true, "Men's Accessories": true });
  const [addedToCart,       setAddedToCart]       = useState({});
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

  /* derived values */
  const minProductPrice = useMemo(() => Math.min(...products.map(p=>p.price_lkr), 0), [products]);
  const maxProductPrice = useMemo(() => Math.max(...products.map(p=>p.price_lkr), 10000), [products]);

  const filteredProducts = useMemo(() => {
    let r = [...products];

    // Filter to only accessories if any accessories exist in database.
    // Otherwise show all products as a fallback for design testing
    const accessoriesProducts = r.filter(isAccessoryProduct);
    if (accessoriesProducts.length > 0) {
      r = accessoriesProducts;
    }

    // Category filtering
    if (selectedCategory.level === 1) {
      const targetGender = selectedCategory.gender;
      r = r.filter(p => p.gender_category?.trim().toLowerCase() === targetGender.toLowerCase());
      
      const allowedSubcats = getAllSubcategoriesForGender(targetGender);
      r = r.filter(p => p.subcategory && allowedSubcats.has(p.subcategory.trim().toLowerCase()));
    } else if (selectedCategory.level === 2) {
      const targetGender = selectedCategory.gender;
      const targetParent = selectedCategory.parent;
      r = r.filter(p => p.gender_category?.trim().toLowerCase() === targetGender.toLowerCase());
      
      const allowedSubcats = getSubcategoriesForParent(targetGender, targetParent);
      r = r.filter(p => p.subcategory && (allowedSubcats.has(p.subcategory.trim().toLowerCase()) || p.subcategory.trim().toLowerCase() === targetParent.toLowerCase()));
    } else if (selectedCategory.level === 3) {
      const targetGender = selectedCategory.gender;
      const targetSub = selectedCategory.sub;
      r = r.filter(p => p.gender_category?.trim().toLowerCase() === targetGender.toLowerCase() && p.subcategory?.trim().toLowerCase() === targetSub.toLowerCase());
    }

    // Price filtering
    r = r.filter(p => p.price_lkr >= priceRange[0] && p.price_lkr <= priceRange[1]);

    // Search filtering
    if (search.trim())
      r = r.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

    // Sorting
    if (sortBy === 'price-asc')  r.sort((a,b) => a.price_lkr - b.price_lkr);
    if (sortBy === 'price-desc') r.sort((a,b) => b.price_lkr - a.price_lkr);
    if (sortBy === 'newest')     r.sort((a,b) => new Date(b.created_at)-new Date(a.created_at));

    return r;
  }, [products, selectedCategory, priceRange, search, sortBy]);

  /* filter helpers */
  const toggleSize  = s => setSelectedSizes(p => p.includes(s)?p.filter(x=>x!==s):[...p,s]);
  const toggleColor = c => setSelectedColors(p => p.includes(c)?p.filter(x=>x!==c):[...p,c]);
  const toggleWish  = id=> setWishlist(p => p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const toggleSection = k => setOpenSection(p=>({...p,[k]:!p[k]}));

  const selectCategory = (gender, parent, sub, level) => {
    const isSelected = 
      (level === 1 && selectedCategory.level === 1 && selectedCategory.gender === gender) ||
      (level === 2 && selectedCategory.level === 2 && selectedCategory.gender === gender && selectedCategory.parent === parent) ||
      (level === 3 && selectedCategory.level === 3 && selectedCategory.gender === gender && selectedCategory.parent === parent && selectedCategory.sub === sub);
    
    if (isSelected) {
      setSelectedCategory({ gender: null, parent: null, sub: null, level: 0 });
    } else {
      setSelectedCategory({ gender, parent, sub, level });
    }
  };

  const clearAll = () => {
    setSelectedCategory({ gender: null, parent: null, sub: null, level: 0 });
    setPriceRange([0,10000]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSearch('');
  };

  const activeFilterCount = [
    selectedCategory.level > 0,
    priceRange[0]>0 || priceRange[1]<maxProductPrice,
    selectedSizes.length>0,
    selectedColors.length>0,
    search.trim().length>0,
  ].filter(Boolean).length;

  const handleAddToCart = (id, e) => {
    e.stopPropagation();
    setAddedToCart(p => ({...p,[id]:true}));
    setTimeout(() => setAddedToCart(p => ({...p,[id]:false})), 1800);
  };

  const toggleExpand = (path, e) => {
    e.stopPropagation();
    setExpandedPaths(prev => ({ ...prev, [path]: !prev[path] }));
  };

  /* recursive tree search filtering */
  const filteredTree = useMemo(() => {
    if (!catSearch.trim()) return ACCESSORIES_TREE;
    const query = catSearch.toLowerCase().trim();

    return ACCESSORIES_TREE.map(genderNode => {
      const genderMatches = genderNode.name.toLowerCase().includes(query);

      const filteredChildren = genderNode.children.map(parentNode => {
        const parentMatches = parentNode.name.toLowerCase().includes(query);
        const filteredSubs = parentNode.children.filter(sub => 
          sub.toLowerCase().includes(query)
        );

        if (parentMatches || filteredSubs.length > 0 || genderMatches) {
          return {
            ...parentNode,
            children: (parentMatches || genderMatches) ? parentNode.children : filteredSubs
          };
        }
        return null;
      }).filter(Boolean);

      if (genderMatches || filteredChildren.length > 0) {
        return {
          ...genderNode,
          children: genderMatches ? genderNode.children : filteredChildren
        };
      }
      return null;
    }).filter(Boolean);
  }, [catSearch]);

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

    // Auto-cycle on hover
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

    // Popup state
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
            {gridCols === 1 && (
              <div style={{display:'flex',gap:'5px',marginTop:'10px',flexWrap:'wrap'}}>
                {SIZES.slice(0,5).map(sz=>(
                  <span key={sz} style={{fontSize:'9px',fontWeight:'600',padding:'3px 7px',border:'1px solid #e8e8e8',borderRadius:'4px',color:'#888'}}>
                    {sz}
                  </span>
                ))}
              </div>
            )}
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

  /* ─── Tree Node Renderer ────────────────────────────────────────── */
  const renderCategoryNode = (node, level = 1, parentName = null) => {
    const isGender = level === 1;
    const isParent = level === 2;
    const key = isGender
      ? node.name
      : isParent
        ? `${parentName} -> ${node.name}`
        : `${parentName} -> ${node}`;

    const label = isGender || isParent ? node.name : node;

    // Check active selection
    const isActive =
      (isGender && selectedCategory.level === 1 && selectedCategory.gender === node.gender) ||
      (isParent && selectedCategory.level === 2 && selectedCategory.gender === parentName && selectedCategory.parent === node.name) ||
      (!isGender && !isParent && selectedCategory.level === 3 && selectedCategory.gender === parentName.split(' -> ')[0] && selectedCategory.parent === parentName.split(' -> ')[1] && selectedCategory.sub === node);

    const isExpanded = !!expandedPaths[key];
    const hasChildren = (isGender || isParent) && node.children && node.children.length > 0;
    const indent = isGender ? 0 : isParent ? 12 : 24;

    const onSelect = (e) => {
      e.stopPropagation();
      if (isGender) {
        selectCategory(node.gender, null, null, 1);
      } else if (isParent) {
        selectCategory(parentName, node.name, null, 2);
      } else {
        const parts = parentName.split(' -> ');
        selectCategory(parts[0], parts[1], node, 3);
      }
    };

    return (
      <div key={key} style={{ paddingLeft: `${indent}px` }}>
        <div
          style={{
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between',
            padding:'7px 0',
            cursor:'pointer',
            borderRadius:'6px',
            transition:'color 0.15s',
          }}
          onClick={onSelect}
        >
          <span
            style={{
              fontSize: isGender ? '12px' : '11px',
              color: isActive ? '#111' : isGender ? '#444' : '#888',
              fontWeight: isActive ? '600' : isGender ? '600' : '400',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              letterSpacing: isGender ? '1px' : '0.5px',
              textTransform: isGender ? 'uppercase' : 'none',
            }}
          >
            {isActive && (
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#111', flexShrink: 0 }} />
            )}
            {label}
          </span>
          {hasChildren && (
            <button
              onClick={(e) => toggleExpand(key, e)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                color: '#bbb',
                transition: 'transform 0.25s ease',
                transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
              }}
            >
              <ChevronDown size={12} />
            </button>
          )}
        </div>

        {hasChildren && (
          <ExpandableContent isExpanded={isExpanded}>
            <div style={{ paddingBottom: '4px' }}>
              {node.children.map(child =>
                renderCategoryNode(child, level + 1, isGender ? node.gender : `${parentName} -> ${node.name}`)
              )}
            </div>
          </ExpandableContent>
        )}
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
          backgroundImage:`url(${photo2})`,
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
            BLOOMAIR · ACCESSORIES EDIT
          </span>
          <h1 style={{
            color:'white',fontSize:'72px',letterSpacing:'6px',
            fontWeight:'300',margin:'0',
            fontFamily:'"Playfair Display",Georgia,serif',lineHeight:1,
          }}>
            Accessories
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

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div style={{padding:'10px 40px',display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'center',background:'#f7f7f7'}}>
          {selectedCategory.level > 0 && (
            <FilterChip 
              label={
                selectedCategory.level === 1 
                  ? selectedCategory.gender 
                  : selectedCategory.level === 2
                    ? `${selectedCategory.gender}: ${selectedCategory.parent}`
                    : `${selectedCategory.gender}: ${selectedCategory.sub}`
              } 
              onRemove={() => setSelectedCategory({ gender: null, parent: null, sub: null, level: 0 })}
            />
          )}
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
                {/* Category search */}
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
                
                {/* All Accessories button */}
                <div
                  onClick={() => setSelectedCategory({ gender: null, parent: null, sub: null, level: 0 })}
                  style={{
                    display:'flex',alignItems:'center',justifyContent:'space-between',
                    padding:'7px 0',cursor:'pointer',
                    borderRadius:'6px',
                    transition:'color 0.15s',
                  }}
                >
                  <span style={{
                    fontSize:'12px',
                    color: selectedCategory.level === 0 ? '#111' : '#888',
                    fontWeight: selectedCategory.level === 0 ? '600' : '600',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                  }}>
                    All Accessories
                  </span>
                  {selectedCategory.level === 0 && (
                    <div style={{width:'5px',height:'5px',borderRadius:'50%',background:'#111',flexShrink:0}}/>
                  )}
                </div>

                <div style={{maxHeight:'320px',overflowY:'auto',paddingRight:'4px', marginTop:'4px'}}>
                  {filteredTree.map(genderNode => renderCategoryNode(genderNode, 1))}
                </div>
              </SidebarSection>

              {/* Price */}
              <SidebarSection id="price" label="PRICE">
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}>
                  <span style={{fontSize:'11px',color:'#aaa'}}>LKR {fmt(priceRange[0])}</span>
                  <span style={{fontSize:'11px',fontWeight:'700',color:'#111'}}>LKR {fmt(priceRange[1])}</span>
                </div>
                <input
                  type="range" min="0" max="10000" value={priceRange[1]}
                  onChange={e=>setPriceRange([priceRange[0],+e.target.value])}
                  style={{
                    width:'100%',appearance:'none',height:'3px',
                    background:`linear-gradient(to right,#111 ${priceRange[1]/100}%,#e0e0e0 ${priceRange[1]/100}%)`,
                    outline:'none',border:'none',cursor:'pointer',borderRadius:'2px',
                  }}
                />
                <div style={{display:'flex',gap:'6px',marginTop:'14px',flexWrap:'wrap'}}>
                  {[[0,2000,'Under 2K'],[2000,5000,'2K–5K'],[5000,10000,'5K+']].map(([min,max,lbl])=>(
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
