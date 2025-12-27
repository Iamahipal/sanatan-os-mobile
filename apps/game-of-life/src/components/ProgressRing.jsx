/**
 * ProgressRing - Circular progress indicator
 */
export default function ProgressRing({ percentage, size = 120, strokeWidth = 8 }) {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (percentage / 100) * circumference

    return (
        <svg width={size} height={size} className="progress-ring">
            {/* Background circle */}
            <circle
                stroke="#E5E7EB"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />
            {/* Progress circle */}
            <circle
                stroke="#22C55E"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                r={radius}
                cx={size / 2}
                cy={size / 2}
                style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: offset
                }}
            />
            {/* Center text */}
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-3xl font-bold fill-[var(--gol-text)]"
                style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
            >
                {percentage}%
            </text>
        </svg>
    )
}
