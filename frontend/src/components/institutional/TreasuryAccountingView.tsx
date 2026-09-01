import React, { useState } from 'react';
import type { InstitutionalTxn } from '../../types';
import { getCsvExportUrl, getJsonExportUrl } from '../../services/api';
import { Download, Printer, Search, CheckCircle2, Filter, Eye, Code, ArrowRightLeft } from 'lucide-react';

interface TreasuryAccountingViewProps {
  transactions: InstitutionalTxn[];
  onRefresh?: () => void;
}

export const TreasuryAccountingView: React.FC<TreasuryAccountingViewProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGl, setSelectedGl] = useState('ALL');
  const [activeTxn, setActiveTxn] = useState<InstitutionalTxn | null>(null);
  const [showPdfStatement, setShowPdfStatement] = useState(false);
  const [showStandardsModal, setShowStandardsModal] = useState(false);

  const filteredTxns = transactions.filter((t) => {
    const matchesSearch =
      t.txn_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.memo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.sender_legal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.recipient_legal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.iso20022_msg && t.iso20022_msg.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.iso24165_dti && t.iso24165_dti.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.swift_on_off_ramp_code && t.swift_on_off_ramp_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.onchain_hash.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGl = selectedGl === 'ALL' || t.gl_code.startsWith(selectedGl);
    return matchesSearch && matchesGl;
  });

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Logs & ERP General Ledger Export
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Audited transaction ledger with ISO 20022 camt.053, SAP/NetSuite RFC-4180 CSV, and PDF statements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn-outline" onClick={() => setShowStandardsModal(true)}>
            <Code size={14} /> Standards Matrix
          </button>

          <a
            href={getJsonExportUrl()}
            download="veritas_gold_iso_accounting_export.json"
            className="btn-outline"
            style={{ textDecoration: 'none' }}
          >
            <Download size={14} /> Export ISO JSON
          </a>

          <a
            href={getCsvExportUrl()}
            download="veritas_gold_general_ledger_export.csv"
            className="btn-outline"
            style={{ textDecoration: 'none' }}
          >
            <Download size={14} /> Export ERP CSV
          </a>

          <button className="btn-cyan" onClick={() => setShowPdfStatement(true)}>
            <Printer size={14} /> Generate PDF Statement
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '14px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px', backgroundColor: 'var(--bg-input)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <Search size={16} color="var(--text-dim)" />
          <input
            type="text"
            placeholder="Search by TxID, ISO 20022, DTI, SWIFT Ramp, or Memo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', backgroundColor: 'transparent', width: '100%', fontSize: '13px', color: 'var(--text-main)', outline: 'none', fontFamily: 'var(--font-mono)' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={14} color="var(--text-muted)" />
          <select
            value={selectedGl}
            onChange={(e) => setSelectedGl(e.target.value)}
            className="input-dark"
            style={{ padding: '6px 12px', fontSize: '12px', width: 'auto' }}
          >
            <option value="ALL">All GL Accounts</option>
            <option value="1010">GL-1010 (Cash & Deposit Equivalents)</option>
            <option value="1520">GL-1520 (Tokenized Precious Metals)</option>
            <option value="1530">GL-1530 (Sovereign Debt & Treasuries)</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table style={{ width: '100%', minWidth: '950px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#09101f', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <th style={{ padding: '12px 16px' }}>System TXN ID</th>
                <th style={{ padding: '12px 16px' }}>ISO 20022 / DTI</th>
                <th style={{ padding: '12px 16px' }}>SWIFT Ramp Ref</th>
                <th style={{ padding: '12px 16px' }}>Sender & Recipient</th>
                <th style={{ padding: '12px 16px' }}>Description / Memo</th>
                <th style={{ padding: '12px 16px' }}>Amount (€ EUR)</th>
                <th style={{ padding: '12px 16px' }}>On-Chain Notary</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Audit</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.map((t) => (
                <tr key={t.txn_id} style={{ borderBottom: '1px solid #131f36' }}>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--cyan-primary)' }}>
                    {t.txn_id}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span className="pill-cyan" style={{ fontSize: '10px' }}>{t.iso20022_msg || 'pacs.008'}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{t.iso24165_dti || 'DTI-EURD'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {t.swift_on_off_ramp_code ? t.swift_on_off_ramp_code.slice(0, 18) + '...' : 'SWIFT-INTEROP-CH'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{t.sender_legal}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '11px' }}>↳ {t.recipient_legal}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>{t.memo}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 800, color: '#ffffff' }}>
                    €{t.amount} {t.currency}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--green-valid)' }}>
                      <CheckCircle2 size={12} />
                      <code>{t.onchain_hash.slice(0, 10)}...</code>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      className="btn-outline"
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

      {/* Transaction Details Modal */}
      {activeTxn && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>Accounting Double-Entry Record</h3>
              <span className="pill-valid">{activeTxn.status}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12.5px' }}>
              <div style={{ backgroundColor: 'var(--bg-input)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>System Transaction Reference</div>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--cyan-primary)' }}>{activeTxn.txn_id}</code>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#09101f', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <span style={{ color: 'var(--cyan-primary)', fontSize: '11px', fontWeight: 600 }}>ISO 20022 Message:</span>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>{activeTxn.iso20022_msg || 'pacs.008.001.10'}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--cyan-primary)', fontSize: '11px', fontWeight: 600 }}>ISO 24165 DTI:</span>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>{activeTxn.iso24165_dti || 'DTI-EURD-9941'}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--cyan-primary)', fontSize: '11px', fontWeight: 600 }}>ACTUS Contract Type:</span>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{activeTxn.actus_contract_type || 'PAM (Principal at Maturity)'}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--cyan-primary)', fontSize: '11px', fontWeight: 600 }}>GL Account:</span>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{activeTxn.gl_code}</div>
                </div>
              </div>

              <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px', backgroundColor: 'var(--bg-input)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowRightLeft size={14} color="var(--cyan-primary)" /> SWIFT ON/OFF RAMP VERIFICATION VS. ICP CANISTER
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>SWIFT End-to-End Ref: </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-main)' }}>
                      {activeTxn.swift_on_off_ramp_code || 'SWIFT-ONRAMP-CH93-UBSWCHZH'}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>Canister Principal: </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--green-valid)' }}>
                      {activeTxn.canister_principal_id || 'rrkah-fqaaa-aaaaa-aaaaq-cai'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(0, 210, 238, 0.08)', border: '1px solid rgba(0, 210, 238, 0.2)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--cyan-primary)', fontWeight: 600 }}>Double-Entry Ledger Leg</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                  {activeTxn.debit_credit} • €{activeTxn.amount} {activeTxn.currency}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="btn-cyan" onClick={() => setActiveTxn(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Standards Modal */}
      {showStandardsModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '680px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>ISO 20022 & ISO 24165 Standards Matrix</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Decentralized ICP Canister bindings to global financial messaging</p>
              </div>
              <span className="pill-valid">Version 1.0</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', maxHeight: '55vh', overflowY: 'auto' }}>
              <div style={{ backgroundColor: '#09101f', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <b style={{ color: 'var(--cyan-primary)' }}>1. Payments & Wires:</b>
                <div style={{ marginTop: '4px', color: 'var(--text-muted)' }}>• <code>pain.001.001.11</code>: Customer Payment Initiation</div>
                <div style={{ color: 'var(--text-muted)' }}>• <code>pacs.008.001.10</code>: Interbank Wire Transfer on <code>position-ledger</code></div>
                <div style={{ color: 'var(--text-muted)' }}>• <code>camt.053.001.10</code>: Bank-to-Customer Statement Reconciliation</div>
              </div>

              <div style={{ backgroundColor: '#09101f', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <b style={{ color: 'var(--cyan-primary)' }}>2. Digital Token Identifiers (ISO 24165):</b>
                <div style={{ marginTop: '4px', color: 'var(--text-muted)' }}>• <code>DTI-EURD-9941</code> (Tokenized Euro Deposit)</div>
                <div style={{ color: 'var(--text-muted)' }}>• <code>DTI-GOLD-8821</code> (Allocated Swiss Vault Gold Bar)</div>
                <div style={{ color: 'var(--text-muted)' }}>• <code>DTI-USTB-3312</code> (US Treasury 3M Bill Bond)</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="btn-cyan" onClick={() => setShowStandardsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Statement Modal */}
      {showPdfStatement && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '820px', backgroundColor: '#ffffff', color: '#0f172a' }}>
            <div style={{ borderBottom: '2px solid #0051d5', paddingBottom: '14px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>SOVEREIGN LEDGER • VERITAS GOLD</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Central Bank & Enterprise Settlement Network</div>
              </div>
              <span className="badge badge-blue">OFFICIAL BANK STATEMENT</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px', fontSize: '12px' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                <b>ACCOUNT HOLDER:</b> Node Alpha-1 Institutional Corp (Zurich)
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                <b>CLEARING CANISTER:</b> rrkah-fqaaa-aaaaa-aaaaq-cai (ICP Ledger)
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '11px', marginBottom: '16px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9' }}>
                  <th style={{ padding: '6px 8px' }}>Date</th>
                  <th style={{ padding: '6px 8px' }}>TxID</th>
                  <th style={{ padding: '6px 8px' }}>ISO Code</th>
                  <th style={{ padding: '6px 8px' }}>Description</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxns.map((t) => (
                  <tr key={t.txn_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 8px' }}>{t.value_date}</td>
                    <td style={{ padding: '6px 8px', fontFamily: 'monospace' }}>{t.txn_id}</td>
                    <td style={{ padding: '6px 8px' }}>{t.iso20022_msg}</td>
                    <td style={{ padding: '6px 8px' }}>{t.memo}</td>
                    <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700 }}>€{t.amount} {t.currency}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button className="btn-secondary" onClick={() => setShowPdfStatement(false)}>Close</button>
              <button className="btn-accent" onClick={handlePrintPdf}>
                <Printer size={14} /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
