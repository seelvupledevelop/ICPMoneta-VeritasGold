import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface ContextualGuidanceDrawerProps {
  pageTitle: string;
  whatIsThis: string;
  whoCanUse: string[];
  dataOrigin: string;
  operationalSteps: string[];
  controlsAndApprovals: string;
  riskWarnings: string[];
  auditEvidence: string;
}

export const ContextualGuidanceDrawer: React.FC<ContextualGuidanceDrawerProps> = ({
  pageTitle,
  whatIsThis,
  whoCanUse,
  dataOrigin,
  operationalSteps,
  controlsAndApprovals,
  riskWarnings,
  auditEvidence,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        backgroundColor: '#0c0a10',
        border: isOpen ? '1px solid var(--border-red)' : '1px solid var(--border-subtle)',
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: '16px',
        transition: 'all 0.2s ease',
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '10px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          backgroundColor: isOpen ? '#140d17' : '#0e0b12',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={16} color="var(--red-primary)" />
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF' }}>
            What is this page? • Operational Guidance & Regulatory Preconditions
          </span>
          <span
            style={{
              fontSize: '9.5px',
              padding: '1px 6px',
              borderRadius: '4px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: 'var(--red-primary)',
              fontWeight: 700,
            }}
          >
            {pageTitle}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span>{isOpen ? 'Collapse Guide' : 'Expand Official Guidance'}</span>
          {isOpen ? <ChevronUp size={14} color="var(--red-primary)" /> : <ChevronDown size={14} />}
        </div>
      </div>

      {isOpen && (
        <div
          className="fade-in"
          style={{
            padding: '18px 20px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            backgroundColor: '#09070c',
          }}
        >
          {/* 1. Purpose */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--red-primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
              1. Purpose & Functional Mandate
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
              {whatIsThis}
            </p>
          </div>

          {/* 2. Permitted Personas & Origin */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ backgroundColor: '#110c16', padding: '10px 12px', borderRadius: '6px', border: '1px solid #231622' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Permitted Roles & Clearance
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {whoCanUse.map((role) => (
                  <span
                    key={role}
                    style={{
                      fontSize: '9.5px',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: 'var(--red-primary)',
                      fontWeight: 600,
                    }}
                  >
                    ✓ {role}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#110c16', padding: '10px 12px', borderRadius: '6px', border: '1px solid #231622' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Data Freshness & Provenance
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                {dataOrigin}
              </p>
            </div>
          </div>

          {/* 3. Step-by-Step Workflow */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', marginBottom: '6px' }}>
              2. Step-by-Step Execution Workflow
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {operationalSteps.map((step, idx) => (
                <div key={idx} style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* 4. Controls, Risks & Audit Evidence */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--green-valid)', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', marginBottom: '4px' }}>
                <ShieldCheck size={13} />
                Approval Quorum & Safeguards
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                {controlsAndApprovals}
              </p>
            </div>

            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', marginBottom: '4px' }}>
                <AlertTriangle size={13} />
                Risk Warnings & 10-Yr Evidence
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                {auditEvidence}
              </p>
              {riskWarnings.length > 0 && (
                <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {riskWarnings.map((w, i) => (
                    <span key={i} style={{ fontSize: '10px', color: '#f59e0b' }}>• {w}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
