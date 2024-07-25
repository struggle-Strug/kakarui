import { Typography } from 'antd'

import { cn } from '@/utils/helper/functions'

const { Title } = Typography

const HeaderTitle = ({ title, children, level = 3, className = '' }) => {
  return (
    <Title level={level} className={cn(className)}>
      {title || children}
    </Title>
  )
}

export default HeaderTitle
