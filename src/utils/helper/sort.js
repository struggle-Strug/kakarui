import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export function useSortableItem({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'move',
    ...(isDragging && {
      position: 'relative',
      zIndex: 9999,
    }),
  }

  return { style, attributes, listeners, setNodeRef }
}
