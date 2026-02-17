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
        className={`relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-2xl p-5 pb-10 animate-slide-up ${
          darkMode ? 'bg-neutral-900' : 'bg-white'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between pb-3 mb-3 -mt-1 -mx-5 px-5 pt-1" style={{ backgroundColor: darkMode ? '#171717' : '#ffffff' }}>
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className={`p-2 rounded-full ${darkMode ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'}`}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
