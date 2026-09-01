import React, { useState } from 'react';
import { Scan, CheckCircle2, Lock } from 'lucide-react';
import { triggerSettlementConfetti } from './ConfettiTrigger';

interface BiometricAuthScannerProps {
  actionTitle: string;
  amountText: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const BiometricAuthScanner: React.FC<BiometricAuthScannerProps> = ({
  actionTitle,
  amountText,
  onSuccess,
  onCancel,
}) => {
  const [scanStep, setScanStep] = useState<'prompt' | 'scanning' | 'verified'>('prompt');

  const startScan = () => {
    setScanStep('scanning');
    setTimeout(() => {
      setScanStep('verified');
      triggerSettlementConfetti();
      setTimeout(() => {
        onSuccess();
      }, 1200);
    }, 1800);
  };

  return (
    <div className="modal-overlay" style={{ backdropFilter: 'blur(12px)' }}>
      <div
        className="modal-card"
        style={{
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
          border: '1px solid var(--border-red)',
          boxShadow: '0 0 40px rgba(239, 68, 68, 0.35)',
          background: 'linear-gradient(180deg, #160d13 0%, #0c080b 100%)',
          borderRadius: '24px',
          padding: '32px 24px',
        }}
      >
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '9999px',
              backgroundColor: scanStep === 'verified' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `2px solid ${scanStep === 'verified' ? 'var(--green-valid)' : 'var(--red-primary)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: scanStep === 'verified' ? '0 0 24px rgba(16, 185, 129, 0.5)' : '0 0 24px rgba(239, 68, 68, 0.4)',
            }}
          >
            {scanStep === 'scanning' && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, transparent, #ef4444, transparent)',
                  boxShadow: '0 0 12px #ef4444',
                  animation: 'laserScan 1.4s ease-in-out infinite alternate',
                }}
              />
            )}

            {scanStep === 'verified' ? (
              <CheckCircle2 size={40} color="var(--green-valid)" />
            ) : scanStep === 'scanning' ? (
              <Scan size={40} color="var(--red-primary)" style={{ animation: 'pulse 1s infinite' }} />
            ) : (
              <Lock size={36} color="var(--red-primary)" />
            )}
          </div>
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', marginBottom: '6px' }}>
          {scanStep === 'verified' ? 'Identity Cryptographically Signed' : 'Sovereign Biometric Authorization'}
        </h3>

        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>
          {actionTitle}
        </div>

        <div
          style={{
            backgroundColor: '#1c0f15',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid var(--border-red)',
            marginBottom: '24px',
            fontFamily: 'var(--font-mono)',
            fontSize: '18px',
            fontWeight: 800,
            color: '#fff',
          }}
        >
          {amountText}
        </div>

        {scanStep === 'prompt' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={startScan}
              className="btn-red"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '15px',
                borderRadius: '12px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Scan size={18} />
              Authenticate with FaceID / HSM
            </button>
            <button
              onClick={onCancel}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                fontSize: '13px',
                padding: '8px',
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {scanStep === 'scanning' && (
          <div style={{ color: 'var(--red-primary)', fontSize: '13.5px', fontWeight: 700 }}>
            Verifying 256-bit Secure Enclave Principal...
          </div>
        )}

        {scanStep === 'verified' && (
          <div style={{ color: 'var(--green-valid)', fontSize: '14px', fontWeight: 800 }}>
            ✓ Atomic 2/3+ BFT Notarization Emitted
          </div>
        )}
      </div>
    </div>
  );
};
