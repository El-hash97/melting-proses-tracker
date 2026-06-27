import { useFurnace } from '../context/FurnaceContext';

function formatTime(seconds) {
  const s = Math.abs(Math.floor(seconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export default function BatteryIndicator() {
  const {
    phases,
    fillPercent,
    currentPhaseIndex,
    phaseStatus,
    status,
    totalElapsed,
    totalConfiguredSeconds,
  } = useFurnace();

  const totalMin = phases.reduce((acc, p) => acc + p.duration, 0);

  let cumulative = 0;
  const boundaries = phases.map((p) => {
    const start = cumulative;
    cumulative += (p.duration / totalMin) * 100;
    return { start, end: cumulative, phase: p };
  });

  const fillGradient =
    phaseStatus === 'overtime'
      ? 'from-red-900 via-red-600 to-red-400'
      : phaseStatus === 'warning'
      ? 'from-yellow-900 via-yellow-600 to-yellow-400'
      : 'from-orange-950 via-orange-700 to-amber-400';

  const glowStyle =
    phaseStatus === 'overtime'
      ? '0 0 50px #EF444460'
      : phaseStatus === 'warning'
      ? '0 0 50px #FACC1560'
      : '0 0 40px #FF6B2B50';

  const borderColor =
    phaseStatus === 'overtime'
      ? '#EF4444'
      : phaseStatus === 'warning'
      ? '#FACC15'
      : '#2A2A32';

  const blinkClass =
    phaseStatus === 'overtime' && status === 'running'
      ? 'animate-blink-danger'
      : phaseStatus === 'warning' && status === 'running'
      ? 'animate-blink-warn'
      : '';

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {/* Terminal cap */}
      <div className="w-20 h-4 rounded-sm" style={{ background: '#2A2A32' }} />

      {/* Battery body */}
      <div
        className="relative w-72 rounded-2xl overflow-hidden transition-all duration-700"
        style={{
          height: 540,
          border: `3px solid ${borderColor}`,
          background: '#0D0D10',
          boxShadow: glowStyle,
        }}
      >
        {/* Phase segment dividers */}
        {boundaries.slice(0, -1).map((b) => (
          <div
            key={b.phase.id + '-div'}
            className="absolute left-0 right-0 pointer-events-none"
            style={{ bottom: `${b.end}%`, height: 1, background: '#2A2A3260', zIndex: 10 }}
          />
        ))}

        {/* Fill */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${fillGradient} ${blinkClass} transition-all duration-1000 ease-linear`}
          style={{ height: `${fillPercent}%` }}
        />

        {/* Active phase glow ring */}
        {status !== 'idle' && boundaries[currentPhaseIndex] && (
          <div
            className="absolute left-0 right-0 pointer-events-none transition-all duration-700"
            style={{
              bottom: `${boundaries[currentPhaseIndex].start}%`,
              height: `${boundaries[currentPhaseIndex].end - boundaries[currentPhaseIndex].start}%`,
              zIndex: 20,
              border: `1px solid ${phaseStatus === 'overtime' ? '#EF4444' : phaseStatus === 'warning' ? '#FACC15' : '#FF6B2B'}`,
              boxShadow: `inset 0 0 12px ${phaseStatus === 'overtime' ? '#EF444420' : phaseStatus === 'warning' ? '#FACC1520' : '#FF6B2B15'}`,
            }}
          />
        )}

        {/* Phase labels */}
        {boundaries.map((b, i) => {
          const midPercent = (b.start + b.end) / 2;
          const isActive = i === currentPhaseIndex && status !== 'idle';
          const isPast = i < currentPhaseIndex;
          return (
            <div
              key={b.phase.id + '-label'}
              className="absolute w-full flex items-center justify-center pointer-events-none"
              style={{ bottom: `${midPercent}%`, transform: 'translateY(50%)', zIndex: 30 }}
            >
              <span
                className={`font-display tracking-widest transition-all duration-300 ${
                  isActive
                    ? 'text-white text-sm drop-shadow-[0_0_6px_white]'
                    : isPast
                    ? 'text-white/25 text-xs'
                    : 'text-white/45 text-xs'
                }`}
              >
                {b.phase.name.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Fill percentage + total time */}
      <div className="text-center mt-1">
        <div
          className={`font-display text-5xl tracking-widest ${
            phaseStatus === 'overtime' ? 'text-red-400' : phaseStatus === 'warning' ? 'text-yellow-400' : 'text-amber-400'
          }`}
        >
          {Math.round(fillPercent)}%
        </div>
        <div className="font-mono text-xs text-zinc-500 tracking-widest mt-1">
          {formatTime(totalElapsed)} / {formatTime(totalConfiguredSeconds)}
        </div>
      </div>
    </div>
  );
}
