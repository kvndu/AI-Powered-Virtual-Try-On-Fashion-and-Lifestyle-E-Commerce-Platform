import { CheckCircle2, Clock, Package, Truck, Home } from 'lucide-react';

const STEPS = [
  { key: 'pending', label: 'Order Placed', icon: CheckCircle2 },
  { key: 'processing', label: 'Processing', icon: Clock },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
];

const STATUS_ORDER = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderTracker({ status = 'pending' }) {
  const currentIdx = STATUS_ORDER.indexOf(status);

  if (status === 'cancelled') {
    return (
      <div style={{
        padding: 'var(--space-4)',
        background: 'rgba(239,68,68,0.08)',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center',
        color: 'var(--error)',
        fontWeight: 600, fontSize: 15
      }}>
        ❌ Order Cancelled
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-4) 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
        {/* Progress line */}
        <div style={{
          position: 'absolute',
          top: 20,
          left: '12.5%',
          right: '12.5%',
          height: 3,
          background: 'var(--bg-elevated)',
          borderRadius: 2,
          zIndex: 0
        }}>
          <div style={{
            height: '100%',
            width: `${(currentIdx / (STEPS.length - 1)) * 100}%`,
            background: 'linear-gradient(90deg, var(--primary), var(--primary-light))',
            borderRadius: 2,
            transition: 'width 0.8s ease',
            boxShadow: '0 0 8px rgba(168,85,247,0.5)'
          }} />
        </div>

        {STEPS.map((step, i) => {
          const done = i <= currentIdx;
          const active = i === currentIdx;
          const Icon = step.icon;

          return (
            <div
              key={step.key}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-2)',
                position: 'relative',
                zIndex: 1
              }}
            >
              {/* Icon */}
              <div style={{
                width: 42, height: 42,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done
                  ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))'
                  : 'var(--bg-elevated)',
                border: active
                  ? '3px solid var(--primary)'
                  : done
                  ? '3px solid var(--primary)'
                  : '2px solid var(--glass-border)',
                boxShadow: active ? 'var(--shadow-purple)' : 'none',
                transition: 'all 0.4s ease',
                animation: active ? 'pulse 2s infinite' : 'none'
              }}>
                <Icon
                  size={18}
                  color={done ? '#fff' : 'var(--text-muted)'}
                />
              </div>

              {/* Label */}
              <span style={{
                fontSize: 12,
                fontWeight: done ? 600 : 400,
                color: done ? 'var(--primary-light)' : 'var(--text-muted)',
                textAlign: 'center',
                transition: 'color 0.4s ease'
              }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
