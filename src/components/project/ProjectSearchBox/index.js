import SearchBar from '@/components/layout/dashboard/SearchBar'

const ModuleSearchBox = (props) => {
  return (
    <div className="w-full">
      <SearchBar placeholder="プロジェクト名・説明" {...props} />
    </div>
  )
}

export default ModuleSearchBox
