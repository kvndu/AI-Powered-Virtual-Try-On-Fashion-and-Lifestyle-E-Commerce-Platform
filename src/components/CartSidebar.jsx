import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const fmt = (n) => parseInt(n).toLocaleString('en-LK');

export default function CartSidebar({ isOpen, onClose }) {
  const { items, total, itemCount, updateQty, removeItem } = useCart();
  const navigate = useNavigate();
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Sync applied coupon from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ba_applied_coupon');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAppliedCoupon(parsed.code);
        setDiscountPercent(parsed.discount);
      } catch (e) {
        console.error(e);
      }
    } else {
      setAppliedCoupon('');
      setDiscountPercent(0);
    }
  }, [isOpen]);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    
    // Load admin coupons list
    const couponsString = localStorage.getItem('ba_admin_coupons');
    const coupons = couponsString ? JSON.parse(couponsString) : [
      { code: 'SUMMER20', discount: '20%', status: 'Active' },
      { code: 'WELCOME10', discount: '10%', status: 'Active' }
    ];

    const matched = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.status === 'Active');
    if (matched) {
      const pct = parseInt(matched.discount) || 0;
      setDiscountPercent(pct);
      setAppliedCoupon(matched.code.toUpperCase());
      localStorage.setItem('ba_applied_coupon', JSON.stringify({ code: matched.code.toUpperCase(), discount: pct }));
      toast.success(`Coupon ${matched.code} applied! ${pct}% discount.`, {
        style: { background: '#000', color: '#fff', fontSize: '12px' }
      });
    } else {
      toast.error('Invalid or expired coupon code.', {
        style: { background: '#000', color: '#fff', fontSize: '12px' }
      });
    }
    setCouponCode('');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="drawer" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'white' }}>
        <div className="drawer-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Cart Header */}
          <header className="drawer-header" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '24px 28px', borderBottom: '1px solid #e4e4e7', background: '#ffffff'
          }}>
            <div>
              <p className="drawer-label" style={{
                fontSize: '11px', letterSpacing: '0.24em', textTransform: 'uppercase',
                color: '#71717a', margin: 0, fontWeight: 700
              }}>
                YOUR CART • {itemCount}
              </p>
            </div>
            <button className="drawer-close" onClick={onClose} aria-label="Close cart" style={{
              background: 'transparent', border: 'none', color: '#000000', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px'
            }}>
              <X size={20} />
            </button>
          </header>

          {items.length === 0 ? (
            /* Empty Cart State */
            <div className="drawer-empty" style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center', padding: '40px 28px',
              textAlign: 'center', background: '#ffffff'
            }}>
              <div className="empty-hero" style={{
                display: 'flex', flexDirection: 'column', gap: '24px',
                width: '100%', maxWidth: '320px', alignItems: 'center'
              }}>
                <h2 style={{
                  fontSize: '28px', fontWeight: '900', letterSpacing: '-0.03em',
                  fontFamily: 'var(--font-display)', color: '#000000', margin: 0
                }}>
                  YOUR CART IS EMPTY!
                </h2>
                <p className="empty-copy" style={{
                  color: '#71717a', fontSize: '15px', lineHeight: '1.8', margin: 0
                }}>
                  Add your favorite items to your cart.
                </p>
                <Link to="/products" className="btn btn-primary btn-lg empty-action" onClick={onClose} style={{
                  width: '100%', background: '#000000', color: '#ffffff', border: '2px solid #000000',
                  padding: '14px 28px', fontWeight: '700', fontSize: '13px', letterSpacing: '0.06em',
                  textTransform: 'uppercase', cursor: 'pointer', display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center', textDecoration: 'none'
                }}>
                  SHOP NOW
                </Link>
              </div>
            </div>
          ) : (
            /* Cart With Products State */
            <>
              {/* Product List & Order info (Scrollable Content) */}
              <div className="drawer-content" style={{
                flex: 1, overflowY: 'auto', padding: '24px 28px 0',
                display: 'flex', flexDirection: 'column', gap: '24px',
                background: '#ffffff'
              }}>
                
                {/* Product List */}
                <section className="drawer-section drawer-items" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {items.map((item) => (
                    <article key={item.id} className="drawer-item" style={{
                      display: 'grid', gridTemplateColumns: '90px 1fr', gap: '18px',
                      padding: '18px 0', borderBottom: '1px solid #f4f4f5', position: 'relative',
                      background: 'none', border: 'none'
                    }}>
                      {/* Product Image */}
                      <div className="drawer-item-image" style={{
                        width: '90px', height: '115px', overflow: 'hidden', background: '#f4f4f5',
                        border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '0'
                      }}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <ShoppingBag size={24} color="#a1a1aa" />
                        )}
                      </div>

                      {/* Product Details & Variant */}
                      <div className="drawer-item-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingRight: '24px' }}>
                        <div className="drawer-item-meta">
                          <h3 style={{
                            fontSize: '14px', fontWeight: '700', color: '#111111',
                            margin: '0 0 4px', lineHeight: '1.45', fontFamily: 'var(--font-body)'
                          }}>
                            {item.name}
                          </h3>
                          <span style={{ fontSize: '12px', color: '#71717a', fontWeight: '500' }}>
                            Size: {item.size || 'M'} {item.color && item.color !== 'Default' && ` / ${item.color}`}
                          </span>
                        </div>

                        {/* Quantity controls & Price */}
                        <div className="drawer-item-controls" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                          <div className="qty-group" style={{
                            display: 'inline-flex', alignItems: 'center', border: '1px solid #d4d4d8',
                            background: '#ffffff', borderRadius: '0'
                          }}>
                            <button
                              onClick={() => updateQty(item.id, item.quantity - 1)}
                              style={{
                                width: '32px', height: '32px', border: 'none', background: 'transparent',
                                color: '#111111', display: 'inline-flex', alignItems: 'center',
                                justifyContent: 'center', cursor: 'pointer'
                              }}
                            >
                              <Minus size={11} />
                            </button>
                            <span style={{ minWidth: '28px', textAlign: 'center', fontWeight: '700', fontSize: '13px' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, item.quantity + 1)}
                              style={{
                                width: '32px', height: '32px', border: 'none', background: 'transparent',
                                color: '#111111', display: 'inline-flex', alignItems: 'center',
                                justifyContent: 'center', cursor: 'pointer'
                              }}
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                          <p className="drawer-item-price" style={{ fontSize: '14px', fontWeight: '800', color: '#111111', margin: 0 }}>
                            LKR {fmt(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        className="drawer-item-remove"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                        style={{
                          position: 'absolute', top: '16px', right: '0',
                          background: 'transparent', border: 'none', color: '#a1a1aa',
                          cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center'
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={e => e.currentTarget.style.color = '#a1a1aa'}
                      >
                        <Trash2 size={14} />
                      </button>
                    </article>
                  ))}
                </section>

                {/* Order Information Section */}
                <section className="drawer-section drawer-order-info" style={{ display: 'flex', flexDirection: 'column', gap: '18px', borderTop: '1px solid #f4f4f5', paddingTop: '20px', paddingBottom: '20px' }}>
                  <div className="drawer-info-card" style={{ padding: '0', border: 'none', background: '#ffffff' }}>
                    <p className="info-title" style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#111111', marginBottom: '8px' }}>
                      Contact information for COD orders
                    </p>
                    <textarea
                      className="input drawer-textarea"
                      rows="3"
                      value={phoneNumbers}
                      onChange={(event) => setPhoneNumbers(event.target.value)}
                      placeholder="Add two or more mobile numbers"
                      style={{
                        width: '100%', padding: '10px 12px', border: '1px solid #d4d4d8',
                        fontSize: '13px', fontFamily: 'var(--font-body)', resize: 'none', minHeight: '80px',
                        outline: 'none', boxSizing: 'border-box', borderRadius: '0'
                      }}
                    />
                  </div>

                  <div className="drawer-info-card coupon-card" style={{ padding: '0', border: 'none', background: '#ffffff' }}>
                    <label htmlFor="coupon" className="info-title" style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#111111', display: 'block', marginBottom: '8px' }}>
                      Discount code
                    </label>
                    <div className="coupon-row" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
                      <input
                        id="coupon"
                        className="input"
                        type="text"
                        value={couponCode}
                        onChange={(event) => setCouponCode(event.target.value)}
                        placeholder="Enter coupon code"
                        style={{
                          width: '100%', padding: '10px 12px', border: '1px solid #d4d4d8',
                          fontSize: '13px', fontFamily: 'var(--font-body)', outline: 'none', borderRadius: '0'
                        }}
                      />
                      <button
                        className="btn btn-outline coupon-apply"
                        onClick={handleApplyCoupon}
                        style={{
                          background: 'transparent', border: '2px solid #000000', color: '#000000',
                          padding: '10px 20px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em',
                          textTransform: 'uppercase', cursor: 'pointer', borderRadius: '0'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#000000'; e.currentTarget.style.color = '#ffffff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000000'; }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              {/* Checkout Summary Footer */}
              <footer className="drawer-footer" style={{
                padding: '24px 28px 28px', borderTop: '1px solid #e4e4e7',
                background: '#ffffff', display: 'grid', gap: '16px'
              }}>
                <div className="drawer-summary" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#111111', fontSize: '14px' }}>
                    <span style={{ fontWeight: '500' }}>Subtotal</span>
                    <strong style={{ fontSize: '18px', fontWeight: '900' }}>LKR {fmt(total)}</strong>
                  </div>
                  {discountPercent > 0 && (
                    <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#dc2626', fontSize: '13px', fontWeight: 600 }}>
                      <span>Discount ({appliedCoupon})</span>
                      <span>-LKR {fmt((total * discountPercent) / 100)}</span>
                    </div>
                  )}
                  <div className="summary-row gift-row" style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#111111' }}>
                      <input
                        type="checkbox"
                        checked={giftWrap}
                        onChange={() => setGiftWrap((value) => !value)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#000' }}
                      />
                      This order is a gift
                    </label>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-lg checkout-button"
                  onClick={handleCheckout}
                  style={{
                    width: '100%', padding: '16px', background: '#000000', color: '#ffffff',
                    border: '2px solid #000000', fontSize: '13px', fontWeight: '700',
                    letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '0'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
                  onMouseLeave={e => e.currentTarget.style.background = '#000000'}
                >
                  Checkout • LKR {fmt(total - (total * discountPercent) / 100)}
                </button>

                <Link
                  to="/cart"
                  className="drawer-view-cart"
                  onClick={onClose}
                  style={{
                    display: 'inline-flex', justifyContent: 'center', width: '100%',
                    padding: '8px 0', fontSize: '12px', letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: '#000000', fontWeight: '700',
                    textDecoration: 'underline', border: 'none'
                  }}
                >
                  View Cart
                </Link>
              </footer>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
