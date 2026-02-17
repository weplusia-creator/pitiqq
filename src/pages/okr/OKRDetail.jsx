import { useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, TrendingUp } from 'lucide-react'
import { AppContext } from '../../App'
import Modal from '../../components/Modal'
import { generateId, haptic } from '../../utils/helpers'

export default function OKRDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { okrs, setOkrs, darkMode } = useContext(AppContext)
  const okr = okrs.find(o => o.id === id)
  const [showModal, setShowModal] = useState(false)
  const [editingKR, setEditingKR] = useState(null)
  const [form, setForm] = useState({ description: '', current: '', target: '', unit: '' })

  if (!okr) return (
    <div className="px-4 py-4">
      <button onClick={() => navigate('/okr')} className="flex items-center gap-2 text-pink-brand mb-4">
        <ArrowLeft size={20} /> Volver
      </button>
      <p className="text-center py-16 text-neutral-500">Objetivo no encontrado</p>
    </div>
  )

  const update = (changes) => {
    setOkrs(prev => prev.map(o => o.id === id ? { ...o, ...changes } : o))
  }

  const card = `rounded-2xl p-4 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`
  const inputClass = `w-full p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`

  const overallProgress = () => {
    const krs = okr.keyResults || []
    if (krs.length === 0) return 0
    const total = krs.reduce((sum, kr) => {
      const pct = kr.target > 0 ? Math.min(100, (kr.current / kr.target) * 100) : 0
      return sum + pct
    }, 0)
    return Math.round(total / krs.length)
  }

  const handleSaveKR = () => {
    if (!form.description || !form.target) return
    haptic('medium')
    const kr = {
      id: editingKR || generateId(),
      description: form.description,
      current: Number(form.current) || 0,
      target: Number(form.target),
      unit: form.unit,
    }
    if (editingKR) {
      update({ keyResults: (okr.keyResults || []).map(k => k.id === editingKR ? kr : k) })
    } else {
      update({ keyResults: [...(okr.keyResults || []), kr] })
    }
    setForm({ description: '', current: '', target: '', unit: '' })
    setEditingKR(null)
    setShowModal(false)
  }

  const handleEditKR = (kr) => {
    setForm({ description: kr.description, current: kr.current.toString(), target: kr.target.toString(), unit: kr.unit || '' })
    setEditingKR(kr.id)
    setShowModal(true)
  }

  const handleDeleteKR = (krId) => {
    haptic('medium')
    update({ keyResults: (okr.keyResults || []).filter(k => k.id !== krId) })
  }

  const handleUpdateProgress = (krId, newCurrent) => {
    haptic()
    update({
      keyResults: (okr.keyResults || []).map(k =>
        k.id === krId ? { ...k, current: Math.max(0, Number(newCurrent)) } : k
      )
    })
  }

  const pct = overallProgress()

  return (
    <div className="px-4 py-4 space-y-4">
      <button onClick={() => navigate('/okr')} className="flex items-center gap-2 text-pink-brand">
        <ArrowLeft size={20} /> OKRs
      </button>

      {/* Objective header */}
      <div className={card}>
        <input
          type="text"
          value={okr.title}
          onChange={e => update({ title: e.target.value })}
          className={`w-full text-lg font-bold bg-transparent outline-none ${darkMode ? 'text-white' : 'text-neutral-900'}`}
        />
        {okr.period && (
          <p className={`text-sm mt-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>{okr.period}</p>
        )}

        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Progreso general</span>
            <span className="font-bold">{pct}%</span>
          </div>
          <div className={`h-3 rounded-full overflow-hidden ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                pct >= 100 ? 'bg-emerald-400' : pct >= 70 ? 'bg-yellow-400' : 'bg-pink-brand'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Key Results */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Key Results</h2>
        <button
          onClick={() => { setForm({ description: '', current: '', target: '', unit: '' }); setEditingKR(null); setShowModal(true) }}
          className="bg-pink-brand text-white p-2 rounded-xl active:scale-95 transition-transform"
        >
          <Plus size={16} />
        </button>
      </div>

      {(!okr.keyResults || okr.keyResults.length === 0) ? (
        <div className="text-center py-8">
          <TrendingUp size={32} className="text-neutral-600 mx-auto mb-2" />
          <p className={`text-sm ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Agregá Key Results para medir el progreso
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {(okr.keyResults || []).map(kr => {
            const krPct = kr.target > 0 ? Math.min(100, Math.round((kr.current / kr.target) * 100)) : 0
            return (
              <div key={kr.id} className={card}>
                <div className="flex items-start justify-between">
                  <p
                    className="font-medium text-sm flex-1 cursor-pointer"
                    onClick={() => handleEditKR(kr)}
                  >
                    {kr.description}
                  </p>
                  <button onClick={() => handleDeleteKR(kr.id)} className="text-neutral-500 p-1 ml-2">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className={darkMode ? 'text-neutral-400' : 'text-neutral-500'}>
                      {kr.current} / {kr.target} {kr.unit}
                    </span>
                    <span className="font-medium">{krPct}%</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        krPct >= 100 ? 'bg-emerald-400' : krPct >= 70 ? 'bg-yellow-400' : 'bg-pink-brand'
                      }`}
                      style={{ width: `${krPct}%` }}
                    />
                  </div>
                </div>

                {/* Quick update */}
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={kr.current}
                    onChange={e => handleUpdateProgress(kr.id, e.target.value)}
                    className={`flex-1 p-2 rounded-lg text-sm text-center ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleUpdateProgress(kr.id, kr.current + 1)}
                      className="px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handleUpdateProgress(kr.id, kr.current + 10)}
                      className="px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium"
                    >
                      +10
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* KR Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingKR ? 'Editar Key Result' : 'Nuevo Key Result'}>
        <div className="space-y-4">
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Descripción</label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Ej: Conseguir 10K seguidores"
              className={`${inputClass} mt-1`}
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Actual</label>
              <input
                type="number"
                inputMode="numeric"
                value={form.current}
                onChange={e => setForm(f => ({ ...f, current: e.target.value }))}
                placeholder="0"
                className={`${inputClass} mt-1`}
              />
            </div>
            <div>
              <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Objetivo</label>
              <input
                type="number"
                inputMode="numeric"
                value={form.target}
                onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                placeholder="100"
                className={`${inputClass} mt-1`}
              />
            </div>
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Unidad (opcional)</label>
            <input
              type="text"
              value={form.unit}
              onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
              placeholder="Ej: seguidores, videos, $"
              className={`${inputClass} mt-1`}
            />
          </div>
          <button onClick={handleSaveKR} className="w-full py-3.5 bg-pink-brand text-white rounded-xl font-bold text-lg active:scale-95 transition-transform">
            {editingKR ? 'Guardar cambios' : 'Agregar KR'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
