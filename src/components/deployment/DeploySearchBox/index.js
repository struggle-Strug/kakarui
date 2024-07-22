import { SearchBar } from '@/components/layout/dashboard'

const DeploySearchBox = (props) => {
  return (
    <div className="w-full">
      <SearchBar placeholder="モジュール配置名" {...props} />
    </div>
  )
}

export default DeploySearchBox
