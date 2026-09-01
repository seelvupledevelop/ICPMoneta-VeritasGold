import React, { useState } from 'react';
import type { InstitutionalTxn } from '../../types';
import { getCsvExportUrl } from '../../services/api';
import { Download, Printer, Search, CheckCircle2, Filter, Eye } from 'lucide-react';

interface TreasuryAccountingViewProps {
  transactions: InstitutionalTxn[];
  onRefresh?: () => void;
}

export const TreasuryAccountingView: React.FC<TreasuryAccountingViewProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGl, setSelectedGl] = useState('ALL');
  const [activeTxn, setActiveTxn] = useState<InstitutionalTxn | null>(null);
  const [showPdfStatement, setShowPdfStatement] = useState(false);

  const filteredTxns = transactions.filter((t) => {
    const matchesSearch =
      t.txn_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.memo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.sender_legal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.recipient_legal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.onchain_hash.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGl = selectedGl === 'ALL' || t.gl_code.startsWith(selectedGl);
    return matchesSearch && matchesGl;
  });

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-active">ERP & General Ledger Sync</span>
            <span style={{ fontSize: '11px', color: '#606060' }}>SAP • Oracle NetSuite • Bloomberg AIM Standard</span>
          </div>
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 700, marginTop: '4px' }}>
            Treasury History, Accounting & Audit Reports
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <a
            href={getCsvExportUrl()}
            download="veritas_gold_general_ledger_export.csv"
            className="btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            <Download size={15} /> Export CSV for ERP
          </a>

          <button className="btn-accent" onClick={() => setShowPdfStatement(true)}>
            <Printer size={15} /> Generate PDF Statement
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '14px', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px', backgroundColor: '#F9F9F9', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E5E5E5' }}>
          <Search size={16} color="#888" />
          <input
            type="text"
            placeholder="Search by TXN ID, Entity, Notary Hash, or Memo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', backgroundColor: 'transparent', width: '100%', fontSize: '13px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={14} color="#606060" />
          <select
            value={selectedGl}
            onChange={(e) => setSelectedGl(e.target.value)}
            className="input-flat"
            style={{ padding: '6px 12px', fontSize: '12px', width: 'auto' }}
          >
            <option value="ALL">All GL Accounts</option>
            <option value="1010">GL-1010 (Cash & Deposit Equivalents)</option>
            <option value="1520">GL-1520 (Tokenized Precious Metals)</option>
            <option value="1530">GL-1530 (Sovereign Debt & Treasuries)</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9F9F9', borderBottom: '1px solid #E5E5E5', color: '#606060', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>System TXN ID</th>
                <th style={{ padding: '12px 16px' }}>Booking Date (UTC)</th>
                <th style={{ padding: '12px 16px' }}>GL Code</th>
                <th style={{ padding: '12px 16px' }}>Sender & Recipient</th>
                <th style={{ padding: '12px 16px' }}>Description / Memo</th>
                <th style={{ padding: '12px 16px' }}>Amount (€ EUR)</th>
                <th style={{ padding: '12px 16px' }}>On-Chain Notary</th>
                <th style={{ padding: '12px 16px' }}>Audit</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.map((t) => (
                <tr key={t.txn_id} style={{ borderBottom: '1px solid #EAEAEA' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0F0F0F' }}>
                    {t.txn_id}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#606060' }}>{t.booking_date}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-blue">{t.gl_code}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, fontSize: '12px' }}>{t.sender_legal}</div>
                    <div style={{ color: '#606060', fontSize: '11px' }}>↳ {t.recipient_legal}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px' }}>{t.memo}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#FF0000' }}>
                    €{t.amount} {t.currency}
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#2BA640' }}>
                      <CheckCircle2 size={12} />
                      <code>{t.onchain_hash.slice(0, 10)}...</code>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                      onClick={() => setActiveTxn(t)}
                    >
                      <Eye size={12} /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {activeTxn && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Transaction Accounting Entry</h3>
              <span className="badge badge-active">{activeTxn.status}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ backgroundColor: '#F9F9F9', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#606060' }}>System Transaction Reference</div>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700 }}>{activeTxn.txn_id}</code>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ color: '#606060' }}>Value Date:</span>
                  <div style={{ fontWeight: 600 }}>{activeTxn.value_date}</div>
                </div>
                <div>
                  <span style={{ color: '#606060' }}>GL Account Code:</span>
                  <div style={{ fontWeight: 600 }}>{activeTxn.gl_code}</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFEBEE', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#FF0000', fontWeight: 600 }}>Accounting Double-Entry Leg</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FF0000', marginTop: '2px' }}>
                  {activeTxn.debit_credit} • €{activeTxn.amount} {activeTxn.currency}
                </div>
              </div>

              <div>
                <span style={{ color: '#606060', fontSize: '11px' }}>Memo / Commercial Purpose:</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>{activeTxn.memo}</div>
              </div>

              <div style={{ borderTop: '1px solid #E5E5E5', paddingTop: '10px' }}>
                <span style={{ color: '#606060', fontSize: '11px' }}>On-Chain Attestation Hash (ICP Finality Proof):</span>
                <code style={{ display: 'block', wordBreak: 'break-all', fontFamily: 'var(--font-mono)', fontSize: '11px', backgroundColor: '#F2F2F2', padding: '8px', borderRadius: '6px', marginTop: '4px' }}>
                  {activeTxn.onchain_hash}
                </code>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="btn-primary" onClick={() => setActiveTxn(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showPdfStatement && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '780px', backgroundColor: '#FFFFFF' }}>
            <div style={{ borderBottom: '2px solid #FF0000', paddingBottom: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.02em' }}>
                  VERITAS GOLD • ICP MONETA
                </div>
                <div style={{ fontSize: '12px', color: '#606060' }}>
                  Enterprise RWA Market & Central Bank Deposit Network
                </div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  Licensed to ICP Moneta • Zurich Financial Center
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-red" style={{ fontSize: '12px' }}>OFFICIAL BANK STATEMENT</span>
                <div style={{ fontSize: '11px', color: '#606060', marginTop: '6px' }}>Statement Date: 2026-09-01</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', fontSize: '12px' }}>
              <div style={{ backgroundColor: '#F9F9F9', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>ACCOUNT HOLDER</div>
                <div>Alice Trading Corp</div>
                <div>Bahnhofstrasse 45, 8001 Zurich</div>
                <div style={{ fontFamily: 'var(--font-mono)', marginTop: '4px' }}>Principal: lpmt4-wqbam-aaaaa-aaaaa-cai</div>
              </div>
              <div style={{ backgroundColor: '#F9F9F9', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>DEPOSITORY & NOTARY</div>
                <div>Apex Central Reserve / Swiss Vault</div>
                <div>Consensus: ICP Canister Notary</div>
                <div style={{ color: '#2BA640', fontWeight: 600, marginTop: '4px' }}>● 100% Finalized Zero Double-Spend</div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px', marginBottom: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F2F2F2', borderBottom: '1px solid #CCC' }}>
                  <th style={{ padding: '8px 10px' }}>Date</th>
                  <th style={{ padding: '8px 10px' }}>TXN ID</th>
                  <th style={{ padding: '8px 10px' }}>GL Code</th>
                  <th style={{ padding: '8px 10px' }}>Description</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Amount (EUR)</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxns.map((t) => (
                  <tr key={t.txn_id} style={{ borderBottom: '1px solid #EAEAEA' }}>
                    <td style={{ padding: '8px 10px' }}>{t.value_date}</td>
                    <td style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>{t.txn_id}</td>
                    <td style={{ padding: '8px 10px' }}>{t.gl_code}</td>
                    <td style={{ padding: '8px 10px' }}>{t.memo}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>€{t.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ borderTop: '1px solid #E5E5E5', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '10px', color: '#888' }}>
                Cryptographic Attestation ID: SHA256-ICP-CANISTER-NOTARY-VERIFIED • Tamper-proof on-chain record
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary" onClick={() => setShowPdfStatement(false)}>Close</button>
                <button className="btn-accent" onClick={handlePrintPdf}>
                  <Printer size={14} /> Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
