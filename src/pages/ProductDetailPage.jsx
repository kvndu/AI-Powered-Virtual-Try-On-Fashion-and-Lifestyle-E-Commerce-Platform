import { useState, useEffect, useRef } from 'react';
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
  Copy
} from 'lucide-react';

import {
  FaFacebook,
  FaInstagram,
  FaXTwitter
} from 'react-icons/fa6';

const fmt = n => parseInt(n).toLocaleString('en-LK');

const ALL_SIZES   = ['XS','S','M','L','XL','XXL','3XL'];
const COLORS_DATA = [
  { name:'Black',  hex:'#1a1a1a' },
  { name:'White',  hex:'#f0f0f0', border:'#ccc' },
  { name:'Nude',   hex:'#c9a88a' },
  { name:'Pink',   hex:'#f4a7b9' },
  { name:'Red',    hex:'#e05a6a' },
  { name:'Blue',   hex:'#5b8ed6' },
  { name:'Green',  hex:'#6aab7e' },
  { name:'Yellow', hex:'#f5c842' },
];

const TABS = [
  { id:'desc',     label:'Description' },
  { id:'details',  label:'Details' },
  { id:'care',     label:'Care' },
  { id:'delivery', label:'Delivery & Returns' },
];

const MOCK_REVIEWS = [
  { name:'Dilini P.',  rating:5, date:'2 days ago',   text:'Absolutely love this! The fabric is so soft and the fit is perfect. Got so many compliments when I wore it!', verified:true,  helpful:24 },
  { name:'Sachini M.', rating:4, date:'1 week ago',   text:'Beautiful dress, exactly as shown in photos. Shipping was fast too. Slightly bigger than expected but still great quality.', verified:true,  helpful:18 },
  { name:'Amaya K.',   rating:5, date:'2 weeks ago',  text:'Best purchase I\'ve made in a while. The quality is amazing for the price. Will definitely order again!', verified:false, helpful:12 },
  { name:'Tharushi R.',rating:3, date:'3 weeks ago',  text:'Decent quality but the colour was slightly different from what I saw on screen. Customer service was helpful though.', verified:true,  helpful:7  },
  { name:'Nadeesha W.',rating:5, date:'1 month ago',  text:'Perfect fit, beautiful material. Wore it to an office event and everyone loved it. Fast delivery too!', verified:true,  helpful:31 },
];

