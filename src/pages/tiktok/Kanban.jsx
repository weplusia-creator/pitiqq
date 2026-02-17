import { useContext, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AppContext } from '../../App'
import { IDEA_STATES, PRIORITY_LEVELS, haptic } from '../../utils/helpers'

export default function Kanban() {
  const { ideas, setIdeas, darkMode } = useContext(AppContext)
  const navigate = useNavigate()
  const scrollRef = useRef(null)

  const changeState = (ideaId, newState) => {
    haptic('medium')
    setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, state: newState } : i))
  }

  return (
    <div className="py-4 space-y-4">
      <div className="px-4 flex items-center gap-3">
        <button onClick={() => navigate('/ideas')} className="text-pink-brand">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Kanban</h1>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-4 pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {IDEA_STATES.map(state => {
          const stateIdeas = ideas.filter(i => i.state === state.id)
          return (
            <div
              key={state.id}
              className={`shrink-0 w-[75vw] max-w-xs snap-center rounded-2xl p-3 ${
                darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: state.color }} />
                <h3 className="font-semibold text-sm">{state.label}</h3>
                <span className={`text-xs ml-auto ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  {stateIdeas.length}
                </span>
              </div>

              <div className="space-y-2 min-h-[200px]">
                {stateIdeas.map(idea => {
                  const priority = PRIORITY_LEVELS.find(p => p.id === idea.priority)
                  const stateIndex = IDEA_STATES.findIndex(s => s.id === idea.state)
                  const nextState = IDEA_STATES[stateIndex + 1]
                  const prevState = IDEA_STATES[stateIndex - 1]

                  return (
                    <div
                      key={idea.id}
                      className={`rounded-xl p-3 ${darkMode ? 'bg-neutral-800' : 'bg-neutral-50'}`}
                    >
                      <div className="flex items-start justify-between">
                        <p
                          className="font-medium text-sm cursor-pointer flex-1"
                          onClick={() => navigate(`/ideas/${idea.id}`)}
                        >
                          {idea.title}
                        </p>
                        <div className="w-2 h-2 rounded-full mt-1 ml-2 shrink-0" style={{ backgroundColor: priority?.color }} />
                      </div>

                      <div className="flex gap-1 mt-2">
                        {prevState && (
                          <button
                            onClick={() => changeState(idea.id, prevState.id)}
                            className={`text-xs px-2 py-1 rounded-lg ${darkMode ? 'bg-neutral-700 text-neutral-300' : 'bg-neutral-200 text-neutral-600'}`}
                          >
                            ← {prevState.label}
                          </button>
                        )}
                        {nextState && (
                          <button
                            onClick={() => changeState(idea.id, nextState.id)}
                            className="text-xs px-2 py-1 rounded-lg text-white ml-auto"
                            style={{ backgroundColor: nextState.color }}
                          >
                            {nextState.label} →
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}

                {stateIdeas.length === 0 && (
                  <p className={`text-center py-8 text-xs ${darkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    Vacío
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
