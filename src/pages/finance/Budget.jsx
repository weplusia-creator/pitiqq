import { useContext, useState, useMemo } from 'react'
import { Plus, AlertTriangle } from 'lucide-react'
import { AppContext } from '../../App'
import Modal from '../../components/Modal'
import { generateId, formatMoney, getCurrentMonth, getMonthName, EXPENSE_CATEGORIES, haptic } from '../../utils/helpers'

export default function Budget() {
  const { budgets, setBudgets, movements, darkMode } = useContext(AppContext)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ category: 'comida', amount: '' })
  const currentMonth = getCurrentMonth()

  const monthExpenses = useMemo(() => {
    const map = {}
    movements
      .filter(m => m.type === 'expense' && m.date.startsWith(currentMonth))
      .forEach(m => { map[m.category] = (map[m.category] || 0) + m.amount })
    return map
  }, [movements, currentMonth])

  const handleSave = () => {
    if (!form.amount || Number(form.amount) <= 0) return
    haptic('medium')
    const existing = budgets.find(b => b.category === form.category)
    if (existing) {
      setBudgets(prev => prev.map(b => b.category === form.category ? { ...b, amount: Number(form.amount) } : b))
    } else {
      setBudgets(prev => [...prev, { id: generateId(), category: form.category, amount: Number(form.amount) }])
    }
    setShowModal(false)
    setForm({ category: 'comida', amount: '' })
  }

  const handleDelete = (id) => {
    haptic('medium')
    setBudgets(prev => prev.filter(b => b.id !== id))
  }

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0)
  const totalSpent = budgets.reduce((s, b) => s + (monthExpenses[b.category] || 0), 0)

  const card = `rounded-2xl p-4 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`

  const usedCategories = budgets.map(b => b.category)
  const availableCategories = EXPENSE_CATEGORIES.filter(c => !usedCategories.includes(c.id))

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Presupuesto</h1>
          <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>{getMonthName(currentMonth)}</p>
        </div>
        {availableCategories.length > 0 && (
          <button
            onClick={() => {
              setForm({ category: availableCategories[0].id, amount: '' })
              setShowModal(true)
            }}
            className="bg-pink-brand text-white p-2.5 rounded-xl active:scale-95 transition-transform"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      {/* Total overview */}
      {budgets.length > 0 && (
        <div className={card}>
          <div className="flex justify-between text-sm mb-2">
            <span>Gastado: {formatMoney(totalSpent)}</span>
            <span>Presupuesto: {formatMoney(totalBudget)}</span>
          </div>
          <div className={`h-3 rounded-full overflow-hidden ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                totalSpent / totalBudget > 0.9 ? 'bg-red-500' : totalSpent / totalBudget > 0.7 ? 'bg-yellow-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, (totalSpent / totalBudget) * 100)}%` }}
            />
          </div>
          <p className={`text-xs mt-1 text-right ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Restante: {formatMoney(Math.max(0, totalBudget - totalSpent))}
          </p>
        </div>
      )}

      {/* Category budgets */}
      {budgets.length === 0 ? (
        <div className="text-center py-16">
          <p className={`text-4xl mb-3`}>📊</p>
          <p className={darkMode ? 'text-neutral-500' : 'text-neutral-400'}>No tenés presupuestos definidos</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 px-6 py-2.5 bg-pink-brand text-white rounded-xl font-medium"
          >
            Definir presupuesto
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {budgets.map(b => {
            const cat = EXPENSE_CATEGORIES.find(c => c.id === b.category) || {}
            const spent = monthExpenses[b.category] || 0
            const pct = Math.min(100, Math.round((spent / b.amount) * 100))
            const over = spent > b.amount
            return (
              <div key={b.id} className={`${card} ${over ? 'ring-1 ring-red-500/50' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.icon}</span>
                    <span className="font-medium">{cat.label}</span>
                  </div>
                  <button onClick={() => handleDelete(b.id)} className="text-neutral-500 text-xs">Eliminar</button>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className={over ? 'text-red-400' : ''}>{formatMoney(spent)}</span>
                  <span className={darkMode ? 'text-neutral-400' : 'text-neutral-500'}>{formatMoney(b.amount)}</span>
                </div>
                <div className={`h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-yellow-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {over && (
                  <div className="flex items-center gap-1 mt-2 text-red-400 text-xs">
                    <AlertTriangle size={12} />
                    <span>Te pasaste por {formatMoney(spent - b.amount)}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Definir presupuesto"
        action={
          <button onClick={handleSave} className="w-full py-3.5 bg-pink-brand text-white rounded-xl font-bold text-lg active:scale-95 transition-transform">
            Guardar
          </button>
        }
      >
        <div className="space-y-4">
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Categoría</label>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {availableCategories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setForm(f => ({ ...f, category: c.id }))}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs transition-all ${
                    form.category === c.id
                      ? 'ring-2 ring-pink-brand scale-105'
                      : darkMode ? 'bg-neutral-800' : 'bg-neutral-100'
                  }`}
                >
                  <span className="text-lg">{c.icon}</span>
                  <span className="truncate w-full text-center">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Monto mensual</label>
            <input
              type="number"
              inputMode="numeric"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              placeholder="0"
              className={`w-full mt-1 p-3 rounded-xl text-xl font-bold text-center ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
              autoFocus
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
