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

      {/* Modal posicionado abajo */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center">
        <div
          className={`w-full max-w-lg rounded-t-2xl animate-slide-up ${bg}`}
          style={{ maxHeight: '90vh' }}
        >
          {/* Todo scrollea junto */}
          <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: '90vh' }}>
            {/* Header sticky arriba */}
            <div className={`sticky top-0 z-10 flex items-center justify-between px-5 pt-5 pb-3 rounded-t-2xl ${bg}`}>
              <h2 className="text-lg font-bold">{title}</h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-full ${darkMode ? 'active:bg-neutral-800' : 'active:bg-neutral-100'}`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Contenido */}
            <div className="px-5 pb-3">
              {children}
            </div>

            {/* Botón sticky abajo */}
            {action && (
              <div
                className={`sticky bottom-0 z-10 px-5 pt-3 pb-5 ${bg}`}
                style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom, 1.25rem))' }}
              >
                {action}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
