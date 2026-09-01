import React, { useState } from 'react';
import {
  Send,
  Lock,
  DollarSign,
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface ChatContact {
  id: string;
  name: string;
  country: string;
  flag: string;
  bic: string;
  status: 'Online (VetKeys E2EE)' | 'Encrypted Mesh Active';
  lastMessage: string;
  lastTime: string;
}

export const CHAT_CONTACTS: ChatContact[] = [
  {
    id: 'CBRT-TURKEY',
    name: 'Central Bank of the Republic of Turkey (CBRT)',
    country: 'Turkey',
    flag: '🇹🇷',
    bic: 'TCZBTR2AXXX',
    status: 'Online (VetKeys E2EE)',
    lastMessage: 'Ready to settle 500 oz Physical Gold swap against Zurich Vault.',
    lastTime: '10:35',
  },
  {
    id: 'SNB-SWISS',
    name: 'Swiss National Bank (SNB Treasury Desk)',
    country: 'Switzerland',
    flag: '🇨🇭',
    bic: 'SNBCH22XXXX',
    status: 'Online (VetKeys E2EE)',
    lastMessage: 'Zurich Vault ZRH-01 ultrasonic bullion density confirmed 99.992%.',
    lastTime: '10:32',
  },
  {
    id: 'HKMA-HONGKONG',
    name: 'Hong Kong Monetary Authority (HKMA Corridor)',
    country: 'Hong Kong',
    flag: '🇭🇰',
    bic: 'HKMAHK2HXXX',
    status: 'Online (VetKeys E2EE)',
    lastMessage: 'Hong Kong Vault HKG-01 liquidity ready for ckEUR atomic DvP.',
    lastTime: '10:28',
  },
  {
    id: 'NBU-UKRAINE',
    name: 'National Bank of Ukraine (NBU Sovereign Desk)',
    country: 'Ukraine',
    flag: '🇺🇦',
    bic: 'NBUKUA2XXXX',
    status: 'Encrypted Mesh Active',
    lastMessage: 'Bilateral settlement quota verified for emergency gold backing.',
    lastTime: '09:50',
  },
  {
    id: 'CBR-RUSSIA',
    name: 'Bank of Russia (Bilateral Clearing Node)',
    country: 'Russia',
    flag: '🇷🇺',
    bic: 'CBRRU2MXXXX',
    status: 'Online (VetKeys E2EE)',
    lastMessage: 'Direct RWA Gold transfer channel open via Hong Kong depository.',
    lastTime: '09:15',
  },
];

interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  isPayment?: boolean;
  paymentDetails?: {
    asset: 'XAU-Gold' | 'ckEUR' | 'ckUSD';
    amount: string;
    valueEur: string;
    vault: string;
    status: 'Pending' | 'Settled';
    txHash: string;
  };
}

interface SignalEncryptedChatViewProps {
  onNotify: (msg: string, isError?: boolean) => void;
  onRefresh?: () => void;
}

