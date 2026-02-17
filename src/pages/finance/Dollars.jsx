import { useContext, useState, useMemo } from 'react'
import { Plus, DollarSign, TrendingUp, TrendingDown, Trash2, RefreshCw } from 'lucide-react'
import { AppContext } from '../../App'
import Modal from '../../components/Modal'
import SwipeToDelete from '../../components/SwipeToDelete'
import { generateId, haptic, getToday } from '../../utils/helpers'

export default function Dollars() {
  const { dollars, setDollars, darkMode } = useContext(AppContext)
  const [showModal, setShowModal] = useState(false)
  const [cotizacion, setCotizacion] = useState('')
  const [loadingCot, setLoadingCot] = useState(false)
  const [form, setForm] = useState({ type: 'compra', amount: '', price: '', date: getToday() })

  const balance = dollars.balance || 0
  const operations = dollars.operations || []

  const card = `rounded-2xl p-4 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`

  const fetchCotizacion = async () => {
    setLoadingCot(true)
    try {
      const res = await fetch('https://dolarapi.com/v1/dolares/blue')
      const data = await res.json()
      setCotizacion(data.venta)
    } catch {
      setCotizacion('')
    }
    setLoadingCot(false)
  }

  const handleSave = () => {
    if (!form.amount || !form.price) return
    haptic('medium')
    const amount = Number(form.amount)
    const price = Number(form.price)
    const newBalance = form.type === 'compra' ? balance + amount : Math.max(0, balance - amount)
    setDollars({
      balance: newBalance,
      operations: [...operations, {
        id: generateId(),
        type: form.type,
        amount,
        price,
        total: amount * price,
        date: form.date,
      }]
    })
    setForm({ type: 'compra', amount: '', price: '', date: getToday() })
    setShowModal(false)
  }

  const handleDelete = (id) => {
    haptic('medium')
    const op = operations.find(o => o.id === id)
    if (!op) return
    const newBalance = op.type === 'compra' ? balance - op.amount : balance + op.amount
    setDollars({
      balance: Math.max(0, newBalance),
      operations: operations.filter(o => o.id !== id)
    })
  }

  const avgBuyPrice = useMemo(() => {
    const buys = operations.filter(o => o.type === 'compra')
    if (buys.length === 0) return 0
    const totalUSD = buys.reduce((s, o) => s + o.amount, 0)
    const totalARS = buys.reduce((s, o) => s + o.total, 0)
    return totalUSD > 0 ? Math.round(totalARS / totalUSD) : 0
  }, [operations])

  const formatUSD = (n) => `US$ ${n.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`
  const formatARS = (n) => `$ ${n.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Dólares</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-pink-brand text-white p-2.5 rounded-xl active:scale-95 transition-transform"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Balance */}
      <div className={`${card} text-center`}>
        <DollarSign size={36} className="text-emerald-400 mx-auto mb-2" />
        <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Tenencia en dólares</p>
        <p className="text-3xl font-bold text-emerald-400 mt-1">{formatUSD(balance)}</p>
        {avgBuyPrice > 0 && (
          <p className={`text-xs mt-1 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Precio promedio de compra: {formatARS(avgBuyPrice)}
          </p>
        )}
      </div>

      {/* Cotización */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">Dólar Blue</p>
            {cotizacion ? (
              <p className="text-lg font-bold text-emerald-400">{formatARS(cotizacion)}</p>
            ) : (
              <p className={`text-sm ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Tocá para consultar</p>
            )}
          </div>
          <button
            onClick={fetchCotizacion}
            disabled={loadingCot}
            className={`p-3 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'} active:scale-95 transition-transform`}
          >
            <RefreshCw size={18} className={loadingCot ? 'animate-spin text-pink-brand' : ''} />
          </button>
        </div>
        {cotizacion && balance > 0 && (
          <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
            <p className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Equivalente en pesos</p>
            <p className="text-lg font-bold">{formatARS(balance * cotizacion)}</p>
          </div>
        )}
      </div>

      {/* Operations */}
      <div>
        <h3 className="font-semibold text-sm mb-2">Historial</h3>
        {operations.length === 0 ? (
          <p className={`text-center py-8 text-sm ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            No hay operaciones
          </p>
        ) : (
          <div className="space-y-2">
            {[...operations].reverse().map(op => (
              <SwipeToDelete key={op.id} onDelete={() => handleDelete(op.id)}>
                <div className={`${card} flex items-center gap-3`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    op.type === 'compra' ? 'bg-emerald-500/15' : 'bg-red-500/15'
                  }`}>
                    {op.type === 'compra'
                      ? <TrendingUp size={18} className="text-emerald-400" />
                      : <TrendingDown size={18} className="text-red-400" />
                    }
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {op.type === 'compra' ? 'Compra' : 'Venta'} de {formatUSD(op.amount)}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      a {formatARS(op.price)} · {new Date(op.date + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <span className={`font-semibold text-sm ${op.type === 'compra' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {op.type === 'compra' ? '-' : '+'}{formatARS(op.total)}
                  </span>
                </div>
              </SwipeToDelete>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nueva operación">
        <div className="space-y-4">
          <div className="flex gap-2">
            {['compra', 'venta'].map(t => (
              <button
                key={t}
                onClick={() => setForm(f => ({ ...f, type: t }))}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                  form.type === t
                    ? t === 'compra' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                    : darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {t === 'compra' ? 'Compra' : 'Venta'}
              </button>
            ))}
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Cantidad (USD)</label>
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
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Precio por dólar (ARS)</label>
            <input
              type="number"
              inputMode="numeric"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              placeholder="0"
              className={`w-full mt-1 p-3 rounded-xl text-xl font-bold text-center ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
            />
          </div>
          {form.amount && form.price && (
            <p className={`text-center text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Total: {formatARS(Number(form.amount) * Number(form.price))}
            </p>
          )}
          <div>
            <label className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Fecha</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className={`w-full mt-1 p-3 rounded-xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}
            />
          </div>
          <button onClick={handleSave} className="w-full py-3.5 bg-pink-brand text-white rounded-xl font-bold text-lg active:scale-95 transition-transform">
            Registrar
          </button>
        </div>
      </Modal>
    </div>
  )
}
