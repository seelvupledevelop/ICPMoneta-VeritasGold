import React, { useState, useRef } from 'react';
import { Crosshair } from 'lucide-react';

export interface PricePoint {
  time: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: string;
}

const SAMPLE_CHART_DATA: PricePoint[] = [
  { time: '09:00', price: 83.20, open: 83.10, high: 83.45, low: 83.00, close: 83.20, volume: '142 oz' },
  { time: '10:00', price: 83.65, open: 83.20, high: 83.90, low: 83.15, close: 83.65, volume: '280 oz' },
  { time: '11:00', price: 84.10, open: 83.65, high: 84.30, low: 83.50, close: 84.10, volume: '510 oz' },
  { time: '12:00', price: 83.95, open: 84.10, high: 84.25, low: 83.80, close: 83.95, volume: '195 oz' },
  { time: '13:00', price: 84.40, open: 83.95, high: 84.60, low: 83.90, close: 84.40, volume: '640 oz' },
  { time: '14:00', price: 84.85, open: 84.40, high: 85.10, low: 84.30, close: 84.85, volume: '820 oz' },
  { time: '15:00', price: 84.50, open: 84.85, high: 85.00, low: 84.35, close: 84.50, volume: '410 oz' },
  { time: '16:00', price: 85.15, open: 84.50, high: 85.30, low: 84.40, close: 85.15, volume: '950 oz' },
  { time: '17:00', price: 85.40, open: 85.15, high: 85.60, low: 85.00, close: 85.40, volume: '730 oz' },
];

interface TouchInteractiveChartProps {
  assetSymbol?: string;
  assetName?: string;
  currency?: string;
  data?: PricePoint[];
}

