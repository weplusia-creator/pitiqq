import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-20 pt-safe">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
