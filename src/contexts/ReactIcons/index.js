import { useMemo } from 'react'
import { IconContext } from 'react-icons'

// source: https://github.com/react-icons/react-icons

export default function ReactIconsProvider({ children }) {
  const value = useMemo(() => {
    return { className: 'react-icons', size: 24 }
  }, [])

  return <IconContext.Provider value={value}>{children}</IconContext.Provider>
}
