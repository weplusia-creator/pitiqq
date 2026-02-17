import { useContext, useState } from 'react'
import { Plus, Trophy, Trash2 } from 'lucide-react'
import { AppContext } from '../../App'
import Modal from '../../components/Modal'
import { generateId, formatMoney, haptic } from '../../utils/helpers'

export default function SavingsGoals() {
  const { goals, setGoals, darkMode } = useContext(AppContext)
  const [showModal, setShowModal] = useState(false)
  const [showContrib, setShowContrib] = useState(null)
  const [contribAmount, setContribAmount] = useState('')
  const [form, setForm] = useState({ name: '', target: '', deadline: '' })

  const card = `rounded-2xl p-4 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`

  const handleCreate = () => {
    if (!form.name || !form.target) return
    haptic('medium')
    setGoals(prev => [...prev, {
      id: generateId(),
      name: form.name,
      target: Number(form.target),
      deadline: form.deadline,
      current: 0,
      contributions: [],
    }])
    setForm({ name: '', target: '', deadline: '' })
    setShowModal(false)
  }

  const handleContrib = (goalId) => {
    if (!contribAmount || Number(contribAmount) <= 0) return
    haptic('success')
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g
      const newCurrent = g.current + Number(contribAmount)
      return {
        ...g,
        current: newCurrent,
        contributions: [...(g.contributions || []), { amount: Number(contribAmount), date: new Date().toISOString() }]
      }
    }))
    setContribAmount('')
    setShowContrib(null)
  }

  const handleDelete = (id) => {
    haptic('medium')
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Metas de ahorro</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-pink-brand text-white p-2.5 rounded-xl active:scale-95 transition-transform"
        >
          <Plus size={18} />
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-16">
          <Trophy size={48} className="text-neutral-600 mx-auto mb-3" />
          <p className={darkMode ? 'text-neutral-500' : 'text-neutral-400'}>No tenés metas aún</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 px-6 py-2.5 bg-pink-brand text-white rounded-xl font-medium"
          >
            Crear primera meta
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map(g => {
            const pct = Math.min(100, Math.round((g.current / g.target) * 100))
            const isComplete = pct >= 100
            return (
              <div key={g.id} className={`${card} ${isComplete ? 'animate-celebrate ring-2 ring-emerald-400' : ''}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {isComplete && <Trophy size={16} className="text-yellow-400" />}
                      {g.name}
                    </h3>
                    {g.deadline && (
                      <p className={`text-xs mt-0.5 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        Fecha límite: {new Date(g.deadline + 'T12:00:00').toLocaleDateString('es-AR')}
                      </p>
                    )}
                  </div>
                  <button onClick={() => handleDelete(g.id)} className="text-neutral-500 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{formatMoney(g.current)}</span>
                    <span className={darkMode ? 'text-neutral-400' : 'text-neutral-500'}>{formatMoney(g.target)}</span>
                  </div>
                  <div className={`h-3 rounded-full overflow-hidden ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isComplete ? 'bg-emerald-400' : pct > 70 ? 'bg-yellow-400' : 'bg-pink-brand'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-right text-xs mt-1 font-medium">{pct}%</p>
                </div>

                {isComplete ? (
                  <p className="text-center text-emerald-400 font-bold mt-2">Meta alcanzada!</p>
                ) : (
                  <button
                    onClick={() => { setShowContrib(g.id); setContribAmount('') }}
                    className="w-full mt-3 py-2.5 border border-pink-brand text-pink-brand rounded-xl font-medium active:scale-95 transition-transform"
                  >
                    Agregar aporte
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nueva meta">
        <div className="space-y-4">
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ej: Viaje a Europa"
              className={`w-full mt-1 p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
            />
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Monto objetivo</label>
            <input
              type="number"
              inputMode="numeric"
              value={form.target}
              onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
              placeholder="0"
              className={`w-full mt-1 p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
            />
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
          <button onClick={handleCreate} className="w-full py-3.5 bg-pink-brand text-white rounded-xl font-bold text-lg active:scale-95 transition-transform">
            Crear meta
          </button>
        </div>
      </Modal>

      {/* Contribution Modal */}
      <Modal open={!!showContrib} onClose={() => setShowContrib(null)} title="Agregar aporte">
        <div className="space-y-4">
          <input
            type="number"
            inputMode="numeric"
            value={contribAmount}
            onChange={e => setContribAmount(e.target.value)}
            placeholder="Monto"
            autoFocus
            className={`w-full p-3 rounded-xl text-xl font-bold text-center ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
          />
          <button
            onClick={() => handleContrib(showContrib)}
            className="w-full py-3.5 bg-emerald-500 text-white rounded-xl font-bold text-lg active:scale-95 transition-transform"
          >
            Aportar
          </button>
        </div>
      </Modal>
    </div>
  )
}
