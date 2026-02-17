// Modal v2
import { useContext, useEffect } from 'react'
import { X } from 'lucide-react'
import { AppContext } from '../App'

export default function Modal({ open, onClose, title, action, children }) {
  const { darkMode } = useContext(AppContext)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const bg = darkMode ? 'bg-neutral-900' : 'bg-white'

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 flex justify-center"
        onClick={e => e.stopPropagation()}
      >
        <div
          className={`w-full max-w-lg max-h-[90vh] rounded-t-2xl animate-slide-up overflow-hidden flex flex-col ${bg}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
            <h2 className="text-lg font-bold">{title}</h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-full ${darkMode ? 'active:bg-neutral-800' : 'active:bg-neutral-100'}`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Contenido scrolleable */}
          <div className="overflow-y-auto flex-1 px-5 pb-4 overscroll-contain">
            {children}
          </div>

          {/* Botón siempre visible */}
          {action && (
            <div
              className="shrink-0 px-5 pt-3 pb-5"
              style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom, 1.25rem))' }}
            >
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
