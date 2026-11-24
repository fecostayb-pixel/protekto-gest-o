import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const counter = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (message, variant) => {
      const id = ++counter.current
      setToasts((prev) => [...prev, { id, message, variant }])
      setTimeout(() => dismiss(id), 3000)
    },
    [dismiss],
  )

  const toast = {
    success: (message) => push(message, 'success'),
    error: (message) => push(message, 'error'),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2.5 rounded-md border px-4 py-3 text-sm font-medium shadow-lg ${
              t.variant === 'error'
                ? 'border-destructive/20 bg-destructive/10 text-destructive'
                : 'border-green-200 bg-green-50 text-green-700'
            }`}
          >
            {t.variant === 'error' ? (
              <XCircle className="h-4 w-4 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            )}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
