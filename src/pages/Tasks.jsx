import { useContext, useState, useMemo } from 'react'
import { Plus, Check, Trash2, Calendar, Filter } from 'lucide-react'
import { AppContext } from '../App'
import Modal from '../components/Modal'
import SwipeToDelete from '../components/SwipeToDelete'
import { generateId, haptic, getToday } from '../utils/helpers'

const TASK_CATEGORIES = [
  { id: 'personal', label: 'Personal', color: '#3b82f6', icon: '👤' },
  { id: 'trabajo', label: 'Trabajo', color: '#8b5cf6', icon: '💼' },
  { id: 'casa', label: 'Casa', color: '#f97316', icon: '🏠' },
  { id: 'salud', label: 'Salud', color: '#10b981', icon: '💪' },
  { id: 'estudios', label: 'Estudios', color: '#06b6d4', icon: '📚' },
  { id: 'compras', label: 'Compras', color: '#ec4899', icon: '🛒' },
  { id: 'otro', label: 'Otro', color: '#6b7280', icon: '📌' },
]

const PRIORITY_LEVELS = [
  { id: 'alta', label: 'Alta', color: '#ef4444' },
  { id: 'media', label: 'Media', color: '#f97316' },
  { id: 'baja', label: 'Baja', color: '#6b7280' },
]

export default function Tasks() {
  const { userTasks, setUserTasks, darkMode, currentUser } = useContext(AppContext)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'personal', priority: 'media', deadline: '', notes: '' })
  const [filterCat, setFilterCat] = useState('all')
  const [showCompleted, setShowCompleted] = useState(false)

  const card = `rounded-2xl p-4 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`

  const pendingTasks = useMemo(() => {
    let list = userTasks.filter(t => !t.done)
    if (filterCat !== 'all') list = list.filter(t => t.category === filterCat)
    const pOrder = { alta: 0, media: 1, baja: 2 }
    return list.sort((a, b) => {
      if (a.priority !== b.priority) return (pOrder[a.priority] || 1) - (pOrder[b.priority] || 1)
      if (a.deadline && b.deadline) return new Date(a.deadline) - new Date(b.deadline)
      if (a.deadline) return -1
      if (b.deadline) return 1
      return 0
    })
  }, [userTasks, filterCat])

  const completedTasks = useMemo(() =>
    userTasks.filter(t => t.done).sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0)),
    [userTasks]
  )

  const handleSave = () => {
    if (!form.title) return
    haptic('medium')
    setUserTasks(prev => [...prev, {
      ...form,
      id: generateId(),
      done: false,
      createdAt: new Date().toISOString(),
    }])
    setForm({ title: '', category: 'personal', priority: 'media', deadline: '', notes: '' })
    setShowModal(false)
  }

  const toggleTask = (id) => {
    haptic('success')
    setUserTasks(prev => prev.map(t =>
      t.id === id ? { ...t, done: !t.done, completedAt: !t.done ? new Date().toISOString() : null } : t
    ))
  }

  const deleteTask = (id) => {
    haptic('medium')
    setUserTasks(prev => prev.filter(t => t.id !== id))
  }

  const isOverdue = (deadline) => {
    if (!deadline) return false
    return new Date(deadline) < new Date(getToday())
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Tareas</h1>
          <p className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            {pendingTasks.length} pendiente{pendingTasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-pink-brand text-white p-2.5 rounded-xl active:scale-95 transition-transform"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4">
        <button
          onClick={() => setFilterCat('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
            filterCat === 'all' ? 'bg-pink-brand text-white' : darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-200 text-neutral-500'
          }`}
        >
          Todas
        </button>
        {TASK_CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setFilterCat(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              filterCat === c.id ? 'text-white' : darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-200 text-neutral-500'
            }`}
            style={filterCat === c.id ? { backgroundColor: c.color } : {}}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Pending tasks */}
      {pendingTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">✅</p>
          <p className={darkMode ? 'text-neutral-500' : 'text-neutral-400'}>
            {userTasks.length === 0 ? 'No tenés tareas aún' : 'Todo listo!'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {pendingTasks.map(task => {
            const cat = TASK_CATEGORIES.find(c => c.id === task.category)
            const priority = PRIORITY_LEVELS.find(p => p.id === task.priority)
            const overdue = isOverdue(task.deadline)
            return (
              <SwipeToDelete key={task.id} onDelete={() => deleteTask(task.id)}>
                <div className={`${card} flex items-start gap-3`}>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 mt-0.5 rounded-md flex items-center justify-center shrink-0 border ${
                      darkMode ? 'border-neutral-600' : 'border-neutral-300'
                    }`}
                  >
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{task.title}</p>
                    {task.notes && (
                      <p className={`text-xs mt-0.5 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        {task.notes}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: cat?.color + '20', color: cat?.color }}>
                        {cat?.icon} {cat?.label}
                      </span>
                      {task.deadline && (
                        <span className={`text-[10px] flex items-center gap-0.5 ${overdue ? 'text-red-400 font-medium' : darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                          <Calendar size={10} />
                          {overdue ? '⚠️ ' : ''}{new Date(task.deadline + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: priority?.color }} />
                </div>
              </SwipeToDelete>
            )
          })}
        </div>
      )}

      {/* Completed toggle */}
      {completedTasks.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`text-sm font-medium ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
          >
            {showCompleted ? '▾' : '▸'} Completadas ({completedTasks.length})
          </button>

          {showCompleted && (
            <div className="space-y-2 mt-2 animate-fade-in">
              {completedTasks.map(task => {
                const cat = TASK_CATEGORIES.find(c => c.id === task.category)
                return (
                  <SwipeToDelete key={task.id} onDelete={() => deleteTask(task.id)}>
                    <div className={`${card} flex items-center gap-3 opacity-50`}>
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 bg-emerald-500 text-white"
                      >
                        <Check size={14} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-through">{task.title}</p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: cat?.color + '20', color: cat?.color }}>
                          {cat?.icon} {cat?.label}
                        </span>
                      </div>
                    </div>
                  </SwipeToDelete>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 right-5 bg-pink-brand text-white w-14 h-14 rounded-full shadow-lg shadow-pink-brand/30 flex items-center justify-center active:scale-90 transition-transform z-40"
      >
        <Plus size={26} />
      </button>

      {/* Create Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Nueva tarea"
        action={
          <button onClick={handleSave} className="w-full py-3.5 bg-pink-brand text-white rounded-xl font-bold text-lg active:scale-95 transition-transform">
            Agregar tarea
          </button>
        }
      >
        <div className="space-y-4">
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Tarea</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="Qué tenés que hacer?"
              className={`w-full mt-1 p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
              autoFocus
            />
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Categoría</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {TASK_CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setForm(f => ({ ...f, category: c.id }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    form.category === c.id ? 'text-white' : darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
                  }`}
                  style={form.category === c.id ? { backgroundColor: c.color } : {}}
                >
                  {c.icon} {c.label}
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
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Fecha límite (opcional)</label>
            <input
              type="date"
              value={form.deadline}
              onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
              className={`w-full mt-1 p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
            />
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Notas (opcional)</label>
            <input
              type="text"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Detalles extra..."
              className={`w-full mt-1 p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
