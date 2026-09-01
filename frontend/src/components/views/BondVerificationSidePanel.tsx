import React, { useState } from 'react';
import {
  FileCheck2,
  Send,
} from 'lucide-react';
import { PulseBadge } from '../ui/motion/PulseBadge';

interface BondVerificationSidePanelProps {
  isin?: string;
  bondTitle?: string;
  couponRate?: string;
  maturityDate?: string;
  issuerLegalEntity?: string;
}

export const BondVerificationSidePanel: React.FC<BondVerificationSidePanelProps> = ({
  isin = 'XC0009845012',
  bondTitle = 'Swiss Fiduciary 5Y Gold-Linked Sovereign Note',
  couponRate = '4.25% p.a.',
  maturityDate = '2031-09-01',
  issuerLegalEntity = 'Swiss National Bank / Fiduciary Division',
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; citations?: string[] }>>([
    {
      sender: 'assistant',
      text: `Hello. I am the Veritas Bond Verification Assistant. I provide structured, verifiable citations from approved prospectuses and legal termsheets for ${bondTitle} (${isin}). Note: I do not provide investment advice or execute unapproved orders.`,
      citations: ['Prospectus Section 4.1 (ACTUS PAM)', 'Zurich Bullion Title Attestation #ZRH-01'],
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText;
    setInputText('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);

    setTimeout(() => {
      let reply = '';
      let citations = ['Prospectus Legal Registry'];

      if (userMsg.toLowerCase().includes('coupon') || userMsg.toLowerCase().includes('rate')) {
        reply = `According to Terms Supplement Art. 3.2, the fixed coupon rate is ${couponRate} calculated on ACTUS Actual/360 day-count convention. Coupons are distributed semi-annually directly via pacs.008 settlement instructions.`;
        citations = ['Terms Supplement Art. 3.2', 'ACTUS DayCount PAM Matrix'];
      } else if (userMsg.toLowerCase().includes('gold') || userMsg.toLowerCase().includes('backing') || userMsg.toLowerCase().includes('custody')) {
        reply = `The underlying collateral is 100% physically allocated in Zurich Duty-Free Vault ZRH-01. Custody is attested under Swiss BankG Art. 899 with continuous ultrasonic IoT density telemetry.`;
        citations = ['Zurich Vault Title Certificate #ZRH-01', 'LBMA Good Delivery Bar Registry'];
      } else if (userMsg.toLowerCase().includes('buy') || userMsg.toLowerCase().includes('invest')) {
        reply = `To participate in primary subscription or Dutch auctions, submit a formal Request for Quote (RFQ) or auction bid slip through your Primary Dealer account. All orders require 2-of-2 maker-checker sign-off.`;
        citations = ['Primary Dealer Master Agreement Sec. 8'];
      } else {
        reply = `Document verified: ${bondTitle} is issued by ${issuerLegalEntity} under Swiss Governing Law with maturity on ${maturityDate}. Legal classification: Regulated Institutional Sovereign Debt.`;
        citations = ['ISIN Allocation Notice ISO 6166', 'FinSA Institutional Prospectus'];
      }

      setMessages((prev) => [...prev, { sender: 'assistant', text: reply, citations }]);
    }, 600);
  };

  return (
    <div
      style={{
        backgroundColor: '#0c0a10',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        height: '520px',
        overflow: 'hidden',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: '#0f0b14',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileCheck2 size={16} color="var(--red-primary)" />
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#FFFFFF' }}>Bond Intelligence & Verification</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Citations from Approved Termsheets & ACTUS Code</div>
          </div>
        </div>
        <PulseBadge label="Verified Data" variant="green" />
      </div>

      {/* Investor Pre-Flight Checklist */}
      <div style={{ padding: '8px 12px', backgroundColor: '#130d17', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
        <span style={{ color: 'var(--text-dim)', fontWeight: 700 }}>PRE-FLIGHT:</span>
        <span style={{ color: 'var(--green-valid)', fontWeight: 600 }}>✓ Investor KYC Cleared</span>
        <span style={{ color: 'var(--green-valid)', fontWeight: 600 }}>✓ ISIN Verified</span>
        <span style={{ color: '#f59e0b', fontWeight: 600 }}>⚠ 2-of-2 Approval Required</span>
      </div>

      {/* Messages Feed */}
      <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '88%',
              backgroundColor: m.sender === 'user' ? 'var(--red-primary)' : '#16101c',
              border: m.sender === 'user' ? 'none' : '1px solid #281d2f',
              padding: '10px 12px',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '12px',
              lineHeight: 1.4,
            }}
          >
            <div>{m.text}</div>
            {m.citations && m.citations.length > 0 && (
              <div style={{ marginTop: '6px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4px', fontSize: '9.5px', color: 'var(--red-primary)', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                <span style={{ color: 'var(--text-dim)' }}>CITATIONS:</span>
                {m.citations.map((c, i) => (
                  <span key={i} style={{ textDecoration: 'underline' }}>{c}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSendMessage} style={{ padding: '10px 12px', borderTop: '1px solid var(--border-subtle)', backgroundColor: '#0e0b12', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Ask about coupon terms, collateral backing, ISIN legal status..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="input-dark"
          style={{ flex: 1, padding: '8px 10px', fontSize: '11.5px' }}
        />
        <button type="submit" className="btn-red" style={{ padding: '8px 12px', fontSize: '12px' }}>
          <Send size={13} />
        </button>
      </form>
    </div>
  );
};
