import { Settings, ClipboardList } from 'lucide-react';
import BatteryIndicator from '../components/BatteryIndicator';
import PhasePanel from '../components/PhasePanel';
import ControlButtons from '../components/ControlButtons';
import { useFurnace } from '../context/FurnaceContext';

export default function DashboardScreen({ onOpenSettings, onOpenHistory }) {
  const { status, phaseStatus } = useFurnace();

  const accentGradient =
    status === 'running'
      ? phaseStatus === 'overtime'
        ? 'from-transparent via-red-500 to-transparent'
        : phaseStatus === 'warning'
        ? 'from-transparent via-yellow-500 to-transparent'
        : 'from-transparent via-amber-500 to-transparent'
      : 'from-transparent via-zinc-700 to-transparent';

  return (
    <div className="min-h-screen bg-furnace-bg flex flex-col font-body">
      {/* Top accent line */}
      <div className={`h-px w-full bg-gradient-to-r ${accentGradient} transition-all duration-700`} />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-furnace-border">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-4 h-4">
            {status === 'running' && (
              <span className={`absolute inset-0 rounded-full animate-ping ${
                phaseStatus === 'overtime' ? 'bg-red-400/30' :
                phaseStatus === 'warning' ? 'bg-yellow-400/30' : 'bg-emerald-400/30'
              }`} />
            )}
            <span className={`relative block w-2 h-2 rounded-full ${
              status === 'running' ? 'bg-emerald-400' :
              status === 'paused' ? 'bg-amber-400' : 'bg-zinc-600'
            }`} />
          </div>
          <span className="font-display text-lg tracking-widest text-zinc-300">FURNACE TRACKER</span>
          {status !== 'idle' && (
            <span className={`font-mono text-xs tracking-widest px-2 py-0.5 rounded border ${
              status === 'running'
                ? 'text-emerald-400 border-emerald-800/40 bg-emerald-900/20'
                : 'text-amber-400 border-amber-800/40 bg-amber-900/20'
            }`}>
              {status === 'running' ? 'RUNNING' : 'PAUSED'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-furnace-border text-zinc-500 hover:text-zinc-200 hover:border-zinc-500 hover:bg-white/[0.04] transition-all font-display text-sm tracking-widest"
          >
            <ClipboardList size={14} />
            HISTORY
          </button>
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-furnace-border text-zinc-500 hover:text-zinc-200 hover:border-zinc-500 hover:bg-white/[0.04] transition-all font-display text-sm tracking-widest"
          >
            <Settings size={14} />
            SETTINGS
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center gap-6 px-6 py-6 overflow-auto">
        {/* Left: info panels */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-3 pt-2">
          <PhasePanel />
        </div>

        {/* Center: Battery */}
        <div className="flex-shrink-0 flex flex-col items-center pt-2">
          <BatteryIndicator />
        </div>

        {/* Right: phase list + controls */}
        <div className="w-56 flex-shrink-0 flex flex-col gap-3 pt-2">
          <PhaseList />
          <ControlButtons />
        </div>
      </main>
    </div>
  );
}

function PhaseList() {
  const { phases, currentPhaseIndex, status, phaseStatus } = useFurnace();
  const totalMin = phases.reduce((a, p) => a + p.duration, 0);

  return (
    <div className="bg-furnace-panel rounded-xl border border-furnace-border flex flex-col overflow-hidden">
      <div className="px-3 py-2.5 border-b border-furnace-border flex-shrink-0">
        <p className="font-display text-xs tracking-widest text-zinc-500">
          {phases.length} PROSES — {totalMin}m
        </p>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-furnace-border/50">
        {phases.map((p, i) => {
          const isActive = i === currentPhaseIndex && status !== 'idle';
          const isPast = i < currentPhaseIndex;
          const dotColor = isActive
            ? phaseStatus === 'overtime'
              ? 'bg-red-400 animate-blink-warn'
              : phaseStatus === 'warning'
              ? 'bg-yellow-400 animate-blink-warn'
              : 'bg-amber-400 animate-pulse'
            : isPast
            ? 'bg-emerald-700'
            : 'bg-zinc-700';

          return (
            <div
              key={p.id}
              className={`flex items-center justify-between px-3 py-2.5 transition-colors ${
                isActive ? 'bg-amber-950/40' : isPast ? 'bg-black/10' : ''
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />
                <span className={`font-display tracking-wider text-xs truncate ${
                  isActive ? 'text-white' : isPast ? 'text-zinc-600' : 'text-zinc-600'
                }`}>
                  {p.name.toUpperCase()}
                </span>
              </div>
              <span className={`font-mono text-xs flex-shrink-0 ml-1 ${
                isActive ? 'text-amber-400' : 'text-zinc-700'
              }`}>
                {p.duration}m
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
