import { useContext } from 'react'
import { AppContext } from '../App'
import { haptic } from '../utils/helpers'

const users = [
  { id: 'mateo', name: 'Mateo', emoji: '👨‍💻', color: '#3b82f6' },
  { id: 'lucre', name: 'Lucre', emoji: '👩‍💼', color: '#ec4899' },
]

export default function UserSelect() {
  const { setCurrentUser } = useContext(AppContext)

  const handleSelect = (userId) => {
    haptic('medium')
    setCurrentUser(userId)
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-black text-pink-brand mb-2">Pitiqq</h1>
      <p className="text-neutral-500 text-sm mb-12">Quién sos?</p>

      <div className="flex gap-6">
        {users.map(user => (
          <button
            key={user.id}
            onClick={() => handleSelect(user.id)}
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
    </div>
  )
}
