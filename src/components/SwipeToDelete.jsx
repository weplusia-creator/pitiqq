import { useState, useRef } from 'react'
import { Trash2 } from 'lucide-react'

export default function SwipeToDelete({ onDelete, children }) {
  const [offset, setOffset] = useState(0)
  const startX = useRef(0)
  const swiping = useRef(false)

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX
    swiping.current = true
  }

  const handleTouchMove = (e) => {
    if (!swiping.current) return
    const diff = startX.current - e.touches[0].clientX
    if (diff > 0) setOffset(Math.min(diff, 80))
    else setOffset(0)
  }

  const handleTouchEnd = () => {
    swiping.current = false
    if (offset > 60) setOffset(80)
    else setOffset(0)
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div
        className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center bg-red-500"
        onClick={() => { setOffset(0); onDelete() }}
      >
        <Trash2 size={20} className="text-white" />
      </div>
      <div
        className="relative transition-transform duration-200"
        style={{ transform: `translateX(-${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  )
}
