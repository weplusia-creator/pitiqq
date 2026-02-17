import { useContext } from 'react'
import { X } from 'lucide-react'
import { AppContext } from '../App'

export default function Modal({ open, onClose, title, children }) {
  const { darkMode } = useContext(AppContext)
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className={`relative w-full max-w-lg max-h-[90vh] rounded-t-2xl animate-slide-up flex flex-col ${
          darkMode ? 'bg-neutral-900' : 'bg-white'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header fijo */}
        <div className={`flex items-center justify-between px-5 pt-5 pb-3 shrink-0 ${darkMode ? 'bg-neutral-900' : 'bg-white'} rounded-t-2xl`}>
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className={`p-2 rounded-full ${darkMode ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'}`}>
            <X size={20} />
          </button>
        </div>
        {/* Contenido scrolleable con padding extra abajo */}
        <div className="overflow-y-auto px-5 pb-8" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 2rem))' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