/* ══════════════════════════════════════════════════════════════ */
export default function ProductDetailPage({
  product: p, allProducts, onBack,
  wishlist, onWish, onAddToCart, addedToCart
}) {
  const images = (p.images_array && p.images_array.length > 0)
    ? p.images_array
    : [`https://via.placeholder.com/600x700/f8f8f8/aaa?text=${encodeURIComponent(p.name||'Product')}`];

  /* ── State ── */
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
  const [spinMode,       setSpinMode]       = useState(false);
  const [spinAngle,      setSpinAngle]      = useState(0);
  const [autoSpin,       setAutoSpin]       = useState(false);
  const [isDragging,     setIsDragging]     = useState(false);
  const [dragStart,      setDragStart]      = useState(0);
  const [dragAngle,      setDragAngle]      = useState(0);
  const [zoomPos,        setZoomPos]        = useState(null);
  const [showZoom,       setShowZoom]       = useState(false);
  const [pinchZoom,      setPinchZoom]      = useState(1);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [toastMsg,       setToastMsg]       = useState('');

  const imgRef       = useRef(null);
  const autoSpinRef  = useRef(null);
  const shareRef     = useRef(null);

  /* ── Computed ── */
  const isWished  = wishlist.includes(p.id);
  const inCart    = addedToCart[p.id];
  const discount  = p.original_price && p.original_price > p.price_lkr
    ? Math.round((1 - p.price_lkr / p.original_price) * 100) : 0;
  const savings   = discount > 0 ? (p.original_price - p.price_lkr) * qty : 0;
  const avgRating = (MOCK_REVIEWS.reduce((s,r)=>s+r.rating,0)/MOCK_REVIEWS.length).toFixed(1);
  const related   = allProducts.filter(r => r.id !== p.id && r.category === p.category).slice(0,4);

  const ratingCounts = [5,4,3,2,1].map(star => ({
    star, count: MOCK_REVIEWS.filter(r=>r.rating===star).length,
  }));

  const sortedReviews = [...MOCK_REVIEWS].sort((a,b) =>
    reviewSort === 'helpful' ? b.helpful - a.helpful :
    reviewSort === 'highest' ? b.rating - a.rating :
    reviewSort === 'lowest'  ? a.rating - b.rating : 0
  );

  const spinImgIdx = spinMode
    ? Math.floor((spinAngle / 360) * images.length) % images.length
    : activeImg;

  /* ── Effects ── */
  useEffect(() => { window.scrollTo(0,0); }, []);

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
        else if (shareOpen) setShareOpen(false);
        else onBack();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [images.length, lightbox, sizeGuideOpen, shareOpen]);

  // Track recently viewed
  useEffect(() => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(item=>item.id!==p.id);
      return [p, ...filtered].slice(0,4);
    });
  }, [p.id]);

  // Close share popup on outside click
  useEffect(() => {
    const handler = e => {
      if (shareRef.current && !shareRef.current.contains(e.target)) setShareOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Handlers ── */
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
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
    onAddToCart(p.id, e, selectedSize, selectedColor || 'Default', qty);
    showToast('✓ Added to bag!');
  };

  const handleWish = () => {
    onWish(p.id);
    showToast(isWished ? 'Removed from wishlist' : '♥ Added to wishlist!');
  };

  const TAB_CONTENT = {
    desc:     p.description || 'A beautifully crafted piece from Bloomair\'s Women\'s Collection. Designed for effortless style and all-day comfort — from morning coffee to evening outings.',
    details:  `• Material: ${p.material||'Premium woven fabric'}\n• Fit: ${p.fit||'Regular fit'}\n• Origin: ${p.origin||'Sri Lanka'}\n• SKU: BL-W-${String(p.id||'001').slice(0,6)}\n• Care: Machine washable`,
    care:     '• Machine wash cold (30°C)\n• Wash with similar colours\n• Do not bleach\n• Tumble dry on low heat\n• Warm iron on reverse\n• Do not dry clean',
    delivery: '• FREE delivery on orders over LKR 3,000\n• Standard: 3–5 business days\n• Express: 1–2 business days (LKR 350)\n• Same-day Colombo: available before 12PM\n• Free returns within 14 days — no questions asked',
  };

  /* ── Size Guide Modal ── */
  const SizeGuideModal = () => (
    <div
      onClick={()=>setSizeGuideOpen(false)}
      style={{
        position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:9999,
        display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(4px)',
      }}
    >
      <div
        onClick={e=>e.stopPropagation()}
        style={{
          background:'white',borderRadius:'20px',padding:'32px',
          maxWidth:'600px',width:'90%',maxHeight:'80vh',overflowY:'auto',
          boxShadow:'0 40px 100px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
          <h2 style={{margin:0,fontSize:'20px',fontWeight:'600',color:'#111',fontFamily:'"Playfair Display",serif'}}>
            Size Guide
          </h2>
          <button onClick={()=>setSizeGuideOpen(false)} style={{background:'none',border:'none',cursor:'pointer',color:'#888'}}>
            <X size={20}/>
          </button>
        </div>
        <p style={{fontSize:'12px',color:'#888',marginBottom:'16px'}}>All measurements in centimetres (cm)</p>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
          <thead>
            <tr style={{background:'#f8f8f8'}}>
              {['Size','Chest','Waist','Hips','Length'].map(h=>(
                <th key={h} style={{padding:'10px 14px',textAlign:'left',fontWeight:'700',color:'#111',letterSpacing:'0.5px',borderBottom:'1px solid #eee'}}>
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
              <tr key={sz} style={{background:selectedSize===sz?'#f0f7ff':i%2===0?'white':'#fafafa'}}>
                <td style={{padding:'10px 14px',fontWeight:'700',color:selectedSize===sz?'#5b8ed6':'#111',borderBottom:'1px solid #f0f0f0'}}>
                  {sz} {selectedSize===sz&&'←'}
                </td>
                {vals.map((v,vi)=>(
                  <td key={vi} style={{padding:'10px 14px',color:'#666',borderBottom:'1px solid #f0f0f0'}}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{marginTop:'20px',background:'#fffbea',borderRadius:'12px',padding:'14px 16px',border:'1px solid #f5e4a0'}}>
          <p style={{margin:0,fontSize:'12px',color:'#8a6d00',fontWeight:'600'}}>💡 Fit Tip</p>
          <p style={{margin:'6px 0 0',fontSize:'12px',color:'#7a5d00',lineHeight:'1.6'}}>
            If you're between sizes, we recommend sizing up for a more comfortable fit.
            This style is designed for a relaxed, flowy silhouette.
          </p>
        </div>
      </div>
    </div>
  );

  /* ── Share Popup ── */
  const SharePopup = () => (
    <div
      ref={shareRef}
      style={{
        position:'absolute',top:'calc(100% + 8px)',right:0,zIndex:200,
        background:'white',borderRadius:'16px',padding:'16px',
        boxShadow:'0 20px 60px rgba(0,0,0,0.18)',border:'1px solid #f0f0f0',
        width:'220px',
      }}
    >
      <p style={{fontSize:'11px',fontWeight:'700',letterSpacing:'1.5px',color:'#aaa',margin:'0 0 12px'}}>SHARE THIS STYLE</p>
      {[
        { icon:<Facebook size={14}/>, label:'Facebook',  color:'#1877f2' },
        { icon:<Twitter size={14}/>,  label:'X / Twitter', color:'#000' },
        { icon:<Instagram size={14}/>,label:'Instagram',  color:'#e1306c' },
      ].map(({icon,label,color})=>(
        <button key={label} style={{
          width:'100%',display:'flex',alignItems:'center',gap:'10px',
          padding:'9px 12px',border:'none',background:'none',cursor:'pointer',
          borderRadius:'8px',fontSize:'12px',color:'#333',fontWeight:'500',
          textAlign:'left',transition:'background 0.15s',fontFamily:'"Outfit",sans-serif',
        }}
          onMouseEnter={e=>e.currentTarget.style.background='#f5f5f5'}
          onMouseLeave={e=>e.currentTarget.style.background='none'}
        >
          <span style={{color}}>{icon}</span> {label}
        </button>
      ))}
      <div style={{borderTop:'1px solid #f0f0f0',marginTop:'8px',paddingTop:'8px'}}>
        <button
          onClick={handleCopyLink}
          style={{
            width:'100%',display:'flex',alignItems:'center',gap:'10px',
            padding:'9px 12px',border:'none',
            background: copyDone?'#edf7f2':'none',
            cursor:'pointer',borderRadius:'8px',
            fontSize:'12px',color: copyDone?'#4caf87':'#333',fontWeight:'500',
            textAlign:'left',transition:'all 0.2s',fontFamily:'"Outfit",sans-serif',
          }}
        >
          {copyDone ? <Check size={14}/> : <Copy size={14}/>}
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
        position:'fixed',inset:0,background:'rgba(0,0,0,0.95)',zIndex:9999,
        display:'flex',alignItems:'center',justifyContent:'center',
      }}
    >
      <button onClick={()=>setLightbox(false)} style={{
        position:'absolute',top:'24px',right:'32px',background:'rgba(255,255,255,0.1)',border:'none',
        color:'white',cursor:'pointer',borderRadius:'50%',
        width:'44px',height:'44px',display:'flex',alignItems:'center',justifyContent:'center',
      }}><X size={20}/></button>
      <button onClick={e=>{e.stopPropagation();setActiveImg(i=>(i-1+images.length)%images.length);}} style={{
        position:'absolute',left:'32px',background:'rgba(255,255,255,0.1)',border:'none',
        color:'white',cursor:'pointer',borderRadius:'50%',
        width:'52px',height:'52px',display:'flex',alignItems:'center',justifyContent:'center',
      }}><ChevronLeft size={24}/></button>
      <img
        src={images[activeImg]} alt=""
        onClick={e=>e.stopPropagation()}
        style={{maxWidth:'80vw',maxHeight:'90vh',objectFit:'contain',borderRadius:'12px'}}
      />
      <button onClick={e=>{e.stopPropagation();setActiveImg(i=>(i+1)%images.length);}} style={{
        position:'absolute',right:'32px',background:'rgba(255,255,255,0.1)',border:'none',
        color:'white',cursor:'pointer',borderRadius:'50%',
        width:'52px',height:'52px',display:'flex',alignItems:'center',justifyContent:'center',
      }}><ChevronRight size={24}/></button>
      <div style={{position:'absolute',bottom:'24px',display:'flex',gap:'8px'}}>
        {images.map((_,i)=>(
          <div key={i} onClick={e=>{e.stopPropagation();setActiveImg(i);}} style={{
            width:activeImg===i?'24px':'8px',height:'8px',borderRadius:'10px',
            background:activeImg===i?'white':'rgba(255,255,255,0.4)',cursor:'pointer',
            transition:'all 0.3s',
          }}/>
        ))}
      </div>
      {/* Thumbnail strip */}
      <div style={{
        position:'absolute',bottom:'60px',left:'50%',transform:'translateX(-50%)',
        display:'flex',gap:'8px',
      }}>
        {images.map((src,i)=>(
          <div key={i} onClick={e=>{e.stopPropagation();setActiveImg(i);}} style={{
            width:'56px',height:'68px',borderRadius:'8px',overflow:'hidden',cursor:'pointer',
            border:`2px solid ${activeImg===i?'white':'transparent'}`,
            opacity:activeImg===i?1:0.5,transition:'all 0.2s',
          }}>
            <img src={src} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── Main Render ── */
  return (
    <div style={{minHeight:'100vh',backgroundColor:'#f8f8f8',fontFamily:'"Outfit",sans-serif'}}>

      {/* Toast */}
      {toastMsg && (
        <div style={{
          position:'fixed',bottom:'32px',left:'50%',transform:'translateX(-50%)',
          background:'#111',color:'white',padding:'12px 24px',
          borderRadius:'30px',fontSize:'13px',fontWeight:'600',
          zIndex:9999,boxShadow:'0 8px 30px rgba(0,0,0,0.3)',
          animation:'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          pointerEvents:'none',
        }}>
          {toastMsg}
        </div>
      )}

      {/* Size Guide */}
      {sizeGuideOpen && <SizeGuideModal/>}

      {/* Sticky nav */}
      <div style={{
        position:'sticky',top:0,zIndex:100,
        background:'rgba(248,248,248,0.97)',backdropFilter:'blur(16px)',
        borderBottom:'1px solid #efefef',padding:'14px 40px',
        display:'flex',alignItems:'center',justifyContent:'space-between',
      }}>
        {/* Breadcrumb */}
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <button onClick={onBack} style={{
            display:'flex',alignItems:'center',gap:'8px',
            background:'white',border:'1px solid #e0e0e0',padding:'8px 18px',
            borderRadius:'10px',cursor:'pointer',fontSize:'11px',
            fontWeight:'700',color:'#333',letterSpacing:'1px',
            fontFamily:'"Outfit",sans-serif',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
          }}>
            ← BACK
          </button>
          <nav style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'11px',color:'#bbb'}}>
            <span style={{cursor:'pointer'}} onClick={onBack}>Women's</span>
            <span>/</span>
            <span style={{cursor:'pointer'}} onClick={onBack}>{p.category||'All'}</span>
            <span>/</span>
            <span style={{color:'#555',fontWeight:'500',maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
              {p.name}
            </span>
          </nav>
        </div>

        {/* Actions */}
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <button onClick={handleWish} style={{
            display:'flex',alignItems:'center',gap:'6px',background:'none',
            border:`1px solid ${isWished?'#e05a6a':'#e0e0e0'}`,padding:'8px 16px',
            borderRadius:'20px',cursor:'pointer',fontSize:'11px',fontWeight:'600',
            color:isWished?'#e05a6a':'#888',transition:'all 0.2s',
          }}>
            <Heart size={13} fill={isWished?'#e05a6a':'none'} color={isWished?'#e05a6a':'#888'}/>
            {isWished?'WISHLISTED':'WISHLIST'}
          </button>

          {/* Share */}
          <div style={{position:'relative'}} ref={shareRef}>
            <button onClick={()=>setShareOpen(o=>!o)} style={{
              display:'flex',alignItems:'center',gap:'6px',background:'none',
              border:'1px solid #e0e0e0',padding:'8px 16px',
              borderRadius:'20px',cursor:'pointer',fontSize:'11px',fontWeight:'600',
              color:'#888',transition:'all 0.2s',
            }}>
              <Share2 size={13}/>
              SHARE
            </button>
            {shareOpen && <SharePopup/>}
          </div>
        </div>
      </div>

      {/* Main 2-col */}
      <div style={{
        maxWidth:'1320px',margin:'0 auto',padding:'36px 40px 80px',
        display:'grid',gridTemplateColumns:'55% 1fr',gap:'56px',alignItems:'start',
      }}>

        {/* ══ LEFT: Image Viewer ══ */}
        <div style={{position:'sticky',top:'80px'}}>
          {/* View mode toggle */}
          <div style={{
            display:'flex',gap:'6px',marginBottom:'14px',
            background:'white',borderRadius:'12px',padding:'5px',
            border:'1px solid #efefef',width:'fit-content',
            boxShadow:'0 2px 8px rgba(0,0,0,0.05)',
          }}>
            {[{id:false,label:'📷 Gallery'},{id:true,label:'↻ 360° View'}].map(m=>(
              <button key={String(m.id)} onClick={()=>{setSpinMode(m.id);setAutoSpin(m.id);}} style={{
                padding:'7px 18px',border:'none',borderRadius:'9px',cursor:'pointer',
                background:spinMode===m.id?'#111':'transparent',
                color:spinMode===m.id?'white':'#777',
                fontSize:'11px',fontWeight:'700',letterSpacing:'0.5px',
                transition:'all 0.2s',fontFamily:'"Outfit",sans-serif',
              }}>{m.label}</button>
            ))}
          </div>

          <div style={{display:'flex',gap:'14px'}}>
            {/* Thumbnails */}
            {!spinMode && (
              <div style={{display:'flex',flexDirection:'column',gap:'8px',width:'72px',flexShrink:0}}>
                {images.map((src,idx)=>(
                  <div key={idx} onClick={()=>setActiveImg(idx)} style={{
                    width:'72px',height:'88px',borderRadius:'10px',overflow:'hidden',
                    border:activeImg===idx?'2.5px solid #111':'2px solid transparent',
                    cursor:'pointer',transition:'all 0.2s',
                    boxShadow:activeImg===idx?'0 4px 14px rgba(0,0,0,0.18)':'0 2px 6px rgba(0,0,0,0.06)',
                    transform:activeImg===idx?'scale(1.02)':'scale(1)',
                  }}>
                    <img src={src} alt="" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top'}}/>
                  </div>
                ))}
              </div>
            )}

            {/* Main image */}
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
                  position:'relative',borderRadius:'20px',overflow:'hidden',
                  background:'#f0f0f0',aspectRatio:'3/4',
                  cursor:spinMode?(isDragging?'grabbing':'grab'):(showZoom?'zoom-in':'pointer'),
                  userSelect:'none',
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

                {/* 360 overlay */}
                {spinMode && (
                  <div style={{
                    position:'absolute',inset:0,display:'flex',flexDirection:'column',
                    alignItems:'center',justifyContent:'flex-end',pointerEvents:'none',
                    paddingBottom:'20px',gap:'10px',
                  }}>
                    {!isDragging && (
                      <div style={{
                        background:'rgba(0,0,0,0.55)',backdropFilter:'blur(8px)',
                        color:'white',fontSize:'11px',fontWeight:'600',
                        padding:'7px 16px',borderRadius:'20px',letterSpacing:'1px',
                      }}>
                        ↔ DRAG TO ROTATE
                      </div>
                    )}
                    <div style={{display:'flex',gap:'3px'}}>
                      {images.map((_,i)=>(
                        <div key={i} style={{
                          width:spinImgIdx===i?'20px':'5px',height:'5px',borderRadius:'10px',
                          background:spinImgIdx===i?'white':'rgba(255,255,255,0.4)',
                          transition:'all 0.2s',
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
                      position:'absolute',top:'14px',right:'14px',
                      background:autoSpin?'#111':'rgba(255,255,255,0.9)',
                      color:autoSpin?'white':'#333',
                      border:'none',borderRadius:'20px',padding:'6px 14px',
                      fontSize:'10px',fontWeight:'700',cursor:'pointer',
                      letterSpacing:'1px',boxShadow:'0 2px 10px rgba(0,0,0,0.15)',
                    }}
                  >
                    {autoSpin?'⏸ PAUSE':'▶ AUTO'}
                  </button>
                )}

                {/* Zoom lens */}
                {showZoom && zoomPos && !spinMode && (
                  <div style={{
                    position:'absolute',
                    width:'140px',height:'140px',borderRadius:'50%',
                    border:'2.5px solid rgba(255,255,255,0.9)',
                    boxShadow:'0 8px 32px rgba(0,0,0,0.35)',
                    left:`calc(${zoomPos.x}% - 70px)`,
                    top:`calc(${zoomPos.y}% - 70px)`,
                    backgroundImage:`url(${images[activeImg]})`,
                    backgroundSize:'350%',
                    backgroundPosition:`${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundRepeat:'no-repeat',
                    pointerEvents:'none',zIndex:5,
                  }}/>
                )}

                {/* Nav arrows */}
                {!spinMode && images.length>1 && (
                  <>
                    <button onClick={e=>{e.stopPropagation();setActiveImg(i=>(i-1+images.length)%images.length);}} style={{
                      position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',
                      background:'rgba(255,255,255,0.9)',border:'none',borderRadius:'50%',
                      width:'38px',height:'38px',cursor:'pointer',zIndex:4,
                      display:'flex',alignItems:'center',justifyContent:'center',
                      boxShadow:'0 2px 12px rgba(0,0,0,0.15)',
                    }}><ChevronLeft size={18}/></button>
                    <button onClick={e=>{e.stopPropagation();setActiveImg(i=>(i+1)%images.length);}} style={{
                      position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',
                      background:'rgba(255,255,255,0.9)',border:'none',borderRadius:'50%',
                      width:'38px',height:'38px',cursor:'pointer',zIndex:4,
                      display:'flex',alignItems:'center',justifyContent:'center',
                      boxShadow:'0 2px 12px rgba(0,0,0,0.15)',
                    }}><ChevronRight size={18}/></button>
                  </>
                )}

                {/* Badges */}
                <div style={{position:'absolute',top:'16px',left:'16px',display:'flex',flexDirection:'column',gap:'6px',zIndex:3,pointerEvents:'none'}}>
                  {discount>0&&<span style={{background:'#e05a6a',color:'white',fontSize:'10px',fontWeight:'700',padding:'4px 10px',borderRadius:'20px'}}>-{discount}% OFF</span>}
                  <span style={{background:'#111',color:'white',fontSize:'10px',fontWeight:'700',padding:'4px 10px',borderRadius:'20px'}}>NEW</span>
                </div>

                {/* Expand + counter */}
                {!spinMode && (
                  <>
                    <div style={{
                      position:'absolute',bottom:'14px',right:'14px',zIndex:4,
                      background:'rgba(255,255,255,0.9)',borderRadius:'8px',padding:'6px 10px',
                      cursor:'pointer',boxShadow:'0 2px 8px rgba(0,0,0,0.12)',
                      display:'flex',alignItems:'center',gap:'5px',
                    }}>
                      <ZoomIn size={14} color="#555"/>
                    </div>
                    <div style={{
                      position:'absolute',bottom:'14px',left:'14px',zIndex:4,
                      background:'rgba(0,0,0,0.5)',color:'white',
                      fontSize:'10px',fontWeight:'600',padding:'4px 10px',
                      borderRadius:'20px',backdropFilter:'blur(4px)',letterSpacing:'1px',
                    }}>
                      {activeImg+1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              <p style={{textAlign:'center',fontSize:'10px',color:'#ccc',marginTop:'8px',letterSpacing:'1px'}}>
                {spinMode ? '360° · DRAG TO ROTATE · CLICK AUTO TO SPIN' : 'CLICK TO EXPAND · HOVER TO ZOOM'}
              </p>
            </div>
          </div>
        </div>

        {/* ══ RIGHT: Product Info ══ */}
        <div style={{paddingTop:'4px'}}>

          {/* Category */}
          <span style={{fontSize:'10px',color:'#bbb',letterSpacing:'3px',fontWeight:'600'}}>
            {(p.category||'WOMEN').toUpperCase()}
          </span>

          {/* Name */}
          <h1 style={{
            fontSize:'30px',fontWeight:'400',color:'#111',
            fontFamily:'"Playfair Display",Georgia,serif',
            margin:'6px 0 12px',lineHeight:'1.3',
          }}>{p.name}</h1>

          {/* Rating summary row */}
          <div
            onClick={()=>setShowReviews(r=>!r)}
            style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'20px',cursor:'pointer'}}
          >
            <div style={{display:'flex',gap:'2px'}}>
              {[1,2,3,4,5].map(s=>(
                <Star key={s} size={14}
                  fill={s<=Math.round(avgRating)?'#f5c842':'none'}
                  color={s<=Math.round(avgRating)?'#f5c842':'#ddd'}
                />
              ))}
            </div>
            <span style={{fontSize:'13px',fontWeight:'700',color:'#111'}}>{avgRating}</span>
            <span style={{fontSize:'12px',color:'#aaa'}}>({MOCK_REVIEWS.length} reviews)</span>
            <span style={{fontSize:'11px',color:'#5b8ed6',textDecoration:'underline'}}>
              {showReviews?'Hide':'See all'} ↓
            </span>
          </div>

          {/* ── Reviews Section ── */}
          {showReviews && (
            <div style={{
              background:'white',borderRadius:'16px',padding:'20px',
              marginBottom:'24px',border:'1px solid #f0f0f0',
            }}>
              {/* Rating breakdown */}
              <div style={{display:'flex',gap:'20px',marginBottom:'20px',paddingBottom:'20px',borderBottom:'1px solid #f5f5f5'}}>
                <div style={{textAlign:'center',flexShrink:0}}>
                  <div style={{fontSize:'40px',fontWeight:'700',color:'#111',lineHeight:1}}>{avgRating}</div>
                  <div style={{display:'flex',gap:'2px',justifyContent:'center',margin:'6px 0'}}>
                    {[1,2,3,4,5].map(s=>(
                      <Star key={s} size={12} fill={s<=Math.round(avgRating)?'#f5c842':'none'} color={s<=Math.round(avgRating)?'#f5c842':'#ddd'}/>
                    ))}
                  </div>
                  <div style={{fontSize:'10px',color:'#aaa'}}>{MOCK_REVIEWS.length} reviews</div>
                </div>
                <div style={{flex:1}}>
                  {ratingCounts.map(({star,count})=>(
                    <div key={star} style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'5px'}}>
                      <span style={{fontSize:'10px',color:'#888',width:'12px',textAlign:'right'}}>{star}</span>
                      <Star size={10} fill="#f5c842" color="#f5c842"/>
                      <div style={{flex:1,height:'6px',background:'#f0f0f0',borderRadius:'3px',overflow:'hidden'}}>
                        <div style={{
                          height:'100%',borderRadius:'3px',background:'#f5c842',
                          width:`${(count/MOCK_REVIEWS.length)*100}%`,
                          transition:'width 0.6s ease',
                        }}/>
                      </div>
                      <span style={{fontSize:'10px',color:'#aaa',width:'14px'}}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sort + Write Review */}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                <select
                  value={reviewSort}
                  onChange={e=>setReviewSort(e.target.value)}
                  style={{
                    fontSize:'11px',border:'1px solid #e0e0e0',borderRadius:'8px',
                    padding:'6px 12px',background:'white',color:'#555',
                    fontFamily:'"Outfit",sans-serif',outline:'none',cursor:'pointer',
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
                    fontSize:'11px',fontWeight:'700',letterSpacing:'1px',
                    background:writeReview?'#111':'white',
                    color:writeReview?'white':'#111',
                    border:'1px solid #111',padding:'7px 16px',borderRadius:'8px',
                    cursor:'pointer',fontFamily:'"Outfit",sans-serif',
                  }}
                >
                  {writeReview?'CANCEL':'+ WRITE REVIEW'}
                </button>
              </div>

              {/* Write review form */}
              {writeReview && !reviewSubmitted && (
                <div style={{
                  background:'#f8f8f8',borderRadius:'12px',padding:'16px',
                  marginBottom:'16px',border:'1px solid #efefef',
                }}>
                  <p style={{fontSize:'12px',fontWeight:'700',color:'#111',margin:'0 0 12px'}}>Your Rating</p>
                  <div style={{display:'flex',gap:'6px',marginBottom:'14px'}}>
                    {[1,2,3,4,5].map(s=>(
                      <button
                        key={s}
                        onMouseEnter={()=>setMyRatingHover(s)}
                        onMouseLeave={()=>setMyRatingHover(0)}
                        onClick={()=>setMyRating(s)}
                        style={{background:'none',border:'none',cursor:'pointer',padding:'2px'}}
                      >
                        <Star size={24}
                          fill={s<=(myRatingHover||myRating)?'#f5c842':'none'}
                          color={s<=(myRatingHover||myRating)?'#f5c842':'#ddd'}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={myReviewText}
                    onChange={e=>setMyReviewText(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    style={{
                      width:'100%',boxSizing:'border-box',
                      padding:'10px 12px',border:'1px solid #e0e0e0',borderRadius:'8px',
                      fontSize:'12px',fontFamily:'"Outfit",sans-serif',
                      resize:'vertical',minHeight:'80px',outline:'none',
                      color:'#333',
                    }}
                  />
                  <button
                    onClick={()=>{if(myRating&&myReviewText){setReviewSubmitted(true);}}}
                    style={{
                      marginTop:'10px',padding:'10px 24px',
                      background:myRating&&myReviewText?'#111':'#ccc',
                      color:'white',border:'none',borderRadius:'8px',
                      cursor:myRating&&myReviewText?'pointer':'not-allowed',
                      fontSize:'11px',fontWeight:'700',letterSpacing:'1px',
                      fontFamily:'"Outfit",sans-serif',
                    }}
                  >
                    SUBMIT REVIEW
                  </button>
                </div>
              )}
              {reviewSubmitted && (
                <div style={{
                  background:'#edf7f2',borderRadius:'12px',padding:'14px',
                  marginBottom:'16px',border:'1px solid #c8eddb',
                  display:'flex',alignItems:'center',gap:'10px',
                }}>
                  <Check size={18} color="#4caf87"/>
                  <span style={{fontSize:'13px',color:'#4caf87',fontWeight:'600'}}>Thank you! Your review has been submitted.</span>
                </div>
              )}

              {/* Review list */}
              {sortedReviews.map((r,i)=>(
                <div key={i} style={{
                  padding:'14px 0',
                  borderBottom:i<sortedReviews.length-1?'1px solid #f5f5f5':'none',
                }}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px'}}>
                    <div>
                      <div style={{display:'flex',gap:'3px',marginBottom:'4px'}}>
                        {[1,2,3,4,5].map(s=>(
                          <Star key={s} size={12}
                            fill={s<=r.rating?'#f5c842':'none'}
                            color={s<=r.rating?'#f5c842':'#ddd'}
                          />
                        ))}
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                        <span style={{fontSize:'12px',fontWeight:'600',color:'#333'}}>{r.name}</span>
                        {r.verified && (
                          <span style={{fontSize:'9px',color:'#4caf87',background:'#edf7f2',padding:'2px 7px',borderRadius:'20px',fontWeight:'600',display:'flex',alignItems:'center',gap:'3px'}}>
                            <Check size={8}/> VERIFIED
                          </span>
                        )}
                      </div>
                    </div>
                    <span style={{fontSize:'10px',color:'#ccc'}}>{r.date}</span>
                  </div>
                  <p style={{fontSize:'12px',color:'#777',margin:'0 0 10px',lineHeight:'1.7'}}>{r.text}</p>
                  <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    <span style={{fontSize:'10px',color:'#bbb'}}>Was this helpful?</span>
                    <button
                      onClick={()=>handleHelpful(i)}
                      style={{
                        background:helpfulVotes[i]?'#edf7f2':'#f5f5f5',
                        color:helpfulVotes[i]?'#4caf87':'#888',
                        border:'none',borderRadius:'20px',padding:'3px 10px',
                        fontSize:'10px',fontWeight:'600',cursor:helpfulVotes[i]?'default':'pointer',
                        fontFamily:'"Outfit",sans-serif',
                      }}
                    >
                      👍 Yes ({r.helpful + (helpfulVotes[i]?1:0)})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Price card */}
          <div style={{
            background:'linear-gradient(135deg,#ffffff,#f8f8f8)',
            border:'1px solid #efefef',borderRadius:'16px',
            padding:'18px 22px',marginBottom:'24px',
            boxShadow:'0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <div style={{display:'flex',alignItems:'baseline',gap:'12px',flexWrap:'wrap'}}>
              <span style={{fontSize:'32px',fontWeight:'700',color:'#111',lineHeight:1}}>
                LKR {fmt(p.price_lkr * qty)}
              </span>
              {discount>0&&(
                <span style={{fontSize:'17px',color:'#ccc',textDecoration:'line-through'}}>
                  LKR {fmt(p.original_price * qty)}
                </span>
              )}
              {discount>0&&(
                <span style={{fontSize:'12px',fontWeight:'700',color:'#4caf87',background:'#edf7f2',padding:'4px 12px',borderRadius:'20px'}}>
                  -{discount}% OFF
                </span>
              )}
            </div>
            {savings>0&&(
              <p style={{margin:'8px 0 0',fontSize:'13px',color:'#4caf87',fontWeight:'600'}}>
                🎉 You save LKR {fmt(savings)}!
              </p>
            )}
            <div style={{
              marginTop:'12px',display:'flex',alignItems:'center',gap:'8px',
              fontSize:'11px',color:'#e07a40',fontWeight:'600',
            }}>
              <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#e07a40',flexShrink:0,animation:'pulse 1.5s infinite'}}/>
              Only 5 left in stock — order soon!
            </div>
          </div>

          {/* Color selector */}
          <div style={{marginBottom:'20px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}>
              <span style={{fontSize:'11px',fontWeight:'700',letterSpacing:'2px',color:'#111'}}>
                COLOUR
                {selectedColor && <span style={{fontWeight:'400',letterSpacing:'0'}}> — {selectedColor}</span>}
              </span>
            </div>
            <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
              {COLORS_DATA.map(({name,hex,border})=>{
                const sel = selectedColor===name;
                return (
                  <div
                    key={name}
                    title={name}
                    onClick={()=>setSelectedColor(name)}
                    style={{
                      width:'32px',height:'32px',borderRadius:'50%',background:hex,
                      cursor:'pointer',
                      outline:sel?'2.5px solid #111':'2.5px solid transparent',
                      outlineOffset:'3px',
                      border:`1.5px solid ${border||'transparent'}`,
                      boxShadow:'0 2px 6px rgba(0,0,0,0.15)',
                      transform:sel?'scale(1.18)':'scale(1)',
                      transition:'all 0.18s',
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Size selector */}
          <div style={{marginBottom:'24px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
              <span style={{fontSize:'11px',fontWeight:'700',letterSpacing:'2px',color:'#111'}}>
                SIZE {selectedSize&&`— ${selectedSize}`}
              </span>
              <button
                onClick={()=>setSizeGuideOpen(true)}
                style={{
                  fontSize:'11px',color:'#5b8ed6',cursor:'pointer',
                  textDecoration:'underline',background:'none',border:'none',
                  fontFamily:'"Outfit",sans-serif',
                }}
              >
                Size Guide ↗
              </button>
            </div>
            <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
              {ALL_SIZES.map(sz=>{
                const sel = selectedSize===sz;
                return (
                  <button key={sz} onClick={()=>setSelectedSize(sz)} style={{
                    minWidth:'54px',height:'54px',padding:'0 10px',
                    border:sel?'2px solid #111':'1.5px solid #e0e0e0',
                    background:sel?'#111':'white',
                    color:sel?'white':'#555',
                    borderRadius:'12px',cursor:'pointer',
                    fontSize:'12px',fontWeight:'700',
                    transition:'all 0.18s',fontFamily:'"Outfit",sans-serif',
                    boxShadow:sel?'0 4px 14px rgba(0,0,0,0.2)':'0 1px 4px rgba(0,0,0,0.04)',
                    transform:sel?'scale(1.04)':'scale(1)',
                  }}>{sz}</button>
                );
              })}
            </div>
            {!selectedSize && (
              <p style={{fontSize:'11px',color:'#e05a6a',margin:'8px 0 0'}}>
                ⚠ Please select a size to continue
              </p>
            )}
          </div>

          {/* Qty + Add to bag */}
          <div style={{display:'flex',gap:'12px',marginBottom:'12px'}}>
            <div style={{
              display:'flex',alignItems:'center',
              border:'1.5px solid #e0e0e0',borderRadius:'12px',
              overflow:'hidden',background:'white',
              boxShadow:'0 1px 4px rgba(0,0,0,0.05)',
            }}>
              <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{
                width:'46px',height:'54px',border:'none',background:'white',
                cursor:'pointer',fontSize:'20px',color:'#444',
              }}>−</button>
              <span style={{width:'46px',textAlign:'center',fontSize:'16px',fontWeight:'700',color:'#111'}}>{qty}</span>
              <button onClick={()=>setQty(q=>Math.min(10,q+1))} style={{
                width:'46px',height:'54px',border:'none',background:'white',
                cursor:'pointer',fontSize:'20px',color:'#444',
              }}>+</button>
            </div>
            <button
              onClick={handleAddToCartWithValidation}
              style={{
                flex:1,height:'54px',
                background:inCart?'#4caf87':'#111',
                color:'white',border:'none',borderRadius:'12px',
                fontSize:'12px',fontWeight:'700',letterSpacing:'2px',cursor:'pointer',
                transition:'all 0.25s',
                display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',
                boxShadow:inCart?'0 6px 20px rgba(76,175,135,0.4)':'0 6px 20px rgba(0,0,0,0.2)',
                transform:inCart?'scale(0.98)':'scale(1)',
              }}
            >
              <ShoppingBag size={16}/>
              {inCart?'ADDED TO BAG ✓':'ADD TO BAG'}
            </button>
          </div>

          {/* Buy now */}
          <button style={{
            width:'100%',height:'54px',
            background:'white',color:'#111',
            border:'2px solid #111',borderRadius:'12px',
            fontSize:'12px',fontWeight:'700',letterSpacing:'2px',
            cursor:'pointer',marginBottom:'28px',
            fontFamily:'"Outfit",sans-serif',
          }}>⚡ BUY NOW</button>

          {/* Notify me */}
          <div style={{
            background:'#fffbea',border:'1px solid #f5e4a0',borderRadius:'14px',
            padding:'16px 18px',marginBottom:'24px',
          }}>
            <p style={{fontSize:'12px',fontWeight:'700',color:'#8a6d00',margin:'0 0 10px',letterSpacing:'0.5px'}}>
              🔔 Notify me when back in stock
            </p>
            <div style={{display:'flex',gap:'8px'}}>
              <input
                value={notifyEmail}
                onChange={e=>setNotifyEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  flex:1,padding:'9px 14px',border:'1px solid #f0d060',borderRadius:'9px',
                  fontSize:'12px',outline:'none',background:'white',fontFamily:'"Outfit",sans-serif',
                }}
              />
              <button
                onClick={()=>{if(notifyEmail)setNotifySent(true);}}
                style={{
                  padding:'9px 18px',background:notifySent?'#4caf87':'#8a6d00',
                  color:'white',border:'none',borderRadius:'9px',cursor:'pointer',
                  fontSize:'11px',fontWeight:'700',fontFamily:'"Outfit",sans-serif',
                  whiteSpace:'nowrap',
                }}
              >
                {notifySent?'✓ Sent!':'NOTIFY ME'}
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'28px'}}>
            {[
              [<Truck size={18}/>,    'Free Delivery',   'Orders LKR 3,000+'],
              [<RefreshCw size={18}/>, 'Easy Returns',    '14-day hassle-free'],
              [<Shield size={18}/>,   '100% Authentic',  'Quality guaranteed'],
            ].map(([icon,title,sub])=>(
              <div key={title} style={{
                textAlign:'center',padding:'14px 8px',
                background:'white',borderRadius:'12px',border:'1px solid #f0f0f0',
                boxShadow:'0 2px 6px rgba(0,0,0,0.04)',
              }}>
                <div style={{display:'flex',justifyContent:'center',color:'#888',marginBottom:'6px'}}>{icon}</div>
                <div style={{fontSize:'10px',fontWeight:'700',color:'#222',letterSpacing:'0.5px'}}>{title}</div>
                <div style={{fontSize:'9px',color:'#aaa',marginTop:'3px'}}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Info tabs */}
          <div style={{background:'white',borderRadius:'16px',overflow:'hidden',border:'1px solid #f0f0f0',boxShadow:'0 2px 10px rgba(0,0,0,0.04)'}}>
            <div style={{display:'flex',borderBottom:'1px solid #f0f0f0',overflowX:'auto'}}>
              {TABS.map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} style={{
                  padding:'13px 18px',border:'none',background:'none',cursor:'pointer',
                  fontSize:'10px',fontWeight:'700',letterSpacing:'1.5px',
                  color:tab===t.id?'#111':'#bbb',
                  borderBottom:tab===t.id?'2.5px solid #111':'2.5px solid transparent',
                  transition:'all 0.2s',fontFamily:'"Outfit",sans-serif',whiteSpace:'nowrap',
                }}>{t.label.toUpperCase()}</button>
              ))}
            </div>
            <div style={{padding:'20px 22px',fontSize:'13px',color:'#777',lineHeight:'1.9',whiteSpace:'pre-line'}}>
              {TAB_CONTENT[tab]}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div style={{background:'white',padding:'48px 40px',borderTop:'1px solid #f0f0f0'}}>
          <div style={{maxWidth:'1320px',margin:'0 auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:'28px'}}>
              <h2 style={{
                fontSize:'24px',fontWeight:'400',color:'#111',
                fontFamily:'"Playfair Display",Georgia,serif',margin:0,
              }}>You May Also Like</h2>
              <span style={{fontSize:'11px',color:'#5b8ed6',cursor:'pointer',letterSpacing:'1px'}}>
                VIEW ALL →
              </span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'20px'}}>
              {related.map(r=>{
                const rImg  = r.images_array?.[0]||`https://via.placeholder.com/300x360/f8f8f8/aaa?text=${encodeURIComponent(r.name||'Product')}`;
                const rDisc = r.original_price&&r.original_price>r.price_lkr?Math.round((1-r.price_lkr/r.original_price)*100):0;
                return (
                  <div key={r.id} style={{
                    background:'#f8f8f8',borderRadius:'16px',overflow:'hidden',
                    cursor:'pointer',transition:'all 0.3s',
                    boxShadow:'0 2px 8px rgba(0,0,0,0.05)',
                  }}>
                    <div style={{height:'240px',overflow:'hidden',background:'#f0f0f0',position:'relative'}}>
                      <img src={rImg} alt={r.name} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top'}}/>
                      {rDisc>0&&<span style={{position:'absolute',top:'10px',left:'10px',background:'#e05a6a',color:'white',fontSize:'9px',fontWeight:'700',padding:'3px 8px',borderRadius:'20px'}}>-{rDisc}%</span>}
                    </div>
                    <div style={{padding:'14px 16px'}}>
                      <span style={{fontSize:'9px',color:'#bbb',letterSpacing:'2px'}}>{(r.category||'').toUpperCase()}</span>
                      <p style={{fontSize:'13px',fontWeight:'500',color:'#111',margin:'4px 0 6px',lineHeight:'1.4'}}>{r.name}</p>
                      <span style={{fontSize:'14px',fontWeight:'700',color:'#111'}}>LKR {fmt(r.price_lkr)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
      `}</style>
    </div>
  );
}