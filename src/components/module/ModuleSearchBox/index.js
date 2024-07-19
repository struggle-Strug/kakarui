import { SearchBar } from '@/components/layout/dashboard'

const ModuleSearchBox = (props) => {
  return (
    <div className="w-full">
      <SearchBar placeholder="モジュールセット名・説明" {...props} />
    </div>
  )
}

export default ModuleSearchBox
