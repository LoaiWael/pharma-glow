import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'

type AccountFieldProps = {
  id: string
  label: string
  error?: string
  required?: boolean
  children: ReactNode
}

export const AccountField = ({ id, label, error, required, children }: AccountFieldProps) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-foreground">
      {label}
      {required ? <span className="ms-1 text-secondary">*</span> : null}
    </Label>
    {children}
    {error ? (
      <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
        {error}
      </p>
    ) : null}
  </div>
)
