import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Gift, CreditCard, Send, Zap, ShieldCheck, Heart,
  ChevronDown, ChevronUp, Sparkles, ArrowRight, Check, Copy, Star
} from 'lucide-react';
import GBG from '../assets/GBG.jpeg';

/* ─── Gift Card Tiers ──────────────────────────────────────────── */
const GIFT_TIERS = [
  {
    amount: 2500,
    label: 'Classic',
    gradient: 'linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 50%,#1a1a1a 100%)',
    accent: '#C9A96E',
    shimmer: 'rgba(201,169,110,0.15)',
    tag: 'STARTER',
    perks: ['Valid across all categories', 'Instant digital delivery', 'Never expires'],
  },
  {
    amount: 5000,
    label: 'Prestige',
    gradient: 'linear-gradient(135deg,#0d1b2e 0%,#1a3456 50%,#0d1b2e 100%)',
    accent: '#7eb8f5',
    shimmer: 'rgba(126,184,245,0.15)',
    tag: 'POPULAR',
    perks: ['Free priority delivery on first order', 'Exclusive member pricing', 'Never expires'],
    highlight: true,
  },
  {
    amount: 10000,
    label: 'Luxury',
    gradient: 'linear-gradient(135deg,#1a0a0d 0%,#3d1520 50%,#1a0a0d 100%)',
    accent: '#f09aa8',
    shimmer: 'rgba(240,154,168,0.15)',
    tag: 'PREMIUM',
    perks: ['Complimentary styling session', 'Early access to new collections', 'Never expires'],
  },
  {
    amount: 25000,
    label: 'Élite',
    gradient: 'linear-gradient(135deg,#0a1a0d 0%,#1a3d22 50%,#0a1a0d 100%)',
    accent: '#7ed4a0',
    shimmer: 'rgba(126,212,160,0.15)',
    tag: 'ÉLITE',
    perks: ['Dedicated personal stylist', 'Bespoke packaging & handwritten note', 'Never expires'],
  },
];

const MARQUEE_ITEMS = [
  '✦ INSTANT DIGITAL DELIVERY',
  '✦ NEVER EXPIRES',
  '✦ USE ACROSS ALL CATEGORIES',
  '✦ PERSONAL MESSAGE INCLUDED',
  '✦ SECURE & ENCRYPTED',
  '✦ REDEEMABLE ON ALL PRODUCTS',
];

const OCCASIONS = [
  { emoji: '💍', label: 'Weddings' },
  { emoji: '🎂', label: 'Birthdays' },
  { emoji: '🎓', label: 'Graduation' },
  { emoji: '💝', label: 'Anniversary' },
  { emoji: '🌸', label: "Mother's Day" },
  { emoji: '🎄', label: 'Festive Season' },
];

const FAQS = [
  {
    q: 'How do gift cards work?',
    a: 'Gift cards are delivered instantly as a unique digital code to the recipient\'s email. They can enter the code at checkout to apply the balance to any order.',
  },
  {
    q: 'Do BloomAir gift cards expire?',
    a: 'Never. BloomAir gift cards have no expiry date — they can be used anytime, for any occasion, forever.',
  },
  {
    q: 'Can I send a gift card directly to someone?',
    a: 'Yes! Enter the recipient\'s name, email, and a personal message. We\'ll deliver it directly to them with your heartfelt note.',
  },
  {
    q: 'Can I use multiple gift cards on one order?',
    a: 'Yes, you can stack multiple gift cards during checkout. Any remaining balance stays on the card for future use.',
  },
  {
    q: 'What if the recipient already has an account?',
    a: 'The gift card balance will be credited to their BloomAir wallet automatically when they redeem the code.',
  },
];

