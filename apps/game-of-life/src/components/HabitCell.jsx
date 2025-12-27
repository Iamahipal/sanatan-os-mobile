import { Check } from 'lucide-react'

/**
 * HabitCell - Single toggleable cell in the grid
 */
export default function HabitCell({ completed, onClick, isToday }) {
    return (
        <div
            onClick={onClick}
            className={`habit-cell ${completed ? 'completed' : ''} ${isToday ? 'ring-2 ring-green-400 ring-inset' : ''}`}
        >
            {completed && <Check size={16} />}
        </div>
    )
}
