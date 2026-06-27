import BatteryIndicator from '../components/BatteryIndicator';
import PhasePanel from '../components/PhasePanel';
import ControlButtons from '../components/ControlButtons';
import { useFurnace } from '../context/FurnaceContext';

export default function DashboardScreen({ onOpenSettings, onOpenHistory }) {
  const { status, phaseStatus } = useFurnace();

  return (
    <div className="min-h-screen bg-furnace-bg flex flex-col font-body">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-furnace-border">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${
            status === 'running' ? 'bg-emerald-400 animate-pulse' :
            status === 'paused' ? 'bg-amber-400' : 'bg-zinc-600'
          }`} />
          <span className="font-display text-lg tracking-widest text-zinc-300">FURNACE TRACKER</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-furnace-border text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition-all font-display text-sm tracking-widest"
          >
            📋 HISTORY
          </button>
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-furnace-border text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition-all font-display text-sm tracking-widest"
          >
            ⚙ SETTINGS
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

        {/* Right: phase list (scrollable, tinggi sama dengan kiri) + controls */}
        <div className="w-52 flex-shrink-0 flex flex-col gap-3 pt-2">
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
      <div className="px-3 py-2 border-b border-furnace-border flex-shrink-0">
        <p className="font-display text-xs tracking-widest text-zinc-500">
          {phases.length} PROSES — {totalMin} MENIT
        </p>
      </div>
      <div className="divide-y divide-furnace-border">
        {phases.map((p, i) => {
          const isActive = i === currentPhaseIndex && status !== 'idle';
          const isPast = i < currentPhaseIndex;
          const dotColor = isActive
            ? phaseStatus === 'overtime' ? 'bg-red-400 animate-blink-warn'
            : phaseStatus === 'warning' ? 'bg-yellow-400 animate-blink-warn'
            : 'bg-amber-400 animate-pulse'
            : isPast ? 'bg-emerald-700' : 'bg-zinc-700';

          return (
            <div
              key={p.id}
              className={`flex items-center justify-between px-3 py-2.5 transition-colors flex-shrink-0 ${isActive ? 'bg-amber-950/30' : ''}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />
                <span className={`font-display tracking-wider text-xs truncate ${
                  isActive ? 'text-white' : isPast ? 'text-zinc-500' : 'text-zinc-600'
                }`}>
                  {p.name.toUpperCase()}
                </span>
              </div>
              <span className={`font-mono text-xs flex-shrink-0 ml-1 ${isActive ? 'text-amber-400' : 'text-zinc-700'}`}>
                {p.duration}m
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
