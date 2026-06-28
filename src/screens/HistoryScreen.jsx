import { useState } from 'react';
import { ClipboardList, X, ChevronDown, Trash2 } from 'lucide-react';
import { loadHistory, clearHistory } from '../lib/storage';

function formatDuration(seconds) {
  const s = Math.abs(Math.floor(seconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function formatDeviation(seconds) {
  const s = Math.abs(Math.floor(seconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  const sign = seconds < 0 ? '-' : '+';
  if (m === 0) return `${sign}${sec}d`;
  return `${sign}${m}m ${String(sec).padStart(2, '0')}d`;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function HistoryScreen({ onClose }) {
  const [records, setRecords] = useState(() => loadHistory());
  const [showConfirm, setShowConfirm] = useState(false);

  function handleClear() {
    clearHistory();
    setRecords([]);
    setShowConfirm(false);
  }

  return (
    <div className="min-h-screen bg-furnace-bg flex flex-col font-body">
      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

      <header className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-furnace-border gap-2">
        <span className="font-display text-lg tracking-widest text-zinc-300">RIWAYAT SIKLUS</span>
        <div className="flex items-center gap-2">
          {records.length > 0 && (
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg border border-red-900/40 text-red-600 hover:text-red-400 hover:border-red-700/60 hover:bg-red-900/10 transition-all font-display text-sm tracking-widest"
            >
              <Trash2 size={13} />
              <span className="hidden sm:inline">HAPUS SEMUA</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-furnace-border text-zinc-500 hover:text-zinc-200 hover:border-zinc-500 hover:bg-white/[0.04] transition-all font-display text-sm tracking-widest"
          >
            <X size={14} />
            TUTUP
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto px-6 py-6 max-w-3xl mx-auto w-full">
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-furnace-border bg-furnace-panel flex items-center justify-center">
              <ClipboardList size={28} className="text-zinc-600" />
            </div>
            <div className="text-center">
              <p className="font-display text-xl tracking-widest text-zinc-600">BELUM ADA RIWAYAT</p>
              <p className="text-zinc-700 text-sm font-mono mt-2">Riwayat muncul setelah klik FINISH pada siklus.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <SummaryStats records={records} />
            {records.map((r, i) => (
              <RecordCard key={r.id} record={r} index={i} />
            ))}
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-furnace-panel border border-furnace-border rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h2 className="font-display text-2xl tracking-widest text-white mb-2">HAPUS RIWAYAT?</h2>
            <p className="text-zinc-400 text-sm mb-6">Semua {records.length} catatan siklus akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-furnace-border text-zinc-400 font-display tracking-widest text-sm hover:text-white hover:border-zinc-500 transition-all"
              >
                BATAL
              </button>
              <button
                onClick={handleClear}
                className="flex-1 py-3 rounded-xl bg-red-700 hover:bg-red-600 text-white font-display tracking-widest text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Trash2 size={14} />
                HAPUS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryStats({ records }) {
  const total = records.length;
  const faster = records.filter(r => r.deviation < 0).length;
  const overtime = records.filter(r => r.deviation > 0).length;
  const onTime = total - faster - overtime;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
      <div className="bg-furnace-panel rounded-xl border border-furnace-border p-4 text-center">
        <p className="font-display text-3xl tracking-widest text-white">{total}</p>
        <p className="font-mono text-xs text-zinc-500 mt-1 tracking-widest uppercase">Total</p>
      </div>
      <div className="bg-furnace-panel rounded-xl border border-blue-900/30 p-4 text-center">
        <p className="font-display text-3xl tracking-widest text-blue-400">{faster}</p>
        <p className="font-mono text-xs text-zinc-500 mt-1 tracking-widest uppercase">Lebih Cepat</p>
      </div>
      <div className="bg-furnace-panel rounded-xl border border-emerald-900/30 p-4 text-center">
        <p className="font-display text-3xl tracking-widest text-emerald-400">{onTime}</p>
        <p className="font-mono text-xs text-zinc-500 mt-1 tracking-widest uppercase">Tepat Waktu</p>
      </div>
      <div className="bg-furnace-panel rounded-xl border border-red-900/30 p-4 text-center">
        <p className="font-display text-3xl tracking-widest text-red-400">{overtime}</p>
        <p className="font-mono text-xs text-zinc-500 mt-1 tracking-widest uppercase">Overtime</p>
      </div>
    </div>
  );
}

function RecordCard({ record, index }) {
  const [expanded, setExpanded] = useState(false);
  const isOvertime = record.deviation > 0;
  const isOnTime = record.deviation === 0;

  const sc = isOnTime
    ? { badge: 'bg-emerald-900/30 border-emerald-700/40 text-emerald-400', dev: 'text-emerald-400', label: 'TEPAT WAKTU' }
    : isOvertime
    ? { badge: 'bg-red-900/30 border-red-700/40 text-red-400', dev: 'text-red-400', label: 'OVERTIME' }
    : { badge: 'bg-blue-900/30 border-blue-700/40 text-blue-400', dev: 'text-blue-400', label: 'LEBIH CEPAT' };

  return (
    <div className="bg-furnace-panel rounded-xl border border-furnace-border overflow-hidden hover:border-zinc-600/60 transition-colors">
      <button
        className="w-full flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <span className="font-mono text-xs text-zinc-600 w-5 flex-shrink-0 text-right">#{index + 1}</span>

        <div className="flex-1 min-w-0">
          <p className="font-display text-xs sm:text-sm tracking-widest text-zinc-300 truncate">{formatDate(record.finishedAt)}</p>
          <p className="font-mono text-[10px] sm:text-xs text-zinc-600 mt-0.5">
            {formatDuration(record.totalElapsed)} / {formatDuration(record.totalConfigured)}
          </p>
        </div>

        <div className={`hidden sm:flex flex-shrink-0 px-3 py-1.5 rounded-lg border text-xs font-display tracking-widest ${sc.badge}`}>
          {sc.label}
        </div>

        <div className="flex-shrink-0 text-right min-w-[48px] sm:min-w-[60px]">
          <p className={`font-display text-base sm:text-xl tracking-widest ${sc.dev}`}>
            {record.deviation === 0 ? '±0' : formatDeviation(record.deviation)}
          </p>
          <p className={`sm:hidden font-mono text-[9px] tracking-widest mt-0.5 ${sc.dev}`}>{sc.label}</p>
        </div>

        <ChevronDown
          size={14}
          className={`text-zinc-600 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && record.phases && (
        <div className="border-t border-furnace-border px-4 py-3 bg-black/10">
          <p className="font-mono text-xs text-zinc-600 tracking-widest uppercase mb-2">Konfigurasi Proses</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5">
            {record.phases.map((p, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="font-mono text-xs text-zinc-700">{i + 1}.</span>
                <span className="font-display text-xs tracking-widest text-zinc-400">{p.name.toUpperCase()}</span>
                <span className="font-mono text-xs text-amber-700">{p.duration}m</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
