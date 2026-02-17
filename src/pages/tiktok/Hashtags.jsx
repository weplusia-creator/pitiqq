import { useContext, useState } from 'react'
import { Plus, Copy, Check, Trash2 } from 'lucide-react'
import { AppContext } from '../../App'
import Modal from '../../components/Modal'
import { generateId, TIKTOK_CATEGORIES, haptic } from '../../utils/helpers'

export default function Hashtags() {
  const { hashtags, setHashtags, darkMode } = useContext(AppContext)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ category: 'tutorial', tags: '' })
  const [copied, setCopied] = useState(null)
  const [filterCat, setFilterCat] = useState('all')

  const filtered = filterCat === 'all' ? hashtags : hashtags.filter(h => h.category === filterCat)

  const handleSave = () => {
    if (!form.tags.trim()) return
    haptic('medium')
    const tags = form.tags.split(/[\s,]+/).filter(t => t).map(t => t.startsWith('#') ? t : '#' + t)
    setHashtags(prev => [...prev, { id: generateId(), category: form.category, tags }])
    setForm({ category: 'tutorial', tags: '' })
    setShowModal(false)
  }

  const handleCopy = async (group) => {
    const text = group.tags.join(' ')
    try {
      await navigator.clipboard.writeText(text)
      haptic('success')
      setCopied(group.id)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      haptic('success')
      setCopied(group.id)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  const handleDelete = (id) => {
    haptic('medium')
    setHashtags(prev => prev.filter(h => h.id !== id))
  }

  const card = `rounded-2xl p-4 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Hashtags</h1>
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
        {TIKTOK_CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setFilterCat(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              filterCat === c.id ? 'text-white' : darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-200 text-neutral-500'
            }`}
            style={filterCat === c.id ? { backgroundColor: c.color } : {}}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">#</p>
          <p className={darkMode ? 'text-neutral-500' : 'text-neutral-400'}>No hay hashtags guardados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(group => {
            const cat = TIKTOK_CATEGORIES.find(c => c.id === group.category)
            return (
              <div key={group.id} className={card}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: cat?.color + '20', color: cat?.color }}>
                    {cat?.label}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleCopy(group)}
                      className={`p-2 rounded-lg text-sm flex items-center gap-1 ${
                        copied === group.id ? 'text-emerald-400' : 'text-pink-brand'
                      }`}
                    >
                      {copied === group.id ? <Check size={14} /> : <Copy size={14} />}
                      <span className="text-xs">{copied === group.id ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                    <button onClick={() => handleDelete(group.id)} className="p-2 text-neutral-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.tags.map((tag, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2 py-1 rounded-lg ${darkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Agregar hashtags"
        action={
          <button onClick={handleSave} className="w-full py-3.5 bg-pink-brand text-white rounded-xl font-bold text-lg active:scale-95 transition-transform">
            Guardar
          </button>
        }
      >
        <div className="space-y-4">
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Categoría</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className={`w-full mt-1 p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
            >
              {TIKTOK_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Hashtags (separados por espacio o coma)</label>
            <textarea
              value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="#fyp #viral #contenido"
              rows={4}
              className={`w-full mt-1 p-3 rounded-xl resize-none ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
              autoFocus
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
