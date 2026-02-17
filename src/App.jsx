import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, createContext } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import Layout from './components/Layout'
import Dashboard from './pages/finance/Dashboard'
import Movements from './pages/finance/Movements'
import SavingsGoals from './pages/finance/SavingsGoals'
import Budget from './pages/finance/Budget'
import IdeasBank from './pages/tiktok/IdeasBank'
import IdeaDetail from './pages/tiktok/IdeaDetail'
import Kanban from './pages/tiktok/Kanban'
import ContentCalendar from './pages/tiktok/ContentCalendar'
import Trends from './pages/tiktok/Trends'
import VideoStats from './pages/tiktok/VideoStats'
import Hashtags from './pages/tiktok/Hashtags'
import Settings from './pages/Settings'

export const AppContext = createContext()

function App() {
  const [movements, setMovements] = useLocalStorage('pitiqq_movements', [])
  const [goals, setGoals] = useLocalStorage('pitiqq_goals', [])
  const [budgets, setBudgets] = useLocalStorage('pitiqq_budgets', [])
  const [ideas, setIdeas] = useLocalStorage('pitiqq_ideas', [])
  const [trends, setTrends] = useLocalStorage('pitiqq_trends', [])
  const [videoStats, setVideoStats] = useLocalStorage('pitiqq_video_stats', [])
  const [hashtags, setHashtags] = useLocalStorage('pitiqq_hashtags', [])
  const [darkMode, setDarkMode] = useLocalStorage('pitiqq_dark_mode', true)

  const ctx = {
    movements, setMovements,
    goals, setGoals,
    budgets, setBudgets,
    ideas, setIdeas,
    trends, setTrends,
    videoStats, setVideoStats,
    hashtags, setHashtags,
    darkMode, setDarkMode,
  }

  return (
    <AppContext.Provider value={ctx}>
      <div className={darkMode ? '' : 'light'}>
        <div className={`min-h-screen ${darkMode ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-900'}`}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/movements" element={<Movements />} />
              <Route path="/goals" element={<SavingsGoals />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/ideas" element={<IdeasBank />} />
              <Route path="/ideas/:id" element={<IdeaDetail />} />
              <Route path="/kanban" element={<Kanban />} />
              <Route path="/calendar" element={<ContentCalendar />} />
              <Route path="/trends" element={<Trends />} />
              <Route path="/stats" element={<VideoStats />} />
              <Route path="/hashtags" element={<Hashtags />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </AppContext.Provider>
  )
}

export default App
