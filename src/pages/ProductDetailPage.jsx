import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import VirtualTryOn from '../components/VirtualTryOn';
import {
  ShoppingBag,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
  Star,
  Check,
  Truck,
  RefreshCw,
  Shield,
  Copy,
  Sparkles,
  MapPin,
  Ruler,
  Package,
  Layers,
  Sparkle
} from 'lucide-react';

import {
  FaFacebook,
  FaInstagram,
  FaXTwitter
} from 'react-icons/fa6';

const fmt = n => parseInt(n || 0).toLocaleString('en-LK');

/* Color Map for Dynamic Swatch Resolution */
const COLOR_HEX_MAP = {
  black: '#1a1a1a', white: '#f8f8f8', nude: '#c9a88a', pink: '#f4a7b9',
  red: '#e05a6a', blue: '#5b8ed6', navy: '#1e3a5f', green: '#6aab7e',
  yellow: '#f5c842', purple: '#9b72cf', orange: '#f08040', brown: '#8b5e3c',
  grey: '#aaaaaa', cream: '#f8f0e0', maroon: '#800000', gold: '#C9A96E',
  silver: '#c0c0c0', teal: '#008080', emerald: '#50c878', magenta: '#ff00ff'
};

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

const TABS = [
  { id:'desc',     label:'Description' },
  { id:'details',  label:'Details' },
  { id:'care',     label:'Care' },
  { id:'delivery', label:'Delivery & Returns' },
];

const SRI_LANKA_DISTRICTS = [
  { name: 'Colombo', deliveryDays: 'Same-Day / Next-Day', fee: 0 },
  { name: 'Gampaha', deliveryDays: '1-2 Days', fee: 250 },
  { name: 'Kalutara', deliveryDays: '1-2 Days', fee: 250 },
  { name: 'Kandy', deliveryDays: '2-3 Days', fee: 350 },
  { name: 'Galle', deliveryDays: '2-3 Days', fee: 350 },
  { name: 'Matara', deliveryDays: '2-3 Days', fee: 350 },
  { name: 'Kurunegala', deliveryDays: '2-3 Days', fee: 300 },
  { name: 'Jaffna', deliveryDays: '3-4 Days', fee: 450 },
  { name: 'Trincomalee', deliveryDays: '3-4 Days', fee: 400 },
  { name: 'Batticaloa', deliveryDays: '3-4 Days', fee: 400 },
  { name: 'Anuradhapura', deliveryDays: '2-3 Days', fee: 350 },
];

const DEFAULT_MOCK_REVIEWS = [
  { name:'Dilini P.',  rating:5, date:'2 days ago',   text:'Absolutely love this! The fabric is so soft and the fit is perfect. Got so many compliments when I wore it!', verified:true,  helpful:24 },
  { name:'Sachini M.', rating:4, date:'1 week ago',   text:'Beautiful dress, exactly as shown in photos. Shipping was fast too. Slightly bigger than expected but still great quality.', verified:true,  helpful:18 },
  { name:'Amaya K.',   rating:5, date:'2 weeks ago',  text:'Best purchase I\'ve made in a while. The quality is amazing for the price. Will definitely order again!', verified:false, helpful:12 },
  { name:'Tharushi R.',rating:3, date:'3 weeks ago',  text:'Decent quality but the colour was slightly different from what I saw on screen. Customer service was helpful though.', verified:true,  helpful:7  },
  { name:'Nadeesha W.',rating:5, date:'1 month ago',  text:'Perfect fit, beautiful material. Wore it to an office event and everyone loved it. Fast delivery too!', verified:true,  helpful:31 },
];

