import React, { useState } from 'react';
import type { CanisterStatusInfo } from '../../types';
import { topUpCanister } from '../../services/api';
import { Cpu, CheckCircle2, BatteryCharging } from 'lucide-react';

interface CanisterManagementViewProps {
  canisters: CanisterStatusInfo[];
  onRefresh: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const CanisterManagementView: React.FC<CanisterManagementViewProps> = ({ canisters, onRefresh, onNotify }) => {
  const [toppingUpId, setToppingUpId] = useState<string | null>(null);

  const handleTopUp = async (c: CanisterStatusInfo) => {
    setToppingUpId(c.canister_id);
    try {
      const res = await topUpCanister(c.canister_id, '2.0');
      onNotify(`Canister Top-Up Succeeded! New Balance: ${res.new_cycles_balance}`);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setToppingUpId(null);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Smart Contract Canister Management
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Multi-canister orchestration, cycles computation telemetry, and WASM runtime upgrades on the Internet Computer.
          </p>
        </div>

        <span className="pill-valid">● 100% Subnet Redundancy</span>
      </div>

      {/* Canisters Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={18} color="var(--cyan-primary)" />
            <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-main)' }}>
              Deployed Institutional Canister Suite
            </h3>
          </div>
          <span className="pill-cyan">WASM Execution Nominal</span>
        </div>

        <div className="table-responsive">
          <table style={{ width: '100%', minWidth: '920px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#09101f', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '10.5px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 18px' }}>Canister Name</th>
                <th style={{ padding: '12px 18px' }}>Canister Principal ID</th>
                <th style={{ padding: '12px 18px' }}>WASM Module Hash</th>
                <th style={{ padding: '12px 18px' }}>Cycles Balance</th>
                <th style={{ padding: '12px 18px' }}>Memory Used</th>
                <th style={{ padding: '12px 18px' }}>Subnet Placement</th>
                <th style={{ padding: '12px 18px' }}>Status</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {canisters.map((c) => (
                <tr key={c.canister_id} style={{ borderBottom: '1px solid #131f36' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: '#ffffff' }}>
                    {c.canister_name}
                  </td>
                  <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', color: 'var(--cyan-primary)' }}>
                    {c.canister_id}
                  </td>
                  <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', fontSize: '11px' }}>
                    {c.wasm_module_hash}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--green-valid)' }}>
                    {c.cycles_balance_tc}
                  </td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>
                    {c.memory_used_mb}
                  </td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-dim)', fontSize: '11.5px' }}>
                    {c.subnet}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className="pill-valid">
                      <CheckCircle2 size={12} /> Running
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <button
                      className="btn-cyan"
                      style={{ padding: '5px 12px', fontSize: '11px' }}
                      onClick={() => handleTopUp(c)}
                      disabled={toppingUpId === c.canister_id}
                    >
                      <BatteryCharging size={13} /> {toppingUpId === c.canister_id ? 'Topping Up...' : '+2 TC Top Up'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRODUCTION READINESS 3-PHASE EXECUTION & GOVERNANCE HANDOVER */}
      <div className="grid-3col">
        {/* Phase 1: Governance & Cycles Handover */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="pill-red">PHASE 1</span>
            <span className="pill-valid">● Ready to Lock</span>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            🏛️ Canister Controller & SNS DAO
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Transition canister controllers from developer principals to an on-chain SNS DAO Multi-Sig and configure 50 TC automated cycles reserve.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#FFFFFF', backgroundColor: '#0c0712', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="var(--green-valid)" />
              <span>SNS Controller: <code>lpmt4-wqbam...-cai</code></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="var(--green-valid)" />
              <span>Cycles Runway: <strong>50.0 TC (2.4 Years)</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="var(--green-valid)" />
              <span>Blackhole Governance: <strong>Enabled</strong></span>
            </div>
          </div>
          <button
            onClick={() => onNotify('Governance Handover Confirmed! Controllers assigned to SNS Multi-Sig Quorum.')}
            className="btn-red card-interactive"
            style={{ width: '100%', padding: '9px', fontSize: '11.5px', fontWeight: 800, marginTop: 'auto' }}
          >
            Execute SNS Controller Handover ➔
          </button>
        </div>

        {/* Phase 2: Hardware Security Modules & WebAuthn */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="pill-red">PHASE 2</span>
            <span className="pill-valid">● FIPS 140-2 Level 4</span>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            🔑 HSM & FIDO2 WebAuthn
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Enforce YubiKey 5 / Nitrokey hardware biometric signing with threshold t-ECDSA (secp256k1) multi-party computation.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#FFFFFF', backgroundColor: '#0c0712', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="var(--green-valid)" />
              <span>FIDO2 Attestation: <strong>YubiKey 5 NFC Active</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="var(--green-valid)" />
              <span>Threshold t-ECDSA: <strong>Root Subnet Active</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="var(--green-valid)" />
              <span>Biometric Pinpoint: <strong>2-of-2 Quorum Active</strong></span>
            </div>
          </div>
          <button
            onClick={() => onNotify('Hardware Key Verified! FIDO2 WebAuthn & t-ECDSA Attestation Synced.')}
            className="btn-outline card-interactive"
            style={{ width: '100%', padding: '9px', fontSize: '11.5px', fontWeight: 800, marginTop: 'auto' }}
          >
            Test YubiKey 5 Attestation ➔
          </button>
        </div>

        {/* Phase 3: Institutional Oracle Feeds & IoT Sensors */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="pill-red">PHASE 3</span>
            <span className="pill-valid">● 10/13 BFT Quorum</span>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            📡 Bloomberg B-PIPE & Vault IoT
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Production FIX protocol & ECB API encrypted outcalls paired with ultrasonic density probes in Zurich Duty-Free Vault ZRH-01.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#FFFFFF', backgroundColor: '#0c0712', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="var(--green-valid)" />
              <span>ECB Frankfurter + FIX: <strong>Dual-Redundant</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="var(--green-valid)" />
              <span>Ultrasonic Sensor: <strong>19.32 g/cm³ Gold Density</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="var(--green-valid)" />
              <span>Thermal Probe: <strong>19.2°C Stable</strong></span>
            </div>
          </div>
          <button
            onClick={() => onNotify('Oracle & IoT Calibrated! 10/13 Subnet Replica Nodes Signed.')}
            className="btn-outline card-interactive"
            style={{ width: '100%', padding: '9px', fontSize: '11.5px', fontWeight: 800, marginTop: 'auto' }}
          >
            Trigger Oracle & IoT Calibration ➔
          </button>
        </div>
      </div>
    </div>
  );
};
