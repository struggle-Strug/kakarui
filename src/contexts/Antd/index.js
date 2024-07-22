import { ConfigProvider } from 'antd'
import localeJP from 'antd/locale/ja_JP'

import { configTheme } from '@/configs/theme'

import StyledComponentsRegistry from '@/libs/antd-registry'

export default function AntdProvider({ children }) {
  return (
    <ConfigProvider locale={localeJP} theme={configTheme}>
      <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
    </ConfigProvider>
  )
}
