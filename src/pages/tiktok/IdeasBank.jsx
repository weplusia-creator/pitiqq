import { useContext, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, LayoutGrid, Columns3 } from 'lucide-react'
import { AppContext } from '../../App'
import Modal from '../../components/Modal'
import SwipeToDelete from '../../components/SwipeToDelete'
import { generateId, TIKTOK_CATEGORIES, IDEA_STATES, PRIORITY_LEVELS, haptic } from '../../utils/helpers'

const emptyIdea = { title: '', description: '', category: 'tutorial', state: 'idea', priority: 'media', publishDate: '', script: { hook: '', body: '', close: '', cta: '' }, checklist: [] }

export default function IdeasBank() {
  const { ideas, setIdeas, darkMode } = useContext(AppContext)
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyIdea)
  const [filterState, setFilterState] = useState('all')

  const filtered = useMemo(() => {
    let list = [...ideas]
    if (filterState !== 'all') list = list.filter(i => i.state === filterState)
    return list.sort((a, b) => {
      const pOrder = { alta: 0, media: 1, baja: 2 }
      return (pOrder[a.priority] || 1) - (pOrder[b.priority] || 1)
    })
  }, [ideas, filterState])

  const handleSave = () => {
    if (!form.title) return
    haptic('medium')
    setIdeas(prev => [...prev, { ...form, id: generateId(), createdAt: new Date().toISOString() }])
    setForm(emptyIdea)
    setShowModal(false)
  }

  const handleDelete = (id) => {
    haptic('medium')
    setIdeas(prev => prev.filter(i => i.id !== id))
  }

  const card = `${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Ideas TikTok</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/kanban')}
            className={`p-2.5 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`}
          >
            <Columns3 size={18} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-pink-brand text-white p-2.5 rounded-xl active:scale-95 transition-transform"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Quick links */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {[
          { label: 'Kanban', path: '/kanban' },
          { label: 'Trends', path: '/trends' },
          { label: 'Stats', path: '/stats' },
          { label: 'Hashtags', path: '/hashtags' },
        ].map(l => (
          <button
            key={l.path}
            onClick={() => navigate(l.path)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              darkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-200 text-neutral-600'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* State filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4">
        <button
          onClick={() => setFilterState('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
            filterState === 'all' ? 'bg-pink-brand text-white' : darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-200 text-neutral-500'
          }`}
        >
          Todas ({ideas.length})
        </button>
        {IDEA_STATES.map(s => {
          const count = ideas.filter(i => i.state === s.id).length
          return (
            <button
              key={s.id}
              onClick={() => setFilterState(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                filterState === s.id ? 'text-white' : darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-200 text-neutral-500'
              }`}
              style={filterState === s.id ? { backgroundColor: s.color } : {}}
            >
              {s.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Ideas list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">💡</p>
          <p className={darkMode ? 'text-neutral-500' : 'text-neutral-400'}>No hay ideas aún</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(idea => {
            const cat = TIKTOK_CATEGORIES.find(c => c.id === idea.category)
            const state = IDEA_STATES.find(s => s.id === idea.state)
            const priority = PRIORITY_LEVELS.find(p => p.id === idea.priority)
            return (
              <SwipeToDelete key={idea.id} onDelete={() => handleDelete(idea.id)}>
                <div
                  onClick={() => navigate(`/ideas/${idea.id}`)}
                  className={`${card} rounded-2xl p-4 active:scale-[0.98] transition-transform cursor-pointer`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-sm flex-1">{idea.title}</h3>
                    <div className="w-2 h-2 rounded-full ml-2 mt-1.5 shrink-0" style={{ backgroundColor: priority?.color }} />
                  </div>
                  {idea.description && (
                    <p className={`text-xs mt-1 line-clamp-2 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {idea.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: state?.color + '20', color: state?.color }}>
                      {state?.label}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: cat?.color + '20', color: cat?.color }}>
                      {cat?.label}
                    </span>
                  </div>
                </div>
              </SwipeToDelete>
            )
          })}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-5 bg-pink-brand text-white w-14 h-14 rounded-full shadow-lg shadow-pink-brand/30 flex items-center justify-center active:scale-90 transition-transform z-40"
      >
        <Plus size={26} />
      </button>

      {/* Create Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nueva idea">
        <div className="space-y-4">
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Título</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Título de la idea"
              className={`w-full mt-1 p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
              autoFocus
            />
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Descripción</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="De qué trata..."
              rows={3}
              className={`w-full mt-1 p-3 rounded-xl resize-none ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
            />
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Categoría</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {TIKTOK_CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setForm(f => ({ ...f, category: c.id }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    form.category === c.id ? 'text-white ring-2 ring-offset-1 ring-offset-neutral-900' : darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
                  }`}
                  style={form.category === c.id ? { backgroundColor: c.color } : {}}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Prioridad</label>
            <div className="flex gap-2 mt-1">
              {PRIORITY_LEVELS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setForm(f => ({ ...f, priority: p.id }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                    form.priority === p.id ? 'text-white' : darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
                  }`}
                  style={form.priority === p.id ? { backgroundColor: p.color } : {}}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Fecha de publicación (opcional)</label>
            <input
              type="date"
              value={form.publishDate}
              onChange={e => setForm(f => ({ ...f, publishDate: e.target.value }))}
              className={`w-full mt-1 p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
            />
          </div>
          <button onClick={handleSave} className="w-full py-3.5 bg-pink-brand text-white rounded-xl font-bold text-lg active:scale-95 transition-transform">
            Guardar idea
          </button>
        </div>
      </Modal>
    </div>
  )
}
