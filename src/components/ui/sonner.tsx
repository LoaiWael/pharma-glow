import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      closeButton={false}
      icons={{
        success: <CircleCheckIcon className="size-5 text-secondary-600" />,
        info: <InfoIcon className="size-5 text-tertiary-500" />,
        warning: <TriangleAlertIcon className="size-5 text-amber-600" />,
        error: <OctagonXIcon className="size-5 text-rose-600" />,
        loading: <Loader2Icon className="size-5 animate-spin text-secondary-600" />,
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "1rem",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast rounded-2xl border shadow-lg font-ibm-plex-sans-arabic p-4 flex items-center gap-3 [&_[data-close-button]]:!hidden",
          closeButton: "!hidden",
          title: "text-sm font-semibold",
          description: "text-xs text-muted-foreground",
          success:
            "!bg-neutral !border-secondary-200 !text-secondary-900 [&_[data-icon]]:!text-secondary-600",
          info:
            "!bg-tertiary-50 !border-tertiary-200 !text-tertiary-900 [&_[data-icon]]:!text-tertiary-600",
          warning:
            "!bg-amber-50 !border-amber-200 !text-amber-900 [&_[data-icon]]:!text-amber-600",
          error:
            "!bg-rose-50 !border-rose-200 !text-rose-950 [&_[data-icon]]:!text-rose-600",
          loading:
            "!bg-primary-50 !border-primary-200 !text-primary-950 [&_[data-icon]]:!text-secondary-600",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
