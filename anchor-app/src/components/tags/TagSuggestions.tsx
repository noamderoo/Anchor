import { Sparkles, X, Loader2 } from 'lucide-react'
import type { TagSuggestion } from '@/lib/ai/tagSuggestions'

interface TagSuggestionsProps {
  suggestions: TagSuggestion[]
  isLoading: boolean
  onAccept: (tagName: string) => void
  onDismiss: (tagName: string) => void
  onDismissAll: () => void
}

export function TagSuggestions({
  suggestions,
  isLoading,
  onAccept,
  onDismiss,
  onDismissAll,
}: TagSuggestionsProps) {
  // Don't render anything if no suggestions and not loading
  if (!isLoading && suggestions.length === 0) return null

  return (
    <div className="mt-2 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          {isLoading ? (
            <Loader2 size={12} className="text-violet-400 animate-spin" />
          ) : (
            <Sparkles size={12} className="text-violet-400" />
          )}
          <span className="text-[11px] font-medium text-violet-400 uppercase tracking-wider">
            {isLoading ? 'Suggesties laden...' : 'AI Suggesties'}
          </span>
        </div>

        {suggestions.length > 0 && (
          <button
            onClick={onDismissAll}
            className="text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
          >
            Alles negeren
          </button>
        )}
      </div>

      {/* Suggestion pills */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.name}
              className="group flex items-center gap-1 bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-800/50 text-violet-700 dark:text-violet-300 rounded-full pl-2.5 pr-1 py-1 text-xs transition-all hover:bg-violet-100 dark:hover:bg-violet-900/40 hover:border-violet-200 dark:hover:border-violet-700"
            >
              <button
                onClick={() => onAccept(suggestion.name)}
                className="cursor-pointer hover:text-violet-900 transition-colors"
                title={`"${suggestion.name}" toevoegen`}
              >
                {suggestion.name}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDismiss(suggestion.name)
                }}
                className="p-0.5 rounded-full text-violet-300 hover:text-violet-600 hover:bg-violet-200/50 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                title="Negeren"
                aria-label={`Suggestie "${suggestion.name}" negeren`}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
