import React, { useState } from 'react';
import type { SovereignBondContract } from '../../types';
import { createBondContract } from '../../services/api';
import {
  FileCode2,
  Landmark,
  ShieldCheck,
  Cpu,
  PlusCircle,
} from 'lucide-react';

interface SmartContractMakerViewProps {
  contracts: SovereignBondContract[];
  onRefresh: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const SmartContractMakerView: React.FC<SmartContractMakerViewProps> = ({
  contracts,
  onRefresh,
  onNotify,
}) => {
  const [issuerName, setIssuerName] = useState('Central Bank of the Republic of Turkey (CBRT)');
  const [issuerPrincipal, setIssuerPrincipal] = useState('cbrt1-gibai-aaaaa-aaaaa-cai');
  const [isinCode, setIsinCode] = useState('TRT150836T12');
  const [dtiCode, setDtiCode] = useState('DTI-TRY-BOND-10Y');
  const [currency, setCurrency] = useState('EURD');
  const [notionalVolume, setNotionalVolume] = useState('1,000,000,000.00');
  const [couponRate, setCouponRate] = useState('4.25%');
  const [couponFrequency, setCouponFrequency] = useState('Semi-Annual');
  const [contractType, setContractType] = useState('Principal At Maturity (PAM)');
  const [maturityDate, setMaturityDate] = useState('2036-08-15');
  const [auctionMechanism, setAuctionMechanism] = useState('Uniform-Price Dutch Auction');
  const [collateralBacking, setCollateralBacking] = useState('Dual Sovereign Guarantee + 500 oz LBMA Gold Pool');
  const [deploying, setDeploying] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDeployContract = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeploying(true);
    try {
      const res = await createBondContract({
        issuer_name: issuerName,
        issuer_principal: issuerPrincipal,
        isin_code: isinCode,
        dti_code: dtiCode,
        currency,
        notional_volume_eur: notionalVolume,
        coupon_rate_pct: couponRate,
        coupon_frequency: couponFrequency,
        actus_contract_type: contractType,
        maturity_date: maturityDate,
        auction_mechanism: auctionMechanism,
        collateral_backing: collateralBacking,
      });
      onNotify(`Sovereign Bond Canister Deployed! ID: ${res.contract_id} (${res.canister_principal_id})`);
      setShowModal(false);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="pill-red">● Sovereign Smart Contract Factory</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ACTUS Financial Standards & ICP Canister WASM</span>
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Sovereign Bond & Asset Contract Maker
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-red"
          style={{ padding: '10px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <PlusCircle size={16} /> Deploy New Sovereign Bond Canister
        </button>
      </div>

      {/* Top Value Proposition Banners */}
      <div className="grid-3col">
        <div className="card" style={{ padding: '18px', display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--red-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-red)' }}>
            <Cpu size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Canister Architecture</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>100% Native Rust WASM</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ic-cdk & Stable Memory Direct Access</div>
          </div>
        </div>

        <div className="card" style={{ padding: '18px', display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--green-valid)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Standardization</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>ACTUS PAM & ISO 24165</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Automated Coupon & Maturity Cashflows</div>
          </div>
        </div>

        <div className="card" style={{ padding: '18px', display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--red-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-red)' }}>
            <Landmark size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Central Bank Issuance</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>Dutch Auction Syndication</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Instant DvP Primary Settlement</div>
          </div>
        </div>
      </div>

      {/* ACTIVE DEPLOYED SOVEREIGN BOND CONTRACTS */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
              Active Sovereign Bond Canister Instances ({contracts.length})
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Sovereign debt instruments instantiated and executing on the ICP Canister engine.
            </p>
          </div>
          <span className="pill-valid">● BFT Consensus Active</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {contracts.map((bond) => (
            <div
              key={bond.contract_id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                backgroundColor: '#0c0a10',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    color: 'var(--red-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-red)',
                  }}
                >
                  <FileCode2 size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '15px', color: '#FFFFFF' }}>{bond.issuer_name}</span>
                    <span className="pill-red">{bond.contract_id}</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    ISIN: <span style={{ color: 'var(--red-primary)' }}>{bond.isin_code}</span> • DTI: {bond.dti_code} • Canister: {bond.canister_principal_id}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Notional</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                    €{bond.notional_volume_eur} {bond.currency}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Coupon Rate</span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--green-valid)', fontFamily: 'var(--font-mono)' }}>
                    {bond.coupon_rate_pct} ({bond.coupon_frequency})
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Maturity</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {bond.maturity_date}
                  </span>
                </div>

                <span className="pill-valid">{bond.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DEPLOYMENT MODAL FORM */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCode2 size={22} color="var(--red-primary)" />
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>Instantiate Sovereign Bond Smart Contract</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="btn-outline" style={{ padding: '4px 10px', fontSize: '12px' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleDeployContract} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Sovereign Central Bank / Issuer
                </label>
                <select
                  value={issuerName}
                  onChange={(e) => {
                    const name = e.target.value;
                    setIssuerName(name);
                    if (name.includes('Turkey')) {
                      setIssuerPrincipal('cbrt1-gibai-aaaaa-aaaaa-cai');
                      setIsinCode('TRT150836T12');
                      setDtiCode('DTI-TRY-BOND-10Y');
                    } else if (name.includes('Swiss')) {
                      setIssuerPrincipal('snb01-hexae-mc6xm-gopwt-x5jg7-2a');
                      setIsinCode('CH0553128914');
                      setDtiCode('DTI-CHF-GREEN-10Y');
                    } else if (name.includes('Hong Kong')) {
                      setIssuerPrincipal('hkma0-eybaq-aaaaa-aaaaa-cai');
                      setIsinCode('HK0000892109');
                      setDtiCode('DTI-HKD-SOV-10Y');
                    } else {
                      setIssuerPrincipal('bund1-hexae-mc6xm-gopwt-x5jg7-2a');
                      setIsinCode('DE0001102580');
                      setDtiCode('DTI-DE-BUND-10Y');
                    }
                  }}
                  className="input-dark"
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}
                >
                  <option value="Central Bank of the Republic of Turkey (CBRT)">Central Bank of the Republic of Turkey (CBRT)</option>
                  <option value="Swiss National Bank (SNB)">Swiss National Bank (SNB)</option>
                  <option value="Deutsche Bundesbank (Germany)">Deutsche Bundesbank (Germany)</option>
                  <option value="Hong Kong Monetary Authority (HKMA)">Hong Kong Monetary Authority (HKMA)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    ISIN Code (ISO 6166)
                  </label>
                  <input
                    type="text"
                    value={isinCode}
                    onChange={(e) => setIsinCode(e.target.value)}
                    className="input-dark"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Digital Token Identifier (ISO 24165 DTI)
                  </label>
                  <input
                    type="text"
                    value={dtiCode}
                    onChange={(e) => setDtiCode(e.target.value)}
                    className="input-dark"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Notional Volume (EUR Equivalent)
                  </label>
                  <input
                    type="text"
                    value={notionalVolume}
                    onChange={(e) => setNotionalVolume(e.target.value)}
                    className="input-dark"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Settlement Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="input-dark"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}
                  >
                    <option value="EURD">Tokenized Euro (EURD)</option>
                    <option value="CHFD">Swiss Franc (CHFD)</option>
                    <option value="USDD">US Dollar (USDD)</option>
                    <option value="TRYD">Turkish Lira (TRYD)</option>
                    <option value="HKDD">Hong Kong Dollar (HKDD)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Coupon Rate % p.a.
                  </label>
                  <input
                    type="text"
                    value={couponRate}
                    onChange={(e) => setCouponRate(e.target.value)}
                    className="input-dark"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Coupon Frequency
                  </label>
                  <select
                    value={couponFrequency}
                    onChange={(e) => setCouponFrequency(e.target.value)}
                    className="input-dark"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}
                  >
                    <option value="Annual">Annual (1x per year)</option>
                    <option value="Semi-Annual">Semi-Annual (2x per year)</option>
                    <option value="Quarterly">Quarterly (4x per year)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    ACTUS Contract Archetype
                  </label>
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value)}
                    className="input-dark"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}
                  >
                    <option value="Principal At Maturity (PAM)">Principal At Maturity (PAM)</option>
                    <option value="Zero Coupon Bond (ZCB)">Zero Coupon Bond (ZCB)</option>
                    <option value="Green Climate Bond">Green Climate Bond (Verified Impact)</option>
                    <option value="Dual-Asset Gold Linked Note">Dual-Asset Gold Linked Note</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Maturity Date
                  </label>
                  <input
                    type="date"
                    value={maturityDate}
                    onChange={(e) => setMaturityDate(e.target.value)}
                    className="input-dark"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Primary Placement & Auction Mechanism
                </label>
                <select
                  value={auctionMechanism}
                  onChange={(e) => setAuctionMechanism(e.target.value)}
                  className="input-dark"
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}
                >
                  <option value="Uniform-Price Dutch Auction">Uniform-Price Dutch Auction (Single Clearing Yield)</option>
                  <option value="Multi-Price Discriminatory Auction">Multi-Price Discriminatory Auction (Pay-as-Bid)</option>
                  <option value="Direct Institutional Syndication">Direct Institutional Syndication (Tier-1 Primary Dealers)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Collateral Backing / Reserve Guarantee
                </label>
                <input
                  type="text"
                  value={collateralBacking}
                  onChange={(e) => setCollateralBacking(e.target.value)}
                  className="input-dark"
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline"
                  style={{ padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-red"
                  style={{ padding: '8px 22px', fontWeight: 800 }}
                  disabled={deploying}
                >
                  {deploying ? 'Deploying Canister...' : 'Compile & Deploy to ICP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
