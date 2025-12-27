import { Trophy } from 'lucide-react'

/**
 * XPBar - Sticky top bar showing level progress
 * Shows current level, XP progress bar, and level name
 */
export default function XPBar({ currentXP, currentLevel, levelName, xpForNextLevel }) {
    const previousLevelXP = getLevelThreshold(currentLevel)
    const progress = ((currentXP - previousLevelXP) / (xpForNextLevel - previousLevelXP)) * 100

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[var(--gol-border)] shadow-sm">
            <div className="max-w-4xl mx-auto px-4 py-3">
                <div className="flex items-center gap-4">
                    {/* Level Badge */}
                    <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                        <Trophy size={16} className="text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                            Lv.{currentLevel} {levelName}
                        </span>
                    </div>

                    {/* XP Progress */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between text-xs text-[var(--gol-text-muted)] mb-1">
                            <span>{currentXP} XP</span>
                            <span>{xpForNextLevel} XP</span>
                        </div>
                        <div className="xp-bar">
                            <div
                                className="xp-bar-fill"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Level thresholds
function getLevelThreshold(level) {
    const thresholds = {
        1: 0,
        2: 100,
        3: 300,
        4: 600,
        5: 1000,
        6: 1500,
        7: 2100,
        8: 2800,
        9: 3600,
        10: 4500,
    }
    return thresholds[level] || 0
}
