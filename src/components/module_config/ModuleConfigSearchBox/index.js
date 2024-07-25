import { SearchBar } from '@/components/layout/dashboard'

const ModuleConfigSearchBox = (props) => {
  return (
    <div className="w-full">
      <SearchBar placeholder="モジュール配置名・説明" {...props} />
    </div>
  )
}

export default ModuleConfigSearchBox
