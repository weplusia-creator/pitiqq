import { useContext, useState } from 'react'
import { Lock } from 'lucide-react'
import { AppContext } from '../App'
import { haptic } from '../utils/helpers'

const users = [
  { id: 'mateo', name: 'Mateo', emoji: '👨‍💻', color: '#3b82f6', hash: '3c549bb21982e648d921ae6dd4fe920791b61f4f1d169fd3e9f7e16e0a446ecb' },
  { id: 'lucre', name: 'Lucre', emoji: '👩‍💼', color: '#ec4899', hash: 'db29bb135d574a79da6d8c1ce3a6f5b2eec3694b5ca2db9e1c9e028a2813f0d1' },
]

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function UserSelect() {
  const { setCurrentUser } = useContext(AppContext)
  const [selectedUser, setSelectedUser] = useState(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSelect = (user) => {
    haptic()
    setSelectedUser(user)
    setPassword('')
    setError(false)
  }

  const handleLogin = async () => {
    if (!password) return
    setLoading(true)
    setError(false)
    const hashed = await sha256(password)
    if (hashed === selectedUser.hash) {
      haptic('success')
      setCurrentUser(selectedUser.id)
    } else {
      haptic('error')
      setError(true)
      setPassword('')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-black text-pink-brand mb-2">Pitiqq</h1>

      {!selectedUser ? (
        <>
          <p className="text-neutral-500 text-sm mb-12">Quién sos?</p>
          <div className="flex gap-6">
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => handleSelect(user)}
                className="flex flex-col items-center gap-3 active:scale-95 transition-transform"
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
                  style={{ backgroundColor: user.color + '20', border: `3px solid ${user.color}` }}
                >
                  {user.emoji}
                </div>
                <span className="text-lg font-bold">{user.name}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="w-full max-w-xs animate-fade-in">
          <button
            onClick={() => setSelectedUser(null)}
            className="text-neutral-500 text-sm mb-6 block mx-auto"
          >
            ← Cambiar usuario
          </button>

          <div className="flex flex-col items-center mb-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-3"
              style={{ backgroundColor: selectedUser.color + '20', border: `3px solid ${selectedUser.color}` }}
            >
              {selectedUser.emoji}
            </div>
            <span className="text-lg font-bold">{selectedUser.name}</span>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(false) }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="Contraseña"
                autoFocus
                className={`w-full p-3 pl-10 rounded-xl bg-neutral-800 text-white outline-none ${
                  error ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-pink-brand'
                }`}
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm text-center animate-fade-in">Contraseña incorrecta</p>
            )}
            <button
              onClick={handleLogin}
              disabled={loading || !password}
              className="w-full py-3.5 bg-pink-brand text-white rounded-xl font-bold text-lg active:scale-95 transition-transform disabled:opacity-50"
            >
              Entrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
