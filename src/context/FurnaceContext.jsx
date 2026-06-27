import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { loadConfig, saveConfig, DEFAULT_PHASES, DEFAULT_PIN, SPEED_OPTIONS, addHistoryRecord } from '../lib/storage';

const FurnaceContext = createContext(null);

export function FurnaceProvider({ children }) {
  const [phases, setPhases] = useState(() => loadConfig().phases || DEFAULT_PHASES);
  const [pin, setPin] = useState(() => loadConfig().pin || DEFAULT_PIN);
  const [speed, setSpeedState] = useState(() => loadConfig().speed || 1);
  const [status, setStatus] = useState('idle'); // idle | running | paused
  const [totalElapsed, setTotalElapsed] = useState(0); // virtual seconds
  const startTimeRef = useRef(null);
  const pauseOffsetRef = useRef(0); // real ms accumulated during pauses
  const pauseStartRef = useRef(null);
  const intervalRef = useRef(null);
  const prevPhaseIndexRef = useRef(-1);
  const prevOvertimeRef = useRef(false);
  const speedRef = useRef(speed);

  const totalConfiguredSeconds = phases.reduce((acc, p) => acc + p.duration * 60, 0);

  function getCurrentPhaseInfo(elapsed) {
    let remaining = elapsed;
    for (let i = 0; i < phases.length; i++) {
      const phaseSec = phases[i].duration * 60;
      if (remaining < phaseSec) {
        return { phaseIndex: i, elapsedInPhase: remaining, remainingInPhase: phaseSec - remaining };
      }
      remaining -= phaseSec;
    }
    const lastIdx = phases.length - 1;
    const lastPhaseSec = phases[lastIdx].duration * 60;
    const overBy = elapsed - totalConfiguredSeconds;
    return { phaseIndex: lastIdx, elapsedInPhase: lastPhaseSec + overBy, remainingInPhase: -overBy };
  }

  function getPhaseStatus(elapsedInPhase, phaseDurationSec) {
    if (elapsedInPhase >= phaseDurationSec) return 'overtime';
    if (elapsedInPhase >= phaseDurationSec - 120) return 'warning';
    return 'normal';
  }

  function playBeep(frequency = 880, duration = 500) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = frequency;
      osc.type = 'square';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration / 1000);
    } catch { /* audio not supported */ }
  }

  function playAlarm() {
    playBeep(440, 300);
    setTimeout(() => playBeep(550, 300), 350);
    setTimeout(() => playBeep(440, 600), 700);
  }

  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    if (status !== 'running') {
      clearInterval(intervalRef.current);
      return;
    }

    // Tick setiap 200ms agar smooth di semua kecepatan
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const realMs = now - startTimeRef.current - pauseOffsetRef.current;
      const elapsed = Math.floor(realMs * speedRef.current / 1000);
      setTotalElapsed(elapsed);

      const { phaseIndex, elapsedInPhase } = getCurrentPhaseInfo(elapsed);
      const phaseSec = phases[phaseIndex].duration * 60;
      const isOvertime = elapsedInPhase >= phaseSec;

      if (phaseIndex !== prevPhaseIndexRef.current) {
        if (prevPhaseIndexRef.current >= 0 && speedRef.current === 1) playBeep(660, 400);
        prevPhaseIndexRef.current = phaseIndex;
        prevOvertimeRef.current = false;
      }

      if (isOvertime && !prevOvertimeRef.current) {
        if (speedRef.current === 1) playAlarm();
        prevOvertimeRef.current = true;
      }
    }, 200);

    return () => clearInterval(intervalRef.current);
  }, [status, phases]);

  function start() {
    if (status === 'running') return;
    if (status === 'idle') {
      startTimeRef.current = Date.now();
      pauseOffsetRef.current = 0;
      prevPhaseIndexRef.current = -1;
      prevOvertimeRef.current = false;
      setTotalElapsed(0);
    } else if (status === 'paused') {
      pauseOffsetRef.current += Date.now() - pauseStartRef.current;
    }
    setStatus('running');
  }

  function pause() {
    if (status !== 'running') return;
    pauseStartRef.current = Date.now();
    setStatus('paused');
  }

  function reset() {
    clearInterval(intervalRef.current);
    setStatus('idle');
    setTotalElapsed(0);
    startTimeRef.current = null;
    pauseOffsetRef.current = 0;
    pauseStartRef.current = null;
    prevPhaseIndexRef.current = -1;
    prevOvertimeRef.current = false;
  }

  function finish(currentElapsed) {
    const elapsed = currentElapsed ?? totalElapsed;
    const configured = phases.reduce((acc, p) => acc + p.duration * 60, 0);
    addHistoryRecord({
      id: Date.now().toString(),
      finishedAt: new Date().toISOString(),
      totalElapsed: elapsed,
      totalConfigured: configured,
      deviation: elapsed - configured, // negatif = lebih cepat, positif = overtime
      phases: phases.map(p => ({ name: p.name, duration: p.duration })),
    });
    reset();
  }

  function updatePhases(newPhases) {
    setPhases(newPhases);
    saveConfig({ phases: newPhases, pin, speed });
  }

  function updatePin(newPin) {
    setPin(newPin);
    saveConfig({ phases, pin: newPin, speed });
  }

  function updateSpeed(newSpeed) {
    if (!SPEED_OPTIONS.includes(newSpeed)) return;
    setSpeedState(newSpeed);
    speedRef.current = newSpeed;
    saveConfig({ phases, pin, speed: newSpeed });
  }

  const { phaseIndex: currentPhaseIndex, elapsedInPhase, remainingInPhase } = getCurrentPhaseInfo(totalElapsed);
  const currentPhaseSec = (phases[currentPhaseIndex]?.duration || 0) * 60;
  const phaseStatus = status === 'idle' ? 'normal' : getPhaseStatus(elapsedInPhase, currentPhaseSec);
  const fillPercent = totalConfiguredSeconds > 0
    ? Math.min((totalElapsed / totalConfiguredSeconds) * 100, 100)
    : 0;
  const isOverTotal = totalElapsed > totalConfiguredSeconds && status !== 'idle';

  return (
    <FurnaceContext.Provider value={{
      phases, pin, speed, status, totalElapsed, totalConfiguredSeconds,
      currentPhaseIndex, elapsedInPhase, remainingInPhase,
      phaseStatus, fillPercent, isOverTotal,
      start, pause, reset, finish, updatePhases, updatePin, updateSpeed,
    }}>
      {children}
    </FurnaceContext.Provider>
  );
}

export function useFurnace() {
  const ctx = useContext(FurnaceContext);
  if (!ctx) throw new Error('useFurnace must be used within FurnaceProvider');
  return ctx;
}
