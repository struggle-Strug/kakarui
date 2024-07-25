import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Children, cloneElement } from 'react'

import { MenuIcon } from '@/components/icons'

const RowSort = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
  } = useSortable({
    id: props?.['data-row-key'],
  })

  const style = {
    ...props?.style,
    transform: CSS.Transform.toString(
      transform && {
        ...transform,
        scaleY: 1,
      }
    ),
    transition,
    cursor: 'move',
    ...(isDragging
      ? {
          position: 'relative',
          zIndex: 9999,
        }
      : {}),
  }

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {Children.map(props?.children, (child) => {
        if (child?.key === 'sort') {
          return cloneElement(child, {
            children: (
              <MenuIcon
                ref={setActivatorNodeRef}
                style={{ touchAction: 'none', cursor: 'move' }}
                {...listeners}
              />
            ),
          })
        }
        return child
      })}
    </tr>
  )
}

export default RowSort
