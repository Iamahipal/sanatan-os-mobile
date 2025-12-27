import { useState } from 'react'
import { Check } from 'lucide-react'
import HabitCell from './HabitCell'

/**
 * HabitGrid - Month view matrix
 * Rows = Habits, Columns = Days
 */
export default function HabitGrid({ habits }) {
    // Generate last 14 days for demo
    const days = generateDays(14)

    // Mock completion data (habit_id -> date -> completed)
    const [completions, setCompletions] = useState({})

    const toggleCell = (habitId, date) => {
        const key = `${habitId}-${date}`
        setCompletions(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
        // TODO: Sync to Supabase with optimistic update
    }

    const isCompleted = (habitId, date) => {
        return completions[`${habitId}-${date}`] || false
    }

    return (
        <div className="bg-white rounded-xl border border-[var(--gol-border)] overflow-hidden">
            {/* Header row with dates */}
            <div className="flex border-b border-[var(--gol-border)]">
                <div className="w-32 shrink-0 p-3 bg-gray-50 font-medium text-sm text-[var(--gol-text-muted)]">
                    Habits
                </div>
                {days.map(day => (
                    <div
                        key={day.date}
                        className="habit-cell bg-gray-50 text-xs text-center text-[var(--gol-text-muted)] font-medium flex-col"
                    >
                        <span>{day.dayName}</span>
                        <span className="text-[var(--gol-text)]">{day.dayNum}</span>
                    </div>
                ))}
            </div>

            {/* Habit rows */}
            {habits.map(habit => (
                <div key={habit.id} className="flex border-b border-[var(--gol-border)] last:border-b-0">
                    {/* Habit name */}
                    <div className="w-32 shrink-0 p-3 text-sm font-medium text-[var(--gol-text)] bg-white flex items-center">
                        {habit.name}
                    </div>

                    {/* Day cells */}
                    {days.map(day => (
                        <HabitCell
                            key={`${habit.id}-${day.date}`}
                            completed={isCompleted(habit.id, day.date)}
                            onClick={() => toggleCell(habit.id, day.date)}
                            isToday={day.isToday}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}

// Generate array of days
function generateDays(count) {
    const days = []
    const today = new Date()

    for (let i = count - 1; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)

        days.push({
            date: date.toISOString().split('T')[0],
            dayName: date.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2),
            dayNum: date.getDate(),
            isToday: i === 0
        })
    }

    return days
}
