import { Layout } from 'antd'

import { forwardRef, useMemo } from 'react'

const Container = ({ title, helper, extra, children, className, style }, ref) => {
  const renderHelper = useMemo(
    () => (
      <span style={{ color: '#8A7774' }} className="ml-2.5 text-sm">
        {helper}
      </span>
    ),
    [helper]
  )

  return (
    <Layout ref={ref} {...{ style, className }}>
      <header className="mb-6 flex items-center justify-between">
        <div className="text-lg font-semibold text-dark-gray-3">
          {title}
          {helper ? renderHelper : null}
        </div>
        {extra}
      </header>

      <Layout.Content>{children}</Layout.Content>
    </Layout>
  )
}

export default forwardRef(Container)
