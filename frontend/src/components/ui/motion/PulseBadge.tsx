import React from 'react';

interface PulseBadgeProps {
  label: string;
  variant?: 'green' | 'red' | 'gold';
  pulse?: boolean;
}

export const PulseBadge: React.FC<PulseBadgeProps> = ({
  label,
  variant = 'green',
  pulse = true,
}) => {
  const colorMap = {
    green: {
      bg: 'rgba(16, 185, 129, 0.15)',
      border: 'rgba(16, 185, 129, 0.4)',
      text: '#10b981',
      dot: '#10b981',
      glow: 'rgba(16, 185, 129, 0.5)',
    },
    red: {
      bg: 'rgba(239, 68, 68, 0.15)',
      border: 'rgba(239, 68, 68, 0.4)',
      text: '#ef4444',
      dot: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.5)',
    },
    gold: {
      bg: 'rgba(245, 158, 11, 0.15)',
      border: 'rgba(245, 158, 11, 0.4)',
      text: '#f59e0b',
      dot: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.5)',
    },
  }[variant];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 9px',
        borderRadius: '9999px',
        backgroundColor: colorMap.bg,
        border: `1px solid ${colorMap.border}`,
        color: colorMap.text,
        fontSize: '11px',
        fontWeight: 700,
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.02em',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '9999px',
          backgroundColor: colorMap.dot,
          boxShadow: pulse ? `0 0 8px ${colorMap.glow}` : 'none',
          animation: pulse ? 'beaconPulse 1.8s infinite ease-in-out' : 'none',
        }}
      />
      {label}
    </div>
  );
};
