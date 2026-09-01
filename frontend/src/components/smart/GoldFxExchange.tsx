import React, { useState } from 'react';
import type { MarketRate } from '../../types';
import { ArrowLeftRight } from 'lucide-react';

interface GoldFxExchangeProps {
  rates: MarketRate[];
}

export const GoldFxExchange: React.FC<GoldFxExchangeProps> = ({ rates }) => {
  const [amount, setAmount] = useState('1000');
  const [fromAsset, setFromAsset] = useState('EUR');
  const [toAsset, setToAsset] = useState('GOLD');

  const goldRate = rates.find((r) => r.symbol === 'GOLD') || { price_eur: '2542.10', price_usd: '2745.50' };

  const calcConverted = () => {
    const val = parseFloat(amount || '0');
    if (fromAsset === 'EUR' && toAsset === 'GOLD') {
      return (val / parseFloat(goldRate.price_eur)).toFixed(4) + ' oz GOLD';
    } else if (fromAsset === 'USD' && toAsset === 'GOLD') {
      return (val / parseFloat(goldRate.price_usd)).toFixed(4) + ' oz GOLD';
    } else if (fromAsset === 'GOLD' && toAsset === 'EUR') {
      return '€' + (val * parseFloat(goldRate.price_eur)).toFixed(2) + ' EUR';
    } else if (fromAsset === 'GOLD' && toAsset === 'USD') {
      return '$' + (val * parseFloat(goldRate.price_usd)).toFixed(2) + ' USD';
    } else if (fromAsset === 'EUR' && toAsset === 'USD') {
      return '$' + (val * 1.08).toFixed(2) + ' USD';
    }
    return val.toFixed(2) + ' ' + toAsset;
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-active">Live FX & Precious Metal Desk</span>
          <span style={{ fontSize: '12px', color: '#606060' }}>Direct Interbank Oracle Feed</span>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px' }}>Gold & Foreign Exchange Rates</h2>
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, #1C1917 0%, #0C0A09 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: '#FFFFFF',
          marginBottom: '24px',
          border: '1px solid rgba(255,215,0,0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>🏆</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#FFD700' }}>LBMA Physical Gold (Spot Ounce)</span>
            <span className="badge badge-active" style={{ fontSize: '11px' }}>+1.35% (24h)</span>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.02em' }}>
            €{goldRate.price_eur} <span style={{ fontSize: '20px', fontWeight: 500, color: '#A8A29E' }}>EUR</span> / ${goldRate.price_usd} <span style={{ fontSize: '20px', fontWeight: 500, color: '#A8A29E' }}>USD</span>
          </div>
          <div style={{ fontSize: '12px', color: '#A8A29E', marginTop: '6px' }}>
            Backing: Allocated Swiss Vault Physical Bars • Pure 99.99% Fine Gold
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '16px 20px', borderRadius: '12px', textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: '#A8A29E' }}>1 oz Gold = EUR Equivalent</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#FFD700', marginTop: '2px' }}>€{goldRate.price_eur}</div>
          <div style={{ fontSize: '11px', color: '#2BA640', marginTop: '4px' }}>● Live Interbank Spread 0.02%</div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeftRight size={18} color="#065FD4" /> Quick Currency & Gold Converter
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#606060', marginBottom: '4px', display: 'block' }}>You Pay</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-flat"
                style={{ fontSize: '18px', fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#606060', marginBottom: '4px', display: 'block' }}>From</label>
              <select value={fromAsset} onChange={(e) => setFromAsset(e.target.value)} className="input-flat" style={{ fontSize: '14px', fontWeight: 600 }}>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GOLD">GOLD (oz)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#606060', marginBottom: '4px', display: 'block' }}>You Receive (Estimated)</label>
              <div style={{ backgroundColor: '#F9F9F9', padding: '10px 14px', borderRadius: '6px', fontSize: '18px', fontWeight: 700, color: '#2BA640' }}>
                {calcConverted()}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#606060', marginBottom: '4px', display: 'block' }}>To</label>
              <select value={toAsset} onChange={(e) => setToAsset(e.target.value)} className="input-flat" style={{ fontSize: '14px', fontWeight: 600 }}>
                <option value="GOLD">GOLD (oz)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
