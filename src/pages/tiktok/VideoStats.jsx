import { useContext, useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Plus, Trash2, Eye, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'
import { AppContext } from '../../App'
import Modal from '../../components/Modal'
import { generateId, TIKTOK_CATEGORIES, haptic } from '../../utils/helpers'

export default function VideoStats() {
  const { videoStats, setVideoStats, darkMode } = useContext(AppContext)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    title: '', category: 'tutorial', views: '', likes: '', comments: '', shares: '', saves: '', date: ''
  })

  const handleSave = () => {
    if (!form.title) return
    haptic('medium')
    setVideoStats(prev => [...prev, {
      ...form,
      id: generateId(),
      views: Number(form.views) || 0,
      likes: Number(form.likes) || 0,
      comments: Number(form.comments) || 0,
      shares: Number(form.shares) || 0,
      saves: Number(form.saves) || 0,
    }])
    setForm({ title: '', category: 'tutorial', views: '', likes: '', comments: '', shares: '', saves: '', date: '' })
    setShowModal(false)
  }

  const handleDelete = (id) => {
    haptic('medium')
    setVideoStats(prev => prev.filter(v => v.id !== id))
  }

  const chartData = useMemo(() =>
    [...videoStats].slice(-10).map(v => ({
      name: v.title.substring(0, 12) + (v.title.length > 12 ? '...' : ''),
      views: v.views,
      likes: v.likes,
    })),
    [videoStats]
  )

  const bestCategory = useMemo(() => {
    const map = {}
    videoStats.forEach(v => {
      if (!map[v.category]) map[v.category] = { views: 0, count: 0 }
      map[v.category].views += v.views
      map[v.category].count++
    })
    let best = null
    let bestAvg = 0
    Object.entries(map).forEach(([cat, data]) => {
      const avg = data.views / data.count
      if (avg > bestAvg) { best = cat; bestAvg = avg }
    })
    return best ? TIKTOK_CATEGORIES.find(c => c.id === best)?.label : null
  }, [videoStats])

  const totals = useMemo(() => ({
    views: videoStats.reduce((s, v) => s + v.views, 0),
    likes: videoStats.reduce((s, v) => s + v.likes, 0),
    comments: videoStats.reduce((s, v) => s + v.comments, 0),
    shares: videoStats.reduce((s, v) => s + v.shares, 0),
    saves: videoStats.reduce((s, v) => s + v.saves, 0),
  }), [videoStats])

  const card = `rounded-2xl p-4 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`
  const formatNum = (n) => n >= 1000000 ? (n/1000000).toFixed(1) + 'M' : n >= 1000 ? (n/1000).toFixed(1) + 'K' : n.toString()

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Stats de Videos</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-pink-brand text-white p-2.5 rounded-xl active:scale-95 transition-transform"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Totals */}
      {videoStats.length > 0 && (
        <>
          <div className="grid grid-cols-5 gap-2">
            {[
              { icon: Eye, label: 'Vistas', value: totals.views },
              { icon: Heart, label: 'Likes', value: totals.likes },
              { icon: MessageCircle, label: 'Coment.', value: totals.comments },
              { icon: Share2, label: 'Shares', value: totals.shares },
              { icon: Bookmark, label: 'Saves', value: totals.saves },
            ].map(stat => (
              <div key={stat.label} className={`${card} text-center !p-2`}>
                <stat.icon size={16} className="text-pink-brand mx-auto mb-1" />
                <p className="font-bold text-sm">{formatNum(stat.value)}</p>
                <p className={`text-[10px] ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>{stat.label}</p>
              </div>
            ))}
          </div>

          {bestCategory && (
            <div className={`${card} text-center`}>
              <p className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Mejor categoría por vistas promedio</p>
              <p className="text-lg font-bold text-pink-brand mt-1">{bestCategory}</p>
            </div>
          )}

          {/* Chart */}
          {chartData.length > 1 && (
            <div className={card}>
              <h3 className="font-semibold text-sm mb-3">Rendimiento</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: darkMode ? '#737373' : '#a3a3a3' }} />
                  <YAxis tick={{ fontSize: 10, fill: darkMode ? '#737373' : '#a3a3a3' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#171717' : '#fff',
                      border: 'none',
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="views" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="likes" fill="#f472b6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      {/* Videos list */}
      {videoStats.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📊</p>
          <p className={darkMode ? 'text-neutral-500' : 'text-neutral-400'}>No hay videos registrados</p>
        </div>
      ) : (
        <div className="space-y-2">
          {[...videoStats].reverse().map(v => (
            <div key={v.id} className={`${card} flex items-center justify-between`}>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{v.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs flex items-center gap-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    <Eye size={12} /> {formatNum(v.views)}
                  </span>
                  <span className={`text-xs flex items-center gap-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    <Heart size={12} /> {formatNum(v.likes)}
                  </span>
                  <span className={`text-xs flex items-center gap-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    <MessageCircle size={12} /> {formatNum(v.comments)}
                  </span>
                </div>
              </div>
              <button onClick={() => handleDelete(v.id)} className="p-2 text-neutral-500">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Registrar video">
        <div className="space-y-3">
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Título del video</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className={`w-full mt-1 p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
              autoFocus
            />
          </div>
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
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'views', label: 'Vistas', icon: '👁️' },
              { key: 'likes', label: 'Likes', icon: '❤️' },
              { key: 'comments', label: 'Comentarios', icon: '💬' },
              { key: 'shares', label: 'Compartidos', icon: '🔄' },
              { key: 'saves', label: 'Guardados', icon: '🔖' },
            ].map(field => (
              <div key={field.key}>
                <label className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>{field.icon} {field.label}</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={form[field.key]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  placeholder="0"
                  className={`w-full mt-1 p-2.5 rounded-xl text-sm ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
                />
              </div>
            ))}
          </div>
          <button onClick={handleSave} className="w-full py-3.5 bg-pink-brand text-white rounded-xl font-bold text-lg active:scale-95 transition-transform">
            Guardar
          </button>
        </div>
      </Modal>
    </div>
  )
}
