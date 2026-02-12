import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useToastStore } from '@/store/useToastStore'
import type { ToastType } from '@/types'

const iconMap: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const colorMap: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

const iconColorMap: Record<ToastType, string> = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm"
      aria-live="polite"
      aria-label="Notificaties"
    >
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type]
        return (
          <div
            key={toast.id}
            className={`
              flex items-start gap-3 px-4 py-3 rounded-lg border shadow-md
              animate-slide-in-up
              ${colorMap[toast.type]}
            `}
            role="alert"
          >
            <Icon size={18} className={`shrink-0 mt-0.5 ${iconColorMap[toast.type]}`} />
            <p className="text-sm flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-0.5 rounded hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Sluiten"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
