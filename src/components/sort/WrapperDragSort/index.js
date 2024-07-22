import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import noop from 'lodash/noop'

const WrapperDragSort = ({ children, ids, sortQueryData = noop, sortKey = 'ordering' }) => {
  const handleDragEnd = ({ active, over }) => {
    const sourceIndex = active?.data?.current?.sortable?.index
    const destinationIndex = over?.data?.current?.sortable?.index

    if (sourceIndex !== destinationIndex) {
      sortQueryData(sourceIndex, destinationIndex, sortKey)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  )

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}

export default WrapperDragSort
