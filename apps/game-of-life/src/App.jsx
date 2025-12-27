import { useState } from 'react'
import { Trophy, Calendar, Target, Plus } from 'lucide-react'
import { useAuth } from './hooks/useAuth'
import XPBar from './components/XPBar'
import HabitGrid from './components/HabitGrid'
import DailyDashboard from './components/DailyDashboard'
import LoginScreen from './components/LoginScreen'
import './index.css'

// Mock data for initial development
const MOCK_HABITS = [
  { id: '1', name: 'Exercise', icon: 'dumbbell', color: 'green' },
  { id: '2', name: 'Reading', icon: 'book', color: 'blue' },
  { id: '3', name: 'Meditation', icon: 'brain', color: 'purple' },
  { id: '4', name: 'Water', icon: 'droplet', color: 'cyan' },
]

const MOCK_XP = {
  currentXP: 340,
  currentLevel: 3,
  levelName: 'Warrior',
  xpForNextLevel: 600,
}

function App() {
  const { user, loading, signIn, signOut } = useAuth()
  const [isGuest, setIsGuest] = useState(() => {
    return localStorage.getItem('gol_guest_mode') === 'true'
  })
  const [view, setView] = useState('grid') // 'grid' or 'dashboard'
  const [habits] = useState(MOCK_HABITS)
  const [xp] = useState(MOCK_XP)

  // Handle guest mode
  const handleGuest = () => {
    localStorage.setItem('gol_guest_mode', 'true')
    setIsGuest(true)
  }

  const handleSignOut = () => {
    localStorage.removeItem('gol_guest_mode')
    setIsGuest(false)
    signOut()
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--gol-bg)]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    )
  }

  // Show login screen if not authenticated and not in guest mode
  if (!user && !isGuest) {
    return <LoginScreen onSignIn={signIn} onGuest={handleGuest} />
  }

  return (
    <div className="min-h-screen bg-[var(--gol-bg)]">
      {/* Sticky XP Bar */}
      <XPBar
        currentXP={xp.currentXP}
        currentLevel={xp.currentLevel}
        levelName={xp.levelName}
        xpForNextLevel={xp.xpForNextLevel}
      />

      {/* View Toggle */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[var(--gol-text)]">
            Game of Life
          </h1>

          <div className="flex gap-2">
            <button
              onClick={() => setView('dashboard')}
              className={`p-2 rounded-lg transition-colors ${view === 'dashboard'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Target size={20} />
            </button>
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-colors ${view === 'grid'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Calendar size={20} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        {view === 'grid' ? (
          <HabitGrid habits={habits} />
        ) : (
          <DailyDashboard habits={habits} />
        )}

        {/* Add Habit FAB */}
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center">
          <Plus size={24} />
        </button>
      </div>

      {/* User Menu */}
      <div className="fixed top-4 right-4">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow text-sm text-gray-600 hover:bg-gray-50"
        >
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
              G
            </div>
          )}
          {isGuest ? 'Exit Guest Mode' : 'Sign Out'}
        </button>
      </div>
    </div>
  )
}

export default App
