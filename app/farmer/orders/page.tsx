'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore, type OrderStatus } from '@/store/orderStore';
import DashboardNav from '@/components/shared/DashboardNav';

type Tab = 'ALL' | 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

const statusBadge: Record<OrderStatus, string> = {
  PENDING: 'badge-amber', CONFIRMED: 'badge-blue', OUT_FOR_DELIVERY: 'badge-purple',
  DELIVERED: 'badge-green', COMPLETED: 'badge-gray', CANCELLED: 'badge-red', DISPUTED: 'badge-red',
};

const statusLabel: Record<OrderStatus, string> = {
  PENDING: 'PENDING', CONFIRMED: 'PROCESSING', OUT_FOR_DELIVERY: 'SHIPPED',
  DELIVERED: 'DELIVERED', COMPLETED: 'COMPLETED', CANCELLED: 'CANCELLED', DISPUTED: 'DISPUTED',
};

function formatDate(ts: string) {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) return `Today, ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
  if (diff < 172800000) return `Yesterday, ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function FarmerOrdersPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { orders, confirmOrder, markOutForDelivery } = useOrderStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (mounted && (!isAuthenticated || user?.role !== 'FARMER')) router.push('/auth/farmer');
  }, [mounted, isAuthenticated, user, router]);

  if (!mounted || !user) return null;

  const myOrders = orders.filter(o => o.farmerId === user.id);
  const filtered = (tab === 'ALL' ? myOrders :
    tab === 'PENDING' ? myOrders.filter(o => o.orderStatus === 'PENDING') :
    tab === 'ACTIVE' ? myOrders.filter(o => ['CONFIRMED', 'OUT_FOR_DELIVERY'].includes(o.orderStatus)) :
    tab === 'COMPLETED' ? myOrders.filter(o => ['DELIVERED', 'COMPLETED'].includes(o.orderStatus)) :
    myOrders.filter(o => ['CANCELLED', 'DISPUTED'].includes(o.orderStatus))
  ).filter(o => !searchQuery || o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.cropName.toLowerCase().includes(searchQuery.toLowerCase()));

  const tabCounts: Record<Tab, number> = {
    ALL: myOrders.length,
    PENDING: myOrders.filter(o => o.orderStatus === 'PENDING').length,
    ACTIVE: myOrders.filter(o => ['CONFIRMED', 'OUT_FOR_DELIVERY'].includes(o.orderStatus)).length,
    COMPLETED: myOrders.filter(o => ['DELIVERED', 'COMPLETED'].includes(o.orderStatus)).length,
    CANCELLED: myOrders.filter(o => ['CANCELLED', 'DISPUTED'].includes(o.orderStatus)).length,
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingBottom: '5rem' }}>
      <DashboardNav />
      <div className="container" style={{ padding: '1.75rem 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, fontStyle: 'italic' }}>Manage Orders</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Review, process, and track your recent sales.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input className="input" placeholder="Search order ID or crop..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: '2.25rem', width: 220, fontSize: '0.85rem' }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '2px solid var(--border)', marginBottom: '1.75rem', overflowX: 'auto' }}>
          {(['ALL', 'PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '0.65rem 1rem', border: 'none', background: 'transparent',
              borderBottom: tab === t ? '2px solid var(--green-900)' : '2px solid transparent',
              marginBottom: '-2px', cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: tab === t ? 700 : 500,
              color: tab === t ? 'var(--green-900)' : 'var(--text-muted)',
              whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontFamily: 'inherit', transition: 'all 0.15s',
            }}>
              {t === 'ALL' ? 'All Orders' : t.charAt(0) + t.slice(1).toLowerCase()}
              {tabCounts[t] > 0 && (
                <span style={{
                  background: tab === t ? 'var(--green-900)' : 'var(--border)',
                  color: tab === t ? '#fff' : 'var(--text-muted)',
                  borderRadius: 'var(--radius-full)', padding: '0.1rem 0.45rem',
                  fontSize: '0.7rem', fontWeight: 700, lineHeight: 1.4,
                }}>{tabCounts[t]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        {filtered.length === 0 ? (
          <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📦</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>No orders found</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {tab === 'ALL' ? 'Aapki listings active hain — jald hi orders aayenge!' : `No ${tab.toLowerCase()} orders right now.`}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {filtered.map(o => (
              <div key={o.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Order ID + Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>#{o.id}</span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{formatDate(o.createdAt)}</div>
                  </div>
                  <span className={`badge ${statusBadge[o.orderStatus]}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                    {statusLabel[o.orderStatus]}
                  </span>
                </div>

                {/* Buyer info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--sand)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: 'var(--green-900)', flexShrink: 0,
                  }}>
                    {o.buyerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{o.buyerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      {o.orderStatus === 'PENDING' ? '📍 Awaiting confirmation' :
                       o.orderStatus === 'CONFIRMED' ? '📦 Pickup Scheduled' :
                       o.orderStatus === 'OUT_FOR_DELIVERY' ? '🚚 In Transit' :
                       o.orderStatus === 'DELIVERED' ? '✅ Payment Received' : ''}
                    </div>
                  </div>
                </div>

                {/* Item row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 8, background: 'var(--olive-100)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem',
                    }}>
                      {o.cropName.toLowerCase().includes('wheat') ? '🌾' :
                       o.cropName.toLowerCase().includes('tomato') ? '🍅' :
                       o.cropName.toLowerCase().includes('onion') ? '🧅' :
                       o.cropName.toLowerCase().includes('potato') ? '🥔' : '🌿'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{o.cropName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.quantityKg} kg · {o.orderType}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>₹{o.totalAmount.toLocaleString()}</div>
                </div>

                {/* Total + Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Amount</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "var(--font-outfit, 'Outfit'), sans-serif" }}>₹{o.totalAmount.toLocaleString()}</div>
                  </div>
                  {o.orderStatus === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-ghost btn-sm" style={{ color: '#DC2626', border: '1px solid var(--border)', borderRadius: 8 }}>✕</button>
                      <button className="btn btn-primary btn-sm" style={{ borderRadius: 8 }}
                        onClick={() => confirmOrder(o.id)}>✓ Accept</button>
                    </div>
                  )}
                  {o.orderStatus === 'CONFIRMED' && (
                    <button className="btn btn-outline btn-sm" style={{ borderRadius: 8 }}
                      onClick={() => markOutForDelivery(o.id)}>Mark Ready</button>
                  )}
                  {(o.orderStatus === 'DELIVERED' || o.orderStatus === 'COMPLETED') && (
                    <Link href={`/farmer/orders/${o.id}`} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
                      View Receipt →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
