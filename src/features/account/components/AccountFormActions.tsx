import { Pencil } from 'lucide-react'
import { motion } from 'motion/react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type AccountFormActionsProps = {
  isEditing: boolean
  isDirty: boolean
  isSaving: boolean
  editLabel: string
  cancelLabel: string
  saveLabel: string
  savingLabel: string
  onEdit: () => void
  onCancel: () => void
}

export const AccountFormActions = ({
  isEditing,
  isDirty,
  isSaving,
  editLabel,
  cancelLabel,
  saveLabel,
  savingLabel,
  onEdit,
  onCancel,
}: AccountFormActionsProps) => {
  if (!isEditing) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="button"
          variant="outline"
          onClick={onEdit}
          className="h-9 rounded-xl border-primary-200 bg-card px-3 text-secondary hover:bg-primary-50 hover:text-secondary"
        >
          <Pencil className="size-3.5" />
          {editLabel}
        </Button>
      </motion.div>
    )
  }

  const saveDisabled = isSaving || !isDirty

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        disabled={isSaving}
        onClick={onCancel}
        className="h-9 rounded-xl text-tertiary hover:bg-neutral hover:text-foreground"
      >
        {cancelLabel}
      </Button>
      <motion.button
        type="submit"
        disabled={saveDisabled}
        whileHover={{ scale: saveDisabled ? 1 : 1.02 }}
        whileTap={{ scale: saveDisabled ? 1 : 0.98 }}
        className={cn(buttonVariants({ variant: 'secondary' }), 'h-9 rounded-xl px-4 font-medium shadow-sm')}
      >
        {isSaving ? savingLabel : saveLabel}
      </motion.button>
    </div>
  )
}
