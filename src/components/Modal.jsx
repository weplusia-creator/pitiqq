import { useContext } from 'react'
import { X } from 'lucide-react'
import { AppContext } from '../App'

export default function Modal({ open, onClose, title, action, children }) {
  const { darkMode } = useContext(AppContext)
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <div
          className={`w-full max-w-lg max-h-[85vh] rounded-t-2xl animate-slide-up overflow-hidden flex flex-col ${
            darkMode ? 'bg-neutral-900' : 'bg-white'
          }`}
          onClick={e => e.stopPropagation()}
        >
          {/* Header fijo */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
            <h2 className="text-lg font-bold">{title}</h2>
            <button onClick={onClose} className={`p-2 rounded-full ${darkMode ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'}`}>
              <X size={20} />
            </button>
          </div>

          {/* Contenido scrolleable */}
          <div className="overflow-y-auto flex-1 px-5 pb-4">
            {children}
          </div>

          {/* Botón fijo abajo, siempre visible */}
          {action && (
            <div className="shrink-0 px-5 pt-2 pb-5" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom, 1.25rem))' }}>
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