export const TouchInteractiveChart: React.FC<TouchInteractiveChartProps> = ({
  assetSymbol = 'XAU/EUR',
  assetName = 'Swiss Allocated 999.9 Gold Bullion',
  currency: _currency = 'EUR',
  data = SAMPLE_CHART_DATA,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(data.length - 1);
  const [_isHovering, setIsHovering] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');
  const chartRef = useRef<HTMLDivElement>(null);

  const selectedPoint = data[selectedIndex] || data[data.length - 1];
  const firstPoint = data[0];
  const priceChange = selectedPoint.price - firstPoint.price;
  const priceChangePct = ((priceChange / firstPoint.price) * 100);

  // SVG Calculation Helpers
  const minPrice = Math.min(...data.map((d) => d.low)) * 0.998;
  const maxPrice = Math.max(...data.map((d) => d.high)) * 1.002;
  const chartHeight = 180;
  const chartWidth = 500;

  const getY = (val: number) => {
    return chartHeight - ((val - minPrice) / (maxPrice - minPrice)) * (chartHeight - 30) - 15;
  };

  const getX = (idx: number) => {
    return (idx / (data.length - 1)) * (chartWidth - 40) + 20;
  };

  // Generate Path for SVG Line
  const pointsString = data
    .map((d, i) => `${getX(i)},${getY(d.price)}`)
    .join(' ');

  const areaPathString = `${pointsString} ${getX(data.length - 1)},${chartHeight} ${getX(0)},${chartHeight}`;

  // Handle Touch or Mouse Sliding
  const handlePointerMove = (clientX: number) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const boundedX = Math.max(0, Math.min(relativeX, rect.width));
    const ratio = boundedX / rect.width;
    const targetIndex = Math.round(ratio * (data.length - 1));
    const clampedIndex = Math.max(0, Math.min(targetIndex, data.length - 1));

    setSelectedIndex(clampedIndex);
    setIsHovering(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePointerMove(e.clientX);
  };

  return (
    <div
      style={{
        backgroundColor: '#0c0812',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      {/* Top Interactive Readout Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: 900, color: '#FFFFFF' }}>{assetSymbol}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{assetName}</span>
          </div>

          {/* Dynamic Pinpointed Price Readout */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
              €{selectedPoint.price.toFixed(2)}
            </div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: priceChange >= 0 ? 'var(--green-valid)' : '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              {priceChange >= 0 ? '+' : ''}€{priceChange.toFixed(2)} ({priceChangePct >= 0 ? '+' : ''}{priceChangePct.toFixed(2)}%)
            </div>
          </div>
        </div>

        {/* Timeframe Selector Pills */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#160f1e', padding: '3px', borderRadius: '6px' }}>
          {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: timeframe === tf ? 'var(--red-primary)' : 'transparent',
                color: timeframe === tf ? '#FFFFFF' : 'var(--text-muted)',
                fontSize: '10px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Real-Time Pinpointed OHLC Values Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: '#120c19',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid #23162b',
          fontSize: '10.5px',
          fontFamily: 'var(--font-mono)',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div>
          <span style={{ color: 'var(--text-dim)' }}>TIME: </span>
          <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{selectedPoint.time}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-dim)' }}>O: </span>
          <span style={{ color: '#FFFFFF' }}>€{selectedPoint.open.toFixed(2)}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-dim)' }}>H: </span>
          <span style={{ color: 'var(--green-valid)' }}>€{selectedPoint.high.toFixed(2)}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-dim)' }}>L: </span>
          <span style={{ color: '#ef4444' }}>€{selectedPoint.low.toFixed(2)}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-dim)' }}>VOL: </span>
          <span style={{ color: 'var(--red-primary)', fontWeight: 700 }}>{selectedPoint.volume}</span>
        </div>
      </div>

      {/* Interactive Touch / Slide Chart Area */}
      <div
        ref={chartRef}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchMove}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          position: 'relative',
          height: `${chartHeight}px`,
          cursor: 'crosshair',
          touchAction: 'none',
        }}
      >
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="chartGradientRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(239, 68, 68, 0.35)" />
              <stop offset="100%" stopColor="rgba(239, 68, 68, 0.0)" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          <line x1="0" y1={getY(minPrice + (maxPrice - minPrice) * 0.75)} x2={chartWidth} y2={getY(minPrice + (maxPrice - minPrice) * 0.75)} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          <line x1="0" y1={getY(minPrice + (maxPrice - minPrice) * 0.50)} x2={chartWidth} y2={getY(minPrice + (maxPrice - minPrice) * 0.50)} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          <line x1="0" y1={getY(minPrice + (maxPrice - minPrice) * 0.25)} x2={chartWidth} y2={getY(minPrice + (maxPrice - minPrice) * 0.25)} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

          {/* Gradient Fill */}
          <polygon points={areaPathString} fill="url(#chartGradientRed)" />

          {/* Main Price Line */}
          <polyline
            fill="none"
            stroke="var(--red-primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsString}
          />

          {/* Pinpoint Crosshair Vertical Line */}
          <line
            x1={getX(selectedIndex)}
            y1="0"
            x2={getX(selectedIndex)}
            y2={chartHeight}
            stroke="rgba(239, 68, 68, 0.6)"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />

          {/* Pinpoint Glow Dot at Exact Finger Position */}
          <circle
            cx={getX(selectedIndex)}
            cy={getY(selectedPoint.price)}
            r="6"
            fill="var(--red-primary)"
            stroke="#FFFFFF"
            strokeWidth="2"
            style={{ filter: 'drop-shadow(0 0 8px var(--red-glow))' }}
          />
        </svg>

        {/* Floating Tooltip Follower */}
        <div
          style={{
            position: 'absolute',
            left: `${(selectedIndex / (data.length - 1)) * 90 + 5}%`,
            top: `${Math.max(10, getY(selectedPoint.price) - 35)}px`,
            transform: 'translateX(-50%)',
            backgroundColor: '#1b1022',
            border: '1px solid var(--border-red)',
            padding: '3px 8px',
            borderRadius: '5px',
            fontSize: '10px',
            fontWeight: 800,
            color: '#FFFFFF',
            fontFamily: 'var(--font-mono)',
            pointerEvents: 'none',
            boxShadow: '0 4px 15px rgba(0,0,0,0.8)',
            whiteSpace: 'nowrap',
          }}
        >
          €{selectedPoint.price.toFixed(2)} • {selectedPoint.time}
        </div>
      </div>

      {/* Finger Slide Instruction Helper */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text-dim)', paddingTop: '4px' }}>
        <Crosshair size={12} color="var(--red-primary)" />
        <span>Slide finger or mouse across chart to pinpoint real-time OHLC & volume</span>
      </div>
    </div>
  );
};
