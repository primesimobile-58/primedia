'use client';

import React, { useState } from 'react';

interface WorldMapProps {
  data: Record<string, number>;
  onCountryClick?: (countryCode: string) => void;
}

// Simplified paths for major regions/continents to form a recognizable world map
// This is a stylistic representation.
const WORLD_PATHS = [
  { id: 'US', name: 'United States', d: 'M 150 120 L 250 120 L 250 180 L 150 180 Z' }, // Placeholder box for NA
  { id: 'TR', name: 'Turkey', d: 'M 480 155 L 500 155 L 500 165 L 480 165 Z' }, // Placeholder for TR
  // A better approach for a "Master" level without external libs is a dotted map or a pre-defined SVG.
  // Since I cannot fetch a large SVG, I will use a stylized interactive "Grid Map" or a simple list if I can't do better.
  // BUT the user asked for a MAP.
];

// Let's use a cleaner, abstract dot map approach which looks modern and "Master" level.
// We will generate dots in a grid and highlight them to form a world shape roughly.
// Or we can use a very simplified SVG path set.

const WorldMap: React.FC<WorldMapProps> = ({ data, onCountryClick }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  // Stylized "World" using circles for a modern look
  // This is a rough approximation of world density
  const dots = [
    // North America
    { x: 150, y: 100, c: 'US' }, { x: 170, y: 100, c: 'US' }, { x: 190, y: 100, c: 'US' },
    { x: 150, y: 120, c: 'US' }, { x: 170, y: 120, c: 'US' }, { x: 190, y: 120, c: 'US' },
    { x: 160, y: 140, c: 'US' }, { x: 180, y: 140, c: 'US' },
    // South America
    { x: 220, y: 200, c: 'BR' }, { x: 240, y: 200, c: 'BR' },
    { x: 230, y: 220, c: 'BR' }, { x: 230, y: 240, c: 'BR' },
    // Europe
    { x: 400, y: 100, c: 'GB' }, { x: 420, y: 100, c: 'DE' }, { x: 440, y: 100, c: 'PL' },
    { x: 400, y: 120, c: 'FR' }, { x: 420, y: 120, c: 'IT' }, { x: 440, y: 120, c: 'TR' },
    // Asia
    { x: 500, y: 100, c: 'RU' }, { x: 520, y: 100, c: 'RU' }, { x: 540, y: 100, c: 'RU' },
    { x: 500, y: 120, c: 'CN' }, { x: 520, y: 120, c: 'CN' }, { x: 540, y: 120, c: 'JP' },
    { x: 510, y: 140, c: 'IN' }, { x: 530, y: 140, c: 'CN' },
    // Africa
    { x: 400, y: 180, c: 'EG' }, { x: 420, y: 180, c: 'SA' },
    { x: 400, y: 200, c: 'NG' }, { x: 420, y: 200, c: 'KE' },
    { x: 410, y: 220, c: 'ZA' },
    // Oceania
    { x: 600, y: 220, c: 'AU' }, { x: 620, y: 220, c: 'AU' },
  ];

  return (
    <div className="w-full aspect-[2/1] bg-blue-50/30 rounded-2xl relative overflow-hidden border border-blue-100 p-4">
      <svg viewBox="0 0 800 400" className="w-full h-full">
        {/* Background Grid Lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="800" height="400" fill="url(#grid)" />

        {/* Map Dots */}
        {dots.map((dot, i) => {
          const count = data[dot.c] || 0;
          const size = count > 0 ? 8 + Math.min(count / 10, 10) : 6;
          const opacity = count > 0 ? 0.8 : 0.3;
          const color = count > 0 ? '#3b82f6' : '#cbd5e1';
          
          return (
            <g 
              key={i} 
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHovered(dot.c)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onCountryClick && onCountryClick(dot.c)}
            >
              <circle
                cx={dot.x}
                cy={dot.y}
                r={size}
                fill={color}
                opacity={opacity}
                className="transition-all duration-500 hover:fill-primary hover:opacity-100 hover:r-12"
              />
              {count > 0 && (
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={size + 4}
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  opacity="0.4"
                  className="animate-ping"
                />
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Tooltip */}
      {hovered && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 text-xs font-bold text-gray-700">
          {hovered}: {data[hovered]?.toLocaleString() || 0} Ziyaretçi
        </div>
      )}
      
      <div className="absolute top-4 right-4 text-[10px] font-medium text-gray-400">
        Etkileşimli Dünya Haritası (Beta)
      </div>
    </div>
  );
};

export default WorldMap;
