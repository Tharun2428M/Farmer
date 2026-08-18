import React, { useState } from 'react';

const CHART_COLORS = [
  '#2d6a4f',
  '#52b788',
  '#f59e0b',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316'
];

/**
 * Pure SVG Responsive Line / Area Chart
 */
export const AdminLineChart = ({
  data = [],
  valueKey = 'value',
  labelKey = 'label',
  height = 240,
  strokeColor = '#2d6a4f',
  fillColor = 'rgba(82, 183, 136, 0.18)',
  yAxisFormatter = (val) => val
}) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No trend data available for selected range
      </div>
    );
  }

  const values = data.map((d) => Number(d[valueKey] || 0));
  const maxVal = Math.max(...values, 10);
  const minVal = 0;
  const paddingX = 40;
  const paddingY = 30;
  const width = 600;

  const getX = (idx) => {
    if (data.length <= 1) return width / 2;
    return paddingX + (idx / (data.length - 1)) * (width - paddingX * 2);
  };

  const getY = (val) => {
    return height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - paddingY * 2);
  };

  // Generate SVG path
  const points = data.map((d, i) => `${getX(i)},${getY(d[valueKey])}`).join(' ');
  const areaPath = `M ${getX(0)},${height - paddingY} ${data
    .map((d, i) => `L ${getX(i)},${getY(d[valueKey])}`)
    .join(' ')} L ${getX(data.length - 1)},${height - paddingY} Z`;

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
        <defs>
          <linearGradient id={`grad-${strokeColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const y = height - paddingY - pct * (height - paddingY * 2);
          const gridVal = minVal + pct * (maxVal - minVal);
          return (
            <g key={i}>
              <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#e5e7eb" strokeDasharray="3 3" />
              <text x={paddingX - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
                {yAxisFormatter(Math.round(gridVal))}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill={`url(#grad-${strokeColor.replace('#', '')})`} />

        {/* Line stroke */}
        <polyline fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />

        {/* Data points and labels */}
        {data.map((d, i) => {
          const cx = getX(i);
          const cy = getY(d[valueKey]);
          const isHovered = hoveredPoint === i;

          return (
            <g key={i}>
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 6 : 4}
                fill={isHovered ? strokeColor : '#ffffff'}
                stroke={strokeColor}
                strokeWidth="2.5"
                style={{ cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />

              {/* X-axis labels */}
              <text
                x={cx}
                y={height - 8}
                textAnchor="middle"
                fontSize="10"
                fill={isHovered ? 'var(--text-main)' : '#9ca3af'}
                fontWeight={isHovered ? '700' : '500'}
              >
                {d[labelKey]}
              </text>

              {/* Tooltip on hover */}
              {isHovered && (
                <g>
                  <rect
                    x={cx - 40}
                    y={cy - 34}
                    width="80"
                    height="24"
                    rx="4"
                    fill="#1b4332"
                  />
                  <text
                    x={cx}
                    y={cy - 18}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {yAxisFormatter(d[valueKey])}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/**
 * Pure SVG Horizontal Bar Chart (Best for Top Products / Farmers)
 */
export const AdminBarChart = ({
  data = [],
  valueKey = 'value',
  labelKey = 'label',
  secondaryKey,
  height = 240,
  barColor = '#52b788',
  valueFormatter = (v) => v
}) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No rank data available
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => Number(d[valueKey] || 0)), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%' }}>
      {data.map((item, idx) => {
        const val = Number(item[valueKey] || 0);
        const pct = Math.min(100, Math.max(5, (val / maxVal) * 100));
        const color = CHART_COLORS[idx % CHART_COLORS.length];

        return (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                {item[labelKey]}
              </span>
              <span style={{ fontWeight: 700, color: color }}>
                {valueFormatter(val)}
                {secondaryKey && item[secondaryKey] && (
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500, marginLeft: '6px' }}>
                    (₹{item[secondaryKey]})
                  </span>
                )}
              </span>
            </div>

            <div style={{ height: '8px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  backgroundColor: color,
                  borderRadius: '999px',
                  transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Pure SVG Donut Distribution Chart
 */
export const AdminDonutChart = ({
  data = [],
  valueKey = 'value',
  labelKey = 'label',
  size = 180,
  donutThickness = 28
}) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div style={{ height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No distribution data
      </div>
    );
  }

  const total = data.reduce((acc, d) => acc + Number(d[valueKey] || 0), 0);
  const radius = size / 2;
  const innerRadius = radius - donutThickness;
  const center = radius;

  let accumulatedAngle = -90; // Start at top

  const slices = data.map((d, i) => {
    const val = Number(d[valueKey] || 0);
    const angle = total > 0 ? (val / total) * 360 : 0;
    const startAngle = accumulatedAngle;
    const endAngle = accumulatedAngle + angle;
    accumulatedAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const ix1 = center + innerRadius * Math.cos(endRad);
    const iy1 = center + innerRadius * Math.sin(endRad);
    const ix2 = center + innerRadius * Math.cos(startRad);
    const iy2 = center + innerRadius * Math.sin(startRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = total > 0 && angle < 360
      ? `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix2} ${iy2} Z`
      : `M ${center - radius} ${center} A ${radius} ${radius} 0 1 0 ${center + radius} ${center} A ${radius} ${radius} 0 1 0 ${center - radius} ${center} M ${center - innerRadius} ${center} A ${innerRadius} ${innerRadius} 0 1 1 ${center + innerRadius} ${center} A ${innerRadius} ${innerRadius} 0 1 1 ${center - innerRadius} ${center} Z`;

    return {
      pathData,
      color: CHART_COLORS[i % CHART_COLORS.length],
      label: d[labelKey],
      value: val,
      percentage: total > 0 ? Math.round((val / total) * 100) : 0
    };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
      <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {slices.map((slice, i) => (
            <path
              key={i}
              d={slice.pathData}
              fill={slice.color}
              stroke="#ffffff"
              strokeWidth="2"
              opacity={hoveredIdx === null || hoveredIdx === i ? 1 : 0.4}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
            {hoveredIdx !== null ? slices[hoveredIdx].value : total}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
            {hoveredIdx !== null ? slices[hoveredIdx].label : 'Total'}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        {slices.map((slice, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              padding: '0.2rem 0.4rem',
              borderRadius: '4px',
              backgroundColor: hoveredIdx === i ? '#f8faf9' : 'transparent',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: slice.color, flexShrink: 0 }} />
              <span style={{ color: 'var(--text-main)', fontWeight: 500, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {slice.label}
              </span>
            </div>
            <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
              {slice.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
