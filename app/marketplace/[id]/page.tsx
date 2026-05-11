'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useListingStore } from '@/store/listingStore';
import { useCartStore, type CartItem } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

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

const CF = "var(--font-jakarta, 'Plus Jakarta Sans'), sans-serif";

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const { getById, getActive } = useListingStore();
  const { addItem, items: cartItems } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const listing = mounted ? getById(params.id) : undefined;

  useEffect(() => {
    if (mounted && listing) setQuantity(listing.minOrderKg);
  }, [mounted, listing]);

  if (!mounted) return null;
  if (!listing) { notFound(); }

  const isInCart = cartItems.some(i => i.listing_id === listing.id);
  const visual = getCropVisual(listing.cropName);
  const harvestDaysAgo = Math.max(0, Math.floor((Date.now() - new Date(listing.harvestDate).getTime()) / 86400000));
  const similar = getActive().filter(l => l.id !== listing.id && l.category === listing.category).slice(0, 3);

  const handleAddToCart = () => {
    if (!isAuthenticated) { router.push('/auth/consumer'); return; }
    const cartItem: CartItem = {
      id: `cart-${listing.id}-${Date.now()}`, listing_id: listing.id,
      quantity_kg: quantity, price_per_kg: listing.pricePerKg,
      crop_name: listing.cropName, farmer_name: listing.farmerName,
      farmer_id: listing.farmerId, min_order_kg: listing.minOrderKg,
    };
    addItem(cartItem);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => { handleAddToCart(); setTimeout(() => router.push('/cart'), 300); };

  return (
    <main style={{ minHeight: '100vh', background: '#FAFAF8' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(250,250,248,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E5E7EB', height: '4rem', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: CF, fontWeight: 700, fontSize: '1.3rem', color: '#2D6A4F', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#2D6A4F" aria-label="eco"><path d="M6.05 8.05a7.001 7.001 0 009.9 9.9C17.3 16.6 18 14.9 18 13c0-3.87-3.13-7-7-7-1.9 0-3.6.7-4.95 2.05zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
            AgriConnect
          </Link>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link href="/marketplace" className="btn btn-ghost btn-sm">← Marketplace</Link>
            <Link href="/cart" style={{ position: 'relative', padding: '0.5rem', borderRadius: '50%', background: '#F0F4F0', display: 'flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF6B35" aria-label="Cart"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: '1.5rem 1.5rem 4rem', maxWidth: '1100px', margin: '0 auto' }}>
        {/* Breadcrumbs */}
        <div style={{ fontSize: '0.8rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
          <Link href="/" style={{ transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = '#FF6B35')} onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}>Home</Link>
          <span>›</span>
          <Link href="/marketplace" style={{ transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = '#FF6B35')} onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}>{listing.category}</Link>
          <span>›</span>
          <span style={{ fontWeight: 500, color: '#1A1A1A' }}>{listing.cropName}</span>
        </div>

        {/* ── Hero Grid ────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Left — Image */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ width: '100%', aspectRatio: '1', background: visual.bg, borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8rem', border: '1px solid #E5E7EB', overflow: 'hidden', position: 'relative' }}>
              {visual.emoji}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', height: '4.5rem' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ flex: 1, borderRadius: '8px', border: i === 0 ? '2px solid #FF6B35' : '1px solid #E5E7EB', background: visual.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', opacity: i === 0 ? 1 : 0.6, cursor: 'pointer', transition: 'opacity 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => { if (i !== 0) e.currentTarget.style.opacity = '0.6'; }}>
                  {visual.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600, background: '#E8E8E5', color: '#414844', border: '1px solid #E5E7EB' }}>{listing.variety}</span>
              {listing.organic && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, background: '#FFD166', color: '#1A1A1A' }}>✓ Organic</span>}
              {listing.isB2b && <span style={{ display: 'inline-flex', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600, background: '#DBEAFE', color: '#1E40AF' }}>B2B</span>}
            </div>

            <h1 style={{ fontFamily: CF, fontSize: '1.6rem', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>{listing.cropName}</h1>

            {/* Price + harvest */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
              <span style={{ fontFamily: CF, fontWeight: 800, fontSize: '2.5rem', color: '#FF6B35', lineHeight: 1 }}>₹{listing.pricePerKg}<span style={{ fontSize: '1.1rem', fontWeight: 400, color: '#6B7280' }}>/kg</span></span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500, background: '#c1ecd4', color: '#1B4332', marginBottom: '0.4rem' }}>
                🕐 Harvested {harvestDaysAgo} day{harvestDaysAgo !== 1 ? 's' : ''} ago
              </span>
            </div>

            {/* Seller strip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: '#D8F3DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', color: '#1B4332' }}>
                {listing.farmerName.charAt(0)}
              </div>
              <div>
                <span style={{ fontWeight: 500, fontSize: '0.9rem', color: '#1A1A1A' }}>{listing.farmerName}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', color: '#6B7280' }}>📍 {listing.location}</span>
              </div>
            </div>

            {/* Stock + Pricing tiers */}
            <div style={{ background: '#FAFAF8', borderRadius: '12px', padding: '1rem', border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '0.5rem' }}><strong style={{ color: '#1A1A1A' }}>{listing.quantityRemaining.toLocaleString()} kg</strong> remaining</div>
              <div style={{ borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: '#fff' }}>
                  <span style={{ color: '#6B7280' }}>B2C (1–49 kg)</span>
                  <span style={{ fontWeight: 500, color: '#1A1A1A' }}>₹{listing.pricePerKg}/kg</span>
                </div>
                {listing.isB2b && <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: '#F3F4F1', borderTop: '1px solid #E5E7EB' }}>
                    <span><span style={{ color: '#6B7280' }}>Bulk: 50kg+</span> <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 500, marginLeft: '0.3rem' }}>5% off</span></span>
                    <span style={{ fontWeight: 500, color: '#1A1A1A' }}>₹{(listing.pricePerKg * 0.95).toFixed(0)}/kg</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: '#fff', borderTop: '1px solid #E5E7EB' }}>
                    <span><span style={{ color: '#6B7280' }}>Wholesale: 200kg+</span> <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 500, marginLeft: '0.3rem' }}>12% off</span></span>
                    <span style={{ fontWeight: 500, color: '#1A1A1A' }}>₹{(listing.pricePerKg * 0.88).toFixed(0)}/kg</span>
                  </div>
                </>}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Qty stepper */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '9999px', background: '#fff' }}>
                  <button aria-label="Decrease" onClick={() => setQuantity(q => Math.max(listing.minOrderKg, q - listing.minOrderKg))}
                    style={{ width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: '1.1rem' }}>−</button>
                  <span style={{ fontWeight: 600, minWidth: '2.5rem', textAlign: 'center', fontSize: '0.95rem' }}>{quantity}</span>
                  <button aria-label="Increase" onClick={() => setQuantity(q => Math.min(listing.quantityRemaining, q + listing.minOrderKg))}
                    style={{ width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: '1.1rem' }}>+</button>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>kg · = ₹{(quantity * listing.pricePerKg).toLocaleString()}</span>
              </div>

              {/* CTA buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button id="add-to-cart-btn" onClick={handleAddToCart}
                  style={{ flex: 1, background: added ? '#059669' : '#FF6B35', color: '#fff', border: 'none', borderRadius: '9999px', padding: '0.85rem', fontFamily: CF, fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(255,107,53,0.25)' }}>
                  {added ? '✓ Added!' : isInCart ? '🛒 Add More' : '🛒 Add to Cart'}
                </button>
                <button id="buy-now-btn" onClick={handleBuyNow}
                  style={{ flex: 1, background: 'transparent', color: '#FF6B35', border: '2px solid #FF6B35', borderRadius: '9999px', padding: '0.85rem', fontFamily: CF, fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'all 0.2s' }}>
                  ⚡ Buy Now
                </button>
              </div>
            </div>

            {/* Delivery strip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F0F4F0', padding: '0.6rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: '#6B7280' }}>
              🚚 Est. delivery <strong style={{ color: '#1A1A1A' }}>2–3 days</strong> · 📦 {listing.storageType}
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '2rem 0' }} />

        {/* ── Below Fold: Farmer + Comparison ─────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Farmer card */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontFamily: CF, fontWeight: 700, fontSize: '1.05rem', color: '#1A1A1A' }}>About the Farmer</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: '#D8F3DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.25rem', color: '#1B4332' }}>
                {listing.farmerName.charAt(0)}
              </div>
              <div>
                <div style={{ fontFamily: CF, fontWeight: 600, color: '#1A1A1A' }}>{listing.farmerName}</div>
                <div style={{ color: '#E9C46A', fontSize: '0.85rem', letterSpacing: '2px' }}>★★★★½</div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>📍 {listing.location}</div>
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>Farm: {listing.farmName}</div>
            <Link href="/marketplace" style={{ textAlign: 'center', color: '#FF6B35', fontWeight: 500, fontSize: '0.85rem', marginTop: 'auto' }}>View All Listings →</Link>
          </div>

          {/* Market comparison */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontFamily: CF, fontWeight: 700, fontSize: '1.05rem', color: '#1A1A1A', marginBottom: '0.5rem' }}>Market Price Comparison</h3>
            <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '1.25rem' }}>See how this listing compares to current Mandi rates.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.3rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '0.6rem', height: '0.6rem', borderRadius: '50%', background: '#FF6B35', display: 'inline-block' }}></span> This Listing</span>
                  <span style={{ color: '#FF6B35', fontWeight: 700 }}>₹{listing.pricePerKg}/kg</span>
                </div>
                <div style={{ width: '100%', background: '#E8E8E5', borderRadius: '9999px', height: '0.6rem', overflow: 'hidden' }}>
                  <div style={{ width: '70%', height: '100%', background: '#FF6B35', borderRadius: '9999px' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.3rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '0.6rem', height: '0.6rem', borderRadius: '50%', background: '#9BA3A5', display: 'inline-block' }}></span> Mandi Modal</span>
                  <span style={{ color: '#6B7280' }}>₹{Math.round(listing.pricePerKg * 1.15)}/kg</span>
                </div>
                <div style={{ width: '100%', background: '#E8E8E5', borderRadius: '9999px', height: '0.6rem', overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', background: '#9BA3A5', borderRadius: '9999px', opacity: 0.5 }}></div>
                </div>
              </div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#F0F4F0', borderRadius: '8px', padding: '0.5rem 0.75rem', marginTop: '1rem', color: '#059669', fontWeight: 500, fontSize: '0.8rem' }}>
              📉 You save ₹{Math.round(listing.pricePerKg * 0.15)}/kg vs local markets
            </div>
          </div>
        </div>

        {/* ── Similar Produce ─────────────────────── */}
        {similar.length > 0 && (
          <div>
            <h2 style={{ fontFamily: CF, fontWeight: 700, fontSize: '1.2rem', color: '#1A1A1A', marginBottom: '1.25rem' }}>Similar Produce from Nearby Farms</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {similar.map(s => {
                const sv = getCropVisual(s.cropName);
                return (
                  <Link key={s.id} href={`/marketplace/${s.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s', cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                      <div style={{ height: '10rem', background: sv.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>{sv.emoji}</div>
                      <div style={{ padding: '1rem' }}>
                        <div style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 500, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{s.location.toUpperCase()}</div>
                        <h3 style={{ fontFamily: CF, fontWeight: 600, fontSize: '1rem', color: '#1A1A1A', marginBottom: '0.5rem' }}>{s.cropName}</h3>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.3rem' }}>
                          <span style={{ fontFamily: CF, fontWeight: 700, fontSize: '1.1rem', color: '#1A1A1A' }}>₹{s.pricePerKg}</span>
                          <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>/kg</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
