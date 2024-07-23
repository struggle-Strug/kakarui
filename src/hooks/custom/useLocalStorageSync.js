// Source: https://usehooks.com/useLocalStorage
import { useEffect, useState } from 'react'

import projectApiStub from '../stub/project'

export function useLocalStorageSync(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // If error also return initialValue
      return initialValue
    }
  })
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
    }
  }
  useEffect(() => {
    let interval
    if (typeof window !== 'undefined' && window.localStorage) {
      interval = setInterval(() => {
        try {
          // Get from local storage by key
          const item = window.localStorage.getItem(key)
          // Parse stored json or if none return initialValue
          const newValue = item ? JSON.parse(item) : initialValue
          if (newValue !== storedValue) {
            setStoredValue(newValue)
          }
        } catch (error) {
          // If error also return initialValue
          window.localStorage.clear(key)
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  })
  return [storedValue, setValue]
}

export const useLocalStorageDefaultProject = () => {
  const [defaultProject, setDefaultProject] = useLocalStorageSync('defaultProject')
  const [projectName, setProjectName] = useState()

  const handleRefresh = () => {
    if (defaultProject) {
      projectApiStub
        .getProjects(undefined, undefined, undefined, defaultProject)
        .then((projects) => {
          setProjectName(projects?.[0]?.name || 'プロト1.5')
        })
    } else {
      projectApiStub.getProjects().then((projects) => {
        setDefaultProject(projects?.[0]?.id)
        setProjectName(projects?.[0]?.name || 'プロト1.5')
      })
    }
  }

  useEffect(() => {
    handleRefresh()
  }, [defaultProject])
  return [defaultProject, setDefaultProject, { projectName }, handleRefresh]
}
