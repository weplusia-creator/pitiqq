import { useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Plus, Trash2 } from 'lucide-react'
import { AppContext } from '../../App'
import { TIKTOK_CATEGORIES, IDEA_STATES, PRIORITY_LEVELS, haptic } from '../../utils/helpers'

export default function IdeaDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { ideas, setIdeas, darkMode } = useContext(AppContext)
  const idea = ideas.find(i => i.id === id)
  const [newCheckItem, setNewCheckItem] = useState('')

  if (!idea) return (
    <div className="px-4 py-4">
      <button onClick={() => navigate('/ideas')} className="flex items-center gap-2 text-pink-brand mb-4">
        <ArrowLeft size={20} /> Volver
      </button>
      <p className="text-center py-16 text-neutral-500">Idea no encontrada</p>
    </div>
  )

  const update = (changes) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, ...changes } : i))
  }

  const card = `rounded-2xl p-4 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`
  const state = IDEA_STATES.find(s => s.id === idea.state)
  const cat = TIKTOK_CATEGORIES.find(c => c.id === idea.category)
  const priority = PRIORITY_LEVELS.find(p => p.id === idea.priority)
  const inputClass = `w-full p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`

  const handleAddCheckItem = () => {
    if (!newCheckItem.trim()) return
    haptic()
    const checklist = [...(idea.checklist || []), { text: newCheckItem.trim(), done: false }]
    update({ checklist })
    setNewCheckItem('')
  }

  const toggleCheck = (index) => {
    haptic()
    const checklist = [...(idea.checklist || [])]
    checklist[index] = { ...checklist[index], done: !checklist[index].done }
    update({ checklist })
  }

  const removeCheck = (index) => {
    const checklist = (idea.checklist || []).filter((_, i) => i !== index)
    update({ checklist })
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <button onClick={() => navigate('/ideas')} className="flex items-center gap-2 text-pink-brand">
        <ArrowLeft size={20} /> Ideas
      </button>

      {/* Title & Description */}
      <div className={card}>
        <input
          type="text"
          value={idea.title}
          onChange={e => update({ title: e.target.value })}
          className={`w-full text-lg font-bold bg-transparent outline-none ${darkMode ? 'text-white' : 'text-neutral-900'}`}
          placeholder="Título"
        />
        <textarea
          value={idea.description || ''}
          onChange={e => update({ description: e.target.value })}
          className={`w-full mt-2 bg-transparent outline-none resize-none text-sm ${darkMode ? 'text-neutral-300' : 'text-neutral-600'}`}
          placeholder="Descripción..."
          rows={3}
        />
      </div>

      {/* State */}
      <div className={card}>
        <h3 className="font-semibold text-sm mb-2">Estado</h3>
        <div className="flex flex-wrap gap-2">
          {IDEA_STATES.map(s => (
            <button
              key={s.id}
              onClick={() => { haptic(); update({ state: s.id }) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                idea.state === s.id ? 'text-white' : darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-200 text-neutral-500'
              }`}
              style={idea.state === s.id ? { backgroundColor: s.color } : {}}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category & Priority */}
      <div className="grid grid-cols-2 gap-3">
        <div className={card}>
          <h3 className="font-semibold text-xs mb-2">Categoría</h3>
          <select
            value={idea.category}
            onChange={e => update({ category: e.target.value })}
            className={inputClass + ' text-sm'}
          >
            {TIKTOK_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div className={card}>
          <h3 className="font-semibold text-xs mb-2">Prioridad</h3>
          <select
            value={idea.priority}
            onChange={e => update({ priority: e.target.value })}
            className={inputClass + ' text-sm'}
          >
            {PRIORITY_LEVELS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>
      </div>

      {/* Publish date */}
      <div className={card}>
        <h3 className="font-semibold text-sm mb-2">Fecha de publicación</h3>
        <input
          type="date"
          value={idea.publishDate || ''}
          onChange={e => update({ publishDate: e.target.value })}
          className={inputClass}
        />
      </div>

      {/* Script */}
      <div className={card}>
        <h3 className="font-semibold text-sm mb-3">Guión / Script</h3>
        <div className="space-y-3">
          {[
            { key: 'hook', label: 'Hook (3 seg)', placeholder: 'Lo primero que se ve/escucha...' },
            { key: 'body', label: 'Cuerpo', placeholder: 'Desarrollo del contenido...' },
            { key: 'close', label: 'Cierre', placeholder: 'Cómo termina...' },
            { key: 'cta', label: 'CTA', placeholder: 'Llamada a la acción...' },
          ].map(section => (
            <div key={section.key}>
              <label className={`text-xs font-medium ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {section.label}
              </label>
              <textarea
                value={(idea.script || {})[section.key] || ''}
                onChange={e => update({ script: { ...(idea.script || {}), [section.key]: e.target.value } })}
                placeholder={section.placeholder}
                rows={2}
                className={`${inputClass} mt-1 resize-none text-sm`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className={card}>
        <h3 className="font-semibold text-sm mb-3">Checklist de grabación</h3>
        <div className="space-y-2">
          {(idea.checklist || []).map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <button
                onClick={() => toggleCheck(i)}
                className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                  item.done ? 'bg-emerald-500 text-white' : darkMode ? 'border border-neutral-600' : 'border border-neutral-300'
                }`}
              >
                {item.done && <Check size={14} />}
              </button>
              <span className={`flex-1 text-sm ${item.done ? 'line-through opacity-50' : ''}`}>{item.text}</span>
              <button onClick={() => removeCheck(i)} className="text-neutral-500 p-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newCheckItem}
              onChange={e => setNewCheckItem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddCheckItem()}
              placeholder="Agregar item..."
              className={`flex-1 p-2.5 rounded-xl text-sm ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
            />
            <button onClick={handleAddCheckItem} className="bg-pink-brand text-white p-2.5 rounded-xl">
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={() => { setIdeas(prev => prev.filter(i => i.id !== id)); navigate('/ideas') }}
        className="w-full py-3 text-red-400 font-medium rounded-xl border border-red-400/30"
      >
        Eliminar idea
      </button>
    </div>
  )
}
