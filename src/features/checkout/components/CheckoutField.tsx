import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type CheckoutFieldProps = {
  id: string
  label: string
  error?: string
  required?: boolean
  children: ReactNode
}

export const CheckoutField = ({ id, label, error, required, children }: CheckoutFieldProps) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium text-foreground">
      {label}
      {required ? <span className="ms-1 text-secondary">*</span> : null}
    </label>
    {children}
    {error ? (
      <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
        {error}
      </p>
    ) : null}
  </div>
)

export const checkoutControlClassName = (invalid?: boolean) =>
  cn(
    'h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none',
    'placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50',
    invalid && 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
  )
