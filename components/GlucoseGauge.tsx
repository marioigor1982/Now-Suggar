import React from 'react';

interface GlucoseGaugeProps {
  level: number | null;
  lastRecordDate: string | null;
}

const GlucoseGauge: React.FC<GlucoseGaugeProps> = ({ level, lastRecordDate }) => {
  const min = 40;
  const max = 400;
  const value = level ?? 0;

  const clampedValue = Math.max(min, Math.min(max, value));
  // Converte o valor para um ângulo entre -90 e 90 graus
  const angle = ((clampedValue - min) / (max - min)) * 180 - 90;

  const getLevelInfo = (levelValue: number) => {
    if (levelValue < 70) return { label: 'Baixo', color: 'text-blue-500' };
    if (levelValue < 140) return { label: 'Normal', color: 'text-green-500' };
    if (levelValue < 200) return { label: 'Pré-diabetes', color: 'text-amber-500' };
    return { label: 'Alto', color: 'text-red-500' };
  };
  const levelInfo = getLevelInfo(value);

  // Função para converter coordenadas polares para cartesianas
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Função para descrever um arco SVG
  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    const d = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
    return d;
  };

  // Define as seções do medidor
  const sections = [
    { color: '#3b82f6', start: -90, end: ((70 - min) / (max - min)) * 180 - 90 },
    { color: '#22c55e', start: ((70 - min) / (max - min)) * 180 - 90, end: ((140 - min) / (max - min)) * 180 - 90 },
    { color: '#f59e0b', start: ((140 - min) / (max - min)) * 180 - 90, end: ((200 - min) / (max - min)) * 180 - 90 },
    { color: '#ef4444', start: ((200 - min) / (max - min)) * 180 - 90, end: 90 },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl w-full text-center">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Nível de Glicose Atual</h3>
      {level !== null ? (
        <>
          <div className="relative w-full max-w-xs mx-auto">
            <svg viewBox="-10 -5 220 115" className="w-full">
              <g transform="translate(100, 100)">
                {sections.map((section, index) => (
                  <path
                    key={index}
                    d={describeArc(0, 0, 80, section.start, section.end)}
                    fill="none"
                    stroke={section.color}
                    strokeWidth="20"
                    strokeLinecap="round"
                  />
                ))}
                
                <text x="-75" y="5" textAnchor="middle" className="text-xs fill-gray-500 font-semibold">Normal</text>
                <text x="75" y="5" textAnchor="middle" className="text-xs fill-gray-500 font-semibold">Alto</text>
                
                <g className="transition-transform duration-500 ease-out" style={{ transform: `rotate(${angle}deg)` }}>
                  <polygon points="0,0 -6,-65 6,-65" fill="#374151" />
                </g>
                <circle cx="0" cy="0" r="8" fill="#374151" stroke="#fff" strokeWidth="3" />
              </g>
            </svg>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              <span className={`text-5xl font-bold ${levelInfo.color}`}>{value}</span>
              <span className="text-xl text-gray-600"> mg/dL</span>
            </div>
          </div>
          <p className={`text-xl font-semibold mt-1 ${levelInfo.color}`}>{levelInfo.label}</p>
          {lastRecordDate && <p className="text-sm text-gray-500">Última aferição: {lastRecordDate}</p>}
        </>
      ) : (
        <div className="flex items-center justify-center h-48 text-gray-500">
          <p>Nenhum dado recente para exibir.</p>
        </div>
      )}
    </div>
  );
};

export default GlucoseGauge;