export default function GiftCardPage() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [step, setStep] = useState(1); // 1 = choose, 2 = personalise, 3 = done
  const [form, setForm] = useState({ recipientName: '', recipientEmail: '', senderName: '', message: '' });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [marqueeOffset, setMarqueeOffset] = useState(0);
  const marqueeRef = useRef(null);
  const animRef = useRef(null);

  // Marquee animation
  useEffect(() => {
    let pos = 0;
    const tick = () => {
      pos -= 0.6;
      if (marqueeRef.current) {
        const totalW = marqueeRef.current.scrollWidth / 2;
        if (Math.abs(pos) >= totalW) pos = 0;
        marqueeRef.current.style.transform = `translateX(${pos}px)`;
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('BLOOM-GIFT-2025-XXXX');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div style={{
      background: '#080808',
      color: '#fff',
      minHeight: '100vh',
      fontFamily: '"Outfit", sans-serif',
      overflowX: 'hidden',
    }}>

      {/* ═══ HERO ════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '120px 40px 80px',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Full-bleed 5-column background grid slicing the composite image */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
        }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              position: 'relative',
              overflow: 'hidden',
              height: '100%',
            }}>
              <img
                src={GBG}
                alt=""
                style={{
                  width: '500%',
                  height: '100%',
                  objectFit: 'cover',
                  marginLeft: `-${i * 100}%`,
                  display: 'block',
                  filter: 'brightness(1.0) saturate(1.05)',
                }}
              />
            </div>
          ))}
        </div>
        {/* Dark overlay for text legibility */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(8,8,8,0.45) 0%, rgba(8,8,8,0.2) 50%, rgba(8,8,8,0.75) 100%)',
        }} />

        {/* Ambient glow orbs */}
        <div style={{
          position: 'absolute', width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)',
          top: '10%', left: '20%', pointerEvents: 'none', zIndex: 1,
        }}/>
        <div style={{
          position: 'absolute', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)',
          bottom: '10%', right: '15%', pointerEvents: 'none', zIndex: 1,
        }}/>

        {/* Grid texture overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          backgroundImage: `
            linear-gradient(rgba(201,169,110,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,169,110,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}/>


        {/* Title */}
        <h1 style={{
          position: 'relative', zIndex: 2,
          fontFamily: '"Tenor Sans", serif',
          fontSize: 'clamp(52px, 9vw, 110px)',
          fontWeight: '400',
          letterSpacing: '-1px',
          lineHeight: 1,
          margin: '0 0 8px',
          textAlign: 'center',
          color: '#fff',
        }}>
          Give the Gift of
        </h1>
        <h1 style={{
          position: 'relative', zIndex: 2,
          fontFamily: '"Tenor Sans", serif',
          fontSize: 'clamp(52px, 9vw, 110px)',
          fontWeight: '400',
          letterSpacing: '-1px',
          lineHeight: 1,
          margin: '0 0 20px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #C9A96E 0%, #e8d4a0 50%, #C9A96E 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Luxury.
        </h1>

        {/* Badge (Moved below Title) */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(201,169,110,0.1)',
          border: '1px solid rgba(201,169,110,0.3)',
          borderRadius: '100px',
          padding: '7px 18px',
          marginBottom: '24px',
          backdropFilter: 'blur(10px)',
        }}>
          <Sparkles size={12} color="#C9A96E" />
          <span style={{ fontSize: '9px', fontWeight: '800', color: '#C9A96E', letterSpacing: '3px' }}>
            BLOOMAIR GIFT EXPERIENCE
          </span>
        </div>

        {/* Subtitle */}
        <p style={{
          position: 'relative', zIndex: 2,
          color: 'rgba(255,255,255,0.7)',
          fontSize: '15px',
          lineHeight: '1.75',
          textAlign: 'center',
          maxWidth: '480px',
          margin: '0 0 44px',
          fontWeight: '400',
          letterSpacing: '0.02em',
        }}>
          From a handwritten note to a season's worth of fashion — every BloomAir gift card is an experience, not just a gesture.
        </p>

        {/* CTA Buttons */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#choose" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '16px 40px',
            background: '#C9A96E', color: '#000',
            fontSize: '10px', fontWeight: '900', letterSpacing: '0.18em', textTransform: 'uppercase',
            textDecoration: 'none', transition: 'all 0.3s',
            border: 'none', cursor: 'pointer',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#fff'}
            onMouseLeave={e => e.currentTarget.style.background = '#C9A96E'}
          >
            <Gift size={13} /> Choose a Gift Card
          </a>
          <a href="#personalise" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '16px 28px',
            background: 'rgba(255,255,255,0.04)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase',
            textDecoration: 'none', transition: 'all 0.3s', backdropFilter: 'blur(8px)',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#C9A96E'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
          >
            Send to Someone <ArrowRight size={12} />
          </a>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2,
        }}>
          <div style={{ width: '1px', height: '50px', background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,0.6))' }}/>
        </div>
      </section>

      {/* ═══ MARQUEE STRIP ═══════════════════════════════════════ */}
      <div style={{
        background: '#C9A96E',
        padding: '14px 0',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(0,0,0,0.2)',
      }}>
        <div ref={marqueeRef} style={{ display: 'flex', whiteSpace: 'nowrap', gap: '0' }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{
              fontSize: '9px', fontWeight: '900', color: '#000',
              letterSpacing: '3px', textTransform: 'uppercase',
              padding: '0 40px', flexShrink: 0,
            }}>{item}</span>
          ))}
        </div>
      </div>

      {/* ═══ GIFT CARD TIERS ══════════════════════════════════════ */}
      <section id="choose" style={{ padding: '100px 40px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ fontSize: '9px', color: '#C9A96E', letterSpacing: '4px', fontWeight: '800', marginBottom: '14px' }}>
              STEP 1 · SELECT AMOUNT
            </p>
            <h2 style={{
              fontFamily: '"Tenor Sans", serif',
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: '400', color: '#fff', margin: '0',
            }}>Choose Your Gift Tier</h2>
          </div>

          {/* Cards grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}>
            {GIFT_TIERS.map((tier, idx) => (
              <div
                key={idx}
                onClick={() => { setSelectedTier(idx); setStep(2); }}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: tier.gradient,
                  border: selectedTier === idx
                    ? `2px solid ${tier.accent}`
                    : hoveredCard === idx
                      ? `1px solid ${tier.accent}66`
                      : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '24px',
                  padding: '36px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: selectedTier === idx ? 'translateY(-6px)' : hoveredCard === idx ? 'translateY(-3px)' : 'translateY(0)',
                  boxShadow: selectedTier === idx
                    ? `0 24px 60px rgba(0,0,0,0.6), 0 0 30px ${tier.accent}33`
                    : '0 8px 30px rgba(0,0,0,0.4)',
                }}
              >
                {/* Shimmer glow */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `radial-gradient(circle at ${hoveredCard === idx ? '60% 40%' : '50% 50%'}, ${tier.shimmer} 0%, transparent 70%)`,
                  pointerEvents: 'none', transition: 'all 0.4s',
                }}/>

                {/* Popular badge */}
                {tier.highlight && (
                  <div style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: tier.accent, color: '#000',
                    fontSize: '7px', fontWeight: '900', letterSpacing: '1.5px',
                    padding: '4px 10px', borderRadius: '100px',
                  }}>MOST POPULAR</div>
                )}

                {/* Tier badge */}
                <div style={{
                  fontSize: '7px', color: tier.accent, fontWeight: '900',
                  letterSpacing: '3px', marginBottom: '20px',
                }}>{tier.tag} · GIFT CARD</div>

                {/* Gift icon */}
                <Gift size={32} color={tier.accent} style={{ marginBottom: '16px' }} />

                {/* Tier label */}
                <div style={{
                  fontFamily: '"Tenor Sans", serif',
                  fontSize: '20px', color: '#fff', marginBottom: '6px',
                }}>{tier.label}</div>

                {/* Amount */}
                <div style={{
                  fontSize: 'clamp(36px, 5vw, 48px)',
                  fontWeight: '300',
                  color: '#fff',
                  letterSpacing: '-1px',
                  marginBottom: '4px',
                  lineHeight: 1,
                }}>
                  LKR {tier.amount.toLocaleString()}
                </div>

                {/* Divider */}
                <div style={{
                  height: '1px',
                  background: `linear-gradient(90deg, ${tier.accent}66, transparent)`,
                  margin: '20px 0',
                }}/>

                {/* Perks */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
                  {tier.perks.map((perk, pi) => (
                    <div key={pi} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <Check size={12} color={tier.accent} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>{perk}</span>
                    </div>
                  ))}
                </div>

                {/* Select button */}
                <button style={{
                  width: '100%',
                  padding: '14px',
                  background: selectedTier === idx ? tier.accent : 'rgba(255,255,255,0.07)',
                  color: selectedTier === idx ? '#000' : '#fff',
                  border: `1px solid ${tier.accent}55`,
                  borderRadius: '12px',
                  fontSize: '10px', fontWeight: '900', letterSpacing: '1.5px',
                  cursor: 'pointer', transition: 'all 0.25s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                  {selectedTier === idx ? <><Check size={13}/> SELECTED</> : 'SELECT THIS TIER'}
                </button>
              </div>
            ))}
          </div>

          {/* Custom amount */}
          <div style={{
            marginTop: '32px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '28px 36px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <p style={{ fontSize: '9px', color: '#C9A96E', letterSpacing: '3px', fontWeight: '800', marginBottom: '8px' }}>CUSTOM AMOUNT</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Enter any amount between LKR 1,000 – 100,000</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px' }}>
              <input
                type="number"
                placeholder="Enter amount (LKR)"
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                style={{
                  flex: 1, padding: '14px 18px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px', color: '#fff',
                  fontSize: '14px', outline: 'none',
                  fontFamily: '"Outfit", sans-serif',
                }}
              />
              <button
                onClick={() => customAmount && setStep(2)}
                style={{
                  padding: '14px 24px',
                  background: '#C9A96E', color: '#000',
                  border: 'none', borderRadius: '12px',
                  fontSize: '10px', fontWeight: '900', letterSpacing: '1px',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                CONTINUE →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ OCCASIONS STRIP ══════════════════════════════════════ */}
      <section style={{
        padding: '0 40px 80px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{
            fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '3px',
            fontWeight: '700', marginBottom: '24px', textAlign: 'center',
          }}>PERFECT FOR EVERY OCCASION</p>
          <div style={{
            display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center',
          }}>
            {OCCASIONS.map((occ, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '100px', padding: '10px 20px',
                fontSize: '12px', color: 'rgba(255,255,255,0.7)',
                transition: 'all 0.25s', cursor: 'default',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A96E'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
              >
                <span style={{ fontSize: '18px' }}>{occ.emoji}</span>
                {occ.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PERSONALISE FORM ═════════════════════════════════════ */}
      <section id="personalise" style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ fontSize: '9px', color: '#C9A96E', letterSpacing: '4px', fontWeight: '800', marginBottom: '14px' }}>
              STEP 2 · PERSONALISE
            </p>
            <h2 style={{
              fontFamily: '"Tenor Sans", serif',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: '400', color: '#fff', margin: '0 0 14px',
            }}>Send a Personal Gift</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
              Add a heartfelt message and we'll deliver it straight to their inbox.
            </p>
          </div>

          {step === 3 ? (
            /* ── SUCCESS STATE ── */
            <div style={{
              background: 'rgba(201,169,110,0.05)',
              border: '1px solid rgba(201,169,110,0.25)',
              borderRadius: '24px',
              padding: '56px 40px',
              textAlign: 'center',
            }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'rgba(201,169,110,0.1)',
                border: '1px solid rgba(201,169,110,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <Check size={32} color="#C9A96E" />
              </div>
              <h3 style={{
                fontFamily: '"Tenor Sans", serif', fontSize: '28px', fontWeight: '400',
                color: '#fff', margin: '0 0 12px',
              }}>Gift Card Sent! 🎁</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: '0 0 32px', lineHeight: '1.6' }}>
                Your gift card has been delivered to <strong style={{ color: '#C9A96E' }}>{form.recipientEmail || 'the recipient'}</strong>.
                <br/>They'll receive a unique code to redeem at checkout.
              </p>
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px', padding: '16px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '32px', gap: '16px',
              }}>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', letterSpacing: '2px', fontFamily: 'monospace' }}>
                  BLOOM-GIFT-2025-XXXX
                </span>
                <button
                  onClick={handleCopyCode}
                  style={{
                    background: copiedCode ? 'rgba(201,169,110,0.15)' : 'transparent',
                    border: '1px solid rgba(201,169,110,0.4)',
                    borderRadius: '8px', padding: '7px 14px',
                    color: '#C9A96E', cursor: 'pointer', fontSize: '10px', fontWeight: '700',
                    display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '1px',
                  }}
                >
                  {copiedCode ? <><Check size={12}/> COPIED</> : <><Copy size={12}/> COPY</>}
                </button>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => { setStep(1); setSelectedTier(null); setForm({ recipientName:'',recipientEmail:'',senderName:'',message:'' }); }} style={{
                  padding: '14px 28px',
                  background: 'transparent', color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px', fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px',
                  cursor: 'pointer',
                }}>SEND ANOTHER</button>
                <Link to="/women" style={{
                  padding: '14px 28px',
                  background: '#C9A96E', color: '#000',
                  borderRadius: '12px', fontSize: '10px', fontWeight: '900', letterSpacing: '1.5px',
                  textDecoration: 'none', display: 'inline-block',
                }}>CONTINUE SHOPPING</Link>
              </div>
            </div>
          ) : (
            /* ── PERSONALISE FORM ── */
            <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <LuxInput
                  label="Recipient Name"
                  placeholder="e.g. Anjali Jayawardene"
                  value={form.recipientName}
                  onChange={v => setForm(f => ({ ...f, recipientName: v }))}
                  required
                />
                <LuxInput
                  label="Recipient Email"
                  type="email"
                  placeholder="anjali@email.com"
                  value={form.recipientEmail}
                  onChange={v => setForm(f => ({ ...f, recipientEmail: v }))}
                  required
                />
              </div>
              <LuxInput
                label="Your Name (Sender)"
                placeholder="Your name"
                value={form.senderName}
                onChange={v => setForm(f => ({ ...f, senderName: v }))}
              />
              {/* Selected amount display */}
              {(selectedTier !== null || customAmount) && (
                <div style={{
                  background: 'rgba(201,169,110,0.06)',
                  border: '1px solid rgba(201,169,110,0.2)',
                  borderRadius: '14px', padding: '14px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Selected amount</span>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#C9A96E' }}>
                    LKR {selectedTier !== null
                      ? GIFT_TIERS[selectedTier].amount.toLocaleString()
                      : parseInt(customAmount || 0).toLocaleString()}
                  </span>
                </div>
              )}
              <div>
                <label style={{ fontSize: '9px', color: '#C9A96E', letterSpacing: '2px', fontWeight: '800', display: 'block', marginBottom: '8px' }}>
                  PERSONAL MESSAGE (OPTIONAL)
                </label>
                <textarea
                  rows={5}
                  placeholder="Write a heartfelt message for the recipient..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  style={{
                    width: '100%', padding: '16px 20px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '14px', color: '#fff',
                    fontSize: '14px', outline: 'none',
                    fontFamily: '"Outfit", sans-serif',
                    resize: 'none', boxSizing: 'border-box',
                    lineHeight: '1.6',
                    transition: 'border-color 0.25s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#C9A96E'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '18px',
                  background: 'linear-gradient(135deg, #C9A96E, #a07a45)',
                  color: '#000', border: 'none', borderRadius: '14px',
                  fontSize: '11px', fontWeight: '900', letterSpacing: '2px',
                  cursor: 'pointer', transition: 'all 0.25s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  boxShadow: '0 8px 30px rgba(201,169,110,0.25)',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 40px rgba(201,169,110,0.4)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 30px rgba(201,169,110,0.25)'}
              >
                <Send size={15} /> SEND GIFT CARD NOW
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ═══ WHY BLOOMAIR GIFT CARDS ══════════════════════════════ */}
      <section style={{
        padding: '80px 40px',
        background: 'rgba(255,255,255,0.015)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{
              fontFamily: '"Tenor Sans", serif',
              fontSize: 'clamp(26px, 4vw, 42px)',
              fontWeight: '400', color: '#fff', margin: 0,
            }}>Why Choose BloomAir Gift Cards?</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
          }}>
            {[
              { icon: <Zap size={26} color="#C9A96E"/>, title: 'Instant Delivery', desc: 'Delivered to the recipient\'s inbox within seconds of purchase.' },
              { icon: <ShieldCheck size={26} color="#C9A96E"/>, title: 'Never Expires', desc: 'No pressure, no deadlines. BloomAir gift cards are yours for life.' },
              { icon: <Heart size={26} color="#C9A96E"/>, title: 'Personal Touch', desc: 'Add a custom message and make every gift feel truly unique.' },
              { icon: <Sparkles size={26} color="#C9A96E"/>, title: 'Full Range', desc: 'Redeemable across every product in our luxury collection.' },
            ].map((feat, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px',
                padding: '32px 28px',
                transition: 'all 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)'; e.currentTarget.style.background = 'rgba(201,169,110,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; }}
              >
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: 'rgba(201,169,110,0.08)',
                  border: '1px solid rgba(201,169,110,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: '0 0 10px' }}>{feat.title}</h3>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: '1.7' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ fontSize: '9px', color: '#C9A96E', letterSpacing: '4px', fontWeight: '800', marginBottom: '14px' }}>FAQ</p>
            <h2 style={{
              fontFamily: '"Tenor Sans", serif',
              fontSize: 'clamp(26px, 4vw, 42px)',
              fontWeight: '400', color: '#fff', margin: 0,
            }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                background: openFAQ === i ? 'rgba(201,169,110,0.05)' : 'rgba(255,255,255,0.025)',
                border: openFAQ === i ? '1px solid rgba(201,169,110,0.25)' : '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}>
                <button
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  style={{
                    width: '100%', padding: '22px 28px',
                    background: 'none', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff', lineHeight: '1.4' }}>
                    {faq.q}
                  </span>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: openFAQ === i ? '#C9A96E' : 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(201,169,110,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all 0.25s',
                  }}>
                    {openFAQ === i
                      ? <ChevronUp size={14} color="#000"/>
                      : <ChevronDown size={14} color="#C9A96E"/>}
                  </div>
                </button>
                {openFAQ === i && (
                  <div style={{ padding: '0 28px 22px' }}>
                    <p style={{
                      fontSize: '13px', color: 'rgba(255,255,255,0.55)',
                      lineHeight: '1.75', margin: 0,
                    }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BOTTOM CTA ════════════════════════════════════════ */}
      <section style={{
        padding: '80px 40px',
        background: 'rgba(201,169,110,0.04)',
        borderTop: '1px solid rgba(201,169,110,0.12)',
        textAlign: 'center',
      }}>
        <Sparkles size={28} color="#C9A96E" style={{ marginBottom: '20px' }} />
        <h2 style={{
          fontFamily: '"Tenor Sans", serif',
          fontSize: 'clamp(24px, 4vw, 38px)',
          fontWeight: '400', color: '#fff',
          margin: '0 0 16px',
        }}>
          Not sure what to gift?
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', margin: '0 0 36px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
          Let them choose what they love most. A BloomAir gift card is always the perfect choice.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#choose" style={{
            padding: '16px 40px',
            background: '#C9A96E', color: '#000',
            fontSize: '10px', fontWeight: '900', letterSpacing: '2px',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px',
            transition: 'all 0.25s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#fff'}
            onMouseLeave={e => e.currentTarget.style.background = '#C9A96E'}
          >
            <Gift size={13} /> GIFT A CARD NOW
          </a>
          <Link to="/women" style={{
            padding: '16px 28px',
            background: 'transparent', color: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.15)',
            fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
            transition: 'all 0.25s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#C9A96E'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
          >
            BROWSE COLLECTION <ArrowRight size={12} />
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ─── Reusable luxury input component ─────────────────────────── */
function LuxInput({ label, placeholder, value, onChange, type = 'text', required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && (
        <label style={{
          fontSize: '9px', color: '#C9A96E', letterSpacing: '2px',
          fontWeight: '800', display: 'block', marginBottom: '8px',
        }}>
          {label.toUpperCase()}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '15px 18px',
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${focused ? '#C9A96E' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '12px', color: '#fff',
          fontSize: '14px', outline: 'none',
          fontFamily: '"Outfit", sans-serif',
          boxSizing: 'border-box',
          transition: 'border-color 0.25s',
        }}
      />
    </div>
  );
}