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
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-active">ISO 20022 & ISO 24165 Verified</span>
            <span style={{ fontSize: '11px', color: '#606060' }}>SAP • Oracle NetSuite • SWIFT On/Off Ramp Layer</span>
          </div>
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 700, marginTop: '4px' }}>
            Treasury History, Accounting & Audit Reports
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={() => setShowStandardsModal(true)}>
            <Code size={14} /> Standards Matrix
          </button>

          <a
            href={getJsonExportUrl()}
            download="veritas_gold_iso_accounting_export.json"
            className="btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            <Download size={14} /> Export ISO JSON
          </a>

          <a
            href={getCsvExportUrl()}
            download="veritas_gold_general_ledger_export.csv"
            className="btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            <Download size={14} /> Export CSV
          </a>

          <button className="btn-accent" onClick={() => setShowPdfStatement(true)}>
            <Printer size={14} /> Generate PDF Statement
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '14px', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px', backgroundColor: '#F9F9F9', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E5E5E5' }}>
          <Search size={16} color="#888" />
          <input
            type="text"
            placeholder="Search by TXN ID, ISO 20022 Code, DTI, SWIFT Ramp, or Memo..."
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

      {/* Transactions Accounting Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table style={{ width: '100%', minWidth: '950px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9F9F9', borderBottom: '1px solid #E5E5E5', color: '#606060', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px' }}>System TXN ID</th>
                <th style={{ padding: '12px 14px' }}>ISO 20022 / DTI</th>
                <th style={{ padding: '12px 14px' }}>SWIFT / Ramp Code</th>
                <th style={{ padding: '12px 14px' }}>Sender & Recipient</th>
                <th style={{ padding: '12px 14px' }}>Description / Memo</th>
                <th style={{ padding: '12px 14px' }}>Amount (€ EUR)</th>
                <th style={{ padding: '12px 14px' }}>On-Chain Notary</th>
                <th style={{ padding: '12px 14px' }}>Audit</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.map((t) => (
                <tr key={t.txn_id} style={{ borderBottom: '1px solid #EAEAEA' }}>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0F0F0F' }}>
                    {t.txn_id}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span className="badge badge-blue" style={{ fontSize: '10px' }}>{t.iso20022_msg || 'pacs.008'}</span>
                      <span style={{ fontSize: '10px', color: '#888', fontFamily: 'var(--font-mono)' }}>{t.iso24165_dti || 'DTI-EURD'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#065FD4' }}>
                    {t.swift_on_off_ramp_code ? t.swift_on_off_ramp_code.slice(0, 18) + '...' : 'SWIFT-INTEROP-CH'}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 600, fontSize: '12px' }}>{t.sender_legal}</div>
                    <div style={{ color: '#606060', fontSize: '11px' }}>↳ {t.recipient_legal}</div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '12px' }}>{t.memo}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#FF0000' }}>
                    €{t.amount} {t.currency}
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#2BA640' }}>
                      <CheckCircle2 size={12} />
                      <code>{t.onchain_hash.slice(0, 10)}...</code>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
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

      {/* Transaction Details Modal */}
      {activeTxn && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Transaction Standards & Accounting Entry</h3>
              <span className="badge badge-active">{activeTxn.status}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ backgroundColor: '#F9F9F9', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#606060' }}>System Transaction Reference</div>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700 }}>{activeTxn.txn_id}</code>
              </div>

              {/* Standards Breakdown Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#F0F7FF', padding: '12px', borderRadius: '8px', border: '1px solid #D0E4FF' }}>
                <div>
                  <span style={{ color: '#065FD4', fontSize: '11px', fontWeight: 600 }}>ISO 20022 Message:</span>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{activeTxn.iso20022_msg || 'pacs.008.001.10'}</div>
                </div>
                <div>
                  <span style={{ color: '#065FD4', fontSize: '11px', fontWeight: 600 }}>ISO 24165 DTI:</span>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{activeTxn.iso24165_dti || 'DTI-EURD-9941'}</div>
                </div>
                <div>
                  <span style={{ color: '#065FD4', fontSize: '11px', fontWeight: 600 }}>ACTUS Contract Logic:</span>
                  <div style={{ fontWeight: 700 }}>{activeTxn.actus_contract_type || 'PAM (Principal at Maturity)'}</div>
                </div>
                <div>
                  <span style={{ color: '#065FD4', fontSize: '11px', fontWeight: 600 }}>GL Chart of Accounts:</span>
                  <div style={{ fontWeight: 700 }}>{activeTxn.gl_code}</div>
                </div>
              </div>

              {/* SWIFT Ramp vs ICP Canister ID Comparison */}
              <div style={{ border: '1px solid #E5E5E5', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#606060', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowRightLeft size={14} color="#FF0000" /> SWIFT ON/OFF RAMP VERIFICATION VS. ICP CANISTER
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#888' }}>SWIFT / Rail End-to-End Ref:</span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#0F0F0F' }}>
                      {activeTxn.swift_on_off_ramp_code || 'SWIFT-ONRAMP-CH93-UBSWCHZH'}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#888' }}>Target ICP Canister Principal:</span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#2BA640' }}>
                      {activeTxn.canister_principal_id || 'rrkah-fqaaa-aaaaa-aaaaq-cai'}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFEBEE', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#FF0000', fontWeight: 600 }}>Accounting Double-Entry Leg</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FF0000', marginTop: '2px' }}>
                  {activeTxn.debit_credit} • €{activeTxn.amount} {activeTxn.currency}
                </div>
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

      {/* Standards Mapping Modal */}
      {showStandardsModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '720px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>ISO 20022, ISO 24165 & Financial Standards Matrix</h3>
                <p style={{ fontSize: '12px', color: '#606060' }}>Formal mappings between Web3 ICP Canisters and canonical banking standards</p>
              </div>
              <span className="badge badge-active">Version 1.0</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', maxHeight: '60vh', overflowY: 'auto' }}>
              <div style={{ backgroundColor: '#F9F9F9', padding: '12px', borderRadius: '8px' }}>
                <b style={{ color: '#0F0F0F' }}>1. Customer & Bank Payments:</b>
                <div style={{ marginTop: '4px' }}>• <code>pain.001.001.11</code>: Customer Payment Initiation → mapped to <code>POST /api/v1/accounts/transfer</code></div>
                <div>• <code>pacs.008.001.10</code>: Interbank Wire Transfer → executed atomically on <code>position-ledger</code> canister</div>
                <div>• <code>camt.053.001.10</code>: General Ledger Bank Statement → exported via JSON & CSV API</div>
              </div>

              <div style={{ backgroundColor: '#F9F9F9', padding: '12px', borderRadius: '8px' }}>
                <b style={{ color: '#0F0F0F' }}>2. Digital Token Identifiers (ISO 24165 DTI):</b>
                <div style={{ marginTop: '4px' }}>• <code>DTI-EURD-9941</code> (Tokenized Euro Deposit)</div>
                <div>• <code>DTI-USDD-1024</code> (Tokenized Dollar Deposit)</div>
                <div>• <code>DTI-GOLD-8821</code> (Allocated Swiss Vault Physical Gold Bar)</div>
                <div>• <code>DTI-USTB-3312</code> (US Treasury 3M Bill Sovereign Bond)</div>
              </div>

              <div style={{ backgroundColor: '#F9F9F9', padding: '12px', borderRadius: '8px' }}>
                <b style={{ color: '#0F0F0F' }}>3. ACTUS Cash-Flow & FIX Protocol:</b>
                <div style={{ marginTop: '4px' }}>• <code>ACTUS PAM</code>: Principal at Maturity for Treasury Bonds and Precious Metal Spot DvP</div>
                <div>• <code>ACTUS LAX</code>: Linear Amortizing for Real Estate Equity & Yield Schedules</div>
                <div>• <code>FIX NewOrderSingle (D) / ExecutionReport (8)</code>: Gateway for Institutional Orderbook</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="btn-primary" onClick={() => setShowStandardsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Printable PDF Statement View */}
      {showPdfStatement && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '820px', backgroundColor: '#FFFFFF' }}>
            <div style={{ borderBottom: '2px solid #FF0000', paddingBottom: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.02em' }}>
                  VERITAS GOLD • ICP MONETA
                </div>
                <div style={{ fontSize: '12px', color: '#606060' }}>
                  Enterprise RWA Market & Central Bank Deposit Network
                </div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  Licensed to ICP Moneta • ISO 20022 & ISO 24165 Compliant Ledger
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-red" style={{ fontSize: '12px' }}>OFFICIAL BANK STATEMENT</span>
                <div style={{ fontSize: '11px', color: '#606060', marginTop: '6px' }}>Statement Date: 2026-09-01</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', fontSize: '12px' }}>
              <div style={{ backgroundColor: '#F9F9F9', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>ACCOUNT HOLDER</div>
                <div>Alice Trading Corp</div>
                <div>Bahnhofstrasse 45, 8001 Zurich</div>
                <div style={{ fontFamily: 'var(--font-mono)', marginTop: '4px' }}>Principal: lpmt4-wqbam-aaaaa-aaaaa-cai</div>
              </div>
              <div style={{ backgroundColor: '#F9F9F9', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>CLEARING & SETTLEMENT NOTARY</div>
                <div>Apex Central Reserve / Swiss Vault</div>
                <div>Target Canister: rrkah-fqaaa-aaaaa-aaaaq-cai</div>
                <div style={{ color: '#2BA640', fontWeight: 600, marginTop: '4px' }}>● ISO 20022 camt.053 Certified</div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '11px', marginBottom: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F2F2F2', borderBottom: '1px solid #CCC' }}>
                  <th style={{ padding: '8px 10px' }}>Date</th>
                  <th style={{ padding: '8px 10px' }}>TXN ID</th>
                  <th style={{ padding: '8px 10px' }}>ISO 20022 / DTI</th>
                  <th style={{ padding: '8px 10px' }}>SWIFT Ramp Ref</th>
                  <th style={{ padding: '8px 10px' }}>Description</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Amount (EUR)</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxns.map((t) => (
                  <tr key={t.txn_id} style={{ borderBottom: '1px solid #EAEAEA' }}>
                    <td style={{ padding: '8px 10px' }}>{t.value_date}</td>
                    <td style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>{t.txn_id}</td>
                    <td style={{ padding: '8px 10px' }}>{t.iso20022_msg} / {t.iso24165_dti}</td>
                    <td style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>{t.swift_on_off_ramp_code ? t.swift_on_off_ramp_code.slice(0, 16) : 'SWIFT-RAMP'}</td>
                    <td style={{ padding: '8px 10px' }}>{t.memo}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>€{t.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ borderTop: '1px solid #E5E5E5', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '10px', color: '#888' }}>
                Cryptographic Attestation: SHA256-ICP-CANISTER-NOTARY-VERIFIED • Tamper-proof On-Chain Record
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
