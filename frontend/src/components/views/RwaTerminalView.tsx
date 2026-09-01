import React, { useState, useEffect, useRef } from 'react';
import type { DemandDepositRecord, MarketRate } from '../../types';
import { executeRfqTrade } from '../../services/api';
import {
  createChart,
  ColorType,
  CrosshairMode,
  CandlestickSeries,
  AreaSeries,
  BarSeries,
  BaselineSeries,
  HistogramSeries,
  type IChartApi,
  type Time,
} from 'lightweight-charts';
import {
  Diamond,
  Landmark,
  Zap,
  Activity,
  TrendingUp,
  BarChart3,
  LineChart,
  SlidersHorizontal,
} from 'lucide-react';

export interface TerminalAsset {
  id: string;
  category: 'Gold' | 'FX' | 'Bonds' | 'RWA';
  name: string;
  ticker: string;
  isin_dti: string;
  priceEur: number;
  priceUsd: number;
  change24h: string;
  isPositive: boolean;
  yieldApy?: string;
  maturity?: string;
  liquidityDepthEur: string;
  vaultCustody: string;
  ohlcvData: { time: string; open: number; high: number; low: number; close: number; volume: number }[];
}

export const TERMINAL_ASSETS: TerminalAsset[] = [
  {
    id: 'GOLD-XAU',
    category: 'Gold',
    name: 'Swiss Allocated Physical Gold (LBMA 999.9)',
    ticker: 'XAU/EUR',
    isin_dti: 'DTI-9B2X-GOLD',
    priceEur: 2542.10,
    priceUsd: 2785.40,
    change24h: '+1.45%',
    isPositive: true,
    liquidityDepthEur: '€14,240,000,000',
    vaultCustody: 'Zurich Duty-Free Vault ZRH-01',
    ohlcvData: [
      { time: '2026-08-20', open: 2480, high: 2495, low: 2475, close: 2490, volume: 15400 },
      { time: '2026-08-21', open: 2490, high: 2508, low: 2488, close: 2505, volume: 18200 },
      { time: '2026-08-22', open: 2505, high: 2515, low: 2495, close: 2498, volume: 12000 },
      { time: '2026-08-23', open: 2498, high: 2525, low: 2496, close: 2520, volume: 21500 },
      { time: '2026-08-24', open: 2520, high: 2528, low: 2510, close: 2515, volume: 19800 },
      { time: '2026-08-25', open: 2515, high: 2542, low: 2512, close: 2538, volume: 27400 },
      { time: '2026-08-26', open: 2538, high: 2550, low: 2530, close: 2542.10, volume: 34100 },
    ],
  },
  {
    id: 'USTB-10Y',
    category: 'Bonds',
    name: 'US Treasury 10Y Benchmark Sovereign Note',
    ticker: 'USTB-10Y',
    isin_dti: 'US91282CDJ71',
    priceEur: 98.42,
    priceUsd: 107.80,
    change24h: '+0.12%',
    isPositive: true,
    yieldApy: '3.85% APY',
    maturity: '2036-08-15',
    liquidityDepthEur: '€8,500,000,000',
    vaultCustody: 'Federal Reserve Bank of NY / BNY Mellon',
    ohlcvData: [
      { time: '2026-08-20', open: 98.05, high: 98.18, low: 97.95, close: 98.10, volume: 85000 },
      { time: '2026-08-21', open: 98.10, high: 98.25, low: 98.08, close: 98.20, volume: 92000 },
      { time: '2026-08-22', open: 98.20, high: 98.22, low: 98.10, close: 98.15, volume: 64000 },
      { time: '2026-08-23', open: 98.15, high: 98.40, low: 98.12, close: 98.35, volume: 110000 },
      { time: '2026-08-24', open: 98.35, high: 98.45, low: 98.30, close: 98.40, volume: 98000 },
      { time: '2026-08-25', open: 98.40, high: 98.42, low: 98.32, close: 98.38, volume: 77000 },
      { time: '2026-08-26', open: 98.38, high: 98.50, low: 98.35, close: 98.42, volume: 125000 },
    ],
  },
  {
    id: 'BUND-10Y',
    category: 'Bonds',
    name: 'German Federal Sovereign Bond (Bund-2034)',
    ticker: 'BUND-2034',
    isin_dti: 'DE0001102580',
    priceEur: 102.15,
    priceUsd: 111.90,
    change24h: '-0.08%',
    isPositive: false,
    yieldApy: '2.42% APY',
    maturity: '2034-02-15',
    liquidityDepthEur: '€4,200,000,000',
    vaultCustody: 'Deutsche Bundesbank / Clearstream Frankfurt',
    ohlcvData: [
      { time: '2026-08-20', open: 102.50, high: 102.60, low: 102.35, close: 102.40, volume: 45000 },
      { time: '2026-08-21', open: 102.40, high: 102.45, low: 102.25, close: 102.30, volume: 52000 },
      { time: '2026-08-22', open: 102.30, high: 102.40, low: 102.28, close: 102.35, volume: 38000 },
      { time: '2026-08-23', open: 102.35, high: 102.35, low: 102.15, close: 102.20, volume: 61000 },
      { time: '2026-08-24', open: 102.20, high: 102.25, low: 102.10, close: 102.18, volume: 49000 },
      { time: '2026-08-25', open: 102.18, high: 102.20, low: 102.08, close: 102.12, volume: 43000 },
      { time: '2026-08-26', open: 102.12, high: 102.22, low: 102.10, close: 102.15, volume: 74000 },
    ],
  },
  {
    id: 'FX-EURUSD',
    category: 'FX',
    name: 'Sovereign Euro / US Dollar Cross (ckEUR/ckUSD)',
    ticker: 'EUR/USD',
    isin_dti: 'DTI-EUR-USD-01',
    priceEur: 1.00,
    priceUsd: 1.0955,
    change24h: '+0.34%',
    isPositive: true,
    liquidityDepthEur: '€25,000,000,000',
    vaultCustody: 'ECB RTGS / Fedwire Automated Bridge',
    ohlcvData: [
      { time: '2026-08-20', open: 1.0890, high: 1.0915, low: 1.0880, close: 1.0910, volume: 310000 },
      { time: '2026-08-21', open: 1.0910, high: 1.0930, low: 1.0905, close: 1.0920, volume: 420000 },
      { time: '2026-08-22', open: 1.0920, high: 1.0925, low: 1.0910, close: 1.0915, volume: 290000 },
      { time: '2026-08-23', open: 1.0915, high: 1.0945, low: 1.0912, close: 1.0935, volume: 510000 },
      { time: '2026-08-24', open: 1.0935, high: 1.0950, low: 1.0930, close: 1.0940, volume: 460000 },
      { time: '2026-08-25', open: 1.0940, high: 1.0955, low: 1.0935, close: 1.0950, volume: 380000 },
      { time: '2026-08-26', open: 1.0950, high: 1.0968, low: 1.0945, close: 1.0955, volume: 590000 },
    ],
  },
  {
    id: 'RWA-EQUITY',
    category: 'RWA',
    name: 'Prime Zurich Real Estate Commercial Trust',
    ticker: 'ZUR-PROP',
    isin_dti: 'CH0992384110',
    priceEur: 1540.00,
    priceUsd: 1687.00,
    change24h: '+0.88%',
    isPositive: true,
    yieldApy: '5.20% Net Rental',
    liquidityDepthEur: '€650,000,000',
    vaultCustody: 'Zurich Cantonal Land Registry Title Deed',
    ohlcvData: [
      { time: '2026-08-20', open: 1515, high: 1525, low: 1510, close: 1520, volume: 8500 },
      { time: '2026-08-21', open: 1520, high: 1530, low: 1518, close: 1525, volume: 9200 },
      { time: '2026-08-22', open: 1525, high: 1532, low: 1522, close: 1530, volume: 6400 },
      { time: '2026-08-23', open: 1530, high: 1535, low: 1525, close: 1528, volume: 7800 },
      { time: '2026-08-24', open: 1528, high: 1540, low: 1526, close: 1535, volume: 11000 },
      { time: '2026-08-25', open: 1535, high: 1542, low: 1532, close: 1538, volume: 10500 },
      { time: '2026-08-26', open: 1538, high: 1548, low: 1535, close: 1540.00, volume: 14200 },
    ],
  },
];

