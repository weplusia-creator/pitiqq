import { useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, PiggyBank, ArrowRight, Plus, Target, Wallet, DollarSign } from 'lucide-react'
import { AppContext } from '../../App'
import { formatMoney, getCurrentMonth, getMonthName, EXPENSE_CATEGORIES } from '../../utils/helpers'

export default function Dashboard() {
  const { movements, darkMode, currentUser } = useContext(AppContext)
  const navigate = useNavigate()
  const currentMonth = getCurrentMonth()

  const monthMovements = useMemo(() =>
    movements.filter(m => m.date.startsWith(currentMonth)),
    [movements, currentMonth]
  )

  const totalIncome = useMemo(() =>
    monthMovements.filter(m => m.type === 'income').reduce((s, m) => s + m.amount, 0),
    [monthMovements]
  )

  const totalExpense = useMemo(() =>
    monthMovements.filter(m => m.type === 'expense').reduce((s, m) => s + m.amount, 0),
    [monthMovements]
  )

  const balance = totalIncome - totalExpense

  const expenseByCategory = useMemo(() => {
    const map = {}
    monthMovements.filter(m => m.type === 'expense').forEach(m => {
      map[m.category] = (map[m.category] || 0) + m.amount
    })
    return EXPENSE_CATEGORIES
      .filter(c => map[c.id])
      .map(c => ({ name: c.label, value: map[c.id], color: c.color, icon: c.icon }))
  }, [monthMovements])

  const lastMovements = useMemo(() =>
    [...movements].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [movements]
  )

  const card = `rounded-2xl p-4 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hola, {currentUser === 'mateo' ? 'Mateo' : 'Lucre'}</h1>
          <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
            {getMonthName(currentMonth)}
          </p>
        </div>
        <button
          onClick={() => navigate('/movements?new=1')}
          className="bg-pink-brand text-white p-3 rounded-full shadow-lg shadow-pink-brand/20 active:scale-95 transition-transform"
        >
          <Plus size={22} />
        </button>
      </div>

      {/* Balance */}
      <div className={`${card} text-center`}>
        <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Balance del mes</p>
        <p className={`text-3xl font-bold mt-1 ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {formatMoney(balance)}
        </p>
        <div className="flex justify-center gap-6 mt-3">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="text-sm text-emerald-400">{formatMoney(totalIncome)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingDown size={16} className="text-red-400" />
            <span className="text-sm text-red-400">{formatMoney(totalExpense)}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Wallet, label: 'Movimientos', path: '/movements' },
          { icon: Target, label: 'Metas', path: '/goals' },
          { icon: PiggyBank, label: 'Presupuesto', path: '/budget' },
          { icon: PiggyBank, label: 'Ahorros', path: '/savings' },
          { icon: DollarSign, label: 'Dólares', path: '/dollars' },
        ].map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`${card} flex flex-col items-center gap-2 py-4 active:scale-95 transition-transform`}
          >
            <item.icon size={22} className="text-pink-brand" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Expense Chart */}
      {expenseByCategory.length > 0 && (
        <div className={card}>
          <h3 className="font-semibold mb-3">Gastos por categoría</h3>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%" cy="50%"
                    innerRadius={30} outerRadius={55}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {expenseByCategory.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1.5">
              {expenseByCategory.map(cat => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span>{cat.icon} {cat.name}</span>
                  </div>
                  <span className="font-medium">{formatMoney(cat.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Last Movements */}
      <div className={card}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Últimos movimientos</h3>
          <button onClick={() => navigate('/movements')} className="text-pink-brand text-sm flex items-center gap-1">
            Ver todos <ArrowRight size={14} />
          </button>
        </div>
        {lastMovements.length === 0 ? (
          <p className={`text-center py-6 text-sm ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            No hay movimientos aún
          </p>
        ) : (
          <div className="space-y-2">
            {lastMovements.map(m => {
              const cats = m.type === 'income'
                ? [{ icon: '💰', label: 'Ingreso', color: '#10b981' }]
                : EXPENSE_CATEGORIES
              const cat = cats.find(c => c.id === m.category) || cats[0]
              return (
                <div key={m.id} className={`flex items-center justify-between py-2 border-b last:border-0 ${darkMode ? 'border-neutral-800' : 'border-neutral-100'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{cat.icon}</span>
                    <div>
                      <p className="text-sm font-medium">{m.description || cat.label}</p>
                      <p className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        {new Date(m.date + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold text-sm ${m.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {m.type === 'income' ? '+' : '-'}{formatMoney(m.amount)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Savings Summary */}
      <div className={`${card} text-center`}>
        <PiggyBank size={28} className="text-pink-brand mx-auto mb-2" />
        <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Ahorro del mes</p>
        <p className={`text-xl font-bold ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {formatMoney(Math.max(0, balance))}
        </p>
      </div>
    </div>
  )
}
