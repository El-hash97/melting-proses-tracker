const CONFIG_KEY = 'furnace_config';

export const DEFAULT_PHASES = [
  { id: 'charging',         name: 'Charging',          duration: 10 },
  { id: 'heating-up',       name: 'Heating Up',         duration: 15 },
  { id: 'sample',           name: 'Sample',             duration: 5  },
  { id: 'adjust',           name: 'Adjust',             duration: 5  },
  { id: 'sample-adjust',    name: 'Sample Adjust',      duration: 5  },
  { id: 'cek-temperature',  name: 'Cek Temperature',    duration: 7  },
  { id: 'buang-terak',      name: 'Buang Terak',        duration: 5  },
  { id: 'tapping-1',        name: 'Tapping 1',          duration: 10 },
  { id: 'tapping-2',        name: 'Tapping 2',          duration: 10 },
];

export const DEFAULT_PIN = '1234';
export const SPEED_OPTIONS = [1, 20, 60];

export function loadConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return { phases: DEFAULT_PHASES, pin: DEFAULT_PIN, speed: 1 };
    const cfg = JSON.parse(raw);
    return { phases: DEFAULT_PHASES, pin: DEFAULT_PIN, speed: 1, ...cfg };
  } catch {
    return { phases: DEFAULT_PHASES, pin: DEFAULT_PIN, speed: 1 };
  }
}

export function saveConfig(config) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

const HISTORY_KEY = 'furnace_history';

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addHistoryRecord(record) {
  const history = loadHistory();
  history.unshift(record); // newest first
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 100))); // max 100 records
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
