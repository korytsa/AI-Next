import { ErrorCard } from './ErrorCard'
import { ErrorEntry } from '../hooks/useErrors'

interface ErrorsListProps {
  errors: ErrorEntry[]
  formatDate: (timestamp: number) => string
}

export function ErrorsList({ errors, formatDate }: ErrorsListProps) {
  return (
    <div className="space-y-4">
      {errors.map((error) => (
        <ErrorCard
          key={error.id}
          error={error}
          formatDate={formatDate}
        />
      ))}
    </div>
  )
}
