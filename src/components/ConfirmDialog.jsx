export default function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'KONFIRMASI',
  confirmClass = 'bg-red-600 hover:bg-red-500 shadow-[0_0_20px_#EF444440]',
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-furnace-panel border border-furnace-border rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        <h2 className="font-display text-2xl tracking-widest text-white mb-2">{title}</h2>
        <p className="text-zinc-400 font-body text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-furnace-border text-zinc-400 font-display tracking-widest text-sm hover:border-zinc-500 hover:text-white transition-all"
          >
            BATAL
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl text-white font-display tracking-widest text-sm transition-all active:scale-95 ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
