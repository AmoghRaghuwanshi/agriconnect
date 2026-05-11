'use client';

import { useState, useEffect } from 'react';

const EXAMPLES = [
  { icon: '🌾', hindi: '"100 kilo gehun bechna hai, 21 rupye kilo"', english: 'Create a wheat listing' },
  { icon: '📦', hindi: '"Mere orders dikhao"', english: 'View your orders' },
  { icon: '📊', hindi: '"Gehun ka mandi bhav kya hai?"', english: 'Check mandi prices' },
];

/**
 * VoiceTutorial — First-time overlay introducing voice commands to farmers.
 * Shows on first visit, dismissed with "Got it" button, remembers via localStorage.
 */
export default function VoiceTutorial() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show on browsers that support speech
    const hasSupport = typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    const alreadySeen = localStorage.getItem('agriconnect-voice-tutorial') === 'done';

    if (hasSupport && !alreadySeen) {
      // Small delay so dashboard renders first
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('agriconnect-voice-tutorial', 'done');
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={dismiss}>
      <div className="modal" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.15rem' }}>
            🎤 Voice Commands — आवाज से काम करें
          </h2>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            नीचे दिए गए 🎤 बटन पर tap करें और Hindi में बोलें। AI आपकी बात समझकर काम करेगा।
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {EXAMPLES.map((ex, i) => (
              <div key={i} className="card-flat" style={{ padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{ex.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--green-900)', marginBottom: '0.15rem' }}>
                    {ex.hindi}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {ex.english}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: 'var(--green-50)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--green-900)' }}>
            💡 Tip: Chrome browser mein voice sabse achcha kaam karta hai.
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={dismiss} style={{ width: '100%', justifyContent: 'center' }}>
            👍 समझ गया — Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