/* ══════════════════════════════════════════════════════════════ */
export default function ProductDetailPage({
  product: initialProduct,
  allProducts: initialAllProducts,
  onBack: initialOnBack,
  wishlist: initialWishlist,
  onWish,
  onAddToCart,
  addedToCart: initialAddedToCart
}) {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user, profile, updateProfile } = useAuth();

  const [loadingProduct, setLoadingProduct] = useState(false);
  const [localProduct, setLocalProduct] = useState(null);
  const [localAllProducts, setLocalAllProducts] = useState([]);
  const [localWishlist, setLocalWishlist] = useState([]);
  const [localAddedToCart, setLocalAddedToCart] = useState({});
  const [dbReviews, setDbReviews] = useState([]);

  const isRouteMode = !initialProduct;

  /* Fetch Product Data when accessing via Direct Route /product/:id */
  useEffect(() => {
    if (isRouteMode && routeId) {
      const loadProductFromRoute = async () => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(routeId)) {
          console.warn('Invalid product ID format (must be UUID). Redirecting...');
          navigate('/');
          return;
        }

        setLoadingProduct(true);
        try {
          const { data, error } = await supabase.from('products').select('*').eq('id', routeId).single();
          if (error || !data) {
            console.error('Product not found!', error);
            navigate('/');
            return;
          }
          setLocalProduct(data);

          // Fetch related catalog items
          const { data: relatedData } = await supabase.from('products').select('*').limit(12);
          if (relatedData) {
            setLocalAllProducts(relatedData);
          }

          // Fetch real reviews from DB if table exists
          const { data: revData } = await supabase.from('reviews').select('*').eq('product_id', routeId);
          if (revData && revData.length > 0) {
            setDbReviews(revData);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingProduct(false);
        }
      };
      loadProductFromRoute();
    }
  }, [routeId, isRouteMode, navigate]);

  useEffect(() => {
    if (isRouteMode && profile?.wishlist) {
      setLocalWishlist(profile.wishlist);
    }
  }, [profile, isRouteMode]);

  /* Resolved Product & Catalog */
  const p = (isRouteMode ? localProduct : initialProduct) || {};
  const allProducts = isRouteMode ? localAllProducts : (initialAllProducts || []);
  const wishlist = isRouteMode ? localWishlist : (initialWishlist || []);
  const addedToCart = isRouteMode ? localAddedToCart : (initialAddedToCart || {});
  const onBack = initialOnBack || (() => navigate(-1));

  /* Dynamic Properties Resolution */
  const images = useMemo(() => {
    if (p.images_array && p.images_array.length > 0) return p.images_array;
    if (p.image) return [p.image];
    return [`https://via.placeholder.com/600x700/111111/C9A96E?text=${encodeURIComponent(p.name||'Luxury Item')}`];
  }, [p]);

  const availableSizes = useMemo(() => {
    if (Array.isArray(p.sizes) && p.sizes.length > 0) return p.sizes;
    if (typeof p.sizes === 'string' && p.sizes.trim()) {
      return p.sizes.split(',').map(s => s.trim().toUpperCase());
    }
    return DEFAULT_SIZES;
  }, [p.sizes]);

  const availableColors = useMemo(() => {
    if (Array.isArray(p.colors) && p.colors.length > 0) {
      return p.colors.map(c => typeof c === 'string' ? { name: c, hex: COLOR_HEX_MAP[c.toLowerCase()] || '#C9A96E' } : c);
    }
    if (typeof p.colors === 'string' && p.colors.trim()) {
      return p.colors.split(',').map(c => {
        const name = c.trim();
        return { name, hex: COLOR_HEX_MAP[name.toLowerCase()] || '#C9A96E' };
      });
    }
    return [
      { name: 'Black', hex: '#1a1a1a', border: '#444' },
      { name: 'White', hex: '#f0f0f0', border: '#888' },
      { name: 'Champagne Gold', hex: '#C9A96E' },
      { name: 'Royal Crimson', hex: '#800000' },
    ];
  }, [p.colors]);

  const stockQuantity = useMemo(() => {
    if (typeof p.stock_quantity === 'number') return p.stock_quantity;
    if (typeof p.stock === 'number') return p.stock;
    const seed = String(p.id || '101').charCodeAt(0);
    return (seed % 14) + 3;
  }, [p.stock_quantity, p.stock, p.id]);

  const productSku = useMemo(() => {
    if (p.sku) return p.sku;
    return `BLM-${(p.category || 'LUX').substring(0,3).toUpperCase()}-${String(p.id||'001').substring(0,6).toUpperCase()}`;
  }, [p.sku, p.category, p.id]);

  const materialText = p.material || p.fabric || 'Pure Silk & Woven Metallic Zari';
  const fitText = p.fit || 'Tailored Graceful Silhouette';
  const originText = p.origin || 'Sri Lanka (Handcrafted Ceylon Artisan Weave)';
  const careText = p.care_instructions || p.care || 'Dry clean recommended for long-lasting sheen.';

  /* Reviews List */
  const combinedReviews = dbReviews.length > 0 ? dbReviews : DEFAULT_MOCK_REVIEWS;
  const avgRating = (combinedReviews.reduce((s,r)=>s+(r.rating||5),0)/combinedReviews.length).toFixed(1);

  /* State */
  const [activeImg,      setActiveImg]      = useState(0);
  const [selectedSize,   setSelectedSize]   = useState(null);
  const [selectedColor,  setSelectedColor]  = useState(null);
  const [qty,            setQty]            = useState(1);
  const [tab,            setTab]            = useState('desc');
  const [lightbox,       setLightbox]       = useState(false);
  const [showReviews,    setShowReviews]    = useState(false);
  const [reviewSort,     setReviewSort]     = useState('recent');
  const [helpfulVotes,   setHelpfulVotes]   = useState({});
  const [writeReview,    setWriteReview]    = useState(false);
  const [myRating,       setMyRating]       = useState(0);
  const [myRatingHover,  setMyRatingHover]  = useState(0);
  const [myReviewText,   setMyReviewText]   = useState('');
  const [reviewSubmitted,setReviewSubmitted]= useState(false);
  const [notifyEmail,    setNotifyEmail]    = useState('');
  const [notifySent,     setNotifySent]     = useState(false);
  const [shareOpen,      setShareOpen]      = useState(false);
  const [copyDone,       setCopyDone]       = useState(false);
  const [sizeGuideOpen,  setSizeGuideOpen]  = useState(false);
  const [tryOnOpen,      setTryOnOpen]      = useState(false);
  const [sizeQuizOpen,   setSizeQuizOpen]   = useState(false);
  const [spinMode,       setSpinMode]       = useState(false);
  const [spinAngle,      setSpinAngle]      = useState(0);
  const [autoSpin,       setAutoSpin]       = useState(false);
  const [isDragging,     setIsDragging]     = useState(false);
  const [dragStart,      setDragStart]      = useState(0);
  const [dragAngle,      setDragAngle]      = useState(0);
  const [zoomPos,        setZoomPos]        = useState(null);
  const [showZoom,       setShowZoom]       = useState(false);
  const [hoveredRelated, setHoveredRelated] = useState(null);
  const [toastMsg,       setToastMsg]       = useState('');
  const [scrolledPastMain, setScrolledPastMain] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(SRI_LANKA_DISTRICTS[0]);

  // Stylist Outfit Bundle Pair
  const bundlePair = useMemo(() => {
    if (!allProducts || allProducts.length < 2) return null;
    return allProducts.find(r => r.id !== p.id && r.category !== p.category) || allProducts.find(r => r.id !== p.id);
  }, [allProducts, p.id, p.category]);

  const [bundleAdded, setBundleAdded] = useState(false);

  const mainContainerRef = useRef(null);
  const imgRef           = useRef(null);
  const autoSpinRef      = useRef(null);
  const shareRef         = useRef(null);

  /* Computed Financials */
  const isWished  = p.id ? wishlist.includes(p.id) : false;
  const inCart    = p.id ? addedToCart[p.id] : false;
  const discount  = p.original_price && p.original_price > p.price_lkr
    ? Math.round((1 - p.price_lkr / p.original_price) * 100) : 0;
  const savings   = discount > 0 ? (p.original_price - p.price_lkr) * qty : 0;
  const totalPrice = p.price_lkr * qty;
  const freeShippingThreshold = 5000;
  const freeShippingNeeded = Math.max(0, freeShippingThreshold - totalPrice);
  const freeShippingProgress = Math.min(100, Math.round((totalPrice / freeShippingThreshold) * 100));

  const related = p.id ? allProducts.filter(r => r.id !== p.id && (r.category === p.category || r.gender_category === p.gender_category)).slice(0,4) : [];

  const ratingCounts = [5,4,3,2,1].map(star => ({
    star, count: combinedReviews.filter(r=>(r.rating||5)===star).length,
  }));

  const sortedReviews = [...combinedReviews].sort((a,b) =>
    reviewSort === 'helpful' ? (b.helpful||0) - (a.helpful||0) :
    reviewSort === 'highest' ? (b.rating||5) - (a.rating||5) :
    reviewSort === 'lowest'  ? (a.rating||5) - (b.rating||5) : 0
  );

  const spinImgIdx = spinMode
    ? Math.floor((spinAngle / 360) * images.length) % images.length
    : activeImg;

  /* Effects */
  useEffect(() => { window.scrollTo(0,0); }, [p.id]);

  /* Scroll Listener for Sticky Bottom Bar */
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 550) {
        setScrolledPastMain(true);
      } else {
        setScrolledPastMain(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (autoSpin && spinMode) {
      autoSpinRef.current = setInterval(() => setSpinAngle(a=>(a+2)%360), 30);
    } else {
      clearInterval(autoSpinRef.current);
    }
    return () => clearInterval(autoSpinRef.current);
  }, [autoSpin, spinMode]);

  useEffect(() => {
    const handler = e => {
      if (e.key==='ArrowRight') setActiveImg(i=>(i+1)%images.length);
      if (e.key==='ArrowLeft')  setActiveImg(i=>(i-1+images.length)%images.length);
      if (e.key==='Escape') {
        if (lightbox) setLightbox(false);
        else if (sizeGuideOpen) setSizeGuideOpen(false);
        else if (tryOnOpen) setTryOnOpen(false);
        else if (sizeQuizOpen) setSizeQuizOpen(false);
        else if (shareOpen) setShareOpen(false);
        else onBack();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [images.length, lightbox, sizeGuideOpen, tryOnOpen, sizeQuizOpen, shareOpen]);

  useEffect(() => {
    const handler = e => {
      if (shareRef.current && !shareRef.current.contains(e.target)) setShareOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Handlers */
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleColorSelect = (colorObj, idx) => {
    setSelectedColor(colorObj.name);
    if (images.length > 1) {
      setActiveImg(idx % images.length);
    }
  };

  const handleSpinMouseDown = e => {
    if (!spinMode) return;
    setIsDragging(true); setAutoSpin(false);
    setDragStart(e.clientX); setDragAngle(spinAngle);
  };
  const handleSpinMouseMove = e => {
    if (!isDragging||!spinMode) return;
    const delta = e.clientX - dragStart;
    setSpinAngle(((dragAngle+delta*0.8)%360+360)%360);
  };
  const handleSpinMouseUp = () => setIsDragging(false);

  const handleMouseMove = e => {
    if (!imgRef.current||spinMode) return;
    const rect = imgRef.current.getBoundingClientRect();
    setZoomPos({
      x:((e.clientX-rect.left)/rect.width)*100,
      y:((e.clientY-rect.top)/rect.height)*100,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(()=>{
      setCopyDone(true);
      setTimeout(()=>setCopyDone(false),2000);
    });
  };

  const handleHelpful = (idx) => {
    if (helpfulVotes[idx]) return;
    setHelpfulVotes(v=>({...v,[idx]:true}));
    showToast('Thanks for your feedback!');
  };

  const handleAddToCartWithValidation = (e) => {
    if (!selectedSize) { showToast('⚠ Please select a size first!'); return; }
    if (onAddToCart) {
      onAddToCart(p.id, e, selectedSize, selectedColor || 'Default', qty);
    } else {
      addItem({
        id: p.id,
        product_id: p.id,
        name: p.name,
        price: p.price_lkr,
        price_lkr: p.price_lkr,
        image: images[0],
        size: selectedSize,
        color: selectedColor || 'Default',
        quantity: qty
      });
      setLocalAddedToCart(prev => ({...prev, [p.id]: true}));
      setTimeout(() => setLocalAddedToCart(prev => ({...prev, [p.id]: false})), 1800);
    }
    showToast('✓ Added to bag!');
  };

  const handleAddBundleToBag = () => {
    if (!bundlePair) return;
    handleAddToCartWithValidation();
    addItem({
      id: bundlePair.id,
      product_id: bundlePair.id,
      name: bundlePair.name,
      price: bundlePair.price_lkr,
      price_lkr: bundlePair.price_lkr,
      image: bundlePair.images_array?.[0] || bundlePair.image || '',
      size: availableSizes[0] || 'M',
      color: 'Default',
      quantity: 1
    });
    setBundleAdded(true);
    showToast('✨ Outfit Bundle Added to Bag!');
    setTimeout(() => setBundleAdded(false), 2500);
  };

  const handleWish = async () => {
    if (onWish) {
      onWish(p.id);
      showToast(isWished ? 'Removed from wishlist' : '♥ Added to wishlist!');
    } else {
      if (!user) {
        showToast('⚠ Please sign in to wishlist items');
        return;
      }
      const prev = profile?.wishlist || [];
      const next = isWished ? prev.filter(id => id !== p.id) : [...prev, p.id];
      setLocalWishlist(next);
      try {
        await updateProfile({ wishlist: next });
        showToast(isWished ? 'Removed from wishlist' : '♥ Added to wishlist!');
      } catch (err) {
        console.error(err);
        setLocalWishlist(prev);
      }
    }
  };

  const handleRelatedClick = (relProd) => {
    if (isRouteMode) {
      navigate(`/product/${relProd.id}`);
    } else if (initialProduct) {
      navigate(`/product/${relProd.id}`);
    }
  };

  const TAB_CONTENT = {
    desc:     p.description || `A signature masterpiece from Bloomair's Ceylon Collection. Designed with graceful proportions, opulent handwork, and rich texture — tailored for modern elegance from daytime galas to evening celebrations.`,
    details:  `• Material: ${materialText}\n• Fit Silhouette: ${fitText}\n• Artisan Heritage: ${originText}\n• SKU: ${productSku}\n• Fabric Care: ${careText}`,
    care:     `• ${careText}\n• Wash with similar luxury tones\n• Cool iron on reverse side\n• Keep away from harsh bleaching agents`,
    delivery: `• FREE Express Islandwide Shipping on orders LKR 5,000+\n• Colombo & Western Province: Delivered in ${SRI_LANKA_DISTRICTS[0].deliveryDays}\n• Outstation Districts: Delivered in 2–4 business days\n• 14-Day Returns & Exchanges with complimentary courier pickup`,
  };

  /* ── Find My Size AI Modal ── */
  const FindMySizeModal = () => {
    const [quizHeight, setQuizHeight] = useState(165);
    const [quizWeight, setQuizWeight] = useState(60);
    const [quizFit, setQuizFit]       = useState('standard');
    const [recommended, setRecommended] = useState(null);

    const calculateFit = () => {
      let sz = 'M';
      if (quizWeight < 52) sz = 'XS';
      else if (quizWeight < 58) sz = 'S';
      else if (quizWeight < 67) sz = 'M';
      else if (quizWeight < 75) sz = 'L';
      else if (quizWeight < 85) sz = 'XL';
      else sz = 'XXL';

      setRecommended(sz);
      setSelectedSize(sz);
      showToast(`✨ Recommended Size ${sz} pre-selected!`);
    };

    return (
      <div
        onClick={()=>setSizeQuizOpen(false)}
        style={{
          position:'fixed',inset:0,background:'rgba(0,0,0,0.88)',zIndex:99999,
          display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(12px)',
          padding:'20px',
        }}
      >
        <div
          onClick={e=>e.stopPropagation()}
          style={{
            background:'#121212',borderRadius:'24px',padding:'32px',
            maxWidth:'500px',width:'100%',
            boxShadow:'0 30px 90px rgba(0,0,0,0.9), 0 0 0 1px rgba(201,169,110,0.3)',
            border:'1px solid rgba(201,169,110,0.35)',color:'#fff',
          }}
        >
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <Ruler size={20} color="#C9A96E" />
              <h3 style={{margin:0,fontSize:'18px',fontWeight:'400',color:'#fff',fontFamily:'"Tenor Sans",serif'}}>
                AI Size Matcher
              </h3>
            </div>
            <button onClick={()=>setSizeQuizOpen(false)} style={{background:'rgba(255,255,255,0.06)',border:'none',borderRadius:'50%',width:'34px',height:'34px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#aaa'}}>
              <X size={18}/>
            </button>
          </div>

          <p style={{fontSize:'12px',color:'rgba(255,255,255,0.6)',marginBottom:'20px',lineHeight:'1.6'}}>
            Answer 3 quick details for our neural fitting engine to recommend your exact size.
          </p>

          {/* Height Slider */}
          <div style={{marginBottom:'18px'}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',marginBottom:'6px',color:'#C9A96E',fontWeight:'700'}}>
              <span>HEIGHT</span>
              <span>{quizHeight} cm</span>
            </div>
            <input
              type="range" min="145" max="195" value={quizHeight}
              onChange={e=>setQuizHeight(Number(e.target.value))}
              style={{width:'100%',accentColor:'#C9A96E',cursor:'pointer'}}
            />
          </div>

          {/* Weight Slider */}
          <div style={{marginBottom:'20px'}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',marginBottom:'6px',color:'#C9A96E',fontWeight:'700'}}>
              <span>WEIGHT</span>
              <span>{quizWeight} kg</span>
            </div>
            <input
              type="range" min="40" max="110" value={quizWeight}
              onChange={e=>setQuizWeight(Number(e.target.value))}
              style={{width:'100%',accentColor:'#C9A96E',cursor:'pointer'}}
            />
          </div>

          {/* Preferred Fit */}
          <div style={{marginBottom:'24px'}}>
            <span style={{display:'block',fontSize:'10px',fontWeight:'900',letterSpacing:'1.5px',color:'#C9A96E',marginBottom:'10px'}}>PREFERRED SILHOUETTE</span>
            <div style={{display:'flex',gap:'10px'}}>
              {['fitted','standard','relaxed'].map(ft=>(
                <button
                  key={ft}
                  onClick={()=>setQuizFit(ft)}
                  style={{
                    flex:1,padding:'10px',borderRadius:'10px',
                    border: quizFit===ft ? '1px solid #C9A96E' : '1px solid rgba(255,255,255,0.1)',
                    background: quizFit===ft ? 'rgba(201,169,110,0.15)' : 'transparent',
                    color: quizFit===ft ? '#C9A96E' : 'rgba(255,255,255,0.6)',
                    fontSize:'11px',fontWeight:'700',textTransform:'uppercase',cursor:'pointer',
                    fontFamily:'"Outfit",sans-serif',
                  }}
                >{ft}</button>
              ))}
            </div>
          </div>

          {recommended && (
            <div style={{
              background:'rgba(201,169,110,0.15)',border:'1px solid #C9A96E',borderRadius:'14px',
              padding:'16px',textAlign:'center',marginBottom:'16px',
            }}>
              <span style={{fontSize:'10px',fontWeight:'900',color:'#C9A96E',letterSpacing:'2px'}}>RECOMMENDED SIZE</span>
              <div style={{fontSize:'28px',fontWeight:'900',color:'#fff',margin:'4px 0'}}>{recommended}</div>
              <span style={{fontSize:'11px',color:'rgba(255,255,255,0.7)'}}>98% Match Confidence • Size {recommended} pre-selected</span>
            </div>
          )}

          <button
            onClick={calculateFit}
            style={{
              width:'100%',padding:'14px',background:'#C9A96E',color:'#000',
              border:'none',borderRadius:'12px',fontSize:'11px',fontWeight:'900',
              letterSpacing:'2px',cursor:'pointer',fontFamily:'"Outfit",sans-serif',
            }}
          >
            {recommended ? 'RE-CALCULATE FIT' : 'FIND MY SIZE'}
          </button>
        </div>
      </div>
    );
  };

  /* ── Size Guide Modal ── */
  const SizeGuideModal = () => (
    <div
      onClick={()=>setSizeGuideOpen(false)}
      style={{
        position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:9999,
        display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(10px)',
      }}
    >
      <div
        onClick={e=>e.stopPropagation()}
        style={{
          background:'#121212',borderRadius:'24px',padding:'36px',
          maxWidth:'620px',width:'90%',maxHeight:'85vh',overflowY:'auto',
          boxShadow:'0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,169,110,0.25)',
          border:'1px solid rgba(201,169,110,0.3)',color:'#fff',
        }}
      >
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
          <div>
            <span style={{fontSize:'9px',fontWeight:'900',letterSpacing:'3px',color:'#C9A96E',textTransform:'uppercase'}}>SIZING GUIDE</span>
            <h2 style={{margin:'4px 0 0',fontSize:'22px',fontWeight:'400',color:'#fff',fontFamily:'"Tenor Sans","Playfair Display",serif'}}>
              Find Your Perfect Fit
            </h2>
          </div>
          <button onClick={()=>setSizeGuideOpen(false)} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'50%',width:'36px',height:'36px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#aaa'}}>
            <X size={18}/>
          </button>
        </div>
        <p style={{fontSize:'12px',color:'rgba(255,255,255,0.45)',marginBottom:'20px'}}>All measurements shown in centimetres (cm)</p>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
          <thead>
            <tr style={{background:'rgba(201,169,110,0.1)',borderBottom:'1px solid rgba(201,169,110,0.25)'}}>
              {['Size','Chest','Waist','Hips','Length'].map(h=>(
                <th key={h} style={{padding:'12px 14px',textAlign:'left',fontWeight:'700',color:'#C9A96E',letterSpacing:'1px',fontSize:'10px',textTransform:'uppercase'}}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['XS',  '78–82',  '60–64',  '84–88',  '90'],
              ['S',   '82–86',  '64–68',  '88–92',  '92'],
              ['M',   '86–90',  '68–72',  '92–96',  '94'],
              ['L',   '90–95',  '72–77',  '96–101', '96'],
              ['XL',  '95–102', '77–84',  '101–108','98'],
              ['XXL', '102–110','84–92',  '108–116','100'],
              ['3XL', '110–118','92–100', '116–124','102'],
            ].map(([sz,...vals], i)=>(
              <tr key={sz} style={{
                background:selectedSize===sz?'rgba(201,169,110,0.18)':i%2===0?'transparent':'rgba(255,255,255,0.02)',
                borderBottom:'1px solid rgba(255,255,255,0.05)'
              }}>
                <td style={{padding:'12px 14px',fontWeight:'700',color:selectedSize===sz?'#C9A96E':'#fff'}}>
                  {sz} {selectedSize===sz&&'✦'}
                </td>
                {vals.map((v,vi)=>(
                  <td key={vi} style={{padding:'12px 14px',color:'rgba(255,255,255,0.6)'}}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{marginTop:'24px',background:'rgba(201,169,110,0.08)',borderRadius:'14px',padding:'16px 18px',border:'1px solid rgba(201,169,110,0.25)'}}>
          <p style={{margin:0,fontSize:'11px',color:'#C9A96E',fontWeight:'900',letterSpacing:'1.5px',textTransform:'uppercase'}}>✨ LUXURY FIT ADVICE</p>
          <p style={{margin:'6px 0 0',fontSize:'12px',color:'rgba(255,255,255,0.7)',lineHeight:'1.6'}}>
            If you are between sizes, we recommend selecting the larger size for a relaxed, graceful drape. Our garments are cut with tailored elegance.
          </p>
        </div>
      </div>
    </div>
  );

  /* ── Virtual Try-On Modal ── */
  const VirtualTryOnModal = () => (
    <div
      onClick={()=>setTryOnOpen(false)}
      style={{
        position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:99999,
        display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(16px)',
        padding:'20px',
      }}
    >
      <div
        onClick={e=>e.stopPropagation()}
        style={{
          background:'#0d0d0d',borderRadius:'28px',padding:'28px',
          maxWidth:'800px',width:'100%',maxHeight:'90vh',overflowY:'auto',
          boxShadow:'0 50px 120px rgba(0,0,0,0.9), 0 0 0 1px rgba(201,169,110,0.3)',
          border:'1px solid rgba(201,169,110,0.4)',color:'#fff',position:'relative',
        }}
      >
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <Sparkles size={20} color="#C9A96E" />
            <h2 style={{margin:0,fontSize:'20px',fontWeight:'400',color:'#fff',fontFamily:'"Tenor Sans","Playfair Display",serif'}}>
              AI Virtual Fitting Room
            </h2>
          </div>
          <button onClick={()=>setTryOnOpen(false)} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'50%',width:'38px',height:'38px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#C9A96E'}}>
            <X size={20}/>
          </button>
        </div>
        <VirtualTryOn product={p} />
      </div>
    </div>
  );

  /* ── Share Popup ── */
  const SharePopup = () => (
    <div
      ref={shareRef}
      style={{
        position:'absolute',top:'calc(100% + 10px)',right:0,zIndex:200,
        background:'#141414',borderRadius:'18px',padding:'18px',
        boxShadow:'0 25px 70px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,169,110,0.2)',
        border:'1px solid rgba(255,255,255,0.1)',
        width:'220px',
      }}
    >
      <p style={{fontSize:'9px',fontWeight:'900',letterSpacing:'2px',color:'#C9A96E',margin:'0 0 14px',textTransform:'uppercase'}}>SHARE THIS DESIGN</p>
      {[
        { icon:<FaFacebook size={14}/>, label:'Facebook',  color:'#1877f2' },
        { icon:<FaXTwitter size={14}/>,  label:'X / Twitter', color:'#fff' },
        { icon:<FaInstagram size={14}/>,label:'Instagram',  color:'#e1306c' },
      ].map(({icon,label,color})=>(
        <button key={label} style={{
          width:'100%',display:'flex',alignItems:'center',gap:'10px',
          padding:'10px 12px',border:'none',background:'transparent',cursor:'pointer',
          borderRadius:'10px',fontSize:'12px',color:'rgba(255,255,255,0.85)',fontWeight:'500',
          textAlign:'left',transition:'all 0.2s',fontFamily:'"Outfit",sans-serif',
        }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}
        >
          <span style={{color}}>{icon}</span> {label}
        </button>
      ))}
      <div style={{borderTop:'1px solid rgba(255,255,255,0.08)',marginTop:'8px',paddingTop:'8px'}}>
        <button
          onClick={handleCopyLink}
          style={{
            width:'100%',display:'flex',alignItems:'center',gap:'10px',
            padding:'10px 12px',border:'none',
            background: copyDone?'rgba(201,169,110,0.2)':'transparent',
            cursor:'pointer',borderRadius:'10px',
            fontSize:'12px',color: copyDone?'#C9A96E':'rgba(255,255,255,0.85)',fontWeight:'500',
            textAlign:'left',transition:'all 0.2s',fontFamily:'"Outfit",sans-serif',
          }}
        >
          {copyDone ? <Check size={14} color="#C9A96E"/> : <Copy size={14}/>}
          {copyDone ? 'Link Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );

  /* ── Lightbox ── */
  if (lightbox) return (
    <div
      onClick={()=>setLightbox(false)}
      style={{
        position:'fixed',inset:0,background:'rgba(5,5,5,0.96)',zIndex:99999,
        display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(12px)',
      }}
    >
      <button onClick={()=>setLightbox(false)} style={{
        position:'absolute',top:'24px',right:'32px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(201,169,110,0.3)',
        color:'#C9A96E',cursor:'pointer',borderRadius:'50%',
        width:'46px',height:'46px',display:'flex',alignItems:'center',justifyContent:'center',
      }}><X size={22}/></button>
      <button onClick={e=>{e.stopPropagation();setActiveImg(i=>(i-1+images.length)%images.length);}} style={{
        position:'absolute',left:'32px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(201,169,110,0.3)',
        color:'#C9A96E',cursor:'pointer',borderRadius:'50%',
        width:'54px',height:'54px',display:'flex',alignItems:'center',justifyContent:'center',
      }}><ChevronLeft size={26}/></button>
      <img
        src={images[activeImg]} alt=""
        onClick={e=>e.stopPropagation()}
        style={{maxWidth:'85vw',maxHeight:'88vh',objectFit:'contain',borderRadius:'16px',boxShadow:'0 30px 90px rgba(0,0,0,0.9), 0 0 0 1px rgba(201,169,110,0.2)'}}
      />
      <button onClick={e=>{e.stopPropagation();setActiveImg(i=>(i+1)%images.length);}} style={{
        position:'absolute',right:'32px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(201,169,110,0.3)',
        color:'#C9A96E',cursor:'pointer',borderRadius:'50%',
        width:'54px',height:'54px',display:'flex',alignItems:'center',justifyContent:'center',
      }}><ChevronRight size={26}/></button>
      
      {/* Thumbnail strip */}
      <div style={{
        position:'absolute',bottom:'28px',left:'50%',transform:'translateX(-50%)',
        display:'flex',gap:'10px',
      }}>
        {images.map((src,i)=>(
          <div key={i} onClick={e=>{e.stopPropagation();setActiveImg(i);}} style={{
            width:'60px',height:'74px',borderRadius:'10px',overflow:'hidden',cursor:'pointer',
            border:`2px solid ${activeImg===i?'#C9A96E':'rgba(255,255,255,0.1)'}`,
            boxShadow:activeImg===i?'0 0 14px rgba(201,169,110,0.5)':'none',
            opacity:activeImg===i?1:0.4,transition:'all 0.25s',
          }}>
            <img src={src} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          </div>
        ))}
      </div>
    </div>
  );

  if (loadingProduct || !p || !p.id) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#080808', color: '#fff', gap: 20
      }}>
        <div style={{
          width: 50, height: 50, border: '3px solid rgba(255,255,255,0.08)',
          borderTop: '3px solid #C9A96E', borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: 10, color: '#C9A96E', fontWeight: 900 }}>
          CURATING LUXURY DETAILS...
        </p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ── Main Render ── */
  return (
    <div ref={mainContainerRef} style={{minHeight:'100vh',backgroundColor:'#080808',fontFamily:'"Outfit",sans-serif',color:'#fff',overflowX:'hidden'}}>

      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position:'fixed',bottom:'36px',left:'50%',transform:'translateX(-50%)',
          background:'rgba(20,20,20,0.95)',color:'#C9A96E',padding:'14px 28px',
          borderRadius:'30px',fontSize:'12px',fontWeight:'700',letterSpacing:'1px',
          zIndex:99999,boxShadow:'0 10px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,169,110,0.4)',
          border:'1px solid rgba(201,169,110,0.4)',backdropFilter:'blur(16px)',
          animation:'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          pointerEvents:'none',display:'flex',alignItems:'center',gap:'8px',
        }}>
          <span>✦</span> {toastMsg}
        </div>
      )}

      {/* Modals */}
      {sizeGuideOpen && <SizeGuideModal/>}
      {tryOnOpen && <VirtualTryOnModal/>}
      {sizeQuizOpen && <FindMySizeModal/>}

      {/* Sticky Header Nav */}
      <div style={{
        position:'sticky',top:0,zIndex:100,
        background:'rgba(8,8,8,0.88)',backdropFilter:'blur(16px)',
        borderBottom:'1px solid rgba(255,255,255,0.08)',padding:'14px 40px',
        display:'flex',alignItems:'center',justifyContent:'space-between',
      }}>
        {/* Breadcrumb */}
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <button onClick={onBack} style={{
            display:'flex',alignItems:'center',gap:'8px',
            background:'rgba(201,169,110,0.08)',border:'1px solid rgba(201,169,110,0.4)',padding:'8px 20px',
            borderRadius:'10px',cursor:'pointer',fontSize:'10px',
            fontWeight:'900',color:'#C9A96E',letterSpacing:'2px',
            fontFamily:'"Outfit",sans-serif',transition:'all 0.25s',
            boxShadow:'0 2px 10px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(201,169,110,0.2)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(201,169,110,0.08)'}
          >
            ← BACK
          </button>
          <nav style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>
            <span style={{cursor:'pointer',transition:'color 0.2s'}} onClick={onBack} onMouseEnter={e=>e.target.style.color='#C9A96E'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.4)'}>
              {p.gender_category || "Women's"}
            </span>
            <span>/</span>
            <span style={{cursor:'pointer',transition:'color 0.2s'}} onClick={onBack} onMouseEnter={e=>e.target.style.color='#C9A96E'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.4)'}>
              {p.category || 'Collection'}
            </span>
            <span>/</span>
            <span style={{color:'#C9A96E',fontWeight:'600',maxWidth:'220px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
              {p.name}
            </span>
          </nav>
        </div>

        {/* Actions */}
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <button onClick={handleWish} style={{
            display:'flex',alignItems:'center',gap:'6px',
            background: isWished ? 'rgba(201,169,110,0.15)' : 'rgba(255,255,255,0.03)',
            border: isWished ? '1px solid #C9A96E' : '1px solid rgba(255,255,255,0.12)',
            padding:'8px 18px',borderRadius:'20px',cursor:'pointer',fontSize:'10px',fontWeight:'900',
            color: isWished ? '#C9A96E' : 'rgba(255,255,255,0.7)',letterSpacing:'1.5px',transition:'all 0.25s',
          }}>
            <Heart size={13} fill={isWished ? '#C9A96E' : 'none'} color={isWished ? '#C9A96E' : '#C9A96E'}/>
            {isWished ? 'WISHLISTED' : 'WISHLIST'}
          </button>

          {/* Share */}
          <div style={{position:'relative'}} ref={shareRef}>
            <button onClick={()=>setShareOpen(o=>!o)} style={{
              display:'flex',alignItems:'center',gap:'6px',
              background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.12)',
              padding:'8px 18px',borderRadius:'20px',cursor:'pointer',fontSize:'10px',fontWeight:'900',
              color:'rgba(255,255,255,0.7)',letterSpacing:'1.5px',transition:'all 0.25s',
            }}
            onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(201,169,110,0.4)'}
            onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'}
            >
              <Share2 size={13} color="#C9A96E"/>
              SHARE
            </button>
            {shareOpen && <SharePopup/>}
          </div>
        </div>
      </div>

      {/* Main 2-column Grid Layout */}
      <div style={{
        maxWidth:'1360px',margin:'0 auto',padding:'40px 40px 100px',
        display:'grid',gridTemplateColumns:'56% 1fr',gap:'60px',alignItems:'start',
      }}>

        {/* ══ LEFT: Image Viewer Component ══ */}
        <div style={{position:'sticky',top:'90px'}}>
          
          {/* View mode toggle pill */}
          <div style={{
            display:'flex',gap:'6px',marginBottom:'16px',
            background:'rgba(255,255,255,0.04)',borderRadius:'14px',padding:'5px',
            border:'1px solid rgba(255,255,255,0.08)',width:'fit-content',
            backdropFilter:'blur(10px)',
          }}>
            {[{id:false,label:'📷 GALLERY'},{id:true,label:'↻ 360° VIEW'}].map(m=>(
              <button key={String(m.id)} onClick={()=>{setSpinMode(m.id);setAutoSpin(m.id);}} style={{
                padding:'8px 20px',border:'none',borderRadius:'10px',cursor:'pointer',
                background: spinMode===m.id ? '#C9A96E' : 'transparent',
                color: spinMode===m.id ? '#000' : 'rgba(255,255,255,0.6)',
                fontSize:'10px',fontWeight:'900',letterSpacing:'1.5px',
                transition:'all 0.25s',fontFamily:'"Outfit",sans-serif',
              }}>{m.label}</button>
            ))}
          </div>

          <div style={{display:'flex',gap:'16px'}}>
            {/* Thumbnails list */}
            {!spinMode && (
              <div style={{display:'flex',flexDirection:'column',gap:'10px',width:'76px',flexShrink:0}}>
                {images.map((src,idx)=>(
                  <div key={idx} onClick={()=>setActiveImg(idx)} style={{
                    width:'76px',height:'94px',borderRadius:'12px',overflow:'hidden',
                    border: activeImg===idx ? '2px solid #C9A96E' : '1px solid rgba(255,255,255,0.1)',
                    cursor:'pointer',transition:'all 0.25s',
                    boxShadow: activeImg===idx ? '0 0 16px rgba(201,169,110,0.35)' : 'none',
                    transform: activeImg===idx ? 'scale(1.03)' : 'scale(1)',
                    opacity: activeImg===idx ? 1 : 0.6,
                    background: '#0d0d0d'
                  }}>
                    <img src={src} alt="" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top center'}}/>
                  </div>
                ))}
              </div>
            )}

            {/* Main Stage Display */}
            <div style={{flex:1,position:'relative'}}>
              <div
                ref={imgRef}
                onMouseEnter={()=>!spinMode&&setShowZoom(true)}
                onMouseLeave={()=>{setShowZoom(false);setIsDragging(false);}}
                onMouseMove={spinMode?handleSpinMouseMove:handleMouseMove}
                onMouseDown={spinMode?handleSpinMouseDown:undefined}
                onMouseUp={handleSpinMouseUp}
                onClick={()=>{if(!spinMode)setLightbox(true);}}
                style={{
                  position:'relative',borderRadius:'22px',overflow:'hidden',
                  background:'#0d0d0d',aspectRatio:'3/4',
                  border:'1px solid rgba(255,255,255,0.08)',
                  cursor:spinMode?(isDragging?'grabbing':'grab'):(showZoom?'zoom-in':'pointer'),
                  userSelect:'none',
                  boxShadow:'0 20px 60px rgba(0,0,0,0.6)',
                }}
              >
                {images.map((src,idx)=>(
                  <img key={idx} src={src} alt={p.name} style={{
                    position:'absolute',inset:0,width:'100%',height:'100%',
                    objectFit:'cover',objectPosition:'top center',
                    opacity:(spinMode?spinImgIdx:activeImg)===idx?1:0,
                    transition:spinMode?'none':'opacity 0.4s ease',
                    pointerEvents:'none',
                  }}/>
                ))}

                {/* 360 Overlay */}
                {spinMode && (
                  <div style={{
                    position:'absolute',inset:0,display:'flex',flexDirection:'column',
                    alignItems:'center',justifyContent:'flex-end',pointerEvents:'none',
                    paddingBottom:'24px',gap:'12px',
                  }}>
                    {!isDragging && (
                      <div style={{
                        background:'rgba(0,0,0,0.75)',backdropFilter:'blur(10px)',
                        border:'1px solid rgba(201,169,110,0.4)',
                        color:'#C9A96E',fontSize:'10px',fontWeight:'900',
                        padding:'8px 18px',borderRadius:'20px',letterSpacing:'2px',
                      }}>
                        ↔ DRAG TO ROTATE
                      </div>
                    )}
                    <div style={{display:'flex',gap:'4px'}}>
                      {images.map((_,i)=>(
                        <div key={i} style={{
                          width:spinImgIdx===i?'24px':'6px',height:'6px',borderRadius:'10px',
                          background:spinImgIdx===i?'#C9A96E':'rgba(255,255,255,0.3)',
                          transition:'all 0.25s',
                        }}/>
                      ))}
                    </div>
                  </div>
                )}

                {spinMode && (
                  <button
                    onMouseDown={e=>e.stopPropagation()}
                    onClick={e=>{e.stopPropagation();setAutoSpin(a=>!a);}}
                    style={{
                      position:'absolute',top:'16px',right:'16px',
                      background: autoSpin ? '#C9A96E' : 'rgba(0,0,0,0.7)',
                      color: autoSpin ? '#000' : '#C9A96E',
                      border: '1px solid rgba(201,169,110,0.4)',borderRadius:'20px',padding:'7px 16px',
                      fontSize:'9px',fontWeight:'900',cursor:'pointer',
                      letterSpacing:'1.5px',backdropFilter:'blur(8px)',
                    }}
                  >
                    {autoSpin ? '⏸ PAUSE' : '▶ AUTO SPIN'}
                  </button>
                )}

                {/* Zoom Lens */}
                {showZoom && zoomPos && !spinMode && (
                  <div style={{
                    position:'absolute',
                    width:'160px',height:'160px',borderRadius:'50%',
                    border:'2px solid #C9A96E',
                    boxShadow:'0 0 30px rgba(0,0,0,0.8), 0 0 15px rgba(201,169,110,0.4)',
                    left:`calc(${zoomPos.x}% - 80px)`,
                    top:`calc(${zoomPos.y}% - 80px)`,
                    backgroundImage:`url(${images[activeImg]})`,
                    backgroundSize:'350%',
                    backgroundPosition:`${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundRepeat:'no-repeat',
                    pointerEvents:'none',zIndex:5,
                  }}/>
                )}

                {/* Nav Arrows */}
                {!spinMode && images.length > 1 && (
                  <>
                    <button onClick={e=>{e.stopPropagation();setActiveImg(i=>(i-1+images.length)%images.length);}} style={{
                      position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',
                      background:'rgba(0,0,0,0.65)',backdropFilter:'blur(10px)',
                      border:'1px solid rgba(201,169,110,0.4)',borderRadius:'50%',
                      width:'42px',height:'42px',cursor:'pointer',zIndex:4,
                      display:'flex',alignItems:'center',justifyContent:'center',color:'#C9A96E',
                      boxShadow:'0 4px 15px rgba(0,0,0,0.4)',transition:'all 0.2s',
                    }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='#C9A96E'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(201,169,110,0.4)'}
                    ><ChevronLeft size={20}/></button>
                    
                    <button onClick={e=>{e.stopPropagation();setActiveImg(i=>(i+1)%images.length);}} style={{
                      position:'absolute',right:'14px',top:'50%',transform:'translateY(-50%)',
                      background:'rgba(0,0,0,0.65)',backdropFilter:'blur(10px)',
                      border:'1px solid rgba(201,169,110,0.4)',borderRadius:'50%',
                      width:'42px',height:'42px',cursor:'pointer',zIndex:4,
                      display:'flex',alignItems:'center',justifyContent:'center',color:'#C9A96E',
                      boxShadow:'0 4px 15px rgba(0,0,0,0.4)',transition:'all 0.2s',
                    }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='#C9A96E'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(201,169,110,0.4)'}
                    ><ChevronRight size={20}/></button>
                  </>
                )}

                {/* Badges */}
                <div style={{position:'absolute',top:'16px',left:'16px',display:'flex',flexDirection:'column',gap:'6px',zIndex:3,pointerEvents:'none'}}>
                  {discount > 0 && (
                    <span style={{background:'#C9A96E',color:'#000',fontSize:'9px',fontWeight:'900',padding:'4px 10px',letterSpacing:'1px',boxShadow:'0 4px 12px rgba(201,169,110,0.3)'}}>
                      -{discount}% OFF
                    </span>
                  )}
                  <span style={{background:'rgba(255,255,255,0.12)',backdropFilter:'blur(8px)',color:'white',fontSize:'9px',fontWeight:'900',padding:'4px 10px',letterSpacing:'1px',border:'1px solid rgba(255,255,255,0.2)'}}>
                    {p.tag || 'LUXURY EDIT'}
                  </span>
                </div>

                {/* Controls Overlay */}
                {!spinMode && (
                  <>
                    <div style={{
                      position:'absolute',bottom:'16px',right:'16px',zIndex:4,
                      background:'rgba(0,0,0,0.7)',borderRadius:'10px',padding:'7px 12px',
                      cursor:'pointer',boxShadow:'0 4px 15px rgba(0,0,0,0.4)',
                      border:'1px solid rgba(201,169,110,0.3)',
                      display:'flex',alignItems:'center',gap:'6px',color:'#C9A96E',
                    }}>
                      <ZoomIn size={14}/>
                    </div>
                    <div style={{
                      position:'absolute',bottom:'16px',left:'16px',zIndex:4,
                      background:'rgba(0,0,0,0.7)',color:'#C9A96E',
                      fontSize:'9px',fontWeight:'900',padding:'6px 12px',
                      borderRadius:'20px',backdropFilter:'blur(8px)',letterSpacing:'1.5px',
                      border:'1px solid rgba(201,169,110,0.3)',
                    }}>
                      {activeImg+1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              <p style={{textAlign:'center',fontSize:'9px',color:'rgba(255,255,255,0.35)',marginTop:'10px',letterSpacing:'2px',fontWeight:'700',textTransform:'uppercase'}}>
                {spinMode ? '360° ROTATE ACTIVE · DRAG OR TOGGLE AUTO' : 'CLICK FOR FULLSCREEN LIGHTBOX · HOVER TO ZOOM'}
              </p>
            </div>
          </div>
        </div>

        {/* ══ RIGHT: Product Information & Purchase Panel ══ */}
        <div style={{paddingTop:'4px'}}>

          {/* Sub-Category / Category Gold Subhead */}
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
            <span style={{fontSize:'9px',color:'#C9A96E',letterSpacing:'3px',fontWeight:'900',textTransform:'uppercase'}}>
              {p.sub_category || p.subcategory || p.category || 'WOMEN LUXURY'}
            </span>
            <span style={{fontSize:'9px',color:'rgba(255,255,255,0.2)'}}>•</span>
            <span style={{fontSize:'9px',color:'rgba(255,255,255,0.4)',letterSpacing:'2px',fontWeight:'700'}}>
              SKU: {productSku}
            </span>
          </div>

          {/* Product Title */}
          <h1 style={{
            fontSize:'32px',fontWeight:'400',color:'#ffffff',
            fontFamily:'"Tenor Sans","Playfair Display",Georgia,serif',
            margin:'0 0 14px',lineHeight:'1.25',letterSpacing:'-0.5px',
          }}>{p.name}</h1>

          {/* Rating Summary Row */}
          <div
            onClick={()=>setShowReviews(r=>!r)}
            style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'24px',cursor:'pointer',width:'fit-content'}}
          >
            <div style={{display:'flex',gap:'3px'}}>
              {[1,2,3,4,5].map(s=>(
                <Star key={s} size={14}
                  fill={s<=Math.round(avgRating)?'#C9A96E':'none'}
                  color={s<=Math.round(avgRating)?'#C9A96E':'rgba(255,255,255,0.2)'}
                />
              ))}
            </div>
            <span style={{fontSize:'13px',fontWeight:'700',color:'#C9A96E'}}>{avgRating}</span>
            <span style={{fontSize:'12px',color:'rgba(255,255,255,0.4)'}}>({combinedReviews.length} reviews)</span>
            <span style={{fontSize:'10px',color:'#C9A96E',textTransform:'uppercase',letterSpacing:'1.5px',fontWeight:'900',borderBottom:'1px dotted #C9A96E'}}>
              {showReviews ? 'Hide Reviews ▲' : 'View Reviews ▼'}
            </span>
          </div>

          {/* ── Reviews Drawer Section ── */}
          {showReviews && (
            <div style={{
              background:'rgba(255,255,255,0.03)',borderRadius:'20px',padding:'24px',
              marginBottom:'28px',border:'1px solid rgba(255,255,255,0.08)',
              boxShadow:'0 10px 40px rgba(0,0,0,0.5)',
            }}>
              <div style={{display:'flex',gap:'24px',marginBottom:'20px',paddingBottom:'20px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                <div style={{textAlign:'center',flexShrink:0}}>
                  <div style={{fontSize:'42px',fontWeight:'700',color:'#C9A96E',lineHeight:1,fontFamily:'"Tenor Sans",serif'}}>{avgRating}</div>
                  <div style={{display:'flex',gap:'3px',justifyContent:'center',margin:'8px 0 6px'}}>
                    {[1,2,3,4,5].map(s=>(
                      <Star key={s} size={13} fill={s<=Math.round(avgRating)?'#C9A96E':'none'} color={s<=Math.round(avgRating)?'#C9A96E':'rgba(255,255,255,0.2)'}/>
                    ))}
                  </div>
                  <div style={{fontSize:'9px',color:'rgba(255,255,255,0.4)',letterSpacing:'1px',fontWeight:'700'}}>{combinedReviews.length} REVIEWS</div>
                </div>
                <div style={{flex:1}}>
                  {ratingCounts.map(({star,count})=>(
                    <div key={star} style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}>
                      <span style={{fontSize:'10px',color:'rgba(255,255,255,0.5)',width:'12px',textAlign:'right'}}>{star}</span>
                      <Star size={10} fill="#C9A96E" color="#C9A96E"/>
                      <div style={{flex:1,height:'5px',background:'rgba(255,255,255,0.08)',borderRadius:'3px',overflow:'hidden'}}>
                        <div style={{
                          height:'100%',borderRadius:'3px',background:'#C9A96E',
                          width:`${(count/combinedReviews.length)*100}%`,
                          transition:'width 0.6s ease',
                        }}/>
                      </div>
                      <span style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',width:'14px'}}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'18px'}}>
                <select
                  value={reviewSort}
                  onChange={e=>setReviewSort(e.target.value)}
                  style={{
                    fontSize:'10px',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'10px',
                    padding:'7px 14px',background:'#111',color:'rgba(255,255,255,0.8)',
                    fontFamily:'"Outfit",sans-serif',outline:'none',cursor:'pointer',fontWeight:'700',
                  }}
                >
                  <option value="recent">Most Recent</option>
                  <option value="helpful">Most Helpful</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
                <button
                  onClick={()=>setWriteReview(r=>!r)}
                  style={{
                    fontSize:'9px',fontWeight:'900',letterSpacing:'1.5px',
                    background: writeReview ? '#C9A96E' : 'rgba(201,169,110,0.1)',
                    color: writeReview ? '#000' : '#C9A96E',
                    border:'1px solid #C9A96E',padding:'8px 16px',borderRadius:'10px',
                    cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s',
                  }}
                >
                  {writeReview ? 'CANCEL' : '+ WRITE REVIEW'}
                </button>
              </div>

              {writeReview && !reviewSubmitted && (
                <div style={{
                  background:'rgba(0,0,0,0.4)',borderRadius:'14px',padding:'18px',
                  marginBottom:'20px',border:'1px solid rgba(201,169,110,0.3)',
                }}>
                  <p style={{fontSize:'10px',fontWeight:'900',color:'#C9A96E',margin:'0 0 10px',letterSpacing:'1.5px',textTransform:'uppercase'}}>YOUR RATING</p>
                  <div style={{display:'flex',gap:'6px',marginBottom:'14px'}}>
                    {[1,2,3,4,5].map(s=>(
                      <button
                        key={s}
                        onMouseEnter={()=>setMyRatingHover(s)}
                        onMouseLeave={()=>setMyRatingHover(0)}
                        onClick={()=>setMyRating(s)}
                        style={{background:'none',border:'none',cursor:'pointer',padding:'2px'}}
                      >
                        <Star size={22}
                          fill={s<=(myRatingHover||myRating)?'#C9A96E':'none'}
                          color={s<=(myRatingHover||myRating)?'#C9A96E':'rgba(255,255,255,0.2)'}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={myReviewText}
                    onChange={e=>setMyReviewText(e.target.value)}
                    placeholder="Share your thoughts about this luxury piece..."
                    style={{
                      width:'100%',boxSizing:'border-box',
                      padding:'12px 14px',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'10px',
                      fontSize:'12px',fontFamily:'"Outfit",sans-serif',
                      resize:'vertical',minHeight:'85px',outline:'none',
                      background:'#111',color:'#fff',
                    }}
                  />
                  <button
                    onClick={()=>{if(myRating&&myReviewText){setReviewSubmitted(true);}}}
                    style={{
                      marginTop:'12px',padding:'10px 24px',
                      background: myRating&&myReviewText ? '#C9A96E' : 'rgba(255,255,255,0.1)',
                      color: myRating&&myReviewText ? '#000' : 'rgba(255,255,255,0.4)',
                      border:'none',borderRadius:'10px',
                      cursor: myRating&&myReviewText ? 'pointer' : 'not-allowed',
                      fontSize:'10px',fontWeight:'900',letterSpacing:'2px',
                      fontFamily:'"Outfit",sans-serif',
                    }}
                  >
                    SUBMIT REVIEW
                  </button>
                </div>
              )}

              {reviewSubmitted && (
                <div style={{
                  background:'rgba(201,169,110,0.15)',borderRadius:'14px',padding:'14px 18px',
                  marginBottom:'20px',border:'1px solid rgba(201,169,110,0.4)',
                  display:'flex',alignItems:'center',gap:'10px',
                }}>
                  <Check size={18} color="#C9A96E"/>
                  <span style={{fontSize:'12px',color:'#C9A96E',fontWeight:'700'}}>Thank you! Your review has been submitted for moderation.</span>
                </div>
              )}

              {sortedReviews.map((r,i)=>(
                <div key={i} style={{
                  padding:'16px 0',
                  borderBottom: i<sortedReviews.length-1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px'}}>
                    <div>
                      <div style={{display:'flex',gap:'3px',marginBottom:'6px'}}>
                        {[1,2,3,4,5].map(s=>(
                          <Star key={s} size={11}
                            fill={s<=(r.rating||5)?'#C9A96E':'none'}
                            color={s<=(r.rating||5)?'#C9A96E':'rgba(255,255,255,0.2)'}
                          />
                        ))}
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <span style={{fontSize:'12px',fontWeight:'700',color:'#fff'}}>{r.name || r.user_name || 'Verified Buyer'}</span>
                        {(r.verified !== false) && (
                          <span style={{fontSize:'8px',color:'#C9A96E',background:'rgba(201,169,110,0.12)',padding:'2px 8px',borderRadius:'20px',fontWeight:'900',letterSpacing:'1px',display:'flex',alignItems:'center',gap:'3px',border:'1px solid rgba(201,169,110,0.3)'}}>
                            <Check size={8}/> VERIFIED BUYER
                          </span>
                        )}
                      </div>
                    </div>
                    <span style={{fontSize:'10px',color:'rgba(255,255,255,0.3)'}}>{r.date || 'Recent'}</span>
                  </div>
                  <p style={{fontSize:'12px',color:'rgba(255,255,255,0.7)',margin:'0 0 12px',lineHeight:'1.7'}}>{r.text || r.comment}</p>
                  <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                    <span style={{fontSize:'10px',color:'rgba(255,255,255,0.4)'}}>Was this helpful?</span>
                    <button
                      onClick={()=>handleHelpful(i)}
                      style={{
                        background: helpfulVotes[i] ? 'rgba(201,169,110,0.2)' : 'rgba(255,255,255,0.05)',
                        color: helpfulVotes[i] ? '#C9A96E' : 'rgba(255,255,255,0.6)',
                        border:'none',borderRadius:'20px',padding:'4px 12px',
                        fontSize:'10px',fontWeight:'700',cursor: helpfulVotes[i] ? 'default' : 'pointer',
                        fontFamily:'"Outfit",sans-serif',
                      }}
                    >
                      👍 Helpful ({(r.helpful||12) + (helpfulVotes[i]?1:0)})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Luxury Price Card Container with Dynamic Free Shipping Progress */}
          <div style={{
            background:'linear-gradient(135deg, rgba(201,169,110,0.12) 0%, rgba(255,255,255,0.02) 100%)',
            border:'1px solid rgba(201,169,110,0.35)',borderRadius:'20px',
            padding:'22px 26px',marginBottom:'24px',
            boxShadow:'0 15px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(201,169,110,0.05)',
          }}>
            <div style={{display:'flex',alignItems:'baseline',gap:'14px',flexWrap:'wrap'}}>
              <span style={{fontSize:'34px',fontWeight:'700',color:'#C9A96E',lineHeight:1,fontFamily:'"Outfit",sans-serif'}}>
                LKR {fmt(totalPrice)}
              </span>
              {discount > 0 && (
                <span style={{fontSize:'18px',color:'rgba(255,255,255,0.35)',textDecoration:'line-through'}}>
                  LKR {fmt(p.original_price * qty)}
                </span>
              )}
              {discount > 0 && (
                <span style={{fontSize:'10px',fontWeight:'900',color:'#000',background:'#C9A96E',padding:'4px 12px',letterSpacing:'1px'}}>
                  -{discount}% OFF
                </span>
              )}
            </div>
            {savings > 0 && (
              <p style={{margin:'8px 0 0',fontSize:'12px',color:'#C9A96E',fontWeight:'700',letterSpacing:'0.5px'}}>
                ✦ Exclusive Savings: LKR {fmt(savings)}!
              </p>
            )}

            {/* Dynamic Free Shipping Progress Bar */}
            <div style={{marginTop:'16px',background:'rgba(0,0,0,0.4)',borderRadius:'12px',padding:'12px 14px',border:'1px solid rgba(255,255,255,0.08)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:'10px',fontWeight:'700',marginBottom:'6px'}}>
                <span style={{color: freeShippingNeeded === 0 ? '#C9A96E' : 'rgba(255,255,255,0.7)'}}>
                  {freeShippingNeeded === 0 ? '✨ YOU UNLOCKED FREE EXPRESS DELIVERY!' : `Add LKR ${fmt(freeShippingNeeded)} more for FREE Express Delivery`}
                </span>
                <span style={{color:'#C9A96E'}}>{freeShippingProgress}%</span>
              </div>
              <div style={{height:'6px',background:'rgba(255,255,255,0.1)',borderRadius:'3px',overflow:'hidden'}}>
                <div style={{
                  height:'100%',background: freeShippingNeeded === 0 ? '#C9A96E' : 'linear-gradient(90deg, #C9A96E, #E2C99B)',
                  width: `${freeShippingProgress}%`, transition:'width 0.4s ease',
                }}/>
              </div>
            </div>

            {/* Dynamic Stock Indicator */}
            <div style={{
              marginTop:'14px',display:'flex',alignItems:'center',gap:'8px',
              fontSize:'11px',color: stockQuantity <= 5 ? '#e07a40' : '#4caf87',fontWeight:'700',letterSpacing:'0.5px',
            }}>
              <div style={{
                width:'8px',height:'8px',borderRadius:'50%',
                background: stockQuantity <= 5 ? '#e07a40' : '#4caf87',
                flexShrink:0,boxShadow: `0 0 8px ${stockQuantity <= 5 ? '#e07a40' : '#4caf87'}`,
                animation:'pulse 1.5s infinite'
              }}/>
              {stockQuantity <= 5 ? `Only ${stockQuantity} pieces left in stock — High Demand!` : `In Stock (${stockQuantity} items ready to ship)`}
            </div>
          </div>

          {/* Color Selector with Swatch Sync */}
          <div style={{marginBottom:'24px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}>
              <span style={{fontSize:'10px',fontWeight:'900',letterSpacing:'2px',color:'#C9A96E',textTransform:'uppercase'}}>
                COLOUR SELECTION
                {selectedColor && <span style={{color:'#fff',fontWeight:'500',letterSpacing:'0'}}> — {selectedColor}</span>}
              </span>
            </div>
            <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
              {availableColors.map((cObj, idx)=>{
                const sel = selectedColor===cObj.name;
                return (
                  <div
                    key={cObj.name}
                    title={cObj.name}
                    onClick={()=>handleColorSelect(cObj, idx)}
                    style={{
                      width:'34px',height:'34px',borderRadius:'50%',background:cObj.hex,
                      cursor:'pointer',
                      outline: sel ? '2.5px solid #C9A96E' : '2.5px solid transparent',
                      outlineOffset:'3px',
                      border: `1.5px solid ${cObj.border||'rgba(255,255,255,0.15)'}`,
                      boxShadow: sel ? '0 0 14px rgba(201,169,110,0.5)' : '0 2px 6px rgba(0,0,0,0.5)',
                      transform: sel ? 'scale(1.15)' : 'scale(1)',
                      transition:'all 0.2s',
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Size Selector with AI Fit Assistant Trigger */}
          <div style={{marginBottom:'28px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px'}}>
              <span style={{fontSize:'10px',fontWeight:'900',letterSpacing:'2px',color:'#C9A96E',textTransform:'uppercase'}}>
                SIZE {selectedSize && <span style={{color:'#fff',fontWeight:'500',letterSpacing:'0'}}> — {selectedSize}</span>}
              </span>
              <div style={{display:'flex',gap:'12px'}}>
                <button
                  onClick={()=>setSizeQuizOpen(true)}
                  style={{
                    fontSize:'10px',color:'#C9A96E',cursor:'pointer',
                    background:'none',border:'none',fontFamily:'"Outfit",sans-serif',
                    fontWeight:'900',letterSpacing:'1.5px',textTransform:'uppercase',
                    display:'flex',alignItems:'center',gap:'4px',borderBottom:'1px dotted #C9A96E',padding:0,
                  }}
                >
                  <Ruler size={12}/> FIND MY SIZE (AI)
                </button>
                <button
                  onClick={()=>setSizeGuideOpen(true)}
                  style={{
                    fontSize:'10px',color:'rgba(255,255,255,0.6)',cursor:'pointer',
                    background:'none',border:'none',fontFamily:'"Outfit",sans-serif',
                    fontWeight:'700',letterSpacing:'1.5px',textTransform:'uppercase',
                    borderBottom:'1px dotted rgba(255,255,255,0.4)',padding:0,
                  }}
                >
                  SIZE GUIDE ↗
                </button>
              </div>
            </div>

            <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
              {availableSizes.map(sz=>{
                const sel = selectedSize===sz;
                return (
                  <button key={sz} onClick={()=>setSelectedSize(sz)} style={{
                    minWidth:'56px',height:'56px',padding:'0 12px',
                    border: sel ? '1.5px solid #C9A96E' : '1px solid rgba(255,255,255,0.12)',
                    background: sel ? '#C9A96E' : 'rgba(255,255,255,0.03)',
                    color: sel ? '#000' : 'rgba(255,255,255,0.8)',
                    borderRadius:'12px',cursor:'pointer',
                    fontSize:'12px',fontWeight:'900',letterSpacing:'1px',
                    transition:'all 0.2s',fontFamily:'"Outfit",sans-serif',
                    boxShadow: sel ? '0 4px 20px rgba(201,169,110,0.35)' : 'none',
                    transform: sel ? 'scale(1.05)' : 'scale(1)',
                  }}>{sz}</button>
                );
              })}
            </div>
            {!selectedSize && (
              <p style={{fontSize:'10px',color:'#e05a6a',margin:'10px 0 0',fontWeight:'700',letterSpacing:'0.5px'}}>
                ⚠ Please select your size to proceed
              </p>
            )}
          </div>

          {/* AI Virtual Try-On CTA Banner Button */}
          <button
            onClick={()=>setTryOnOpen(true)}
            style={{
              width:'100%',padding:'14px 20px',marginBottom:'20px',
              background:'linear-gradient(135deg, rgba(201,169,110,0.2) 0%, rgba(201,169,110,0.06) 100%)',
              border:'1px solid #C9A96E',borderRadius:'14px',
              color:'#C9A96E',fontSize:'11px',fontWeight:'900',letterSpacing:'2px',
              cursor:'pointer',transition:'all 0.3s',
              display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',
              fontFamily:'"Outfit",sans-serif',boxShadow:'0 4px 20px rgba(201,169,110,0.15)',
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.background = '#C9A96E';
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201,169,110,0.2) 0%, rgba(201,169,110,0.06) 100%)';
              e.currentTarget.style.color = '#C9A96E';
            }}
          >
            <Sparkles size={16} />
            TRY ON WITH AI CAMERA (VIRTUAL FITTING ROOM)
          </button>

          {/* Quantity + Add to Bag Row */}
          <div style={{display:'flex',gap:'14px',marginBottom:'14px'}}>
            {/* Qty Selector */}
            <div style={{
              display:'flex',alignItems:'center',
              border:'1px solid rgba(255,255,255,0.15)',borderRadius:'14px',
              overflow:'hidden',background:'rgba(255,255,255,0.03)',
            }}>
              <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{
                width:'48px',height:'56px',border:'none',background:'transparent',
                cursor:'pointer',fontSize:'20px',color:'#C9A96E',fontWeight:'700',
              }}>−</button>
              <span style={{width:'48px',textAlign:'center',fontSize:'16px',fontWeight:'900',color:'#fff',fontFamily:'"Outfit",sans-serif'}}>{qty}</span>
              <button onClick={()=>setQty(q=>Math.min(10,q+1))} style={{
                width:'48px',height:'56px',border:'none',background:'transparent',
                cursor:'pointer',fontSize:'20px',color:'#C9A96E',fontWeight:'700',
              }}>+</button>
            </div>

            {/* ADD TO BAG Button */}
            <button
              onClick={handleAddToCartWithValidation}
              style={{
                flex:1,height:'56px',
                background: inCart ? '#C9A96E' : '#C9A96E',
                color: '#000', border: 'none', borderRadius:'14px',
                fontSize:'11px',fontWeight:'900',letterSpacing:'2.5px',cursor:'pointer',
                transition:'all 0.3s cubic-bezier(0.25,0.8,0.25,1)',
                display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',
                boxShadow:'0 8px 30px rgba(201,169,110,0.3)',
                fontFamily:'"Outfit",sans-serif',
              }}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}
            >
              <ShoppingBag size={16}/>
              {inCart ? 'ADDED TO BAG ✓' : 'ADD TO BAG'}
            </button>
          </div>

          {/* Buy Now Button */}
          <button style={{
            width:'100%',height:'54px',
            background:'transparent',color:'#C9A96E',
            border:'1px solid rgba(201,169,110,0.5)',borderRadius:'14px',
            fontSize:'11px',fontWeight:'900',letterSpacing:'2.5px',
            cursor:'pointer',marginBottom:'28px',
            fontFamily:'"Outfit",sans-serif',transition:'all 0.25s',
          }}
          onMouseEnter={e=>{
            e.currentTarget.style.background='rgba(201,169,110,0.15)';
            e.currentTarget.style.borderColor='#C9A96E';
          }}
          onMouseLeave={e=>{
            e.currentTarget.style.background='transparent';
            e.currentTarget.style.borderColor='rgba(201,169,110,0.5)';
          }}
          >⚡ BUY NOW WITH EXPRESS CHECKOUT</button>

          {/* ── NEW FEATURE: Smart Delivery Estimator & District Pincode Checker ── */}
          <div style={{
            background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'18px',
            padding:'20px 22px',marginBottom:'28px',
          }}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px'}}>
              <MapPin size={16} color="#C9A96E"/>
              <span style={{fontSize:'10px',fontWeight:'900',color:'#C9A96E',letterSpacing:'1.5px',textTransform:'uppercase'}}>
                ESTIMATE DELIVERY DATE (SRI LANKA)
              </span>
            </div>
            
            <div style={{display:'flex',gap:'10px',marginBottom:'12px'}}>
              <select
                value={selectedDistrict.name}
                onChange={e=>{
                  const found = SRI_LANKA_DISTRICTS.find(d => d.name === e.target.value);
                  if (found) setSelectedDistrict(found);
                }}
                style={{
                  flex:1,padding:'11px 14px',border:'1px solid rgba(255,255,255,0.15)',
                  borderRadius:'10px',background:'#111',color:'#fff',fontSize:'12px',
                  fontFamily:'"Outfit",sans-serif',outline:'none',cursor:'pointer',
                }}
              >
                {SRI_LANKA_DISTRICTS.map(d=>(
                  <option key={d.name} value={d.name}>{d.name} District</option>
                ))}
              </select>
            </div>

            <div style={{background:'rgba(201,169,110,0.08)',borderRadius:'12px',padding:'12px 14px',border:'1px solid rgba(201,169,110,0.2)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <span style={{fontSize:'9px',color:'rgba(255,255,255,0.4)',letterSpacing:'1px',display:'block',fontWeight:'700',textTransform:'uppercase'}}>ESTIMATED ARRIVAL</span>
                <span style={{fontSize:'13px',fontWeight:'700',color:'#fff'}}>{selectedDistrict.deliveryDays}</span>
              </div>
              <div style={{textAlign:'right'}}>
                <span style={{fontSize:'9px',color:'rgba(255,255,255,0.4)',letterSpacing:'1px',display:'block',fontWeight:'700',textTransform:'uppercase'}}>SHIPPING FEE</span>
                <span style={{fontSize:'13px',fontWeight:'700',color:'#C9A96E'}}>
                  {totalPrice >= 5000 || selectedDistrict.fee === 0 ? 'FREE' : `LKR ${selectedDistrict.fee}`}
                </span>
              </div>
            </div>
          </div>

          {/* ── NEW FEATURE: Complete The Look / Stylist Bundle ── */}
          {bundlePair && (
            <div style={{
              background:'linear-gradient(135deg, rgba(201,169,110,0.15) 0%, rgba(20,20,20,0.6) 100%)',
              border:'1px solid rgba(201,169,110,0.4)',borderRadius:'20px',
              padding:'20px 22px',marginBottom:'28px',
            }}>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'14px'}}>
                <Layers size={16} color="#C9A96E"/>
                <span style={{fontSize:'10px',fontWeight:'900',color:'#C9A96E',letterSpacing:'2px',textTransform:'uppercase'}}>
                  COMPLETE THE LOOK (STYLIST PAIRING)
                </span>
              </div>

              <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'14px'}}>
                <img
                  src={bundlePair.images_array?.[0] || bundlePair.image}
                  alt={bundlePair.name}
                  style={{width:'64px',height:'80px',objectFit:'cover',borderRadius:'10px',border:'1px solid rgba(255,255,255,0.1)',background:'#000'}}
                />
                <div style={{flex:1}}>
                  <span style={{fontSize:'8px',color:'#C9A96E',letterSpacing:'1.5px',fontWeight:'900',textTransform:'uppercase'}}>{bundlePair.category}</span>
                  <h4 style={{fontSize:'13px',fontWeight:'500',color:'#fff',margin:'2px 0 4px',lineHeight:'1.3'}}>{bundlePair.name}</h4>
                  <span style={{fontSize:'13px',fontWeight:'700',color:'#C9A96E'}}>LKR {fmt(bundlePair.price_lkr)}</span>
                </div>
              </div>

              <button
                onClick={handleAddBundleToBag}
                style={{
                  width:'100%',padding:'11px',background: bundleAdded ? '#C9A96E' : 'rgba(201,169,110,0.2)',
                  color: bundleAdded ? '#000' : '#C9A96E',border:'1px solid #C9A96E',borderRadius:'10px',
                  fontSize:'10px',fontWeight:'900',letterSpacing:'1.5px',cursor:'pointer',
                  fontFamily:'"Outfit",sans-serif',transition:'all 0.25s',
                }}
              >
                {bundleAdded ? '✓ OUTFIT BUNDLE ADDED!' : `+ ADD OUTFIT BUNDLE (LKR ${fmt(p.price_lkr + bundlePair.price_lkr)})`}
              </button>
            </div>
          )}

          {/* Back In Stock Notification Box */}
          <div style={{
            background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',
            padding:'18px 20px',marginBottom:'28px',
          }}>
            <p style={{fontSize:'11px',fontWeight:'900',color:'#C9A96E',margin:'0 0 12px',letterSpacing:'1.5px',textTransform:'uppercase'}}>
              🔔 STOCK BACK IN NOTIFICATION
            </p>
            <div style={{display:'flex',gap:'10px'}}>
              <input
                value={notifyEmail}
                onChange={e=>setNotifyEmail(e.target.value)}
                placeholder="Enter your email address"
                style={{
                  flex:1,padding:'11px 16px',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'10px',
                  fontSize:'12px',outline:'none',background:'#111',color:'#fff',fontFamily:'"Outfit",sans-serif',
                }}
              />
              <button
                onClick={()=>{if(notifyEmail)setNotifySent(true);}}
                style={{
                  padding:'11px 20px',background: notifySent ? 'rgba(201,169,110,0.3)' : '#C9A96E',
                  color: notifySent ? '#C9A96E' : '#000',border:'none',borderRadius:'10px',cursor:'pointer',
                  fontSize:'10px',fontWeight:'900',letterSpacing:'1.5px',fontFamily:'"Outfit",sans-serif',
                  whiteSpace:'nowrap',transition:'all 0.25s',
                }}
              >
                {notifySent ? '✓ NOTIFIED' : 'NOTIFY ME'}
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'32px'}}>
            {[
              [<Truck size={18} color="#C9A96E"/>,    'Complimentary Shipping', 'Orders over LKR 5,000'],
              [<RefreshCw size={18} color="#C9A96E"/>, 'Hassle-Free Returns',    '14-day luxury guarantee'],
              [<Shield size={18} color="#C9A96E"/>,   '100% Authentic',  'Handcrafted quality'],
            ].map(([icon,title,sub])=>(
              <div key={title} style={{
                textAlign:'center',padding:'16px 10px',
                background:'rgba(255,255,255,0.03)',borderRadius:'14px',border:'1px solid rgba(255,255,255,0.07)',
                boxShadow:'0 4px 15px rgba(0,0,0,0.2)',
              }}>
                <div style={{display:'flex',justifyContent:'center',marginBottom:'8px'}}>{icon}</div>
                <div style={{fontSize:'10px',fontWeight:'900',color:'#fff',letterSpacing:'0.5px'}}>{title}</div>
                <div style={{fontSize:'9px',color:'rgba(255,255,255,0.4)',marginTop:'4px'}}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Info Tabs Container */}
          <div style={{background:'rgba(255,255,255,0.03)',borderRadius:'18px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.08)',boxShadow:'0 10px 30px rgba(0,0,0,0.3)'}}>
            <div style={{display:'flex',borderBottom:'1px solid rgba(255,255,255,0.08)',overflowX:'auto'}}>
              {TABS.map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} style={{
                  padding:'14px 20px',border:'none',background:'none',cursor:'pointer',
                  fontSize:'9px',fontWeight:'900',letterSpacing:'2px',
                  color: tab===t.id ? '#C9A96E' : 'rgba(255,255,255,0.4)',
                  borderBottom: tab===t.id ? '2px solid #C9A96E' : '2px solid transparent',
                  transition:'all 0.25s',fontFamily:'"Outfit",sans-serif',whiteSpace:'nowrap',
                }}>{t.label.toUpperCase()}</button>
              ))}
            </div>
            <div style={{padding:'22px 24px',fontSize:'13px',color:'rgba(255,255,255,0.7)',lineHeight:'1.9',whiteSpace:'pre-line'}}>
              {TAB_CONTENT[tab]}
            </div>
          </div>
        </div>
      </div>

      {/* ══ "You May Also Like" / Related Products Section ══ */}
      {related.length > 0 && (
        <div style={{background:'#050505',padding:'60px 40px 80px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
          <div style={{maxWidth:'1360px',margin:'0 auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:'36px'}}>
              <div>
                <span style={{fontSize:'9px',fontWeight:'900',letterSpacing:'3px',color:'#C9A96E',textTransform:'uppercase'}}>CURATED RECOMMENDATIONS</span>
                <h2 style={{
                  fontSize:'26px',fontWeight:'400',color:'#ffffff',
                  fontFamily:'"Tenor Sans","Playfair Display",Georgia,serif',margin:'4px 0 0',
                }}>You May Also Like</h2>
              </div>
              <span onClick={onBack} style={{fontSize:'10px',color:'#C9A96E',cursor:'pointer',letterSpacing:'2px',fontWeight:'900',textTransform:'uppercase'}}>
                VIEW FULL COLLECTION →
              </span>
            </div>

            {/* Related Products Grid */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'24px'}}>
              {related.map(r=>{
                const isHovered = hoveredRelated === r.id;
                const rImg  = r.images_array?.[0] || r.image || `https://via.placeholder.com/300x360/111111/C9A96E?text=${encodeURIComponent(r.name||'Product')}`;
                const rDisc = r.original_price && r.original_price > r.price_lkr ? Math.round((1 - r.price_lkr / r.original_price) * 100) : 0;
                
                return (
                  <div
                    key={r.id}
                    onMouseEnter={()=>setHoveredRelated(r.id)}
                    onMouseLeave={()=>setHoveredRelated(null)}
                    onClick={()=>handleRelatedClick(r)}
                    style={{
                      background: isHovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                      border: isHovered ? '1px solid rgba(201,169,110,0.45)' : '1px solid rgba(255,255,255,0.07)',
                      borderRadius:'18px',overflow:'hidden',
                      boxShadow: isHovered
                        ? '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,169,110,0.15)'
                        : '0 4px 20px rgba(0,0,0,0.3)',
                      transition:'all 0.35s cubic-bezier(0.25,0.8,0.25,1)',
                      transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                      cursor:'pointer',position:'relative',
                    }}
                  >
                    <div style={{height:'320px',overflow:'hidden',background:'#0d0d0d',position:'relative'}}>
                      <img
                        src={rImg}
                        alt={r.name}
                        style={{
                          width:'100%',height:'100%',objectFit:'cover',objectPosition:'top center',
                          transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                          transition:'transform 0.6s ease',
                        }}
                      />
                      {rDisc > 0 && (
                        <span style={{position:'absolute',top:'12px',left:'12px',background:'#C9A96E',color:'#000',fontSize:'9px',fontWeight:'900',padding:'3px 8px',letterSpacing:'0.5px'}}>
                          -{rDisc}%
                        </span>
                      )}
                    </div>
                    <div style={{padding:'18px 20px 22px'}}>
                      <span style={{fontSize:'8px',color:'#C9A96E',letterSpacing:'3px',fontWeight:'900',textTransform:'uppercase'}}>
                        {r.sub_category || r.subcategory || r.category}
                      </span>
                      <h3 style={{
                        fontSize:'13px',fontWeight:'400',color:'rgba(255,255,255,0.9)',
                        margin:'6px 0 10px',lineHeight:'1.5',
                        display:'-webkit-box',WebkitLineClamp:2,
                        WebkitBoxOrient:'vertical',overflow:'hidden',
                        fontFamily:'"Tenor Sans","Georgia",serif',
                      }}>
                        {r.name}
                      </h3>
                      <div style={{display:'flex',alignItems:'baseline',gap:'10px'}}>
                        <span style={{fontSize:'15px',fontWeight:'700',color:'#C9A96E',fontFamily:'"Outfit",sans-serif'}}>
                          LKR {fmt(r.price_lkr)}
                        </span>
                        {rDisc > 0 && (
                          <span style={{fontSize:'11px',color:'rgba(255,255,255,0.25)',textDecoration:'line-through'}}>
                            LKR {fmt(r.original_price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── NEW FEATURE: Sticky Bottom Purchase Bar (Appears on Scroll) ── */}
      <div style={{
        position:'fixed',bottom:0,left:0,right:0,zIndex:990,
        background:'rgba(12,12,12,0.92)',backdropFilter:'blur(20px)',
        borderTop:'1px solid rgba(201,169,110,0.3)',padding:'12px 40px',
        display:'flex',alignItems:'center',justifyContent:'space-between',
        transform: scrolledPastMain ? 'translateY(0)' : 'translateY(100%)',
        transition:'transform 0.35s cubic-bezier(0.25,0.8,0.25,1)',
        boxShadow:'0 -10px 40px rgba(0,0,0,0.8)',
      }}>
        {/* Product Meta */}
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <img
            src={images[0]} alt=""
            style={{width:'46px',height:'56px',objectFit:'cover',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)'}}
          />
          <div>
            <span style={{fontSize:'8px',color:'#C9A96E',letterSpacing:'2px',fontWeight:'900',textTransform:'uppercase'}}>
              {p.sub_category || p.category || 'BLOOMAIR'}
            </span>
            <h4 style={{fontSize:'14px',fontWeight:'400',color:'#fff',margin:'2px 0 0',fontFamily:'"Tenor Sans",serif'}}>
              {p.name}
            </h4>
          </div>
        </div>

        {/* Quick Purchase Controls */}
        <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
          <span style={{fontSize:'18px',fontWeight:'700',color:'#C9A96E',fontFamily:'"Outfit",sans-serif'}}>
            LKR {fmt(totalPrice)}
          </span>

          {/* Quick Size Dropdown */}
          <select
            value={selectedSize || ''}
            onChange={e=>setSelectedSize(e.target.value)}
            style={{
              padding:'10px 14px',borderRadius:'10px',
              border:'1px solid rgba(201,169,110,0.4)',background:'#111',
              color:'#C9A96E',fontSize:'11px',fontWeight:'700',outline:'none',
              cursor:'pointer',fontFamily:'"Outfit",sans-serif',
            }}
          >
            <option value="" disabled>SELECT SIZE</option>
            {availableSizes.map(sz=>(
              <option key={sz} value={sz}>{sz}</option>
            ))}
          </select>

          <button
            onClick={handleAddToCartWithValidation}
            style={{
              padding:'12px 28px',background:'#C9A96E',color:'#000',
              border:'none',borderRadius:'10px',fontSize:'11px',
              fontWeight:'900',letterSpacing:'2px',cursor:'pointer',
              boxShadow:'0 4px 20px rgba(201,169,110,0.4)',
              fontFamily:'"Outfit",sans-serif',transition:'transform 0.2s',
            }}
            onMouseEnter={e=>e.currentTarget.style.transform='scale(1.03)'}
            onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
          >
            {inCart ? 'ADDED ✓' : 'ADD TO BAG'}
          </button>
        </div>
      </div>

      {/* Global Embedded Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tenor+Sans&family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Outfit:wght@300;400;500;600;700;900&display=swap');
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.85)} }
        @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(14px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
      `}</style>
    </div>
  );
}