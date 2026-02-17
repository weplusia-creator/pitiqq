import { useContext, useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Filter } from 'lucide-react'
import { AppContext } from '../../App'
import Modal from '../../components/Modal'
import SwipeToDelete from '../../components/SwipeToDelete'
import { generateId, formatMoney, getToday, getCurrentMonth, getMonthName, EXPENSE_CATEGORIES, INCOME_CATEGORIES, haptic } from '../../utils/helpers'

const emptyMovement = { type: 'expense', date: getToday(), amount: '', category: 'comida', description: '' }

export default function Movements() {
  const { movements, setMovements, darkMode } = useContext(AppContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyMovement)
  const [filterMonth, setFilterMonth] = useState(getCurrentMonth())
  const [filterType, setFilterType] = useState('all')
  const [filterCat, setFilterCat] = useState('all')

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setForm(emptyMovement)
      setEditing(null)
      setShowModal(true)
      setSearchParams({})
    }
  }, [searchParams, setSearchParams])

  const filtered = useMemo(() => {
    let list = movements.filter(m => m.date.startsWith(filterMonth))
    if (filterType !== 'all') list = list.filter(m => m.type === filterType)
    if (filterCat !== 'all') list = list.filter(m => m.category === filterCat)
    return list.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [movements, filterMonth, filterType, filterCat])

  const months = useMemo(() => {
    const set = new Set(movements.map(m => m.date.substring(0, 7)))
    set.add(getCurrentMonth())
    return [...set].sort().reverse()
  }, [movements])

  const handleSave = () => {
    if (!form.amount || Number(form.amount) <= 0) return
    haptic('medium')
    const entry = { ...form, amount: Number(form.amount) }
    if (editing) {
      setMovements(prev => prev.map(m => m.id === editing ? { ...entry, id: editing } : m))
    } else {
      setMovements(prev => [...prev, { ...entry, id: generateId() }])
    }
    setShowModal(false)
    setForm(emptyMovement)
    setEditing(null)
  }

  const handleEdit = (m) => {
    setForm({ type: m.type, date: m.date, amount: m.amount.toString(), category: m.category, description: m.description })
    setEditing(m.id)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    haptic('medium')
    setMovements(prev => prev.filter(m => m.id !== id))
  }

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  const card = `${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`

  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Movimientos</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`}
          >
            <Filter size={18} />
          </button>
          <button
            onClick={() => { setForm(emptyMovement); setEditing(null); setShowModal(true) }}
            className="bg-pink-brand text-white p-2.5 rounded-xl active:scale-95 transition-transform"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className={`${card} rounded-2xl p-3 space-y-2 animate-fade-in`}>
          <select
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            className={`w-full p-2.5 rounded-xl text-sm ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
          >
            {months.map(m => <option key={m} value={m}>{getMonthName(m)}</option>)}
          </select>
          <div className="flex gap-2">
            {['all', 'income', 'expense'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filterType === t
                    ? 'bg-pink-brand text-white'
                    : darkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {t === 'all' ? 'Todos' : t === 'income' ? 'Ingresos' : 'Gastos'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`${card} rounded-2xl p-3 text-center`}>
          <p className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Ingresos</p>
          <p className="text-emerald-400 font-bold">
            {formatMoney(filtered.filter(m => m.type === 'income').reduce((s, m) => s + m.amount, 0))}
          </p>
        </div>
        <div className={`${card} rounded-2xl p-3 text-center`}>
          <p className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Gastos</p>
          <p className="text-red-400 font-bold">
            {formatMoney(filtered.filter(m => m.type === 'expense').reduce((s, m) => s + m.amount, 0))}
          </p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className={`text-center py-12 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            No hay movimientos
          </p>
        ) : (
          filtered.map(m => {
            const allCats = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]
            const cat = allCats.find(c => c.id === m.category) || { icon: '📦', label: m.category, color: '#6b7280' }
            return (
              <SwipeToDelete key={m.id} onDelete={() => handleDelete(m.id)}>
                <div
                  onClick={() => handleEdit(m)}
                  className={`${card} rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: cat.color + '20' }}>
                      {cat.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{m.description || cat.label}</p>
                      <p className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        {new Date(m.date + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <span className={`font-bold ${m.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {m.type === 'income' ? '+' : '-'}{formatMoney(m.amount)}
                  </span>
                </div>
              </SwipeToDelete>
            )
          })
        )}
      </div>

      {/* Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Editar movimiento' : 'Nuevo movimiento'}
        action={
          <button
            onClick={handleSave}
            className="w-full py-3.5 bg-pink-brand text-white rounded-xl font-bold text-lg active:scale-95 transition-transform"
          >
            {editing ? 'Guardar cambios' : 'Agregar'}
          </button>
        }
      >
        <div className="space-y-4">
          {/* Type toggle */}
          <div className="flex gap-2">
            {['expense', 'income'].map(t => (
              <button
                key={t}
                onClick={() => {
                  setForm(f => ({
                    ...f,
                    type: t,
                    category: t === 'income' ? 'sueldo' : 'comida'
                  }))
                }}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                  form.type === t
                    ? t === 'expense' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                    : darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {t === 'expense' ? 'Gasto' : 'Ingreso'}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Monto</label>
            <input
              type="number"
              inputMode="numeric"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              placeholder="0"
              className={`w-full mt-1 p-3 rounded-xl text-2xl font-bold text-center ${
                darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'
              }`}
              autoFocus
            />
          </div>

          {/* Date */}
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Fecha</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className={`w-full mt-1 p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
            />
          </div>

          {/* Category */}
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Categoría</label>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {categories.map(c => (
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

          {/* Description */}
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Descripción (opcional)</label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Ej: Almuerzo con amigos"
              className={`w-full mt-1 p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
