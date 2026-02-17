import { useContext, useState, useMemo } from 'react'
import { Plus, Check, Trash2, Users, ListTodo, UserCheck, UserX, Clock, ChevronDown } from 'lucide-react'
import { AppContext } from '../../App'
import Modal from '../../components/Modal'
import SwipeToDelete from '../../components/SwipeToDelete'
import { generateId, haptic } from '../../utils/helpers'

const TASK_CATEGORIES = [
  { id: 'venue', label: 'Venue', color: '#8b5cf6' },
  { id: 'catering', label: 'Catering', color: '#f97316' },
  { id: 'decoracion', label: 'Decoración', color: '#ec4899' },
  { id: 'musica', label: 'Música', color: '#3b82f6' },
  { id: 'foto_video', label: 'Fotos/Video', color: '#06b6d4' },
  { id: 'vestimenta', label: 'Vestimenta', color: '#f43f5e' },
  { id: 'invitaciones', label: 'Invitaciones', color: '#10b981' },
  { id: 'otro', label: 'Otro', color: '#6b7280' },
]

const GUEST_STATUS = [
  { id: 'pendiente', label: 'Pendiente', color: '#f97316', icon: Clock },
  { id: 'confirmado', label: 'Confirmado', color: '#10b981', icon: UserCheck },
  { id: 'no_asiste', label: 'No asiste', color: '#ef4444', icon: UserX },
]

const PRIORITY_LEVELS = [
  { id: 'alta', label: 'Alta', color: '#ef4444' },
  { id: 'media', label: 'Media', color: '#f97316' },
  { id: 'baja', label: 'Baja', color: '#6b7280' },
]

