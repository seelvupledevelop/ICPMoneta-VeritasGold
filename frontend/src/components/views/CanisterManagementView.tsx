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
    </div>
  );
};
