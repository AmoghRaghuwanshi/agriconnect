'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import styles from './MicFAB.module.css';

/**
 * MicFAB — Floating Action Button for farmer voice commands.
 * Provides STT (Hindi) → NLP (rule-based) → TTS (Hindi) → Navigation.
 */
export default function MicFAB() {
  const router = useRouter();
  const { state, transcript, response, action, isSupported, startListening, stopListening, reset } = useVoiceAgent({ useGemini: true });
  const actionHandled = useRef(false);

  // Navigate after TTS finishes speaking
  useEffect(() => {
    if (state === 'IDLE' && action && !actionHandled.current) {
      actionHandled.current = true;
      if (action.type === 'navigate' && action.path) {
        router.push(action.path);
      }
      // Reset after navigation delay
      const timer = setTimeout(() => {
        reset();
        actionHandled.current = false;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state, action, router, reset]);

  // Reset actionHandled when starting a new listen
  useEffect(() => {
    if (state === 'LISTENING') {
      actionHandled.current = false;
    }
  }, [state]);

  if (!isSupported) return null;

  const handleClick = () => {
    if (state === 'LISTENING') {
      stopListening();
    } else if (state === 'IDLE' || state === 'ERROR') {
      startListening();
    }
  };

  const fabClass = [
    styles.fab,
    state === 'IDLE' ? styles.fabIdle :
    state === 'LISTENING' ? styles.fabListening :
    state === 'PROCESSING' ? styles.fabProcessing :
    state === 'SPEAKING' ? styles.fabSpeaking :
    state === 'ERROR' ? styles.fabError : styles.fabIdle,
  ].join(' ');

  const icon =
    state === 'LISTENING' ? '⏹' :
    state === 'PROCESSING' ? '⏳' :
    state === 'SPEAKING' ? '🔊' :
    state === 'ERROR' ? '❌' : '🎤';

  // FIX: Always show bubble when not IDLE (even without transcript yet)
  const showBubble = state !== 'IDLE';

  return (
    <div className={styles['fab-container']}>
      {/* Transcript / Response Bubble */}
      {showBubble && (
        <div className={styles.bubble}>
          {state === 'LISTENING' && (
            <>
              <div className={styles.bubbleLabel}>सुन रहा हूं... / Listening...</div>
              <div className={styles.bubbleText}>
                {transcript || 'बोलिए... / Speak now...'}
              </div>
              <div className={styles.waveform}>
                <div className={styles.waveBar} />
                <div className={styles.waveBar} />
                <div className={styles.waveBar} />
                <div className={styles.waveBar} />
                <div className={styles.waveBar} />
              </div>
            </>
          )}
          {state === 'PROCESSING' && (
            <>
              <div className={styles.bubbleLabel}>समझ रहा हूं... / Processing...</div>
              <div className={styles.bubbleText}>{transcript}</div>
            </>
          )}
          {state === 'SPEAKING' && (
            <>
              <div className={styles.bubbleLabel}>✅ समझ गया / Understood</div>
              <div className={styles.bubbleResponse}>{response}</div>
            </>
          )}
          {state === 'ERROR' && (
            <>
              <div className={styles.bubbleLabel}>⚠️ Error</div>
              <div className={styles.bubbleText}>{response || 'Something went wrong. Tap mic to retry.'}</div>
            </>
          )}
        </div>
      )}

      {/* FAB Button */}
      <button
        className={fabClass}
        onClick={handleClick}
        aria-label={state === 'LISTENING' ? 'रोकें / Stop' : 'बोलें / Speak'}
        title={state === 'LISTENING' ? 'Stop listening' : 'Speak a command in Hindi'}
      >
        {icon}
      </button>
    </div>
  );
}
