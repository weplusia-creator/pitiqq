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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop - solo este cierra */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal panel */}
      <div
        className={`relative w-full max-w-lg rounded-t-2xl animate-slide-up overflow-hidden flex flex-col ${
          darkMode ? 'bg-neutral-900' : 'bg-white'
        }`}
        style={{ maxHeight: '85dvh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-neutral-800 active:bg-neutral-800' : 'hover:bg-neutral-100 active:bg-neutral-100'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto flex-1 px-5 pb-4 overscroll-contain">
          {children}
        </div>

        {/* Botón fijo abajo */}
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
  )
}
