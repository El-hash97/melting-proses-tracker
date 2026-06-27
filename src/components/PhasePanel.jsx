import { useFurnace } from '../context/FurnaceContext';

function formatTime(seconds) {
  const s = Math.abs(Math.floor(seconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export default function PhasePanel() {
  const {
    phases,
    currentPhaseIndex,
    elapsedInPhase,
    remainingInPhase,
    phaseStatus,
    status,
    totalElapsed,
    totalConfiguredSeconds,
  } = useFurnace();

  const currentPhase = phases[currentPhaseIndex];
  if (!currentPhase) return null;

  const phaseSec = currentPhase.duration * 60;
  const overtime = elapsedInPhase > phaseSec;
  const overBy = overtime ? elapsedInPhase - phaseSec : 0;
  const totalOvertime = totalElapsed > totalConfiguredSeconds;
  const totalOverBy = totalElapsed - totalConfiguredSeconds;
  const isRunning = status === 'running';

  const sc = {
    normal:   { label: 'NORMAL',     bg: 'bg-emerald-900/20', border: 'border-emerald-700/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    warning:  { label: 'PERINGATAN', bg: 'bg-yellow-900/20',  border: 'border-yellow-700/30',  text: 'text-yellow-400',  dot: 'bg-yellow-400' },
    overtime: { label: 'OVERTIME',   bg: 'bg-red-900/20',     border: 'border-red-700/30',     text: 'text-red-400',     dot: 'bg-red-400' },
  }[phaseStatus] || { label: 'NORMAL', bg: 'bg-emerald-900/20', border: 'border-emerald-700/30', text: 'text-emerald-400', dot: 'bg-emerald-400' };

  const blinkDot = (phaseStatus !== 'normal') && isRunning ? 'animate-blink-warn' : '';

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Status badge */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${sc.bg} ${sc.border}`}>
        <div className={`w-2 h-2 rounded-full ${sc.dot} ${blinkDot}`} />
        <span className={`font-display text-sm tracking-widest ${sc.text}`}>{sc.label}</span>
      </div>

      {/* Current phase name */}
      <div className="bg-furnace-panel rounded-xl border border-furnace-border p-4">
        <p className="text-zinc-500 text-xs font-mono tracking-widest uppercase mb-1">Proses Aktif</p>
        <p className={`font-display text-3xl tracking-widest leading-none ${sc.text}`}>
          {status === 'idle' ? 'STANDBY' : currentPhase.name.toUpperCase()}
        </p>
        {status !== 'idle' && (
          <p className="text-zinc-600 text-xs font-mono mt-1.5">{currentPhaseIndex + 1} / {phases.length}</p>
        )}
      </div>

      {/* Phase countdown */}
      <div className={`bg-furnace-panel rounded-xl border p-4 ${overtime && isRunning ? 'border-red-800/40' : 'border-furnace-border'}`}>
        <p className="text-zinc-500 text-xs font-mono tracking-widest uppercase mb-1">
          {overtime ? 'Overtime Fase' : 'Sisa Waktu Fase'}
        </p>
        <div className={`font-display tracking-widest leading-none ${
          overtime ? 'text-red-400 text-5xl' : phaseStatus === 'warning' ? 'text-yellow-400 text-5xl animate-blink-warn' : 'text-amber-400 text-5xl'
        }`}>
          {status === 'idle' ? '--:--' : overtime ? `+${formatTime(overBy)}` : formatTime(remainingInPhase)}
        </div>
        <p className="text-zinc-600 text-xs font-mono mt-2">Standar: {currentPhase.duration} menit</p>
      </div>

      {/* Total elapsed */}
      <div className={`bg-furnace-panel rounded-xl border p-4 ${totalOvertime && isRunning ? 'border-red-800/40' : 'border-furnace-border'}`}>
        <p className="text-zinc-500 text-xs font-mono tracking-widest uppercase mb-1">Total Waktu Berjalan</p>
        <div className={`font-display text-4xl tracking-widest leading-none ${totalOvertime && isRunning ? 'text-red-400' : 'text-white'}`}>
          {formatTime(totalElapsed)}
        </div>
        {totalOvertime && isRunning ? (
          <p className="text-red-500 text-xs font-mono mt-1.5 animate-blink-warn">+{formatTime(totalOverBy)} dari standar</p>
        ) : (
          <p className="text-zinc-600 text-xs font-mono mt-1.5">Target: {Math.floor(totalConfiguredSeconds / 60)} menit</p>
        )}
      </div>

      {/* Upcoming phases */}
      {status !== 'idle' && currentPhaseIndex < phases.length - 1 && (
        <div className="bg-furnace-panel rounded-xl border border-furnace-border p-3">
          <p className="text-zinc-500 text-xs font-mono tracking-widest uppercase mb-2">Selanjutnya</p>
          <div className="flex flex-col gap-1.5">
            {phases.slice(currentPhaseIndex + 1, currentPhaseIndex + 4).map((p, i) => (
              <div key={p.id} className="flex items-center justify-between">
                <span className={`font-display tracking-widest ${i === 0 ? 'text-zinc-300 text-sm' : 'text-zinc-600 text-xs'}`}>
                  {p.name.toUpperCase()}
                </span>
                <span className="font-mono text-xs text-zinc-600">{p.duration} mnt</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
