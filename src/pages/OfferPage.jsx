import { useState } from 'react';
import {
  Percent,
  Tag,
  Gift,
  Truck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function OffersPage() {
  const [openFAQ, setOpenFAQ] = useState(0);

  const offers = [
    {
      title: 'Summer Sale',
      discount: '50% OFF',
      desc: 'Selected styles and seasonal essentials.',
      color: 'linear-gradient(135deg,#111,#333)',
    },
    {
      title: 'New Customers',
      discount: '15% OFF',
      desc: 'Special welcome offer for your first order.',
      color: 'linear-gradient(135deg,#5b8ed6,#355e9c)',
    },
    {
      title: 'Weekend Flash',
      discount: '30% OFF',
      desc: 'Limited-time deals available this weekend.',
      color: 'linear-gradient(135deg,#e05a6a,#a53d4c)',
    },
    {
      title: 'Buy 2 Get 1',
      discount: 'FREE',
      desc: 'Applicable on selected collections.',
      color: 'linear-gradient(135deg,#4caf87,#2d7a5c)',
    },
  ];

  const faqs = [
    {
      q: 'Can I combine multiple offers?',
      a: 'Only one promotion can be applied per order.',
    },
    {
      q: 'Do promo codes expire?',
      a: 'Yes. Each promotion has its own validity period.',
    },
    {
      q: 'Are offers available online?',
      a: 'Yes, unless otherwise stated.',
    },
  ];

  return (
    <div
      style={{
        background: '#f7f7f7',
        minHeight: '100vh',
        fontFamily: '"Outfit", sans-serif',
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          position: 'relative',
          height: '430px',
          background: '#d9d9d9',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom,rgba(0,0,0,.15),rgba(0,0,0,.5))',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              color: 'rgba(255,255,255,.7)',
              fontSize: '11px',
              letterSpacing: '6px',
            }}
          >
            BLOOMAIR · EXCLUSIVE DEALS
          </span>

          <h1
            style={{
              color: '#fff',
              fontSize: '88px',
              fontWeight: '300',
              fontFamily: '"Playfair Display", serif',
              margin: '18px 0',
            }}
          >
            Offers
          </h1>

          <div
            style={{
              display: 'flex',
              gap: '40px',
              marginTop: '20px',
              flexWrap: 'wrap',
            }}
          >
            {['FLASH SALE', 'BEST DEALS', 'LIMITED TIME'].map(
              (item) => (
                <span
                  key={item}
                  style={{
                    color: '#fff',
                    fontSize: '12px',
                    letterSpacing: '3px',
                    borderBottom:
                      '1px solid rgba(255,255,255,.5)',
                    paddingBottom: '5px',
                  }}
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        {/* Top Right Badge */}
        <div
          style={{
            position: 'absolute',
            top: '25px',
            right: '30px',
            width: '95px',
            height: '95px',
            borderRadius: '18px',
            background: 'rgba(255,255,255,.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              fontWeight: '700',
            }}
          >
            4
          </div>

          <div
            style={{
              fontSize: '10px',
              letterSpacing: '2px',
            }}
          >
            OFFERS
          </div>
        </div>
      </div>
            {/* Featured Offers */}
      <div
        style={{
          padding: '90px 50px',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: '40px',
            marginBottom: '60px',
          }}
        >
          Featured Promotions
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(280px,1fr))',
            gap: '25px',
          }}
        >
          {offers.map((offer, index) => (
            <div
              key={index}
              style={{
                background: offer.color,
                color: 'white',
                borderRadius: '28px',
                padding: '35px',
                minHeight: '250px',
                boxShadow: '0 20px 40px rgba(0,0,0,.15)',
              }}
            >
              <Percent size={35} />

              <p
                style={{
                  marginTop: '35px',
                  letterSpacing: '3px',
                  fontSize: '11px',
                  color: '#ddd',
                }}
              >
                BLOOMAIR OFFER
              </p>

              <h1
                style={{
                  marginTop: '15px',
                  fontSize: '42px',
                }}
              >
                {offer.discount}
              </h1>

              <h3>{offer.title}</h3>

              <p
                style={{
                  color: '#eee',
                  lineHeight: 1.8,
                }}
              >
                {offer.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Promo Code Section */}
      <div
        style={{
          background: 'white',
          padding: '90px 50px',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: '40px',
            marginBottom: '50px',
          }}
        >
          Promo Codes
        </h2>

        <div
          style={{
            maxWidth: '700px',
            margin: 'auto',
            display: 'flex',
            gap: '18px',
          }}
        >
          <input
            placeholder="Enter Promo Code"
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '15px',
              border: '1px solid #ddd',
              outline: 'none',
              fontSize: '14px',
            }}
          />

          <button
            style={{
              background: '#111',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              padding: '0 30px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Apply
          </button>
        </div>
      </div>

      {/* Shopping Benefits */}
      <div
        style={{
          padding: '90px 50px',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: '40px',
            marginBottom: '50px',
          }}
        >
          Shopping Benefits
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(260px,1fr))',
            gap: '25px',
          }}
        >
          <FeatureCard
            icon={<Truck />}
            title="Free Shipping"
            desc="Enjoy free delivery on selected orders."
          />

          <FeatureCard
            icon={<Gift />}
            title="Bonus Rewards"
            desc="Earn exclusive rewards with purchases."
          />

          <FeatureCard
            icon={<Tag />}
            title="Exclusive Deals"
            desc="Members get early access to promotions."
          />

          <FeatureCard
            icon={<ShieldCheck />}
            title="Secure Payments"
            desc="Safe and protected checkout experience."
          />
        </div>
      </div>
            {/* FAQ Section */}
      <div
        style={{
          background: 'white',
          padding: '90px 50px',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: '40px',
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
                padding: '25px 0',
              }}
            >
              <div
                onClick={() =>
                  setOpenFAQ(openFAQ === i ? -1 : i)
                }
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
                    lineHeight: '1.8',
                    marginTop: '15px',
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
        padding: '40px',
        borderRadius: '25px',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,.05)',
      }}
    >
      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          marginBottom: '12px',
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: '#777',
          lineHeight: '1.8',
        }}
      >
        {desc}
      </p>
    </div>
  );
}