import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AgriConnect — Farm-to-Table Marketplace',
  description:
    'Connecting farmers directly with consumers and wholesalers across India. Fresh produce, fair prices, zero middlemen.',
};

export default function LandingPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#FAFAF8' }}>
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: '#1B4332',
          height: '3.5rem',
          display: 'flex', alignItems: 'center',
        }}
      >
        <div
          className="container"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            fontFamily: "var(--font-fraunces, 'Fraunces'), serif",
            fontWeight: 800, fontSize: '1.15rem', color: '#fff', textDecoration: 'none',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M7 20l5-16 5 16"/><path d="M4 17c2-4 5-6 8-6s6 2 8 6"/></svg>
            AgriConnect
          </Link>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link href="/mandi" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500 }}>Mandi Prices</Link>
            <Link href="/auth/consumer" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500 }}>Sign In</Link>
            <Link href="/auth/consumer" style={{
              background: '#FF6B35', color: '#fff', padding: '0.45rem 1.1rem',
              borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700,
              textDecoration: 'none', transition: 'transform 0.15s',
            }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: '5rem 0 4.5rem',
          background: 'linear-gradient(175deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(255,255,255,0.12)', color: '#FFD166',
            padding: '0.35rem 1rem', borderRadius: '9999px',
            fontSize: '0.75rem', fontWeight: 600, marginBottom: '2rem',
            letterSpacing: '0.04em',
          }}>
            🚀 NOW LIVE — JOIN 1,200+ FARMERS
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5.5vw, 3.75rem)',
              fontWeight: 900, lineHeight: 1.1,
              color: '#fff', marginBottom: '1.25rem',
              letterSpacing: '-0.02em',
              fontFamily: "var(--font-fraunces, 'Fraunces'), serif",
            }}
          >
            Fresh from Farm.{' '}
            <br />
            <span style={{ color: '#FFD166' }}>Direct to You.</span>
          </h1>
          <p
            style={{
              fontSize: '1rem', color: 'rgba(255,255,255,0.75)',
              maxWidth: '520px', margin: '0 auto 2rem',
              lineHeight: 1.7,
            }}
          >
            AgriConnect removes middlemen so farmers earn more and
            consumers pay less. Real-time mandi prices, voice listings in Hindi,
            and secure escrow payments.
          </p>

          {/* Search bar */}
          <div style={{
            display: 'flex', alignItems: 'center',
            background: '#fff', borderRadius: '9999px',
            padding: '0.35rem 0.35rem 0.35rem 1.25rem',
            maxWidth: '520px', margin: '0 auto 1.75rem',
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              readOnly
              placeholder="Search fresh produce, farmers..."
              style={{
                flex: 1, border: 'none', outline: 'none', padding: '0.6rem 0.75rem',
                fontSize: '0.9rem', background: 'transparent', color: '#1A1A1A',
              }}
            />
            <Link href="/marketplace" style={{
              background: '#FF6B35', color: '#fff', padding: '0.6rem 1.5rem',
              borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 700,
              textDecoration: 'none', flexShrink: 0,
            }}>Find</Link>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/marketplace" style={{
              background: '#FF6B35', color: '#fff', padding: '0.7rem 1.75rem',
              borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 700,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              boxShadow: '0 2px 12px rgba(255,107,53,0.3)', transition: 'transform 0.15s',
            }}>🛒 Shop Fresh Produce</Link>
            <Link href="/auth/farmer" style={{
              background: 'transparent', color: '#fff', padding: '0.7rem 1.75rem',
              borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 600,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              border: '1.5px solid rgba(255,255,255,0.4)', transition: 'all 0.15s',
            }}>🌾 I&apos;m a Farmer</Link>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section style={{ padding: '3rem 0', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container">
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem',
            textAlign: 'center',
          }}>
            {[
              { value: '1,200+', label: 'Verified Farmers' },
              { value: '18 States', label: 'Pan-India Coverage' },
              { value: '₹0', label: 'Platform Fee' },
              { value: '24/7', label: 'Voice Support (Hindi)' },
            ].map((stat) => (
              <div key={stat.label} style={{ padding: '0.5rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1B4332', fontFamily: "var(--font-outfit, 'Outfit'), sans-serif", letterSpacing: '-0.02em' }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 500, marginTop: '0.25rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portal Cards ─────────────────────────────────────────────────── */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', fontWeight: 800,
              color: '#1A1A1A', marginBottom: '0.75rem',
              fontFamily: "var(--font-fraunces, 'Fraunces'), serif",
            }}>One platform. Every role.</h2>
            <p style={{ color: '#6B7280', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto' }}>
              Whether you grow, buy, or trade — AgriConnect has a portal built for you.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {[
              {
                icon: '🌾', title: 'For Farmers',
                desc: 'List produce in 30 seconds using Hindi voice commands. Get fair prices, track orders, and build your reputation score.',
                accent: '#1B4332', bg: '#F0FDF4', iconBg: '#D1FAE5',
                href: '/auth/farmer', cta: 'Start Selling',
              },
              {
                icon: '🛒', title: 'For Consumers',
                desc: 'Buy directly from verified farmers. Know exactly where your food comes from. Delivered fresh, priced fairly.',
                accent: '#FF6B35', bg: '#FFF7ED', iconBg: '#FFEDD5',
                href: '/marketplace', cta: 'Browse Produce',
              },
              {
                icon: '🏭', title: 'For Wholesalers',
                desc: 'Source bulk produce from hundreds of farmers. RFQ system, standing orders, credit ledger — all in one dashboard.',
                accent: '#1E40AF', bg: '#EFF6FF', iconBg: '#DBEAFE',
                href: '/auth/wholesaler', cta: 'Register Business',
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  background: '#fff', borderRadius: '16px', padding: '2rem',
                  border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column',
                  transition: 'box-shadow 0.25s, transform 0.25s',
                }}
              >
                <div
                  style={{
                    width: '3.25rem', height: '3.25rem', borderRadius: '12px',
                    background: card.iconBg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem',
                  }}
                >
                  {card.icon}
                </div>
                <h3 style={{
                  fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem',
                  color: card.accent,
                  fontFamily: "var(--font-outfit, 'Outfit'), sans-serif",
                }}>{card.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.5rem', flex: 1 }}>
                  {card.desc}
                </p>
                <Link
                  href={card.href}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    background: card.accent, color: '#fff',
                    padding: '0.6rem 1.25rem', borderRadius: '9999px',
                    fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
                    alignSelf: 'flex-start', transition: 'opacity 0.15s',
                  }}
                >{card.cta} →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features — Built for Bharat ─────────────────────────────────── */}
      <section style={{ background: '#1B4332', padding: '4.5rem 0', color: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2
              style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', fontWeight: 800,
                color: '#fff', marginBottom: '0.75rem',
                fontFamily: "var(--font-fraunces, 'Fraunces'), serif",
              }}
            >Built for Bharat</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7, fontSize: '0.95rem' }}>
              Every feature designed around how Indian farmers and consumers actually work.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { icon: '🎤', title: 'Hindi Voice Listings', desc: 'Farmers list produce by speaking in Hindi. AI extracts crop, quantity, price automatically.', iconBg: '#FFD166' },
              { icon: '📊', title: 'Live Mandi Prices', desc: 'Real-time APMC mandi rates from 18 states. Know before you sell.', iconBg: '#60A5FA' },
              { icon: '🔒', title: 'Escrow Payments', desc: 'Money held safely until delivery confirmed. Both parties protected.', iconBg: '#FB923C' },
              { icon: '⭐', title: 'Farmer Score', desc: 'Accuracy, delivery, and rating score builds trust. Top farmers get priority placement.', iconBg: '#FBBF24' },
              { icon: '📱', title: 'WhatsApp Alerts', desc: 'Order updates, OTPs, and notifications via WhatsApp — no app needed for farmers.', iconBg: '#34D399' },
              { icon: '🌍', title: 'Works Offline', desc: 'PWA-enabled. Farmers in low-connectivity areas can still use core features.', iconBg: '#818CF8' },
            ].map((f) => (
              <div
                key={f.title}
                style={{
                  padding: '1.5rem',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{
                  width: '2.75rem', height: '2.75rem', borderRadius: '10px',
                  background: f.iconBg, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.25rem', marginBottom: '1rem',
                }}>{f.icon}</div>
                <h3 style={{
                  color: '#fff', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem',
                  fontFamily: "var(--font-outfit, 'Outfit'), sans-serif",
                }}>{f.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: '4.5rem 0', background: '#FAFAF8' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', fontWeight: 800,
            color: '#1A1A1A', marginBottom: '0.75rem',
            fontFamily: "var(--font-fraunces, 'Fraunces'), serif",
          }}>Ready to join the movement?</h2>
          <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '2rem' }}>
            No fees. No middlemen. Just fair trade.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/consumer" style={{
              background: '#FF6B35', color: '#fff', padding: '0.75rem 2rem',
              borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 700,
              textDecoration: 'none', boxShadow: '0 2px 12px rgba(255,107,53,0.25)',
            }}>Create Account Free</Link>
            <Link href="/mandi" style={{
              background: 'transparent', color: '#1A1A1A', padding: '0.75rem 2rem',
              borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 600,
              textDecoration: 'none', border: '1.5px solid #D1D5DB',
            }}>See Today&apos;s Prices</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: '#1B4332', color: 'rgba(255,255,255,0.5)',
          padding: '1.75rem 0',
        }}
      >
        <div
          className="container"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}
        >
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            fontFamily: "var(--font-fraunces, 'Fraunces'), serif",
            fontWeight: 700, color: '#fff', fontSize: '1rem', textDecoration: 'none',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M7 20l5-16 5 16"/><path d="M4 17c2-4 5-6 8-6s6 2 8 6"/></svg>
            AgriConnect
          </Link>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem' }}>
            <Link href="/legal/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</Link>
            <Link href="/legal/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/legal/refunds" style={{ color: 'inherit', textDecoration: 'none' }}>Refunds</Link>
            <Link href="/mandi" style={{ color: 'inherit', textDecoration: 'none' }}>Mandi Prices</Link>
          </div>
          <span style={{ fontSize: '0.75rem' }}>© 2026 AgriConnect. Made for Indian Farmers.</span>
        </div>
      </footer>
    </main>
  );
}
