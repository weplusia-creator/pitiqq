import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, createContext } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import Layout from './components/Layout'
import UserSelect from './pages/UserSelect'
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
import OKRList from './pages/okr/OKRList'
import OKRDetail from './pages/okr/OKRDetail'
import Wedding from './pages/wedding/Wedding'
import Tasks from './pages/Tasks'
import Settings from './pages/Settings'

export const AppContext = createContext()

function App() {
  const [currentUser, setCurrentUser] = useLocalStorage('pitiqq_current_user', null)

  // Finance data is per-user (keyed by user name)
  const [movementsMateo, setMovementsMateo] = useLocalStorage('pitiqq_movements_mateo', [])
  const [goalsMateo, setGoalsMateo] = useLocalStorage('pitiqq_goals_mateo', [])
  const [budgetsMateo, setBudgetsMateo] = useLocalStorage('pitiqq_budgets_mateo', [])

  const [movementsLucre, setMovementsLucre] = useLocalStorage('pitiqq_movements_lucre', [])
  const [goalsLucre, setGoalsLucre] = useLocalStorage('pitiqq_goals_lucre', [])
  const [budgetsLucre, setBudgetsLucre] = useLocalStorage('pitiqq_budgets_lucre', [])

  // Per-user tasks
  const [tasksMateo, setTasksMateo] = useLocalStorage('pitiqq_tasks_mateo', [])
  const [tasksLucre, setTasksLucre] = useLocalStorage('pitiqq_tasks_lucre', [])

  // Shared data
  const [ideas, setIdeas] = useLocalStorage('pitiqq_ideas', [])
  const [trends, setTrends] = useLocalStorage('pitiqq_trends', [])
  const [videoStats, setVideoStats] = useLocalStorage('pitiqq_video_stats', [])
  const [hashtags, setHashtags] = useLocalStorage('pitiqq_hashtags', [])
  const [okrs, setOkrs] = useLocalStorage('pitiqq_okrs', [])
  const [weddingTasks, setWeddingTasks] = useLocalStorage('pitiqq_wedding_tasks', [])
  const [weddingGuests, setWeddingGuests] = useLocalStorage('pitiqq_wedding_guests', [])
  const [darkMode, setDarkMode] = useLocalStorage('pitiqq_dark_mode', true)

  // Select the right finance data based on current user
  const isMateo = currentUser === 'mateo'
  const movements = isMateo ? movementsMateo : movementsLucre
  const setMovements = isMateo ? setMovementsMateo : setMovementsLucre
  const goals = isMateo ? goalsMateo : goalsLucre
  const setGoals = isMateo ? setGoalsMateo : setGoalsLucre
  const budgets = isMateo ? budgetsMateo : budgetsLucre
  const setBudgets = isMateo ? setBudgetsMateo : setBudgetsLucre
  const userTasks = isMateo ? tasksMateo : tasksLucre
  const setUserTasks = isMateo ? setTasksMateo : setTasksLucre

  const ctx = {
    currentUser, setCurrentUser,
    movements, setMovements,
    goals, setGoals,
    budgets, setBudgets,
    userTasks, setUserTasks,
    ideas, setIdeas,
    trends, setTrends,
    videoStats, setVideoStats,
    hashtags, setHashtags,
    okrs, setOkrs,
    weddingTasks, setWeddingTasks,
    weddingGuests, setWeddingGuests,
    darkMode, setDarkMode,
  }

  // Show user selection if no user is selected
  if (!currentUser) {
    return (
      <AppContext.Provider value={ctx}>
        <UserSelect />
      </AppContext.Provider>
    )
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
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/ideas" element={<IdeasBank />} />
              <Route path="/ideas/:id" element={<IdeaDetail />} />
              <Route path="/kanban" element={<Kanban />} />
              <Route path="/calendar" element={<ContentCalendar />} />
              <Route path="/trends" element={<Trends />} />
              <Route path="/stats" element={<VideoStats />} />
              <Route path="/hashtags" element={<Hashtags />} />
              <Route path="/okr" element={<OKRList />} />
              <Route path="/okr/:id" element={<OKRDetail />} />
              <Route path="/wedding" element={<Wedding />} />
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
