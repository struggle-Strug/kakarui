import { useEffect, useState } from 'react'

export function useSelectBodyOverflow(isBlockBody = true) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isBlockBody) {
      document.body.style.overflow = isOpen ? 'hidden' : 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isBlockBody, isOpen])

  const onDropdownVisibleChange = (open) => {
    setIsOpen(open)
  }

  return { onDropdownVisibleChange }
}
