import { useEffect, useState, useRef } from 'react'

export default function CountUp({ value, suffix = '', duration = 700 }) {
  const [display, setDisplay] = useState(0)
  const startRef = useRef(null)
  const fromRef = useRef(0)

  useEffect(() => {
    const from = fromRef.current
    const to = typeof value === 'number' ? value : 0
    startRef.current = null

    function step(ts) {
      if (startRef.current === null) startRef.current = ts
      const progress = Math.min((ts - startRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(from + (to - from) * eased)
      if (progress < 1) requestAnimationFrame(step)
      else fromRef.current = to
    }
    const frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <span className="kpi-value">{Math.round(display)}{suffix}</span>
}
