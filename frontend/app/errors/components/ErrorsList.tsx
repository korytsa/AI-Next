import { ErrorCard } from './ErrorCard'
import { ErrorEntry } from '../hooks/useErrors'

interface ErrorsListProps {
  errors: ErrorEntry[]
  formatDate: (timestamp: number) => string
  getTypeColor: (type: string) => string
}

export function ErrorsList({ errors, formatDate, getTypeColor }: ErrorsListProps) {
  return (
    <div className="space-y-4">
      {errors.map((error) => (
        <ErrorCard
          key={error.id}
          error={error}
          formatDate={formatDate}
          getTypeColor={getTypeColor}
        />
      ))}
    </div>
  )
}
