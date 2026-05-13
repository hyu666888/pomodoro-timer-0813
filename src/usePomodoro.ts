import { useState, useEffect, useRef, useCallback } from 'react'

export type Phase = 'work' | 'short' | 'long'

const DURATIONS: Record<Phase, number> = {
  work: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
}

const PHASE_LABELS: Record<Phase, string> = {
  work: 'Focus',
  short: 'Short Break',
  long: 'Long Break',
}

function todayKey() {
  return new Date().toDateString()
}

function loadSessionCount(): number {
  try {
    const raw = localStorage.getItem('pomodoro-sessions')
    if (!raw) return 0
    const { date, count } = JSON.parse(raw)
    if (date === todayKey()) return count as number
  } catch {}
  return 0
}

function saveSessionCount(count: number) {
  localStorage.setItem('pomodoro-sessions', JSON.stringify({ date: todayKey(), count }))
}

function playChime() {
  try {
    const ctx = new AudioContext()
    const gain = ctx.createGain()
    gain.connect(ctx.destination)

    const freqs = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      osc.connect(gain)
      const start = ctx.currentTime + i * 0.22
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.25, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55)
      osc.start(start)
      osc.stop(start + 0.6)
    })
  } catch {}
}

export function usePomodoro() {
  const [phase, setPhase] = useState<Phase>('work')
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS.work)
  const [running, setRunning] = useState(false)
  const [workCount, setWorkCount] = useState(0) // cycles since last long break
  const [sessions, setSessions] = useState(loadSessionCount)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const totalSeconds = DURATIONS[phase]
  const progress = (totalSeconds - secondsLeft) / totalSeconds

  const advancePhase = useCallback(() => {
    playChime()
    setRunning(false)

    setWorkCount(prev => {
      const nextWork = phase === 'work' ? prev + 1 : prev
      if (phase === 'work') {
        setSessions(s => {
          const next = s + 1
          saveSessionCount(next)
          return next
        })
        const isLong = nextWork >= 4
        setPhase(isLong ? 'long' : 'short')
        setSecondsLeft(isLong ? DURATIONS.long : DURATIONS.short)
        return isLong ? 0 : nextWork
      } else {
        setPhase('work')
        setSecondsLeft(DURATIONS.work)
        return prev
      }
    })
  }, [phase])

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current!)
          advancePhase()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current!)
  }, [running, advancePhase])

  const start = () => setRunning(true)
  const pause = () => setRunning(false)
  const reset = () => {
    setRunning(false)
    setSecondsLeft(DURATIONS[phase])
  }
  const switchPhase = (p: Phase) => {
    setRunning(false)
    setPhase(p)
    setSecondsLeft(DURATIONS[p])
  }

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return {
    phase,
    phaseLabel: PHASE_LABELS[phase],
    timeDisplay,
    progress,
    running,
    sessions,
    start,
    pause,
    reset,
    switchPhase,
    workCount,
  }
}
