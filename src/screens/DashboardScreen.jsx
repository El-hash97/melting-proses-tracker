import { Settings, ClipboardList } from 'lucide-react';
import BatteryIndicator from '../components/BatteryIndicator';
import PhasePanel from '../components/PhasePanel';
import ControlButtons from '../components/ControlButtons';
import { useFurnace } from '../context/FurnaceContext';
import { GridPattern } from '@/components/ui/grid-pattern';
import { cn } from '@/lib/utils';

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

  const gridColor =
    status === 'running'
      ? phaseStatus === 'overtime'
        ? 'fill-red-500/[0.08] stroke-red-500/[0.12]'
        : phaseStatus === 'warning'
        ? 'fill-yellow-500/[0.08] stroke-yellow-500/[0.12]'
        : 'fill-amber-500/[0.08] stroke-amber-500/[0.12]'
      : 'fill-zinc-700/[0.06] stroke-zinc-700/[0.10]';

  return (
    <div className="relative min-h-screen bg-furnace-bg flex flex-col font-body overflow-hidden">
      {/* Grid background */}
      <GridPattern
        width={40}
        height={40}
        squares={[
          [2, 3], [4, 1], [6, 4], [8, 2], [10, 5],
          [1, 7], [3, 9], [5, 6], [7, 8], [9, 3],
          [11, 7], [13, 2], [15, 9], [12, 5], [14, 1],
        ]}
        className={cn(
          gridColor,
          'transition-all duration-700',
          '[mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,white_30%,transparent_100%)]',
        )}
      />

      {/* Top accent line */}
      <div className={`h-px w-full bg-gradient-to-r ${accentGradient} transition-all duration-700`} />

      {/* Header */}
      <header className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-furnace-border">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative flex items-center justify-center w-4 h-4 flex-shrink-0">
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
          <span className="font-display text-base sm:text-lg tracking-widest text-zinc-300 truncate">FURNACE TRACKER</span>
          {status !== 'idle' && (
            <span className={`hidden sm:inline font-mono text-xs tracking-widest px-2 py-0.5 rounded border flex-shrink-0 ${
              status === 'running'
                ? 'text-emerald-400 border-emerald-800/40 bg-emerald-900/20'
                : 'text-amber-400 border-amber-800/40 bg-amber-900/20'
            }`}>
              {status === 'running' ? 'RUNNING' : 'PAUSED'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg border border-furnace-border text-zinc-500 hover:text-zinc-200 hover:border-zinc-500 hover:bg-white/[0.04] transition-all font-display text-sm tracking-widest"
          >
            <ClipboardList size={14} />
            <span className="hidden sm:inline">HISTORY</span>
          </button>
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg border border-furnace-border text-zinc-500 hover:text-zinc-200 hover:border-zinc-500 hover:bg-white/[0.04] transition-all font-display text-sm tracking-widest"
          >
            <Settings size={14} />
            <span className="hidden sm:inline">SETTINGS</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row items-center md:items-start justify-center gap-4 md:gap-6 px-3 sm:px-6 py-4 sm:py-6 overflow-auto">
        {/* Left: info panels — below battery on mobile */}
        <div className="w-full md:w-72 flex-shrink-0 flex flex-col gap-3 order-2 md:order-1 md:pt-2">
          <PhasePanel />
        </div>

        {/* Center: Battery — on top on mobile */}
        <div className="flex-shrink-0 flex flex-col items-center order-1 md:order-2 md:pt-2">
          <BatteryIndicator />
        </div>

        {/* Right: phase list + controls — last on mobile */}
        <div className="w-full md:w-56 flex-shrink-0 flex flex-col gap-3 order-3 md:pt-2">
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
