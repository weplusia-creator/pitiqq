import { useLocation, useNavigate } from 'react-router-dom'
import { Wallet, Lightbulb, Target, Heart, Settings } from 'lucide-react'
import { useContext } from 'react'
import { AppContext } from '../App'
import { haptic } from '../utils/helpers'

const tabs = [
  { path: '/', icon: Wallet, label: 'Finanzas', match: ['/', '/movements', '/goals', '/budget'] },
  { path: '/ideas', icon: Lightbulb, label: 'Ideas', match: ['/ideas', '/kanban', '/trends', '/stats', '/hashtags', '/calendar'] },
  { path: '/okr', icon: Target, label: 'OKR', match: ['/okr'] },
  { path: '/wedding', icon: Heart, label: 'Boda', match: ['/wedding'] },
  { path: '/settings', icon: Settings, label: 'Config', match: ['/settings'] },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { darkMode } = useContext(AppContext)

  const isActive = (tab) => tab.match.some(p =>
    p === '/' ? location.pathname === '/' : location.pathname.startsWith(p)
  )

  return (
    <nav className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-neutral-900/95 border-neutral-800' : 'bg-white/95 border-neutral-200'} border-t backdrop-blur-lg pb-safe z-50`}>
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map(tab => {
          const active = isActive(tab)
          return (
            <button
              key={tab.path}
              onClick={() => { haptic(); navigate(tab.path) }}
              className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${
                active ? 'text-pink-brand' : darkMode ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            >
              <tab.icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