export default function Wedding() {
  const { weddingTasks, setWeddingTasks, weddingGuests, setWeddingGuests, darkMode } = useContext(AppContext)
  const [activeTab, setActiveTab] = useState('tasks')
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [taskForm, setTaskForm] = useState({ title: '', category: 'otro', priority: 'media', deadline: '' })
  const [guestForm, setGuestForm] = useState({ name: '', companions: '0', status: 'pendiente', notes: '' })
  const [guestFilter, setGuestFilter] = useState('all')

  const card = `rounded-2xl p-4 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`

  // Summary stats
  const totalGuests = useMemo(() =>
    weddingGuests.reduce((sum, g) => sum + 1 + (Number(g.companions) || 0), 0),
    [weddingGuests]
  )
  const confirmedGuests = useMemo(() =>
    weddingGuests.filter(g => g.status === 'confirmado').reduce((sum, g) => sum + 1 + (Number(g.companions) || 0), 0),
    [weddingGuests]
  )
  const pendingGuests = useMemo(() =>
    weddingGuests.filter(g => g.status === 'pendiente').reduce((sum, g) => sum + 1 + (Number(g.companions) || 0), 0),
    [weddingGuests]
  )
  const completedTasks = weddingTasks.filter(t => t.done).length

  // Task handlers
  const handleSaveTask = () => {
    if (!taskForm.title) return
    haptic('medium')
    setWeddingTasks(prev => [...prev, { ...taskForm, id: generateId(), done: false }])
    setTaskForm({ title: '', category: 'otro', priority: 'media', deadline: '' })
    setShowTaskModal(false)
  }

  const toggleTask = (id) => {
    haptic()
    setWeddingTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const deleteTask = (id) => {
    haptic('medium')
    setWeddingTasks(prev => prev.filter(t => t.id !== id))
  }

  // Guest handlers
  const handleSaveGuest = () => {
    if (!guestForm.name) return
    haptic('medium')
    setWeddingGuests(prev => [...prev, { ...guestForm, id: generateId(), companions: Number(guestForm.companions) || 0 }])
    setGuestForm({ name: '', companions: '0', status: 'pendiente', notes: '' })
    setShowGuestModal(false)
  }

  const changeGuestStatus = (id, status) => {
    haptic()
    setWeddingGuests(prev => prev.map(g => g.id === id ? { ...g, status } : g))
  }

  const deleteGuest = (id) => {
    haptic('medium')
    setWeddingGuests(prev => prev.filter(g => g.id !== id))
  }

  const filteredGuests = guestFilter === 'all' ? weddingGuests : weddingGuests.filter(g => g.status === guestFilter)

  const sortedTasks = useMemo(() => {
    const pOrder = { alta: 0, media: 1, baja: 2 }
    return [...weddingTasks].sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1
      return (pOrder[a.priority] || 1) - (pOrder[b.priority] || 1)
    })
  }, [weddingTasks])

  return (
    <div className="px-4 py-4 space-y-4">
      <h1 className="text-xl font-bold">Casamiento</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`${card} text-center`}>
          <Users size={20} className="text-pink-brand mx-auto mb-1" />
          <p className="text-2xl font-bold">{confirmedGuests}<span className={`text-sm font-normal ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>/{totalGuests}</span></p>
          <p className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Confirmados</p>
        </div>
        <div className={`${card} text-center`}>
          <ListTodo size={20} className="text-pink-brand mx-auto mb-1" />
          <p className="text-2xl font-bold">{completedTasks}<span className={`text-sm font-normal ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>/{weddingTasks.length}</span></p>
          <p className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Tareas listas</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'tasks', label: 'Tareas', icon: ListTodo },
          { id: 'guests', label: 'Invitados', icon: Users },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-pink-brand text-white'
                : darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-200 text-neutral-500'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* TASKS TAB */}
      {activeTab === 'tasks' && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setShowTaskModal(true)}
              className="bg-pink-brand text-white p-2.5 rounded-xl active:scale-95 transition-transform"
            >
              <Plus size={18} />
            </button>
          </div>

          {sortedTasks.length === 0 ? (
            <div className="text-center py-12">
              <ListTodo size={40} className="text-neutral-600 mx-auto mb-2" />
              <p className={darkMode ? 'text-neutral-500' : 'text-neutral-400'}>No hay tareas aún</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedTasks.map(task => {
                const cat = TASK_CATEGORIES.find(c => c.id === task.category)
                const priority = PRIORITY_LEVELS.find(p => p.id === task.priority)
                return (
                  <SwipeToDelete key={task.id} onDelete={() => deleteTask(task.id)}>
                    <div className={`${card} flex items-center gap-3`}>
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                          task.done ? 'bg-emerald-500 text-white' : darkMode ? 'border border-neutral-600' : 'border border-neutral-300'
                        }`}
                      >
                        {task.done && <Check size={14} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${task.done ? 'line-through opacity-50' : ''}`}>{task.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: cat?.color + '20', color: cat?.color }}>
                            {cat?.label}
                          </span>
                          {task.deadline && (
                            <span className={`text-[10px] ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                              {new Date(task.deadline + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: priority?.color }} />
                    </div>
                  </SwipeToDelete>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* GUESTS TAB */}
      {activeTab === 'guests' && (
        <>
          {/* Guest filter */}
          <div className="flex gap-1.5">
            <button
              onClick={() => setGuestFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                guestFilter === 'all' ? 'bg-pink-brand text-white' : darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-200 text-neutral-500'
              }`}
            >
              Todos ({weddingGuests.length})
            </button>
            {GUEST_STATUS.map(s => {
              const count = weddingGuests.filter(g => g.status === s.id).length
              return (
                <button
                  key={s.id}
                  onClick={() => setGuestFilter(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    guestFilter === s.id ? 'text-white' : darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-200 text-neutral-500'
                  }`}
                  style={guestFilter === s.id ? { backgroundColor: s.color } : {}}
                >
                  {s.label} ({count})
                </button>
              )
            })}
          </div>

          <div className="flex justify-between items-center">
            <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {pendingGuests} pendiente{pendingGuests !== 1 ? 's' : ''} de confirmar
            </p>
            <button
              onClick={() => setShowGuestModal(true)}
              className="bg-pink-brand text-white p-2.5 rounded-xl active:scale-95 transition-transform"
            >
              <Plus size={18} />
            </button>
          </div>

          {filteredGuests.length === 0 ? (
            <div className="text-center py-12">
              <Users size={40} className="text-neutral-600 mx-auto mb-2" />
              <p className={darkMode ? 'text-neutral-500' : 'text-neutral-400'}>No hay invitados aún</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredGuests.map(guest => {
                const status = GUEST_STATUS.find(s => s.id === guest.status)
                const StatusIcon = status?.icon || Clock
                return (
                  <SwipeToDelete key={guest.id} onDelete={() => deleteGuest(guest.id)}>
                    <div className={`${card} flex items-center gap-3`}>
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: status?.color + '20' }}
                      >
                        <StatusIcon size={18} style={{ color: status?.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{guest.name}</p>
                        <div className="flex items-center gap-2">
                          {guest.companions > 0 && (
                            <span className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                              +{guest.companions} acompañante{guest.companions > 1 ? 's' : ''}
                            </span>
                          )}
                          {guest.notes && (
                            <span className={`text-xs truncate ${darkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                              {guest.notes}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Status dropdown */}
                      <select
                        value={guest.status}
                        onChange={e => changeGuestStatus(guest.id, e.target.value)}
                        className={`text-xs p-1.5 rounded-lg appearance-none ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
                        style={{ color: status?.color }}
                      >
                        {GUEST_STATUS.map(s => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </SwipeToDelete>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Task Modal */}
      <Modal
        open={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Nueva tarea"
        action={
          <button onClick={handleSaveTask} className="w-full py-3.5 bg-pink-brand text-white rounded-xl font-bold text-lg active:scale-95 transition-transform">
            Agregar tarea
          </button>
        }
      >
        <div className="space-y-4">
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Tarea</label>
            <input
              type="text"
              value={taskForm.title}
              onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ej: Reservar salón"
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
                  onClick={() => setTaskForm(f => ({ ...f, category: c.id }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    taskForm.category === c.id ? 'text-white' : darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
                  }`}
                  style={taskForm.category === c.id ? { backgroundColor: c.color } : {}}
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
                  onClick={() => setTaskForm(f => ({ ...f, priority: p.id }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                    taskForm.priority === p.id ? 'text-white' : darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
                  }`}
                  style={taskForm.priority === p.id ? { backgroundColor: p.color } : {}}
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
              value={taskForm.deadline}
              onChange={e => setTaskForm(f => ({ ...f, deadline: e.target.value }))}
              className={`w-full mt-1 p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
            />
          </div>
        </div>
      </Modal>

      {/* Guest Modal */}
      <Modal
        open={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        title="Agregar invitado"
        action={
          <button onClick={handleSaveGuest} className="w-full py-3.5 bg-pink-brand text-white rounded-xl font-bold text-lg active:scale-95 transition-transform">
            Agregar invitado
          </button>
        }
      >
        <div className="space-y-4">
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Nombre</label>
            <input
              type="text"
              value={guestForm.name}
              onChange={e => setGuestForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Nombre del invitado"
              className={`w-full mt-1 p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
              autoFocus
            />
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Acompañantes</label>
            <input
              type="number"
              inputMode="numeric"
              value={guestForm.companions}
              onChange={e => setGuestForm(f => ({ ...f, companions: e.target.value }))}
              min="0"
              className={`w-full mt-1 p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
            />
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Estado</label>
            <div className="flex gap-2 mt-1">
              {GUEST_STATUS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setGuestForm(f => ({ ...f, status: s.id }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                    guestForm.status === s.id ? 'text-white' : darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
                  }`}
                  style={guestForm.status === s.id ? { backgroundColor: s.color } : {}}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Notas (opcional)</label>
            <input
              type="text"
              value={guestForm.notes}
              onChange={e => setGuestForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Ej: Vegetariano, viene de Córdoba"
              className={`w-full mt-1 p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
