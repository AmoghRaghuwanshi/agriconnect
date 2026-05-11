'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import DashboardNav from '@/components/shared/DashboardNav';

/* ── crop → gradient bg for thumbnails ────────────────── */
function getCropVisual(cropName: string): { emoji: string; bg: string } {
  const lower = cropName.toLowerCase();
  if (lower.includes('wheat')) return { emoji: '🌾', bg: 'linear-gradient(135deg, #fef3c7, #fde68a)' };
  if (lower.includes('rice') || lower.includes('basmati')) return { emoji: '🍚', bg: 'linear-gradient(135deg, #f0fdf4, #d1fae5)' };
  if (lower.includes('tomato')) return { emoji: '🍅', bg: 'linear-gradient(135deg, #fef2f2, #fecaca)' };
  if (lower.includes('onion')) return { emoji: '🧅', bg: 'linear-gradient(135deg, #fdf4ff, #f5d0fe)' };
  if (lower.includes('potato')) return { emoji: '🥔', bg: 'linear-gradient(135deg, #fefce8, #fef08a)' };
  if (lower.includes('chili') || lower.includes('mirch')) return { emoji: '🌶️', bg: 'linear-gradient(135deg, #fff1f2, #fda4af)' };
  if (lower.includes('maize') || lower.includes('corn')) return { emoji: '🌽', bg: 'linear-gradient(135deg, #fffbeb, #fde68a)' };
  if (lower.includes('turmeric')) return { emoji: '🟡', bg: 'linear-gradient(135deg, #fefce8, #fbbf24)' };
  return { emoji: '🌿', bg: 'linear-gradient(135deg, #f0fdf4, #bbf7d0)' };
}

