'use client';

// Proportional Relationship Graph Diagram
export function ProportionalGraphDiagram() {
  return (
    <div className="bg-white rounded-xl p-4 border-2 border-indigo-100 my-4">
      <svg viewBox="0 0 400 300" className="w-full max-w-md mx-auto" role="img" aria-label="Graph of a proportional relationship showing a straight line through the origin">
        {/* Grid */}
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <g key={`grid-${i}`}>
            <line x1={50 + i * 45} y1={20} x2={50 + i * 45} y2={260} stroke="#e5e7eb" strokeWidth="1" />
            <line x1={50} y1={260 - i * 34} x2={365} y2={260 - i * 34} stroke="#e5e7eb" strokeWidth="1" />
          </g>
        ))}
        {/* Axes */}
        <line x1="50" y1="260" x2="365" y2="260" stroke="#374151" strokeWidth="2" markerEnd="url(#arrow)" />
        <line x1="50" y1="260" x2="50" y2="20" stroke="#374151" strokeWidth="2" markerEnd="url(#arrow)" />
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#374151" />
          </marker>
        </defs>
        {/* Axis labels */}
        <text x="370" y="265" fontSize="14" fill="#374151" fontWeight="600">x</text>
        <text x="40" y="15" fontSize="14" fill="#374151" fontWeight="600">y</text>
        <text x="45" y="275" fontSize="12" fill="#6b7280">0</text>
        {/* Tick labels */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <g key={`tick-${i}`}>
            <text x={50 + i * 45} y="278" fontSize="11" fill="#6b7280" textAnchor="middle">{i}</text>
            <text x="38" y={264 - i * 34} fontSize="11" fill="#6b7280" textAnchor="end">{i * 2}</text>
          </g>
        ))}
        {/* Proportional line y = 2x */}
        <line x1="50" y1="260" x2="320" y2="56" stroke="#6366f1" strokeWidth="3" />
        {/* Data points */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <circle key={`pt-${i}`} cx={50 + i * 45} cy={260 - i * 2 * 17} r="5" fill="#6366f1" stroke="white" strokeWidth="2" />
        ))}
        {/* Origin highlight */}
        <circle cx="50" cy="260" r="7" fill="#10b981" stroke="white" strokeWidth="2" />
        <text x="62" y="252" fontSize="11" fill="#10b981" fontWeight="600">(0, 0)</text>
        {/* Label */}
        <text x="280" y="80" fontSize="14" fill="#6366f1" fontWeight="600">y = 2x</text>
        {/* Annotations */}
        <text x="200" y="295" fontSize="12" fill="#6b7280" textAnchor="middle" fontStyle="italic">Straight line through the origin</text>
      </svg>
    </div>
  );
}

// Circumference Diagram
export function CircumferenceDiagram() {
  return (
    <div className="bg-white rounded-xl p-4 border-2 border-indigo-100 my-4">
      <svg viewBox="0 0 400 320" className="w-full max-w-md mx-auto" role="img" aria-label="Circle showing diameter and circumference">
        {/* Circle */}
        <circle cx="200" cy="150" r="100" fill="none" stroke="#6366f1" strokeWidth="3" />
        {/* Circumference highlight - dashed overlay */}
        <circle cx="200" cy="150" r="100" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="12 6" opacity="0.7" />
        {/* Center dot */}
        <circle cx="200" cy="150" r="4" fill="#374151" />
        {/* Diameter line */}
        <line x1="100" y1="150" x2="300" y2="150" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6 4" />
        {/* Diameter label */}
        <text x="200" y="140" fontSize="15" fill="#ef4444" fontWeight="700" textAnchor="middle">d (diameter)</text>
        {/* Radius line */}
        <line x1="200" y1="150" x2="200" y2="50" stroke="#10b981" strokeWidth="2.5" />
        {/* Radius label */}
        <text x="212" y="105" fontSize="14" fill="#10b981" fontWeight="600">r</text>
        {/* Circumference arrow */}
        <path d="M 300 150 A 100 100 0 0 1 270 240" fill="none" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#arrowOrange)" />
        <defs>
          <marker id="arrowOrange" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>
        <text x="330" y="200" fontSize="13" fill="#f59e0b" fontWeight="600">C</text>
        {/* Formula */}
        <rect x="100" y="270" width="200" height="36" rx="8" fill="#6366f1" opacity="0.1" />
        <text x="200" y="294" fontSize="16" fill="#6366f1" fontWeight="700" textAnchor="middle">C = π  d  or  C = 2πr</text>
        {/* Legend */}
        <circle cx="80" cy="295" r="0" />
      </svg>
    </div>
  );
}

// Area Diagram
export function AreaDiagram() {
  return (
    <div className="bg-white rounded-xl p-4 border-2 border-indigo-100 my-4">
      <svg viewBox="0 0 400 320" className="w-full max-w-md mx-auto" role="img" aria-label="Circle showing radius and shaded area">
        {/* Filled circle for area */}
        <circle cx="200" cy="145" r="100" fill="#8b5cf6" opacity="0.15" />
        {/* Circle outline */}
        <circle cx="200" cy="145" r="100" fill="none" stroke="#8b5cf6" strokeWidth="3" />
        {/* Center dot */}
        <circle cx="200" cy="145" r="4" fill="#374151" />
        <text x="195" y="162" fontSize="11" fill="#374151">center</text>
        {/* Radius line */}
        <line x1="200" y1="145" x2="290" y2="100" stroke="#ef4444" strokeWidth="2.5" />
        {/* Radius label */}
        <text x="250" y="112" fontSize="15" fill="#ef4444" fontWeight="700">r (radius)</text>
        {/* Grid squares to show area concept */}
        {[-3, -2, -1, 0, 1, 2, 3].map((row) =>
          [-3, -2, -1, 0, 1, 2, 3].map((col) => {
            const cx = 200 + col * 25;
            const cy = 145 + row * 25;
            const dist = Math.sqrt(col * col + row * row);
            if (dist <= 3.2) {
              return (
                <rect
                  key={`${row}-${col}`}
                  x={cx - 11}
                  y={cy - 11}
                  width="22"
                  height="22"
                  fill="#8b5cf6"
                  opacity="0.08"
                  stroke="#8b5cf6"
                  strokeWidth="0.5"
                  strokeOpacity="0.3"
                  rx="2"
                />
              );
            }
            return null;
          })
        )}
        {/* Area label */}
        <text x="200" y="150" fontSize="22" fill="#8b5cf6" fontWeight="700" textAnchor="middle" opacity="0.5">A</text>
        {/* Formula */}
        <rect x="115" y="268" width="170" height="36" rx="8" fill="#8b5cf6" opacity="0.1" />
        <text x="200" y="292" fontSize="16" fill="#8b5cf6" fontWeight="700" textAnchor="middle">A = πr²</text>
      </svg>
    </div>
  );
}
