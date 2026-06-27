import { useState } from 'react';
import { useFurnace } from '../context/FurnaceContext';
import { SPEED_OPTIONS } from '../lib/storage';

const STANDARD_TOTAL = 72;

export default function SettingsScreen({ onClose }) {
  const { phases, speed, updatePhases, updateSpeed } = useFurnace();

  const [draftPhases, setDraftPhases] = useState(phases.map(p => ({ ...p })));
  const [autoSaveId, setAutoSaveId] = useState(null);

  const totalMin = draftPhases.reduce((a, p) => a + (Number(p.duration) || 0), 0);
  const deviation = totalMin - STANDARD_TOTAL;

  function commitPhases(newPhases) {
    setDraftPhases(newPhases);
    const cleaned = newPhases.map(p => ({
      ...p,
      name: p.name || 'Proses',
      duration: Math.max(1, Number(p.duration) || 1),
    }));
    updatePhases(cleaned);
    clearTimeout(autoSaveId);
    const id = setTimeout(() => setAutoSaveId(null), 1200);
    setAutoSaveId(id);
  }

  function handleNameChange(id, val) {
    setDraftPhases(prev => prev.map(p => p.id === id ? { ...p, name: val } : p));
  }

  function handleNameBlur(id) {
    const updated = draftPhases.map(p =>
      p.id === id ? { ...p, name: p.name.trim() || 'Proses' } : p
    );
    commitPhases(updated);
  }

  function handleDurationChange(id, val) {
    const updated = draftPhases.map(p =>
      p.id === id ? { ...p, duration: val === '' ? '' : Math.max(1, Number(val)) } : p
    );
    commitPhases(updated);
  }

  function handleAddPhase() {
    commitPhases([...draftPhases, { id: `phase-${Date.now()}`, name: 'Proses Baru', duration: 5 }]);
  }

  function handleDeletePhase(id) {
    if (draftPhases.length <= 1) return;
    commitPhases(draftPhases.filter(p => p.id !== id));
  }

  return (
    <div className="min-h-screen bg-furnace-bg flex flex-col font-body">
      <header className="flex items-center justify-between px-6 py-4 border-b border-furnace-border">
        <div className="flex items-center gap-3">
          <span className="font-display text-lg tracking-widest text-zinc-300">KONFIGURASI WAKTU</span>
          {autoSaveId && (
            <span className="font-mono text-xs text-emerald-500 tracking-widest animate-pulse">✓ tersimpan</span>
          )}
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg border border-furnace-border text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition-all font-display text-sm tracking-widest"
        >
          ✕ TUTUP
        </button>
      </header>

      <div className="flex-1 overflow-auto px-6 py-6 max-w-2xl mx-auto w-full">
        {/* Total time indicator */}
        <div className={`mb-6 p-4 rounded-xl border ${
          deviation === 0
            ? 'bg-emerald-900/20 border-emerald-700/30'
            : Math.abs(deviation) <= 5
            ? 'bg-yellow-900/20 border-yellow-700/30'
            : 'bg-red-900/20 border-red-700/30'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-zinc-500 text-xs font-mono tracking-widest uppercase">Total Dikonfigurasi</p>
              <p className={`font-display text-4xl tracking-widest ${
                deviation === 0 ? 'text-emerald-400' : Math.abs(deviation) <= 5 ? 'text-yellow-400' : 'text-red-400'
              }`}>{totalMin} MENIT</p>
            </div>
            <div className="text-right">
              <p className="text-zinc-500 text-xs font-mono tracking-widest uppercase">Deviasi dari Standar</p>
              <p className={`font-display text-2xl tracking-widest ${
                deviation === 0 ? 'text-emerald-400' : Math.abs(deviation) <= 5 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {deviation === 0 ? '±0' : deviation > 0 ? `+${deviation}` : deviation} MNT
              </p>
            </div>
          </div>
          <div className="flex gap-0.5 h-2">
            {draftPhases.map(p => (
              <div
                key={p.id}
                className="h-full rounded-full bg-amber-500/50 transition-all"
                style={{ flex: Number(p.duration) || 1 }}
                title={p.name}
              />
            ))}
          </div>
        </div>

        {/* Phase list — nama + durasi bisa diedit */}
        <div className="bg-furnace-panel rounded-xl border border-furnace-border overflow-hidden mb-3">
          <div className="px-4 py-3 border-b border-furnace-border flex items-center justify-between">
            <p className="font-display text-xs tracking-widest text-zinc-400">
              PROSES ({draftPhases.length})
            </p>
            <span className="font-mono text-xs text-zinc-600">nama · durasi</span>
          </div>
          <div className="divide-y divide-furnace-border">
            {draftPhases.map((p, i) => (
              <div key={p.id} className="flex items-center gap-2 px-3 py-2.5">
                {/* Nomor urut */}
                <span className="font-mono text-xs text-zinc-600 w-4 text-right flex-shrink-0">{i + 1}</span>

                {/* Input nama */}
                <input
                  type="text"
                  value={p.name}
                  maxLength={30}
                  onChange={e => handleNameChange(p.id, e.target.value)}
                  onBlur={() => handleNameBlur(p.id)}
                  className="flex-1 min-w-0 bg-furnace-bg border border-furnace-border rounded-lg px-3 py-1.5 font-display tracking-widest text-sm text-zinc-200 outline-none focus:border-amber-600 transition-colors"
                />

                {/* Input durasi */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={p.duration}
                    onChange={e => handleDurationChange(p.id, e.target.value)}
                    className="w-14 bg-furnace-bg border border-furnace-border rounded-lg px-2 py-1.5 font-mono text-sm text-amber-400 text-center outline-none focus:border-amber-600 transition-colors"
                  />
                  <span className="text-zinc-600 font-mono text-xs">m</span>
                </div>

                {/* Tombol hapus */}
                <button
                  onClick={() => handleDeletePhase(p.id)}
                  disabled={draftPhases.length <= 1}
                  className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-mono text-sm transition-all ${
                    draftPhases.length <= 1
                      ? 'text-zinc-700 cursor-not-allowed'
                      : 'text-zinc-500 hover:text-red-400 hover:bg-red-900/20'
                  }`}
                  title="Hapus proses"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tambah proses */}
        <button
          onClick={handleAddPhase}
          className="w-full py-2.5 mb-6 rounded-xl border border-dashed border-furnace-border text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 font-display text-sm tracking-widest transition-all"
        >
          + TAMBAH PROSES
        </button>

        {/* Speed multiplier */}
        <div className="bg-furnace-panel rounded-xl border border-furnace-border overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-furnace-border">
            <p className="font-display text-xs tracking-widest text-zinc-400">KECEPATAN TIMER</p>
          </div>
          <div className="px-4 py-4">
            <p className="text-zinc-500 text-xs font-mono mb-3">Gunakan 20x / 60x untuk testing. Kembali ke 1x untuk operasi normal.</p>
            <div className="flex gap-2">
              {SPEED_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => updateSpeed(opt)}
                  className={`flex-1 py-3 rounded-xl font-display text-lg tracking-widest transition-all ${
                    speed === opt
                      ? opt === 1
                        ? 'bg-emerald-700 text-white shadow-[0_0_20px_#22C55E40]'
                        : opt === 20
                        ? 'bg-amber-600 text-white shadow-[0_0_20px_#D9770640]'
                        : 'bg-red-700 text-white shadow-[0_0_20px_#EF444440]'
                      : 'bg-furnace-bg border border-furnace-border text-zinc-500 hover:text-zinc-300 hover:border-zinc-500'
                  }`}
                >
                  {opt}×
                </button>
              ))}
            </div>
            {speed > 1 && (
              <p className="text-amber-500 text-xs font-mono mt-2 text-center">
                1 detik nyata = {speed} detik virtual
              </p>
            )}
          </div>
        </div>

        <p className="text-zinc-700 text-xs font-mono text-center">
          Perubahan proses tersimpan otomatis. Berlaku pada siklus berikutnya jika timer sedang berjalan.
        </p>
      </div>
    </div>
  );
}
