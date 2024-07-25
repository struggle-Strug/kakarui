import { Layout } from 'antd'

import { forwardRef } from 'react'

import HeadNext from '@/components/common/HeadNext'

const Container = ({ meta = true, title, children, className, style }, ref) => {
  return (
    <>
      {!!meta && title ? <HeadNext title={title} {...meta} /> : null}

      <Layout ref={ref} {...{ style, className }}>
        <header className="mb-6 flex items-center justify-between">
          {title ? <div className="text-lg font-semibold text-dark-gray-3">{title}</div> : null}
        </header>
        <Layout.Content>{children}</Layout.Content>
      </Layout>
    </>
  )
}

export default forwardRef(Container)
