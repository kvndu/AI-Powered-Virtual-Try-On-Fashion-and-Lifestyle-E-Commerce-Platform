import { useState } from 'react';
import {
  Gift,
  CreditCard,
  Send,
  Zap,
  ShieldCheck,
  Heart,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function GiftCardPage() {
  const [openFAQ, setOpenFAQ] = useState(0);

  const giftCards = [
    { amount: 2500, color: 'linear-gradient(135deg,#111,#333)' },
    { amount: 5000, color: 'linear-gradient(135deg,#5b8ed6,#355e9c)' },
    { amount: 10000, color: 'linear-gradient(135deg,#e05a6a,#a53d4c)' },
    { amount: 25000, color: 'linear-gradient(135deg,#4caf87,#2d7a5c)' },
  ];

  const faqs = [
    {
      q: 'How do gift cards work?',
      a: 'Gift cards are delivered digitally and can be redeemed during checkout.',
    },
    {
      q: 'Do gift cards expire?',
      a: 'No. BloomAir gift cards never expire.',
    },
    {
      q: 'Can I send them directly to someone?',
      a: 'Yes, simply enter their email address and a personal message.',
    },
  ];

  return (
    <div
      style={{
        background: '#f7f7f7',
        minHeight: '100vh',
        fontFamily: '"Outfit",sans-serif',
      }}
    >
      {/* Hero */}
<div
  style={{
    background: '#f3f3f3',
    color: '#111',
    padding: '100px 40px',
    textAlign: 'center',
    borderBottom: '1px solid #e5e5e5',
  }}
>
        <Gift size={55} color="#111"/>
        <h1
          style={{
            fontSize: '64px',
            fontWeight: '300',
            marginTop: '20px',
            letterSpacing: '5px',
          }}
        >
          Gift Cards
        </h1>

        <p
          style={{
            color: '#777',
            maxWidth: '650px',
            margin: '20px auto',
            lineHeight: 1.8,
          }}
        >
          Give the perfect gift for every occasion. Instantly
          delivered and ready to shop.
        </p>
      </div>

      {/* Cards */}
      <div
        style={{
          padding: '80px 50px',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: '34px',
            marginBottom: '50px',
          }}
        >
          Choose a Gift Card
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(270px,1fr))',
            gap: '25px',
          }}
        >
          {giftCards.map((card, index) => (
            <div
              key={index}
              style={{
                background: card.color,
                color: 'white',
                borderRadius: '25px',
                padding: '35px',
                minHeight: '240px',
                boxShadow: '0 15px 40px rgba(0,0,0,.15)',
                transition: '.3s',
              }}
            >
              <Gift size={35} />

              <p
                style={{
                  marginTop: '30px',
                  letterSpacing: '3px',
                  fontSize: '11px',
                  color: '#ddd',
                }}
              >
                BLOOMAIR GIFT CARD
              </p>

              <h1
                style={{
                  marginTop: '15px',
                  fontSize: '42px',
                }}
              >
                LKR {card.amount.toLocaleString()}
              </h1>

              <button
                style={{
                  marginTop: '30px',
                  width: '100%',
                  background: 'rgba(255,255,255,.15)',
                  border: '1px solid rgba(255,255,255,.2)',
                  color: 'white',
                  padding: '13px',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                <CreditCard size={16} /> Purchase
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Gift */}
      <div
        style={{
          background: 'white',
          padding: '80px 50px',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: '34px',
            marginBottom: '50px',
          }}
        >
          Send a Personal Gift
        </h2>

        <div
          style={{
            maxWidth: '700px',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <input
            placeholder="Recipient Name"
            style={inputStyle}
          />

          <input
            placeholder="Recipient Email"
            style={inputStyle}
          />

          <input
            placeholder="Amount (LKR)"
            style={inputStyle}
          />

          <textarea
            rows="5"
            placeholder="Personal Message"
            style={{
              ...inputStyle,
              resize: 'none',
            }}
          />

          <button
            style={{
              background: '#111',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <Send size={16} /> Send Gift Card
          </button>
        </div>
      </div>

      {/* Features */}
      <div
        style={{
          padding: '80px 50px',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '50px',
          }}
        >
          Why Choose BloomAir Gift Cards?
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(250px,1fr))',
            gap: '25px',
          }}
        >
          <FeatureCard
            icon={<Zap />}
            title="Instant Delivery"
            desc="Delivered to inbox within minutes."
          />

          <FeatureCard
            icon={<ShieldCheck />}
            title="Never Expires"
            desc="Use anytime without expiration."
          />

          <FeatureCard
            icon={<Heart />}
            title="Perfect Gift"
            desc="Birthdays, holidays and special moments."
          />
        </div>
      </div>

      {/* FAQ */}
      <div
        style={{
          background: 'white',
          padding: '80px 50px',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          Frequently Asked Questions
        </h2>

        <div
          style={{
            maxWidth: '800px',
            margin: 'auto',
          }}
        >
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                borderBottom: '1px solid #eee',
                padding: '20px 0',
              }}
            >
              <div
                onClick={() => setOpenFAQ(openFAQ === i ? -1 : i)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                <strong>{faq.q}</strong>

                {openFAQ === i ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </div>

              {openFAQ === i && (
                <p
                  style={{
                    color: '#777',
                    marginTop: '15px',
                    lineHeight: 1.8,
                  }}
                >
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div
      style={{
        background: 'white',
        padding: '35px',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 5px 20px rgba(0,0,0,.06)',
      }}
    >
      <div
        style={{
          marginBottom: '20px',
        }}
      >
        {icon}
      </div>

      <h3>{title}</h3>

      <p
        style={{
          color: '#777',
          lineHeight: 1.7,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

const inputStyle = {
  padding: '16px',
  borderRadius: '14px',
  border: '1px solid #ddd',
  outline: 'none',
  fontSize: '14px',
};