import { SearchBar } from '@/components/layout/dashboard'

const ModuleSetSearchBox = (props) => {
  return (
    <div className="w-full">
      <SearchBar placeholder="モジュールセット名・説明" {...props} />
    </div>
  )
}

export default ModuleSetSearchBox