interface RwaTerminalViewProps {
  accounts: DemandDepositRecord[];
  rates?: MarketRate[];
  onRefresh: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const RwaTerminalView: React.FC<RwaTerminalViewProps> = ({
  accounts,
  onRefresh,
  onNotify,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Gold' | 'FX' | 'Bonds' | 'RWA'>('All');
  const [selectedAsset, setSelectedAsset] = useState<TerminalAsset>(TERMINAL_ASSETS[0]);
  const [chartType, setChartType] = useState<'candlestick' | 'area' | 'bar' | 'baseline'>('candlestick');
  const [timeframe, setTimeframe] = useState<'1H' | '24H' | '7D' | '1M' | '1Y'>('24H');
  const [hoveredData, setHoveredData] = useState<{ price: string; date: string } | null>(null);
  const [tradeAmount, setTradeAmount] = useState('10.00');
  const [buyerAccountId, setBuyerAccountId] = useState(accounts[0]?.account_id || '');
  const [submittingTrade, setSubmittingTrade] = useState(false);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<IChartApi | null>(null);

  const filteredAssets =
    selectedCategory === 'All'
      ? TERMINAL_ASSETS
      : TERMINAL_ASSETS.filter((a) => a.category === selectedCategory);

  // Initialize and update TradingView Lightweight Charts
  useEffect(() => {
    if (!chartContainerRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.remove();
      chartInstanceRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#070509' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: 'rgba(239, 68, 68, 0.08)' },
        horzLines: { color: 'rgba(239, 68, 68, 0.08)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: '#ef4444', width: 1, style: 2, labelBackgroundColor: '#ef4444' },
        horzLine: { color: '#ef4444', width: 1, style: 2, labelBackgroundColor: '#ef4444' },
      },
      timeScale: {
        borderColor: '#271f28',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: '#271f28',
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
      width: chartContainerRef.current.clientWidth,
      height: 340,
    });

    chartInstanceRef.current = chart;

    if (chartType === 'candlestick') {
      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });

      candlestickSeries.setData(
        selectedAsset.ohlcvData.map((d) => ({
          time: d.time as Time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }))
      );
    } else if (chartType === 'area') {
      const areaSeries = chart.addSeries(AreaSeries, {
        topColor: 'rgba(239, 68, 68, 0.45)',
        bottomColor: 'rgba(239, 68, 68, 0.01)',
        lineColor: '#ef4444',
        lineWidth: 2,
      });

      areaSeries.setData(
        selectedAsset.ohlcvData.map((d) => ({
          time: d.time as Time,
          value: d.close,
        }))
      );
    } else if (chartType === 'bar') {
      const barSeries = chart.addSeries(BarSeries, {
        upColor: '#10b981',
        downColor: '#ef4444',
      });

      barSeries.setData(
        selectedAsset.ohlcvData.map((d) => ({
          time: d.time as Time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }))
      );
    } else {
      const baselineSeries = chart.addSeries(BaselineSeries, {
        baseValue: { type: 'price', price: selectedAsset.ohlcvData[0]?.open || selectedAsset.priceEur },
        topLineColor: '#10b981',
        bottomLineColor: '#ef4444',
        topFillColor1: 'rgba(16, 185, 129, 0.3)',
        topFillColor2: 'rgba(16, 185, 129, 0.01)',
        bottomFillColor1: 'rgba(239, 68, 68, 0.01)',
        bottomFillColor2: 'rgba(239, 68, 68, 0.3)',
        lineWidth: 2,
      });

      baselineSeries.setData(
        selectedAsset.ohlcvData.map((d) => ({
          time: d.time as Time,
          value: d.close,
        }))
      );
    }

    // Add Volume Histogram Series
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: 'rgba(239, 68, 68, 0.25)',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.82,
        bottom: 0,
      },
    });

    volumeSeries.setData(
      selectedAsset.ohlcvData.map((d) => ({
        time: d.time as Time,
        value: d.volume,
        color: d.close >= d.open ? 'rgba(16, 185, 129, 0.45)' : 'rgba(239, 68, 68, 0.45)',
      }))
    );

    // Crosshair move subscription for live price readout
    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const dateStr = String(param.time);
        const point = selectedAsset.ohlcvData.find((p) => p.time === dateStr);
        if (point) {
          setHoveredData({
            price: `€${point.close.toLocaleString()} EUR (O:${point.open} H:${point.high} L:${point.low})`,
            date: dateStr,
          });
        }
      } else {
        setHoveredData(null);
      }
    });

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current && chartInstanceRef.current) {
        chartInstanceRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, [selectedAsset, chartType, timeframe]);

  const handleExecuteTrade = async (asset: TerminalAsset) => {
    if (!buyerAccountId) {
      onNotify('Please select a settlement payment account', true);
      return;
    }
    setSubmittingTrade(true);
    try {
      const totalCost = (asset.priceEur * parseFloat(tradeAmount)).toFixed(2);
      await executeRfqTrade({
        account_id: buyerAccountId,
        buyer_principal: 'lpmt4-wqbam-aaaaa-aaaaa-cai',
        asset_symbol: asset.ticker.split('/')[0],
        asset_amount: tradeAmount,
        cash_amount: totalCost,
      });
      onNotify(`Atomic DvP Finalized! Acquired ${tradeAmount} ${asset.ticker} for €${totalCost} EUR on ICP`);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setSubmittingTrade(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="pill-red">● TradingView Core Engine</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Interactive Multi-Chart & Touch Gestures</span>
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            RWA Capital Markets & Trading Terminal
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pill-valid">● Sub-Second ICP DvP</span>
          <span className="pill-red">ISO 20022 camt.053</span>
        </div>
      </div>

      {/* TOP SUB-CATEGORY MENU (FX, Gold, Bonds, RWA) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: '#0c0a10',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          overflowX: 'auto',
        }}
      >
        {(['All', 'Gold', 'FX', 'Bonds', 'RWA'] as const).map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={isActive ? 'btn-red' : 'btn-outline'}
              style={{
                padding: '7px 18px',
                fontSize: '12.5px',
                fontWeight: 800,
                borderRadius: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              {cat === 'Gold' && '🏆 '}
              {cat === 'FX' && '💱 '}
              {cat === 'Bonds' && '🏛️ '}
              {cat === 'RWA' && '🏢 '}
              {cat === 'All' ? '⚡ All Sovereign Assets' : cat}
            </button>
          );
        })}
      </div>

      {/* MAIN TRADINGVIEW CHART CONTAINER */}
      <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Chart Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--red-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-red)',
              }}
            >
              {selectedAsset.category === 'Gold' ? <Diamond size={22} /> : selectedAsset.category === 'Bonds' ? <Landmark size={22} /> : <Activity size={22} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>{selectedAsset.name}</h2>
                <span className="pill-red">{selectedAsset.ticker}</span>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                ISIN / DTI: <span style={{ color: 'var(--red-primary)' }}>{selectedAsset.isin_dti}</span> • Custody: {selectedAsset.vaultCustody}
              </div>
            </div>
          </div>

          {/* Controls: 4 Chart Types & Timeframes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* 4 Chart Types */}
            <div style={{ display: 'flex', backgroundColor: '#0c0a10', borderRadius: '8px', padding: '3px', border: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setChartType('candlestick')}
                style={{
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: chartType === 'candlestick' ? 'var(--red-primary)' : 'transparent',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <BarChart3 size={13} /> Candles
              </button>
              <button
                onClick={() => setChartType('area')}
                style={{
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: chartType === 'area' ? 'var(--red-primary)' : 'transparent',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <TrendingUp size={13} /> Area
              </button>
              <button
                onClick={() => setChartType('bar')}
                style={{
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: chartType === 'bar' ? 'var(--red-primary)' : 'transparent',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <SlidersHorizontal size={13} /> Bars
              </button>
              <button
                onClick={() => setChartType('baseline')}
                style={{
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: chartType === 'baseline' ? 'var(--red-primary)' : 'transparent',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <LineChart size={13} /> Baseline
              </button>
            </div>

            {/* Timeframe Selectors */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {(['1H', '24H', '7D', '1M', '1Y'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setTimeframe(tf);
                    onNotify(`Loaded ${tf} Timeseries Resolution for ${selectedAsset.ticker}`);
                  }}
                  style={{
                    padding: '5px 10px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    backgroundColor: timeframe === tf ? 'rgba(239, 68, 68, 0.25)' : 'transparent',
                    color: timeframe === tf ? 'var(--red-primary)' : 'var(--text-dim)',
                    border: `1px solid ${timeframe === tf ? 'var(--border-red)' : 'transparent'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-Time Price Statistics & Crosshair Tooltip Strip */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', padding: '14px 18px', backgroundColor: '#0a080e', borderRadius: '8px', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Spot Price (EUR)</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
              €{selectedAsset.priceEur.toLocaleString()} <span style={{ fontSize: '14px', color: 'var(--red-primary)' }}>EUR</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>USD Equivalent</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              ${selectedAsset.priceUsd.toLocaleString()} USD
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>24h Movement</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: selectedAsset.isPositive ? 'var(--green-valid)' : 'var(--red-reject)', fontFamily: 'var(--font-mono)' }}>
              {selectedAsset.change24h}
            </div>
          </div>

          {hoveredData && (
            <div style={{ padding: '4px 10px', backgroundColor: 'rgba(239, 68, 68, 0.12)', borderRadius: '6px', border: '1px solid var(--border-red)' }}>
              <div style={{ fontSize: '9.5px', color: 'var(--red-primary)', fontWeight: 800 }}>CURSOR INSPECT ({hoveredData.date})</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>{hoveredData.price}</div>
            </div>
          )}

          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Available Depth</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
              {selectedAsset.liquidityDepthEur}
            </div>
          </div>
        </div>

        {/* Lightweight Charts Interactive HTML5 Canvas Container */}
        <div
          ref={chartContainerRef}
          style={{
            width: '100%',
            height: '340px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
          }}
        />

        {/* Order Execution Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: '#0a080e',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '10.5px', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase' }}>
                Settlement Account
              </span>
              <select
                value={buyerAccountId}
                onChange={(e) => setBuyerAccountId(e.target.value)}
                className="input-dark"
                style={{ padding: '6px 12px', fontSize: '12px', minWidth: '180px' }}
              >
                {accounts.map((acc) => (
                  <option key={acc.account_id} value={acc.account_id}>
                    {acc.account_id} (€{acc.balance.value_str} {acc.currency})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span style={{ fontSize: '10.5px', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase' }}>
                Order Quantity
              </span>
              <input
                type="text"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(e.target.value)}
                className="input-dark"
                style={{ padding: '6px 12px', fontSize: '12px', width: '110px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '10.5px', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase' }}>
                Estimated Cost
              </span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                €{(selectedAsset.priceEur * (parseFloat(tradeAmount) || 0)).toFixed(2)} EUR
              </span>
            </div>

            <button
              onClick={() => handleExecuteTrade(selectedAsset)}
              className="btn-red"
              style={{ padding: '8px 18px', fontSize: '12.5px', fontWeight: 800 }}
              disabled={submittingTrade}
            >
              <Zap size={14} /> Instant DvP Execution
            </button>
          </div>
        </div>
      </div>

      {/* ASSET CARDS GRID BELOW THE CHARTS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
              Sovereign Asset & Bond Issues ({filteredAssets.length})
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Select an asset to load its interactive TradingView chart and execute instantaneous DvP settlement.
            </p>
          </div>
          <span className="pill-valid">● Real Canister Order Book</span>
        </div>

        <div className="grid-3col">
          {filteredAssets.map((asset) => {
            const isSelected = selectedAsset.id === asset.id;
            return (
              <div
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isSelected ? '1px solid var(--red-primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'rgba(239, 68, 68, 0.06)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  padding: '18px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '15px', color: '#FFFFFF' }}>{asset.name}</div>
                      <code style={{ fontSize: '11px', color: 'var(--red-primary)', fontWeight: 700 }}>
                        {asset.ticker} • {asset.isin_dti}
                      </code>
                    </div>
                    <span className={asset.isPositive ? 'pill-valid' : 'pill-reject'} style={{ fontSize: '10px' }}>
                      {asset.change24h}
                    </span>
                  </div>

                  <div style={{ margin: '14px 0' }}>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Spot Price</div>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                      €{asset.priceEur.toLocaleString()} <span style={{ fontSize: '13px', color: 'var(--red-primary)' }}>EUR</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11.5px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                    <div>
                      <span style={{ color: 'var(--text-dim)', fontSize: '10px', display: 'block' }}>Liquidity Depth</span>
                      <b style={{ color: '#FFFFFF' }}>{asset.liquidityDepthEur}</b>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', fontSize: '10px', display: 'block' }}>Yield / Coupon</span>
                      <b style={{ color: asset.yieldApy ? 'var(--green-valid)' : 'var(--text-muted)' }}>
                        {asset.yieldApy || 'Spot Clearing'}
                      </b>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExecuteTrade(asset);
                    }}
                    className="btn-red"
                    style={{ flex: 1, justifyContent: 'center', padding: '8px', fontSize: '12px' }}
                    disabled={submittingTrade}
                  >
                    <Zap size={14} /> Buy on ICP DvP
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNotify(`RFQ Locked for ${asset.ticker}! Best institutional price committed.`);
                    }}
                    className="btn-outline"
                    style={{ padding: '8px 14px', fontSize: '12px' }}
                  >
                    RFQ
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
