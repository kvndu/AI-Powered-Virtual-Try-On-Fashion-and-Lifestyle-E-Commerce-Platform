import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartSidebar({ isOpen, onClose }) {
  const { items, total, updateQty, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        {/* Header */}
        <div style={{
          padding: 'var(--space-6)',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <ShoppingBag size={20} color="var(--primary)" />
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Shopping Cart</h2>
            {items.length > 0 && (
              <span className="badge badge-primary">{items.length}</span>
            )}
          </div>
          <button className="btn btn-icon btn-ghost" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-4)' }}>
          {items.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-16) var(--space-8)',
              gap: 'var(--space-4)'
            }}>
              <div style={{
                width: 80, height: 80,
                borderRadius: '50%',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <ShoppingBag size={32} color="var(--text-muted)" />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Your cart is empty</p>
              <Link to="/products" className="btn btn-primary btn-sm" onClick={onClose}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {items.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  position: 'relative'
                }}>
                  {/* Image */}
                  <div style={{
                    width: 72, height: 84,
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: 'var(--bg-elevated)'
                  }}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShoppingBag size={24} color="var(--text-muted)" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2, lineHeight: 1.3 }}>
                      {item.name}
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 8 }}>
                      {item.size && item.size !== 'One Size' && (
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '2px 6px', borderRadius: 4 }}>
                          Size: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span style={{
                          width: 16, height: 16,
                          borderRadius: '50%',
                          background: item.color,
                          border: '1px solid var(--glass-border)',
                          flexShrink: 0,
                          display: 'inline-block'
                        }} />
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Qty */}
                      <div className="qty-control" style={{ padding: '2px 6px' }}>
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          style={{ width: 24, height: 24, fontSize: 14 }}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-value" style={{ fontSize: 13, minWidth: 20 }}>{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          style={{ width: 24, height: 24, fontSize: 14 }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span style={{ fontWeight: 700, color: 'var(--primary-light)', fontSize: 15 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 24, height: 24,
                      border: 'none', background: 'transparent',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'color var(--transition-fast)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--error)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {/* Clear All */}
              <button
                onClick={clearCart}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                  background: 'transparent', border: 'none',
                  color: 'var(--error)', fontSize: 13, cursor: 'pointer',
                  padding: 'var(--space-2) 0',
                  transition: 'opacity var(--transition-fast)'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <Trash2 size={14} /> Clear all items
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: 'var(--space-5)',
            borderTop: '1px solid var(--glass-border)',
            background: 'var(--bg-card)'
          }}>
            {/* Subtotal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Subtotal</span>
              <span style={{ fontWeight: 700, fontSize: 20, color: 'var(--text-primary)' }}>
                ${total.toFixed(2)}
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
              Shipping and taxes calculated at checkout
            </p>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleCheckout}>
              Checkout <ArrowRight size={16} />
            </button>
            <Link
              to="/cart"
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-2)' }}
              onClick={onClose}
            >
              View Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
