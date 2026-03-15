import type { ReactNode } from 'react';

interface BasketballCourtProps {
  children?: ReactNode;
  width?: number;
  height?: number;
}

export function BasketballCourt({
  children,
  width = 500,
  height = 470,
}: BasketballCourtProps) {
  const stroke = '#3a3a4a';
  const sw = 1.5;

  return (
    <div className="max-w-[500px] mx-auto w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Court outline */}
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          stroke={stroke}
          strokeWidth={sw}
          fill="none"
        />

        {/* Backboard */}
        <line
          x1={220}
          y1={40}
          x2={280}
          y2={40}
          stroke={stroke}
          strokeWidth={2}
        />

        {/* Basket / rim */}
        <circle
          cx={250}
          cy={52}
          r={9}
          stroke={stroke}
          strokeWidth={sw}
          fill="none"
        />

        {/* Paint / key */}
        <rect
          x={170}
          y={0}
          width={160}
          height={190}
          stroke={stroke}
          strokeWidth={sw}
          fill="none"
        />

        {/* Free throw circle */}
        <circle
          cx={250}
          cy={190}
          r={60}
          stroke={stroke}
          strokeWidth={sw}
          fill="none"
        />

        {/* Restricted area arc */}
        <path
          d="M 220 52 A 40 40 0 0 0 280 52"
          stroke={stroke}
          strokeWidth={sw}
          fill="none"
        />

        {/* Three-point line */}
        <path
          d="M 30 0 L 30 140 A 238 238 0 0 0 470 140 L 470 0"
          stroke={stroke}
          strokeWidth={sw}
          fill="none"
        />

        {/* Half-court line */}
        <line
          x1={0}
          y1={height}
          x2={width}
          y2={height}
          stroke={stroke}
          strokeWidth={sw}
        />

        {/* Center circle (partial) */}
        <path
          d="M 190 470 A 60 60 0 0 1 310 470"
          stroke={stroke}
          strokeWidth={sw}
          fill="none"
        />

        {/* Overlays */}
        <g>{children}</g>
      </svg>
    </div>
  );
}
