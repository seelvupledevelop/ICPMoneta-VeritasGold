import React, { useState } from 'react';
import type { BridgeRoute } from '../../types';
import { executeBridgeTransfer } from '../../services/api';
import { ArrowLeftRight, ShieldCheck, Zap } from 'lucide-react';

interface CrossChainBridgeViewProps {
  routes: BridgeRoute[];
  onNotify: (msg: string, isError?: boolean) => void;
}

export const CrossChainBridgeView: React.FC<CrossChainBridgeViewProps> = ({ routes, onNotify }) => {
  const [sourceNet, setSourceNet] = useState('Ethereum Mainnet (ERC-20)');
  const [targetNet, setTargetNet] = useState('Internet Computer (Canister UTXO)');
  const [asset, setAsset] = useState('EURD');
  const [amount, setAmount] = useState('10,000.00');
  const [recipient, setRecipient] = useState('rrkah-fqaaa-aaaaa-aaaaq-cai');
  const [submitting, setSubmitting] = useState(false);

  const handleBridge = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await executeBridgeTransfer({
        source_network: sourceNet,
        target_network: targetNet,
        asset_symbol: asset,
        amount,
        recipient_address: recipient,
      });

      onNotify(`Cross-Chain Bridge Notarized! TxID: ${res.bridge_tx_id} via Threshold ECDSA.`);
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Harmonix Cross-Chain Bridge & SWIFT Rail
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Decentralized Chain-Key Threshold ECDSA bridge connecting Ethereum, SWIFT, and the Internet Computer.
          </p>
        </div>

        <span className="pill-valid">● Threshold ECDSA Active</span>
      </div>

      {/* Grid: Bridge Form & Active Routes */}
      <div className="grid-2col">
        {/* Bridge Execution Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <ArrowLeftRight size={18} color="var(--cyan-primary)" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>Bridge Transfer Terminal</h3>
          </div>

          <form onSubmit={handleBridge} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Source Network</label>
              <select value={sourceNet} onChange={(e) => setSourceNet(e.target.value)} className="input-dark">
                <option value="Ethereum Mainnet (ERC-20)">Ethereum Mainnet (ERC-20)</option>
                <option value="SWIFT Alliance Gateway">SWIFT Alliance Gateway (ISO 20022)</option>
                <option value="Internet Computer (Canister UTXO)">Internet Computer (Canister UTXO)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Destination Network</label>
              <select value={targetNet} onChange={(e) => setTargetNet(e.target.value)} className="input-dark">
                <option value="Internet Computer (Canister UTXO)">Internet Computer (Canister UTXO)</option>
                <option value="Ethereum Mainnet (ERC-20)">Ethereum Mainnet (ERC-20)</option>
                <option value="SWIFT Alliance Gateway">SWIFT Alliance Gateway (ISO 20022)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Asset</label>
                <select value={asset} onChange={(e) => setAsset(e.target.value)} className="input-dark">
                  <option value="EURD">Tokenized Euro (EURD)</option>
                  <option value="USDD">Tokenized Dollar (USDD)</option>
                  <option value="GOLD">LBMA Physical Gold (GOLD)</option>
                  <option value="USTB">US Treasury Bill (USTB)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Amount</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Recipient Address / Canister Principal</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="input-dark"
                required
              />
            </div>

            <button type="submit" className="btn-cyan" style={{ marginTop: '6px' }} disabled={submitting}>
              <Zap size={14} /> {submitting ? 'Notarizing via Chain-Key...' : 'Initiate Cross-Chain Bridge'}
            </button>
          </form>
        </div>

        {/* Operational Bridge Routes */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <ShieldCheck size={18} color="var(--green-valid)" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>Active Notarized Routes</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {routes.map((r) => (
                <div key={r.route_id} style={{ backgroundColor: '#09101f', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <code style={{ fontSize: '12px', fontWeight: 700, color: 'var(--cyan-primary)' }}>{r.route_id}</code>
                    <span className="pill-valid" style={{ fontSize: '10px' }}>● {r.status}</span>
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
                    {r.source_network} ➔ {r.target_network}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', marginTop: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>Estimated Finality: <b style={{ color: 'var(--cyan-primary)' }}>{r.estimated_time_sec}s</b></span>
                    <span>Notary Key: <b style={{ color: 'var(--text-main)' }}>{r.threshold_ecdsa_notary.slice(0, 16)}...</b></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