export const SignalEncryptedChatView: React.FC<SignalEncryptedChatViewProps> = ({
  onNotify,
  onRefresh,
}) => {
  const [selectedContact, setSelectedContact] = useState<ChatContact>(CHAT_CONTACTS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'them',
      text: 'Good morning Zurich. We are initiating bilateral settlement for Turkish gold reserves.',
      time: '10:30',
    },
    {
      id: 'm-2',
      sender: 'them',
      text: 'Requesting atomic transfer of 500 oz Swiss Physical Gold (ZRH-01) against 1,271,050.00 ckEUR.',
      time: '10:32',
      isPayment: true,
      paymentDetails: {
        asset: 'XAU-Gold',
        amount: '500.00 oz',
        valueEur: '€1,271,050.00',
        vault: 'Zurich Duty-Free Vault ZRH-01',
        status: 'Pending',
        txHash: '0x8f1a...49bc',
      },
    },
    {
      id: 'm-3',
      sender: 'me',
      text: 'Understood Ankara. Verifying ZK-AML proof and ultrasonic vault telemetry on ICP canister...',
      time: '10:34',
    },
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [sendAmount, setSendAmount] = useState('100.00');
  const [sendAsset, setSendAsset] = useState<'XAU-Gold' | 'ckEUR' | 'ckUSD'>('ckEUR');
  const [showSendMoneyModal, setShowSendMoneyModal] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'me',
      text: inputMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
    onNotify(`Encrypted message dispatched to ${selectedContact.name} via VetKeys E2EE`);
  };

  const handleSendPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const newPaymentMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'me',
      text: `Direct Sovereign Wire: Transferred ${sendAmount} ${sendAsset}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPayment: true,
      paymentDetails: {
        asset: sendAsset,
        amount: `${sendAmount} ${sendAsset === 'XAU-Gold' ? 'oz' : sendAsset}`,
        valueEur: sendAsset === 'XAU-Gold' ? `€${(parseFloat(sendAmount) * 2542.10).toLocaleString()}` : `€${parseFloat(sendAmount).toLocaleString()}`,
        vault: sendAsset === 'XAU-Gold' ? 'Zurich Vault ZRH-01 ➔ Hong Kong HKG-01' : 'ICP Canister Liquidity Pool',
        status: 'Settled',
        txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      },
    };

    setMessages((prev) => [...prev, newPaymentMsg]);
    setShowSendMoneyModal(false);
    onNotify(`Settlement Succeeded! Dispatched ${sendAmount} ${sendAsset} to ${selectedContact.name} in < 400ms!`);
    if (onRefresh) onRefresh();
  };

  const handleAcceptPayment = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId && m.paymentDetails) {
          return {
            ...m,
            paymentDetails: {
              ...m.paymentDetails,
              status: 'Settled',
            },
          };
        }
        return m;
      })
    );
    onNotify(`Atomic DvP Swap Executed! 500 oz Swiss Gold transferred on-chain in 380ms!`);
    if (onRefresh) onRefresh();
  };

  return (
    <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '16px', height: '640px' }}>
      {/* Left Contacts List */}
      <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: '#0e0c12' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={16} color="var(--red-primary)" />
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>Signal E2EE Channels</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>VetKeys Double-Ratchet Sovereign Mesh</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {CHAT_CONTACTS.map((c) => {
            const isSelected = selectedContact.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedContact(c)}
                style={{
                  padding: '12px',
                  borderBottom: '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'rgba(239, 68, 68, 0.12)' : 'transparent',
                  cursor: 'pointer',
                  borderLeft: isSelected ? '3px solid var(--red-primary)' : '3px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px' }}>{c.flag}</span>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: isSelected ? '#FFFFFF' : 'var(--text-main)' }}>
                      {c.country}
                    </span>
                  </div>
                  <span style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{c.lastTime}</span>
                </div>

                <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.lastMessage}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Chat & Settlement Window */}
      <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Chat Header */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: '#0e0c12', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>{selectedContact.flag}</span>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>{selectedContact.name}</div>
              <div style={{ fontSize: '10px', color: 'var(--green-valid)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="pill-valid" style={{ fontSize: '8.5px', padding: '1px 5px' }}>● {selectedContact.status}</span>
                <span>BIC: {selectedContact.bic}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSendMoneyModal(true)}
            className="btn-red"
            style={{ padding: '6px 12px', fontSize: '11.5px' }}
          >
            <DollarSign size={14} /> Send Money / Gold
          </button>
        </div>

        {/* Message Stream */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#08060a' }}>
          {messages.map((m) => {
            const isMe = m.sender === 'me';
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '78%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                {m.isPayment && m.paymentDetails ? (
                  /* In-Chat Payment Bubble */
                  <div
                    className="card card-red-accent"
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      backgroundColor: '#160e14',
                      border: '1px solid var(--border-red)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Zap size={15} color="var(--red-primary)" />
                        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--red-primary)' }}>
                          SOVEREIGN DVP SETTLEMENT
                        </span>
                      </div>
                      <span className={m.paymentDetails.status === 'Settled' ? 'pill-valid' : 'pill-gold'} style={{ fontSize: '9px' }}>
                        ● {m.paymentDetails.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                      {m.paymentDetails.amount} ({m.paymentDetails.valueEur})
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Vault Custody: <b>{m.paymentDetails.vault}</b>
                    </div>
                    <div style={{ fontSize: '9.5px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                      TxHash: {m.paymentDetails.txHash} • Sub-Second Finality
                    </div>

                    {m.paymentDetails.status === 'Pending' && !isMe && (
                      <button
                        onClick={() => handleAcceptPayment(m.id)}
                        className="btn-red"
                        style={{ marginTop: '10px', width: '100%', justifyContent: 'center', padding: '8px', fontSize: '11.5px' }}
                      >
                        <CheckCircle2 size={14} /> Accept & Sign Atomic DvP Swap
                      </button>
                    )}
                  </div>
                ) : (
                  /* Standard Encrypted Chat Message */
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      backgroundColor: isMe ? 'rgba(239, 68, 68, 0.22)' : '#141018',
                      border: `1px solid ${isMe ? 'var(--border-red)' : 'var(--border-subtle)'}`,
                      color: isMe ? '#FFFFFF' : 'var(--text-main)',
                      fontSize: '12.5px',
                    }}
                  >
                    {m.text}
                  </div>
                )}

                <div style={{ fontSize: '9px', color: 'var(--text-dim)', textAlign: isMe ? 'right' : 'left', padding: '0 4px' }}>
                  {m.time} • E2EE Encrypted
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendMessage} style={{ padding: '10px 14px', borderTop: '1px solid var(--border-subtle)', backgroundColor: '#0c0b0e', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder={`Message ${selectedContact.country} securely via VetKeys...`}
            className="input-dark"
            style={{ flex: 1, padding: '9px 12px', fontSize: '12.5px' }}
          />
          <button type="submit" className="btn-red" style={{ padding: '0 16px' }}>
            <Send size={15} />
          </button>
        </form>
      </div>

      {/* In-Chat Send Money Modal */}
      {showSendMoneyModal && (
        <div className="modal-backdrop">
          <div className="modal-card fade-in">
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
              Send RWA Gold or Fiat to {selectedContact.country}
            </h3>
            <form onSubmit={handleSendPayment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Asset</label>
                <select value={sendAsset} onChange={(e: any) => setSendAsset(e.target.value)} className="input-dark">
                  <option value="ckEUR">ckEUR (Euro On-Chain Stable)</option>
                  <option value="XAU-Gold">XAU-Gold (Physical Swiss Bullion)</option>
                  <option value="ckUSD">ckUSD (US Dollar Stable)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Amount</label>
                <input
                  type="text"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button type="submit" className="btn-red" style={{ flex: 1, justifyContent: 'center' }}>
                  <Zap size={14} /> Send Instant in Chat
                </button>
                <button type="button" onClick={() => setShowSendMoneyModal(false)} className="btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
