import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Target, Trash2 } from 'lucide-react'
import { AppContext } from '../../App'
import Modal from '../../components/Modal'
import { generateId, haptic } from '../../utils/helpers'

export default function OKRList() {
  const { okrs, setOkrs, darkMode } = useContext(AppContext)
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', period: '', description: '' })

  const card = `rounded-2xl p-4 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`

  const handleCreate = () => {
    if (!form.title) return
    haptic('medium')
    setOkrs(prev => [...prev, {
      id: generateId(),
      title: form.title,
      period: form.period,
      description: form.description,
      keyResults: [],
      createdAt: new Date().toISOString(),
    }])
    setForm({ title: '', period: '', description: '' })
    setShowModal(false)
  }

  const handleDelete = (e, id) => {
    e.stopPropagation()
    haptic('medium')
    setOkrs(prev => prev.filter(o => o.id !== id))
  }

  const getProgress = (okr) => {
    if (!okr.keyResults || okr.keyResults.length === 0) return 0
    const total = okr.keyResults.reduce((sum, kr) => {
      const pct = kr.target > 0 ? Math.min(100, (kr.current / kr.target) * 100) : 0
      return sum + pct
    }, 0)
    return Math.round(total / okr.keyResults.length)
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">OKRs</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-pink-brand text-white p-2.5 rounded-xl active:scale-95 transition-transform"
        >
          <Plus size={18} />
        </button>
      </div>

      {okrs.length === 0 ? (
        <div className="text-center py-16">
          <Target size={48} className="text-neutral-600 mx-auto mb-3" />
          <p className={darkMode ? 'text-neutral-500' : 'text-neutral-400'}>No tenés objetivos aún</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 px-6 py-2.5 bg-pink-brand text-white rounded-xl font-medium"
          >
            Crear primer objetivo
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {okrs.map(okr => {
            const pct = getProgress(okr)
            const krCount = okr.keyResults?.length || 0
            return (
              <div
                key={okr.id}
                onClick={() => navigate(`/okr/${okr.id}`)}
                className={`${card} active:scale-[0.98] transition-transform cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{okr.title}</h3>
                    {okr.period && (
                      <p className={`text-xs mt-0.5 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        {okr.period}
                      </p>
                    )}
                  </div>
                  <button onClick={(e) => handleDelete(e, okr.id)} className="text-neutral-500 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {krCount} Key Result{krCount !== 1 ? 's' : ''}
                    </span>
                    <span className="font-medium text-sm">{pct}%</span>
                  </div>
                  <div className={`h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 100 ? 'bg-emerald-400' : pct >= 70 ? 'bg-yellow-400' : 'bg-pink-brand'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nuevo objetivo">
        <div className="space-y-4">
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Objetivo</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ej: Crecer en TikTok"
              className={`w-full mt-1 p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
              autoFocus
            />
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Período</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {[
                '1er Cuatrimestre 2026', '2do Cuatrimestre 2026', '3er Cuatrimestre 2026',
                'Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026',
                'Anual 2026',
              ].map(p => (
                <button
                  key={p}
                  onClick={() => setForm(f => ({ ...f, period: p }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    form.period === p ? 'bg-pink-brand text-white' : darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={form.period}
              onChange={e => setForm(f => ({ ...f, period: e.target.value }))}
              placeholder="O escribí uno personalizado..."
              className={`w-full mt-2 p-3 rounded-xl text-sm ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
            />
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Descripción (opcional)</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Contexto del objetivo..."
              rows={2}
              className={`w-full mt-1 p-3 rounded-xl resize-none ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
            />
          </div>
          <button onClick={handleCreate} className="w-full py-3.5 bg-pink-brand text-white rounded-xl font-bold text-lg active:scale-95 transition-transform">
            Crear objetivo
          </button>
        </div>
      </Modal>
    </div>
  )
}
