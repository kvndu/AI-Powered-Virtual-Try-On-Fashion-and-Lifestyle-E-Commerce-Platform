import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product, dark = false }) {
  const { addItem } = useCart();
  const { user, profile, updateProfile } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(
    () => (profile?.wishlist || []).includes(product.id)
  );
  const [hovered, setHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem({
      ...product,
      size: 'M',
      color: 'Black',
      quantity: 1
    });
    toast.success(`Added to bag!`, {
      style: {
        background: '#000',
        color: '#fff',
        border: '2px solid #000',
        borderRadius: 0,
        fontFamily: 'var(--font-body)',
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '0.06em',
        boxShadow: '3px 3px 0px var(--secondary)',
      },
    });
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to wishlist items'); return; }
    const prev = profile?.wishlist || [];
    const next = isWishlisted ? prev.filter(id => id !== product.id) : [...prev, product.id];
    setIsWishlisted(!isWishlisted);
    try {
      await updateProfile({ wishlist: next });
    } catch {
      setIsWishlisted(isWishlisted);
    }
  };

  const discount = product.original_price
  ? Math.round(
      (1 - product.price_lkr / product.original_price) * 100
    )
  : 0;

  const rating = product.rating || 4.5;
  const fullStars = Math.floor(rating);

  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card"
      style={{
        display: 'block', textDecoration: 'none',
        ...(dark ? {
          background: '#1a1a1a',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'none',
        } : {})
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="product-card-img">
        <img
  src={product.images_array?.[0]}
  alt={product.name}
  loading="lazy"
/>

        {/* Badges */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {product.is_new && (
            <span style={{
              background: '#000',
              color: '#fff',
              padding: '3px 8px',
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              display: 'inline-block',
            }}>
              NEW
            </span>
          )}
          {discount > 0 && (
            <span style={{
              background: '#f5af19',
              color: '#000',
              padding: '3px 8px',
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              border: '1.5px solid #000',
              display: 'inline-block',
            }}>
              −{discount}%
            </span>
          )}
          {product.is_featured && (
            <span style={{
              background: '#fff',
              color: '#000',
              padding: '3px 8px',
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              border: '1.5px solid #000',
              display: 'inline-block',
            }}>
              Featured
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 34, height: 34,
            background: '#fff',
            border: '2px solid #000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s',
            boxShadow: isWishlisted ? '2px 2px 0 var(--secondary)' : 'none',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f4f1eb'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        >
          <Heart
            size={14}
            color="#000"
            fill={isWishlisted ? '#f5af19' : 'none'}
          />
        </button>

        {/* Hover overlay — Quick add + View */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          transform: hovered ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <button
            onClick={handleAddToCart}
            style={{
              width: '100%',
              padding: '12px',
              background: '#000',
              border: 'none',
              color: '#fff',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'var(--font-body)',
              borderTop: '2px solid #000',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
            onMouseLeave={e => e.currentTarget.style.background = '#000'}
          >
            <ShoppingBag size={13} /> Add to Bag
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="product-card-body" style={dark ? { background: '#1a1a1a', borderTop: '1px solid rgba(255,255,255,0.07)' } : {}}>
        <div className="product-category" style={dark ? { color: '#C9A96E' } : {}}>
          {product.subcategory}
        </div>
        <div className="product-title" style={{ marginBottom: 6, ...(dark ? { color: '#fff' } : {}) }}>{product.name}</div>

        {/* Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                fill={i < fullStars ? '#C9A96E' : 'none'}
                color={i < fullStars ? '#C9A96E' : (dark ? 'rgba(255,255,255,0.2)' : 'var(--border-medium)')}
              />
            ))}
          </div>
          <span style={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.4)' : 'var(--text-muted)', fontWeight: 500 }}>
            ({product.reviews_count || 0})
          </span>
        </div>

        {/* Price */}
        <div className="price-wrap">
          <span className="price" style={dark ? { color: '#C9A96E' } : {}}>
            LKR {Number(product.price_lkr || 0).toLocaleString()}
          </span>
          {product.original_price && (
            <span className="price-original" style={dark ? { color: 'rgba(255,255,255,0.3)' } : {}}>
              LKR {Number(product.original_price).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