export default function CartPage() {
  const { isAuthenticated } = useAuthStore();
  const { items, updateQuantity, removeItem, total } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const subtotal = total();
  const CONSUMER_FONT = "var(--font-jakarta, 'Plus Jakarta Sans'), sans-serif";

  return (
    <main style={{ minHeight: '100vh', background: '#FAFAF8' }}>
      {/* ── Nav ──────────────────────────────────────── */}
      {isAuthenticated ? <DashboardNav /> : (
        <nav style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(250,250,248,0.92)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E5E7EB', height: '4rem',
          display: 'flex', alignItems: 'center',
        }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: CONSUMER_FONT, fontWeight: 700, fontSize: '1.35rem', color: '#2D6A4F' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="AgriConnect"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.22.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#2D6A4F"/></svg>
              AgriConnect
            </Link>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Link href="/marketplace" className="btn btn-ghost btn-sm">Marketplace</Link>
              <Link href="/auth/consumer" className="btn btn-sm" style={{ background: '#FF6B35', color: '#fff', borderRadius: '9999px' }}>Sign In</Link>
            </div>
          </div>
        </nav>
      )}

      {/* ── Content ──────────────────────────────────── */}
      <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        {/* Page header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontFamily: CONSUMER_FONT, fontSize: '1.6rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '0.25rem' }}>Your Cart</h1>
          <p style={{ fontSize: '0.9rem', color: '#6B7280' }}>Review your items before proceeding to checkout.</p>
        </div>

        {items.length === 0 ? (
          /* ── Empty State ──────────────────────────── */
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '4rem 2rem', textAlign: 'center',
            border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
          }}>
            <div style={{ width: '6rem', height: '6rem', borderRadius: '50%', background: '#F0F4F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-label="Empty cart"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="#9BA3A5"/></svg>
            </div>
            <h2 style={{ fontFamily: CONSUMER_FONT, fontWeight: 700, fontSize: '1.25rem', color: '#1A1A1A' }}>Your cart is empty</h2>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', maxWidth: '360px' }}>Browse our marketplace to discover fresh produce directly from verified farmers.</p>
            <Link href="/marketplace" className="btn" style={{ background: '#FF6B35', color: '#fff', borderRadius: '9999px', padding: '0.75rem 2rem', fontWeight: 600, marginTop: '0.5rem' }}>
              Explore Fresh Produce
            </Link>
          </div>
        ) : (
          /* ── Cart Layout: Items + Summary ──────────── */
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {/* Left — Items */}
            <div style={{ flex: '1 1 480px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map(item => {
                const visual = getCropVisual(item.crop_name);
                return (
                  <div key={item.listing_id} style={{
                    background: '#fff', borderRadius: '16px', padding: '1.25rem',
                    display: 'flex', gap: '1rem', alignItems: 'center',
                    border: '1px solid rgba(229,231,235,0.5)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'box-shadow 0.3s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)')}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      width: '6rem', height: '6rem', borderRadius: '12px', flexShrink: 0,
                      background: visual.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '2.5rem',
                    }}>
                      {visual.emoji}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                          <div>
                            <h3 style={{ fontFamily: CONSUMER_FONT, fontWeight: 600, fontSize: '1rem', color: '#1A1A1A', margin: 0 }}>{item.crop_name}</h3>
                            <p style={{ fontSize: '0.8rem', color: '#2D6A4F', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="#2D6A4F" aria-label="Verified"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                              Farm Direct
                            </p>
                          </div>
                          <span style={{ fontFamily: CONSUMER_FONT, fontWeight: 600, fontSize: '1rem', color: '#1A1A1A' }}>
                            ₹{(item.price_per_kg * item.quantity_kg).toLocaleString()}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Sold by: {item.farmer_name} · ₹{item.price_per_kg}/kg</p>
                      </div>

                      {/* Bottom row: stepper + remove */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Pill-shaped stepper */}
                        <div style={{
                          display: 'flex', alignItems: 'center',
                          background: '#F3F4F1', borderRadius: '9999px', border: '1px solid #E5E7EB',
                        }}>
                          <button aria-label="Decrease quantity" onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(item.listing_id, Math.max(item.min_order_kg ?? 1, item.quantity_kg - (item.min_order_kg ?? 1))); }}
                            style={{ width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: '1.1rem', transition: 'color 0.15s' }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B35')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}>−</button>
                          <span style={{ fontWeight: 600, minWidth: '2.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#1A1A1A' }}>{item.quantity_kg}</span>
                          <button aria-label="Increase quantity" onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(item.listing_id, item.quantity_kg + (item.min_order_kg ?? 1)); }}
                            style={{ width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: '1.1rem', transition: 'color 0.15s' }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B35')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}>+</button>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#6B7280', marginLeft: '0.5rem' }}>kg</span>

                        {/* Remove */}
                        <button onClick={() => removeItem(item.listing_id)} aria-label="Remove item"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: '0.8rem', fontWeight: 500, transition: 'color 0.15s' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#C1121F')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right — Order Summary */}
            <div style={{ flex: '0 0 360px', maxWidth: '380px', width: '100%' }}>
              <div style={{
                background: '#fff', borderRadius: '16px', padding: '1.75rem',
                border: '1px solid rgba(229,231,235,0.5)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                position: 'sticky', top: '5rem',
              }}>
                <h2 style={{ fontFamily: CONSUMER_FONT, fontWeight: 700, fontSize: '1.15rem', color: '#1A1A1A', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #E5E7EB' }}>
                  Order Summary
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem', fontSize: '0.9rem', color: '#6B7280' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                    <span style={{ fontWeight: 500, color: '#1A1A1A' }}>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Delivery</span>
                    <span style={{ fontWeight: 500, color: '#059669' }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Platform Fee</span>
                    <span style={{ fontWeight: 500, color: '#059669' }}>₹0</span>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ fontFamily: CONSUMER_FONT, fontWeight: 700, fontSize: '1.05rem', color: '#1A1A1A' }}>Total</span>
                  <span style={{ fontFamily: CONSUMER_FONT, fontWeight: 800, fontSize: '1.5rem', color: '#2D6A4F' }}>₹{subtotal.toLocaleString()}</span>
                </div>
                <button
                  id="checkout-btn"
                  onClick={() => {
                    if (!isAuthenticated) { router.push('/auth/consumer'); return; }
                    router.push('/checkout');
                  }}
                  style={{
                    width: '100%', background: '#FF6B35', color: '#fff', border: 'none', borderRadius: '9999px',
                    padding: '0.85rem 1.5rem', fontFamily: CONSUMER_FONT, fontWeight: 600, fontSize: '1rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    transition: 'opacity 0.15s, box-shadow 0.15s',
                    boxShadow: '0 2px 8px rgba(255,107,53,0.3)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,107,53,0.4)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,107,53,0.3)'; }}
                >
                  Proceed to Checkout
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                </button>

                {/* Trust badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1rem', color: '#6B7280', fontSize: '0.78rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#6B7280" aria-hidden="true"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                  Secure SSL Checkout
                </div>

                {/* Continue shopping */}
                <Link href="/marketplace" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                  marginTop: '0.75rem', color: '#6B7280', fontSize: '0.85rem', fontWeight: 500,
                  textDecoration: 'none', transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B35')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
