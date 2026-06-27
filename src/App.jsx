import { useState } from 'react';
import { FurnaceProvider } from './context/FurnaceContext';
import DashboardScreen from './screens/DashboardScreen';
import SettingsScreen from './screens/SettingsScreen';
import HistoryScreen from './screens/HistoryScreen';

export default function App() {
  const [screen, setScreen] = useState('dashboard');

  return (
    <FurnaceProvider>
      {screen === 'dashboard' && (
        <DashboardScreen
          onOpenSettings={() => setScreen('settings')}
          onOpenHistory={() => setScreen('history')}
        />
      )}
      {screen === 'settings' && (
        <SettingsScreen onClose={() => setScreen('dashboard')} />
      )}
      {screen === 'history' && (
        <HistoryScreen onClose={() => setScreen('dashboard')} />
      )}
    </FurnaceProvider>
  );
}
