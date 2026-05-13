interface Props {
  progress: number // 0–1
  phase: 'work' | 'short' | 'long'
  size?: number
  strokeWidth?: number
  children: React.ReactNode
}

const PHASE_COLORS = {
  work:  { track: '#fcc9c4', ring: '#c93028' },
  short: { track: '#d9be8e', ring: '#7c5a1e' },
  long:  { track: '#d9be8e', ring: '#5c3d0e' },
}

export default function ProgressRing({ progress, phase, size = 280, strokeWidth = 12, children }: Props) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)
  const { track, ring } = PHASE_COLORS[phase]

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="absolute inset-0 -rotate-90"
        aria-hidden="true"
      >
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={track}
          strokeWidth={strokeWidth}
        />
        {/* progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ring}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="ring-progress"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}
