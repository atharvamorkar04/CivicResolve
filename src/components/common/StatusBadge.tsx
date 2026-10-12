import React from 'react'

export type ComplaintStatusType =
  | 'Submitted'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected'
  | 'Pending'

interface StatusBadgeProps {
  status: ComplaintStatusType | string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const normalized = status.toLowerCase().replace(/[-_]/g, ' ')

  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200'
  let dotColor = 'bg-slate-400'

  if (normalized.includes('submit')) {
    badgeColor = 'bg-blue-50 text-blue-700 border-blue-200'
    dotColor = 'bg-blue-600'
  } else if (normalized.includes('assign')) {
    badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-200'
    dotColor = 'bg-indigo-600'
  } else if (normalized.includes('progress')) {
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200'
    dotColor = 'bg-amber-600'
  } else if (normalized.includes('resolve') || normalized.includes('complet')) {
    badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200'
    dotColor = 'bg-emerald-600'
  } else if (normalized.includes('reject')) {
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200'
    dotColor = 'bg-rose-600'
  } else if (normalized.includes('pending')) {
    badgeColor = 'bg-purple-50 text-purple-700 border-purple-200'
    dotColor = 'bg-purple-600'
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  }[size]

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${sizeClasses} ${badgeColor} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotColor}`} />
      <span className="capitalize">{status}</span>
    </span>
  )
}

export default StatusBadge
