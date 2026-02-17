import { useContext, useState, useEffect } from 'react'
import { Moon, Sun, Download, Upload, Share2, Smartphone, Trash2 } from 'lucide-react'
import { AppContext } from '../App'
import { haptic } from '../utils/helpers'

export default function Settings() {
  const ctx = useContext(AppContext)
  const { darkMode, setDarkMode } = ctx
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  const handleExport = () => {
    haptic('medium')
    const data = {
      movements: ctx.movements,
      goals: ctx.goals,
      budgets: ctx.budgets,
      ideas: ctx.ideas,
      trends: ctx.trends,
      videoStats: ctx.videoStats,
      hashtags: ctx.hashtags,
      okrs: ctx.okrs,
      weddingTasks: ctx.weddingTasks,
      weddingGuests: ctx.weddingGuests,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pitiqq-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result)
          if (data.movements) ctx.setMovements(data.movements)
          if (data.goals) ctx.setGoals(data.goals)
          if (data.budgets) ctx.setBudgets(data.budgets)
          if (data.ideas) ctx.setIdeas(data.ideas)
          if (data.trends) ctx.setTrends(data.trends)
          if (data.videoStats) ctx.setVideoStats(data.videoStats)
          if (data.hashtags) ctx.setHashtags(data.hashtags)
          if (data.okrs) ctx.setOkrs(data.okrs)
          if (data.weddingTasks) ctx.setWeddingTasks(data.weddingTasks)
          if (data.weddingGuests) ctx.setWeddingGuests(data.weddingGuests)
          haptic('success')
          alert('Datos importados correctamente')
        } catch {
          alert('Error al importar el archivo')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const handleShareBackup = async () => {
    haptic('medium')
    const data = {
      movements: ctx.movements,
      goals: ctx.goals,
      budgets: ctx.budgets,
      ideas: ctx.ideas,
      trends: ctx.trends,
      videoStats: ctx.videoStats,
      hashtags: ctx.hashtags,
      okrs: ctx.okrs,
      weddingTasks: ctx.weddingTasks,
      weddingGuests: ctx.weddingGuests,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
    const file = new File([blob], `pitiqq-backup.json`, { type: 'application/json' })

    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Pitiqq Backup', text: 'Backup de mis datos de Pitiqq' })
      } catch { /* cancelled */ }
    } else {
      handleExport()
    }
  }

  const handleClearData = () => {
    haptic('heavy')
    ctx.setMovements([])
    ctx.setGoals([])
    ctx.setBudgets([])
    ctx.setIdeas([])
    ctx.setTrends([])
    ctx.setVideoStats([])
    ctx.setHashtags([])
    ctx.setOkrs([])
    ctx.setWeddingTasks([])
    ctx.setWeddingGuests([])
    setShowConfirmClear(false)
  }

  const card = `rounded-2xl p-4 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`

  return (
    <div className="px-4 py-4 space-y-4">
      <h1 className="text-xl font-bold">Configuración</h1>

      {/* Install PWA */}
      {installPrompt && (
        <button
          onClick={handleInstall}
          className={`${card} w-full flex items-center gap-3 active:scale-[0.98] transition-transform`}
        >
          <div className="w-10 h-10 bg-pink-brand/20 rounded-xl flex items-center justify-center">
            <Smartphone size={20} className="text-pink-brand" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm">Instalar Pitiqq</p>
            <p className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Agregar a pantalla de inicio</p>
          </div>
        </button>
      )}

      {/* Theme */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon size={20} className="text-pink-brand" /> : <Sun size={20} className="text-pink-brand" />}
            <div>
              <p className="font-semibold text-sm">Tema</p>
              <p className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {darkMode ? 'Modo oscuro' : 'Modo claro'}
              </p>
            </div>
          </div>
          <button
            onClick={() => { haptic(); setDarkMode(!darkMode) }}
            className={`w-12 h-7 rounded-full relative transition-colors ${darkMode ? 'bg-pink-brand' : 'bg-neutral-300'}`}
          >
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Data management */}
      <div className={card}>
        <h3 className="font-semibold text-sm mb-3">Datos</h3>
        <div className="space-y-2">
          <button
            onClick={handleExport}
            className={`w-full flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'} active:scale-[0.98] transition-transform`}
          >
            <Download size={18} className="text-emerald-400" />
            <span className="text-sm">Exportar backup (JSON)</span>
          </button>
          <button
            onClick={handleImport}
            className={`w-full flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'} active:scale-[0.98] transition-transform`}
          >
            <Upload size={18} className="text-blue-400" />
            <span className="text-sm">Importar backup</span>
          </button>
          <button
            onClick={handleShareBackup}
            className={`w-full flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'} active:scale-[0.98] transition-transform`}
          >
            <Share2 size={18} className="text-purple-400" />
            <span className="text-sm">Compartir backup (WhatsApp)</span>
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className={`${card} border border-red-500/20`}>
        <h3 className="font-semibold text-sm mb-3 text-red-400">Zona peligrosa</h3>
        {showConfirmClear ? (
          <div className="space-y-2">
            <p className="text-sm text-red-400">Esto borrará TODOS tus datos. No se puede deshacer.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirmClear(false)}
                className={`flex-1 py-2.5 rounded-xl font-medium ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`}
              >
                Cancelar
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 py-2.5 rounded-xl font-medium bg-red-500 text-white"
              >
                Borrar todo
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmClear(true)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-500/10 active:scale-[0.98] transition-transform"
          >
            <Trash2 size={18} className="text-red-400" />
            <span className="text-sm text-red-400">Borrar todos los datos</span>
          </button>
        )}
      </div>

      {/* App info */}
      <div className="text-center py-4">
        <p className="text-2xl font-black text-pink-brand">Pitiqq</p>
        <p className={`text-xs mt-1 ${darkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
          Finanzas + TikTok Ideas
        </p>
        <p className={`text-xs ${darkMode ? 'text-neutral-700' : 'text-neutral-300'}`}>
          v1.0.0
        </p>
      </div>
    </div>
  )
}
