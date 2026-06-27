import { useState } from 'react';
import { useFurnace } from '../context/FurnaceContext';
import ConfirmDialog from './ConfirmDialog';

export default function ControlButtons() {
  const { status, start, pause, reset, finish } = useFurnace();
  const [showReset, setShowReset] = useState(false);
  const [showFinish, setShowFinish] = useState(false);

  const isIdle = status === 'idle';
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isActive = isRunning || isPaused;

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        {/* START — baris penuh, tombol utama */}
        <button
          onClick={start}
          disabled={isRunning}
          className={`w-full py-4 rounded-xl font-display text-2xl tracking-widest transition-all ${
            isRunning
              ? 'bg-emerald-900/30 text-emerald-700 border border-emerald-900/30 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_30px_#22C55E50] active:scale-[0.98]'
          }`}
        >
          {isIdle ? '▶  START' : isPaused ? '▶  LANJUT' : '▶  JALAN'}
        </button>

        {/* PAUSE | FINISH | RESET — satu baris */}
        <div className="flex gap-2">
          <button
            onClick={pause}
            disabled={!isRunning}
            className={`flex-1 py-3 rounded-xl font-display text-base tracking-widest transition-all ${
              !isRunning
                ? 'bg-amber-900/20 text-amber-800 border border-amber-900/20 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-white shadow-[0_0_20px_#F59E0B40] active:scale-95'
            }`}
          >
            ⏸ PAUSE
          </button>

          <button
            onClick={() => setShowFinish(true)}
            disabled={!isActive}
            className={`flex-1 py-3 rounded-xl font-display text-base tracking-widest transition-all ${
              !isActive
                ? 'bg-blue-900/20 text-blue-900 border border-blue-900/20 cursor-not-allowed'
                : 'bg-blue-700 hover:bg-blue-600 text-white shadow-[0_0_20px_#3B82F640] active:scale-95'
            }`}
          >
            ✓ FINISH
          </button>

          <button
            onClick={() => setShowReset(true)}
            disabled={isIdle}
            className={`px-4 py-3 rounded-xl font-display text-base tracking-widest transition-all ${
              isIdle
                ? 'bg-red-900/20 text-red-900 border border-red-900/20 cursor-not-allowed'
                : 'bg-red-700 hover:bg-red-600 text-white shadow-[0_0_20px_#EF444440] active:scale-95'
            }`}
          >
            ↺
          </button>
        </div>
      </div>

      {showFinish && (
        <ConfirmDialog
          title="SELESAIKAN SIKLUS?"
          message="Siklus dinyatakan selesai dan timer akan direset ke awal. Pastikan semua proses sudah dilakukan."
          confirmLabel="SELESAI"
          confirmClass="bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_#3B82F640]"
          onConfirm={() => { finish(); setShowFinish(false); }}
          onCancel={() => setShowFinish(false)}
        />
      )}

      {showReset && (
        <ConfirmDialog
          title="RESET SIKLUS?"
          message="Seluruh progres akan dihapus dan timer dikembalikan ke awal. Tindakan ini tidak bisa dibatalkan."
          confirmLabel="RESET"
          confirmClass="bg-red-600 hover:bg-red-500 shadow-[0_0_20px_#EF444440]"
          onConfirm={() => { reset(); setShowReset(false); }}
          onCancel={() => setShowReset(false)}
        />
      )}
    </>
  );
}
