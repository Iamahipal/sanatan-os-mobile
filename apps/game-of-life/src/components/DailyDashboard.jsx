import { useState } from 'react'
import { Check } from 'lucide-react'
import ProgressRing from './ProgressRing'

/**
 * DailyDashboard - Today's focused view
 * Shows large progress ring and habit list for today
 */
export default function DailyDashboard({ habits }) {
    // Mock today's completions
    const [completions, setCompletions] = useState({
        '1': true,
        '2': false,
        '3': true,
        '4': false,
    })

    const completedCount = Object.values(completions).filter(Boolean).length
    const totalCount = habits.length
    const percentage = Math.round((completedCount / totalCount) * 100)

    const toggleHabit = (habitId) => {
        setCompletions(prev => ({
            ...prev,
            [habitId]: !prev[habitId]
        }))
    }

    return (
        <div className="space-y-6">
            {/* Progress Ring */}
            <div className="bg-white rounded-xl border border-[var(--gol-border)] p-8 flex flex-col items-center">
                <ProgressRing percentage={percentage} size={160} strokeWidth={12} />
                <h2 className="text-2xl font-semibold mt-4 text-[var(--gol-text)]">
                    {completedCount}/{totalCount} Complete
                </h2>
                <p className="text-[var(--gol-text-muted)]">
                    {percentage === 100 ? '🎉 Perfect day!' : 'Keep going!'}
                </p>
            </div>

            {/* Today's Habits */}
            <div className="bg-white rounded-xl border border-[var(--gol-border)] divide-y divide-[var(--gol-border)]">
                {habits.map(habit => (
                    <div
                        key={habit.id}
                        onClick={() => toggleHabit(habit.id)}
                        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${completions[habit.id]
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                            <Check size={18} />
                        </div>
                        <span className={`flex-1 font-medium ${completions[habit.id]
                                ? 'text-[var(--gol-text-muted)] line-through'
                                : 'text-[var(--gol-text)]'
                            }`}>
                            {habit.name}
                        </span>
                        <span className="text-xs text-green-600 font-medium">
                            +10 XP
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
