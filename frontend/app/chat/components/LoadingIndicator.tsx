export function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
        </div>
      </div>
    </div>
  )
}
