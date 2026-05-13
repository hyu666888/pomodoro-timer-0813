import { useState, useRef } from 'react'
import { usePomodoro, Phase } from './usePomodoro'
import ProgressRing from './ProgressRing'

const PHASE_LABELS: Record<Phase, string> = {
  work: 'Focus',
  short: 'Short Break',
  long: 'Long Break',
}

const PHASE_BG: Record<Phase, string> = {
  work:  'bg-tomato-600',
  short: 'bg-amber-700',
  long:  'bg-amber-900',
}

const PHASE_PILL: Record<Phase, string> = {
  work:  'bg-tomato-700 text-cream-50',
  short: 'bg-amber-700 text-cream-50',
  long:  'bg-amber-900 text-cream-50',
}

const PHASE_PILL_INACTIVE: Record<Phase, string> = {
  work:  'bg-tomato-100 text-tomato-700 hover:bg-tomato-200',
  short: 'bg-cream-200 text-amber-800 hover:bg-cream-300',
  long:  'bg-cream-200 text-amber-900 hover:bg-cream-300',
}

export default function App() {
  const { phase, timeDisplay, progress, running, sessions, start, pause, reset, switchPhase, workCount } =
    usePomodoro()

  const [task, setTask] = useState('')
  const [editingTask, setEditingTask] = useState(false)
  const taskRef = useRef<HTMLInputElement>(null)

  const phases: Phase[] = ['work', 'short', 'long']

  function handleTaskClick() {
    setEditingTask(true)
    setTimeout(() => taskRef.current?.focus(), 0)
  }

  function handleTaskBlur() {
    setEditingTask(false)
  }

  const totalDots = 4

  return (
    <div className={`min-h-dvh flex flex-col items-center justify-center px-4 py-10 transition-colors duration-700 bg-cream-100`}>
      {/* Phase tabs */}
      <div className="flex gap-2 mb-8">
        {phases.map(p => (
          <button
            key={p}
            onClick={() => switchPhase(p)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
              phase === p ? PHASE_PILL[p] : PHASE_PILL_INACTIVE[p]
            }`}
          >
            {PHASE_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Task name */}
      <div className="mb-6 w-full max-w-xs">
        {editingTask ? (
          <input
            ref={taskRef}
            value={task}
            onChange={e => setTask(e.target.value)}
            onBlur={handleTaskBlur}
            onKeyDown={e => e.key === 'Enter' && handleTaskBlur()}
            placeholder="What are you focusing on?"
            className="w-full text-center text-base font-medium bg-cream-200 rounded-xl px-4 py-2 outline-none border-2 border-tomato-400 text-tomato-900 placeholder:text-tomato-400"
          />
        ) : (
          <button
            onClick={handleTaskClick}
            className="w-full text-center text-base font-medium text-tomato-700 bg-cream-200 rounded-xl px-4 py-2 truncate hover:bg-cream-300 transition-colors"
          >
            {task || <span className="text-tomato-400 italic">Tap to add focus task…</span>}
          </button>
        )}
      </div>

      {/* Progress ring + timer */}
      <ProgressRing progress={progress} phase={phase} size={272} strokeWidth={14}>
        <div className="flex flex-col items-center select-none">
          <span className="text-[72px] font-extrabold leading-none tracking-tighter text-tomato-800 tabular-nums">
            {timeDisplay}
          </span>
          <span className="mt-2 text-sm font-semibold uppercase tracking-widest text-tomato-500">
            {PHASE_LABELS[phase]}
          </span>
        </div>
      </ProgressRing>

      {/* Cycle dots (shows progress toward long break during work) */}
      <div className="flex gap-2 mt-6">
        {Array.from({ length: totalDots }).map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              i < (phase === 'work' ? workCount + 1 : workCount)
                ? 'bg-tomato-600'
                : 'bg-tomato-200'
            }`}
            title={`Cycle ${i + 1}`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-8">
        <button
          onClick={reset}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-cream-200 text-tomato-600 hover:bg-cream-300 transition-colors"
          aria-label="Reset"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>

        <button
          onClick={running ? pause : start}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-cream-50 shadow-lg transition-all duration-200 active:scale-95 ${PHASE_BG[phase]} hover:brightness-110`}
          aria-label={running ? 'Pause' : 'Start'}
        >
          {running ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 ml-1">
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          )}
        </button>

        <div className="w-11 h-11" /> {/* spacer for centering */}
      </div>

      {/* Session counter */}
      <div className="mt-10 flex flex-col items-center gap-1">
        <span className="text-3xl font-bold text-tomato-700 tabular-nums">{sessions}</span>
        <span className="text-xs font-semibold uppercase tracking-widest text-tomato-400">
          Pomodoros today
        </span>
      </div>
    </div>
  )
}
