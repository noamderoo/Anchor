import { useAppStore } from '@/store/useAppStore'

export function MainArea() {
  const { currentView } = useAppStore()

  return (
    <main className="flex-1 flex overflow-hidden">
      {/* Left: Timeline / View area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl">
          {/* View placeholder */}
          <div className="flex items-center justify-center h-64 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/50">
            <div className="text-center">
              <p className="text-neutral-400 text-sm font-medium uppercase tracking-wide">
                {currentView} view
              </p>
              <p className="text-neutral-300 text-xs mt-1">
                Wordt gebouwd in fase {currentView === 'timeline' ? '3' : currentView === 'graph' ? '8' : '5'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Dashboard area */}
      <div className="w-80 border-l border-neutral-200 bg-neutral-50/50 overflow-y-auto p-6 hidden lg:block">
        {/* Latest entry placeholder */}
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
            Laatste entry
          </h2>
          <div className="rounded-xl border border-neutral-200 bg-white p-4 h-32 flex items-center justify-center">
            <p className="text-neutral-300 text-sm">Nog geen entries</p>
          </div>
        </section>

        {/* Stats placeholder */}
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
            Stats
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-neutral-200 bg-white p-3 text-center">
              <p className="text-2xl font-semibold text-neutral-900">0</p>
              <p className="text-xs text-neutral-400 mt-0.5">Deze maand</p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-3 text-center">
              <p className="text-2xl font-semibold text-neutral-900">0</p>
              <p className="text-xs text-neutral-400 mt-0.5">Bookmarks</p>
            </div>
          </div>
        </section>

        {/* Quick actions placeholder */}
        <section>
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
            Quick actions
          </h2>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-500 hover:bg-white hover:text-neutral-700 border border-transparent hover:border-neutral-200 transition-colors cursor-pointer">
              + Nieuwe entry
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
