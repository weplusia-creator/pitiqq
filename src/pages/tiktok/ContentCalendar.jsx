import { useContext, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { AppContext } from '../../App'
import { IDEA_STATES, haptic } from '../../utils/helpers'

export default function ContentCalendar() {
  const { ideas, darkMode } = useContext(AppContext)
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const monthName = currentDate.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })

  const ideasByDate = useMemo(() => {
    const map = {}
    ideas.forEach(idea => {
      if (idea.publishDate) {
        const key = idea.publishDate
        if (!map[key]) map[key] = []
        map[key].push(idea)
      }
    })
    return map
  }, [ideas])

  const [selectedDate, setSelectedDate] = useState(null)

  const prevMonth = () => setCurrentDate(new Date(year, month - 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1))

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const card = `rounded-2xl p-4 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`

  const days = []
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
    days.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d)
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <h1 className="text-xl font-bold">Calendario</h1>

      {/* Month nav */}
      <div className={card}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2"><ChevronLeft size={20} /></button>
          <h2 className="font-semibold capitalize">{monthName}</h2>
          <button onClick={nextMonth} className="p-2"><ChevronRight size={20} /></button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map(d => (
            <div key={d} className={`text-center text-xs font-medium ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const dayIdeas = ideasByDate[dateStr] || []
            const isToday = dateStr === todayStr
            const isSelected = selectedDate === dateStr

            return (
              <button
                key={i}
                onClick={() => { haptic(); setSelectedDate(isSelected ? null : dateStr) }}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${
                  isSelected
                    ? 'bg-pink-brand text-white'
                    : isToday
                      ? darkMode ? 'bg-neutral-800 ring-1 ring-pink-brand' : 'bg-pink-50 ring-1 ring-pink-brand'
                      : ''
                }`}
              >
                <span className="text-sm">{day}</span>
                {dayIdeas.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayIdeas.slice(0, 3).map((_, j) => (
                      <div key={j} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-pink-brand'}`} />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected date ideas */}
      {selectedDate && (
        <div className="animate-fade-in space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h3>
          </div>

          {(ideasByDate[selectedDate] || []).length === 0 ? (
            <p className={`text-sm ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
              No hay contenido programado
            </p>
          ) : (
            (ideasByDate[selectedDate] || []).map(idea => {
              const state = IDEA_STATES.find(s => s.id === idea.state)
              return (
                <div
                  key={idea.id}
                  onClick={() => navigate(`/ideas/${idea.id}`)}
                  className={`${card} cursor-pointer active:scale-[0.98] transition-transform`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{idea.title}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: state?.color + '20', color: state?.color }}>
                      {state?.label}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
