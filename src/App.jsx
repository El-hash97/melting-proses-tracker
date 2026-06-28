import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FurnaceProvider } from './context/FurnaceContext';
import HeroScreen from './screens/HeroScreen';
import DashboardScreen from './screens/DashboardScreen';
import SettingsScreen from './screens/SettingsScreen';
import HistoryScreen from './screens/HistoryScreen';

const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.25, ease: 'easeIn' } },
};

export default function App() {
  const [screen, setScreen] = useState('hero');

  return (
    <FurnaceProvider>
      <AnimatePresence mode="wait">
        {screen === 'hero' && (
          <motion.div key="hero" {...pageTransition}>
            <HeroScreen onEnter={() => setScreen('dashboard')} />
          </motion.div>
        )}
        {screen === 'dashboard' && (
          <motion.div key="dashboard" {...pageTransition}>
            <DashboardScreen
              onOpenSettings={() => setScreen('settings')}
              onOpenHistory={() => setScreen('history')}
            />
          </motion.div>
        )}
        {screen === 'settings' && (
          <motion.div key="settings" {...pageTransition}>
            <SettingsScreen onClose={() => setScreen('dashboard')} />
          </motion.div>
        )}
        {screen === 'history' && (
          <motion.div key="history" {...pageTransition}>
            <HistoryScreen onClose={() => setScreen('dashboard')} />
          </motion.div>
        )}
      </AnimatePresence>
    </FurnaceProvider>
  );
}
