import { motion } from 'framer-motion';
import { ArrowRight, Timer, AlertTriangle, Activity } from 'lucide-react';
import { GridPattern } from '@/components/ui/grid-pattern';
import { cn } from '@/lib/utils';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stats = [
  { icon: Timer, label: 'Real-time Timer', desc: 'Per proses' },
  { icon: AlertTriangle, label: 'Deteksi Overtime', desc: 'Warning otomatis' },
  { icon: Activity, label: 'Riwayat Sesi', desc: 'Audit trail lengkap' },
];

export default function HeroScreen({ onEnter }) {
  return (
    <div className="relative min-h-screen bg-furnace-bg flex flex-col items-center justify-center overflow-hidden font-body">

      {/* Animated grid background */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <GridPattern
          width={44}
          height={44}
          squares={[
            [1, 2], [3, 5], [5, 1], [7, 4], [9, 2],
            [2, 8], [4, 6], [6, 9], [8, 7], [10, 3],
            [11, 6], [13, 1], [15, 8], [12, 4], [14, 10],
            [0, 11], [2, 13], [4, 10], [16, 5], [17, 9],
          ]}
          className={cn(
            'fill-amber-500/[0.07] stroke-amber-500/[0.10]',
            '[mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,white_20%,transparent_100%)]',
          )}
        />
      </motion.div>

      {/* Top glow orb */}
      <motion.div
        className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-amber-600/10 blur-[100px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.3 }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">

        {/* Badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-700/40 bg-amber-900/20 text-amber-400 font-display text-xs tracking-widest"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          PRODUCTION LINE MONITORING
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="font-display text-6xl md:text-8xl tracking-widest text-white leading-none mb-6"
        >
          FURNACE
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
            TRACKER
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-xl mb-4"
        >
          Identifikasi proses produksi yang{' '}
          <span className="text-zinc-200 font-medium">tidak sesuai standar waktu</span>{' '}
          secara real-time — sebelum berdampak pada{' '}
          <span className="text-red-400 font-medium">line stop</span>.
        </motion.p>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="text-zinc-600 text-sm leading-relaxed max-w-md mb-12"
        >
          Monitor setiap fase furnace, pantau durasi aktual dan target,
          dan dapatkan peringatan dini sebelum toleransi waktu terlampaui.
        </motion.p>

        {/* Stat cards */}
        <motion.div
          className="grid grid-cols-3 gap-3 w-full max-w-lg mb-12"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
        >
          {stats.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 px-3 py-4 rounded-xl border border-furnace-border bg-furnace-panel/60 backdrop-blur-sm"
            >
              <Icon size={18} className="text-amber-500" />
              <p className="font-display text-[10px] tracking-widest text-zinc-300 leading-tight text-center">
                {label}
              </p>
              <p className="text-zinc-600 text-[10px]">{desc}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={5}
        >
          <motion.button
            onClick={onEnter}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group relative flex items-center gap-3 px-8 py-3.5 rounded-xl font-display text-sm tracking-widest text-black bg-gradient-to-r from-amber-400 to-orange-400 overflow-hidden shadow-lg shadow-amber-900/30"
          >
            {/* Shimmer sweep */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
            />
            MULAI TRACKING
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </motion.button>
        </motion.div>

        {/* Sub hint */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={6}
          className="mt-5 text-zinc-700 text-xs tracking-wider"
        >
          Data tersimpan secara lokal
        </motion.p>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-furnace-bg to-transparent pointer-events-none" />
    </div>
  );
}
