import { SearchBar } from '@/components/layout/dashboard'

const UserSearchBox = (props) => {
  return (
    <div className="w-full">
      <SearchBar placeholder="会社名・氏名・メールアドレス" {...props} />
    </div>
  )
}

export default UserSearchBox
