import { useContext, useState } from 'react'
import { Plus, ExternalLink, Music, Trash2 } from 'lucide-react'
import { AppContext } from '../../App'
import Modal from '../../components/Modal'
import { generateId, haptic } from '../../utils/helpers'

export default function Trends() {
  const { trends, setTrends, darkMode } = useContext(AppContext)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', link: '', deadline: '', used: false })
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? trends
    : filter === 'pending' ? trends.filter(t => !t.used)
    : trends.filter(t => t.used)

  const handleSave = () => {
    if (!form.name) return
    haptic('medium')
    setTrends(prev => [...prev, { ...form, id: generateId() }])
    setForm({ name: '', link: '', deadline: '', used: false })
    setShowModal(false)
  }

  const toggleUsed = (id) => {
    haptic()
    setTrends(prev => prev.map(t => t.id === id ? { ...t, used: !t.used } : t))
  }

  const handleDelete = (id) => {
    haptic('medium')
    setTrends(prev => prev.filter(t => t.id !== id))
  }

  const card = `rounded-2xl p-4 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`

  const isExpired = (deadline) => {
    if (!deadline) return false
    return new Date(deadline) < new Date()
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Audios / Trends</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-pink-brand text-white p-2.5 rounded-xl active:scale-95 transition-transform"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'pending', label: 'Por usar' },
          { id: 'used', label: 'Usados' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium ${
              filter === f.id ? 'bg-pink-brand text-white' : darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-200 text-neutral-500'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Music size={48} className="text-neutral-600 mx-auto mb-3" />
          <p className={darkMode ? 'text-neutral-500' : 'text-neutral-400'}>No hay trends guardados</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(t => (
            <div key={t.id} className={`${card} flex items-center gap-3`}>
              <button
                onClick={() => toggleUsed(t.id)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  t.used ? 'bg-emerald-500/20 text-emerald-400' : 'bg-pink-brand/20 text-pink-brand'
                }`}
              >
                <Music size={18} />
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${t.used ? 'line-through opacity-50' : ''}`}>{t.name}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${t.used ? 'text-emerald-400' : 'text-pink-brand'}`}>
                    {t.used ? 'Usado' : 'Por usar'}
                  </span>
                  {t.deadline && (
                    <span className={`text-xs ${isExpired(t.deadline) ? 'text-red-400' : darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      {isExpired(t.deadline) ? '⚠️ Expirado' : `Hasta ${new Date(t.deadline + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}`}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                {t.link && (
                  <a href={t.link} target="_blank" rel="noopener noreferrer" className="p-2 text-neutral-400">
                    <ExternalLink size={16} />
                  </a>
                )}
                <button onClick={() => handleDelete(t.id)} className="p-2 text-neutral-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Guardar audio/trend"
        action={
          <button onClick={handleSave} className="w-full py-3.5 bg-pink-brand text-white rounded-xl font-bold text-lg active:scale-95 transition-transform">
            Guardar
          </button>
        }
      >
        <div className="space-y-4">
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ej: Audio viral del gato"
              className={`w-full mt-1 p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
              autoFocus
            />
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Link (opcional)</label>
            <input
              type="url"
              value={form.link}
              onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
              placeholder="https://..."
              className={`w-full mt-1 p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
            />
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Fecha límite (si es temporal)</label>
            <input
              type="date"
              value={form.deadline}
              onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
              className={`w-full mt-1 p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
