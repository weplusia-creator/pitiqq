import { useContext, useState } from 'react'
import { PiggyBank, Edit3, Check } from 'lucide-react'
import { AppContext } from '../../App'
import { formatMoney, haptic } from '../../utils/helpers'

export default function Savings() {
  const { savings, setSavings, darkMode } = useContext(AppContext)
  const [editing, setEditing] = useState(false)
  const [amount, setAmount] = useState(savings.toString())

  const card = `rounded-2xl p-4 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`

  const handleSave = () => {
    haptic('success')
    setSavings(Number(amount) || 0)
    setEditing(false)
  }

  const handleQuickAdd = (value) => {
    haptic('medium')
    const newAmount = (Number(savings) || 0) + value
    setSavings(newAmount)
    setAmount(newAmount.toString())
  }

  const handleQuickSubtract = (value) => {
    haptic('medium')
    const newAmount = Math.max(0, (Number(savings) || 0) - value)
    setSavings(newAmount)
    setAmount(newAmount.toString())
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <h1 className="text-xl font-bold">Ahorros</h1>

      {/* Balance */}
      <div className={`${card} text-center`}>
        <PiggyBank size={36} className="text-pink-brand mx-auto mb-2" />
        <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Total ahorrado</p>

        {editing ? (
          <div className="flex items-center justify-center gap-2 mt-2">
            <input
              type="number"
              inputMode="numeric"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
              className={`text-3xl font-bold text-center w-48 p-2 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
            />
            <button onClick={handleSave} className="bg-emerald-500 text-white p-2.5 rounded-xl">
              <Check size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 mt-1">
            <p className="text-3xl font-bold text-emerald-400">{formatMoney(savings)}</p>
            <button
              onClick={() => { setAmount(savings.toString()); setEditing(true) }}
              className={`p-2 rounded-lg ${darkMode ? 'text-neutral-500 hover:bg-neutral-800' : 'text-neutral-400 hover:bg-neutral-100'}`}
            >
              <Edit3 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className={card}>
        <h3 className="font-semibold text-sm mb-3">Agregar</h3>
        <div className="grid grid-cols-4 gap-2">
          {[1000, 5000, 10000, 50000].map(val => (
            <button
              key={val}
              onClick={() => handleQuickAdd(val)}
              className="py-3 rounded-xl text-sm font-medium bg-emerald-500/15 text-emerald-400 active:scale-95 transition-transform"
            >
              +{val >= 1000 ? `${val/1000}K` : val}
            </button>
          ))}
        </div>
      </div>

      <div className={card}>
        <h3 className="font-semibold text-sm mb-3">Retirar</h3>
        <div className="grid grid-cols-4 gap-2">
          {[1000, 5000, 10000, 50000].map(val => (
            <button
              key={val}
              onClick={() => handleQuickSubtract(val)}
              className="py-3 rounded-xl text-sm font-medium bg-red-500/15 text-red-400 active:scale-95 transition-transform"
            >
              -{val >= 1000 ? `${val/1000}K` : val}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
