import { Timer, AlertTriangle, Activity } from 'lucide-react';
import Hero from '@/components/ui/animated-shader-hero';

const stats = [
  { icon: Timer, label: 'Real-time Timer', desc: 'Per proses' },
  { icon: AlertTriangle, label: 'Deteksi Overtime', desc: 'Warning otomatis' },
  { icon: Activity, label: 'Riwayat Sesi', desc: 'Audit trail lengkap' },
];

export default function HeroScreen({ onEnter }) {
  return (
    <Hero
      trustBadge={{
        text: "PRODUCTION LINE MONITORING",
        icons: [],
      }}
      headline={{
        line1: "FURNACE",
        line2: "TRACKER",
      }}
      subtitle="Identifikasi proses produksi yang tidak sesuai standar waktu secara real-time — sebelum berdampak pada line stop."
      buttons={{
        primary: {
          text: "MULAI TRACKING",
          onClick: onEnter,
        },
      }}
    >
      <div className="grid grid-cols-3 gap-3 w-full max-w-lg mx-auto">
        {stats.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 px-3 py-4 rounded-xl border border-furnace-border bg-furnace-panel/60 backdrop-blur-sm"
          >
            <Icon size={18} className="text-amber-500" />
            <p className="font-display text-[10px] tracking-widest text-zinc-300 leading-tight text-center">
              {label}
            </p>
            <p className="text-zinc-500 text-[10px]">{desc}</p>
          </div>
        ))}
      </div>
    </Hero>
  );
}
