import {
  GraduationCap,
  Lightbulb,
  Trophy,
  StickyNote,
  Link,
  Bookmark,
  X,
} from 'lucide-react'
import { ENTRY_TYPE_CONFIGS } from '@/types'
import type { EntryType } from '@/types'
import { useEntryStore } from '@/store/useEntryStore'

const iconComponents: Record<string, typeof GraduationCap> = {
  GraduationCap,
  Lightbulb,
  Trophy,
  StickyNote,
  Link,
  Bookmark,
}

const bgColors: Record<EntryType, string> = {
  lesson: 'hover:bg-purple-50 hover:border-purple-200',
  idea: 'hover:bg-amber-50 hover:border-amber-200',
  milestone: 'hover:bg-green-50 hover:border-green-200',
  note: 'hover:bg-slate-50 hover:border-slate-200',
  resource: 'hover:bg-blue-50 hover:border-blue-200',
  bookmark: 'hover:bg-pink-50 hover:border-pink-200',
}

const iconColors: Record<EntryType, string> = {
  lesson: 'text-purple-500',
  idea: 'text-amber-500',
  milestone: 'text-green-500',
  note: 'text-slate-500',
  resource: 'text-blue-500',
  bookmark: 'text-pink-500',
}

export function EntryTypeSelector() {
  const { isTypeSelectorOpen, closeTypeSelector, openNewModal } = useEntryStore()
  const types = Object.values(ENTRY_TYPE_CONFIGS)

  if (!isTypeSelectorOpen) return null

  const handleSelect = (type: EntryType) => {
    openNewModal(type)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={closeTypeSelector}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      {/* Content */}
      <div
        className="relative bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-4 md:p-6 w-full max-w-lg mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Wat wil je toevoegen?
          </h2>
          <button
            onClick={closeTypeSelector}
            className="touch-target p-1.5 rounded-lg text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            aria-label="Sluiten"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {types.map((config) => {
            const Icon = iconComponents[config.icon] || StickyNote
            return (
              <button
                key={config.type}
                onClick={() => handleSelect(config.type)}
                className={`
                  touch-target flex items-start gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700
                  text-left transition-all cursor-pointer
                  ${bgColors[config.type]}
                `}
              >
                <div className={`mt-0.5 ${iconColors[config.type]}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-medium text-sm text-neutral-900 dark:text-neutral-100">{config.label}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{config.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
