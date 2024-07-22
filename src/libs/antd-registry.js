/* eslint-disable react/no-danger */

/* eslint-disable consistent-return */
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs/lib'

import { useServerInsertedHTML } from 'next/navigation'
import { useMemo, useRef } from 'react'

const StyledComponentsRegistry = ({ children }) => {
  const cache = useMemo(() => createCache(), [])
  const isServerInserted = useRef(false)

  useServerInsertedHTML(() => {
    // avoid duplicate css insert
    if (isServerInserted.current) {
      return
    }
    isServerInserted.current = true
    return <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
  })

  return <StyleProvider cache={cache}>{children}</StyleProvider>
}

export default StyledComponentsRegistry
