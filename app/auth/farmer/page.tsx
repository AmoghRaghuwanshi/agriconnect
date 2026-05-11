'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, DEMO_USERS } from '@/store/authStore';

export default function FarmerAuthPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) { setError('Please enter a valid 10-digit mobile number.'); return; }
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleaned })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }
      
      setStep('otp');
    } catch (err) {
      setError(String(err).replace('Error: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) { setError('Please enter a valid 6-digit OTP.'); return; }
    
    setLoading(true);
    try {
      const cleanedPhone = phone.replace(/\D/g, '');
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanedPhone, otp })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }
      
      login(data.user);
      router.push('/farmer/dashboard');
    } catch (err) {
      setError(String(err).replace('Error: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    login(DEMO_USERS.FARMER);
    router.push('/farmer/dashboard');
  };

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, var(--green-50) 0%, var(--bg-base) 50%)', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', height: '4rem', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.3rem', color: 'var(--green-900)' }}>🌾 AgriConnect</Link>
          <span className="badge badge-green">Farmer Portal</span>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.25rem', margin: '0 auto 1.5rem' }}>
              🌾
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Farmer Login</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Enter your mobile number — or use demo login below.
            </p>

            {/* Demo Login — prominent */}
            <button
              id="demo-farmer-login"
              className="btn btn-primary"
              onClick={handleDemoLogin}
              style={{ width: '100%', justifyContent: 'center', marginBottom: '1.25rem', padding: '0.875rem', fontSize: '0.95rem', gap: '0.75rem' }}
            >
              ⚡ Demo Login as Farmer (Raju Patel)
            </button>

            <div className="divider">or login with OTP</div>

            {step === 'phone' ? (
              <form onSubmit={handleSendOTP}>
                <div className="form-group" style={{ textAlign: 'left' }}>
                  <label className="label" htmlFor="farmer-phone">Mobile Number</label>
                  <div className="input-group">
                    <span className="input-group-icon" style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>+91</span>
                    <input
                      id="farmer-phone"
                      type="tel"
                      className="input"
                      placeholder="9876543210"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      maxLength={10}
                      style={{ paddingLeft: '3rem' }}
                      required
                    />
                  </div>
                </div>

                {error && <div className="alert alert-error" style={{ marginBottom: '1rem', textAlign: 'left' }}><span>⚠️</span><span style={{ fontSize: '0.85rem' }}>{error}</span></div>}

                <button id="farmer-send-otp-btn" type="submit" className="btn btn-outline" disabled={loading || phone.length !== 10}
                  style={{ width: '100%', justifyContent: 'center' }}>
                  {loading ? <span className="spinner" style={{ width: '1rem', height: '1rem' }} /> : '📱 Send OTP via SMS'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP}>
                <div className="form-group" style={{ textAlign: 'left' }}>
                  <label className="label" htmlFor="farmer-otp">Enter 6-digit OTP sent to +91 {phone}</label>
                  <input
                    id="farmer-otp"
                    type="text"
                    className="input"
                    placeholder="123456"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
                    required
                    autoFocus
                  />
                </div>

                {error && <div className="alert alert-error" style={{ marginBottom: '1rem', textAlign: 'left' }}><span>⚠️</span><span style={{ fontSize: '0.85rem' }}>{error}</span></div>}

                <button id="farmer-verify-otp-btn" type="submit" className="btn btn-primary" disabled={loading || otp.length !== 6}
                  style={{ width: '100%', justifyContent: 'center' }}>
                  {loading ? <span className="spinner" style={{ width: '1rem', height: '1rem', borderTopColor: '#fff' }} /> : '✅ Verify & Login'}
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setStep('phone'); setOtp(''); setError(''); }} style={{ marginTop: '0.5rem', width: '100%' }}>
                  ← Back to phone
                </button>
              </form>
            )}

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--green-50)', borderRadius: 'var(--radius-md)', textAlign: 'left' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--green-900)', fontWeight: 600, marginBottom: '0.25rem' }}>🎤 Hindi Voice Support</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Once logged in, you can list produce using your voice in Hindi.</p>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <Link href="/auth/consumer" className="btn btn-ghost btn-sm">🛒 Consumer</Link>
              <Link href="/auth/wholesaler" className="btn btn-ghost btn-sm">🏭 Wholesaler</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
