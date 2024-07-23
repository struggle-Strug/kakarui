import { AutoComplete } from 'antd'
import toLower from 'lodash/toLower'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

import { useCallback, useDeferredValue, useEffect, useState } from 'react'

import { CloseCircleIcon, SearchIcon } from '@/components/icons'
import { Input } from '@/components/ui'

const SearchBar = ({ placeholder = '', options = [] }) => {
  const [search, setSearch] = useState('')
  const deferredQuery = useDeferredValue(search)
  const [optionList, setOptionList] = useState([])

  const [searchQuery, setSearchQuery] = useQueryStates({
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
  })

  const handleSubmit = (path) => {
    if (!path.trim()) return

    setSearchQuery({
      search: path.trim(),
      page: 1,
    })
  }

  const handleChange = useCallback(
    (keyword) => {
      if (!keyword) {
        setSearch('')
        setOptionList([])
      } else {
        setSearch(keyword)
        const lowerKeyword = toLower(keyword)
        const filterOption = options.filter((opt) => {
          const lowerValue = toLower(opt.value)
          return lowerValue.includes(lowerKeyword)
        })
        setOptionList(filterOption)
      }
    },
    [setSearch, options]
  )

  const handleClearSearch = () => {
    setSearch('')

    setSearchQuery({
      search: '',
      page: 1,
    })
  }

  useEffect(() => {
    if (!search?.trim() && searchQuery.search) {
      handleClearSearch()
    }
  }, [search, searchQuery.search])

  useEffect(() => {
    if (searchQuery.search && searchQuery.search?.length > 0) {
      setSearch(searchQuery.search)
    }
  }, [searchQuery])

  const onSelect = (value) => {
    handleSubmit(value)
    setSearch(value)
  }

  const handleKeyDown = (e) => {
    if (!e.target) {
      return
    }
    const inputText = deferredQuery

    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(inputText)
    }
  }

  return (
    <div className="search-bar relative flex h-[40px] w-full max-w-[368px] items-center overflow-hidden">
      <AutoComplete
        style={{
          width: 368,
          height: 40,
        }}
        allowClear={{
          clearIcon: <CloseCircleIcon color="#ccc" size={18} />,
        }}
        options={optionList}
        placeholder={placeholder || '入力してください。'}
        onChange={(val) => handleChange(val)}
        onClear={handleClearSearch}
        onSelect={onSelect}
      >
        <Input
          onKeyDown={handleKeyDown}
          className="h-[40px] w-full max-w-[368px] !pr-[75px]"
          placeholder=""
        />
      </AutoComplete>
      <div className="flex-center absolute right-0 top-0 h-[40px] hover:!bg-transparent">
        <div className="h-[40px] w-[0.5px] bg-primary" />
        <SearchIcon
          size={33}
          onClick={() => handleSubmit(deferredQuery)}
          className="mx-2 cursor-pointer"
        />
      </div>
    </div>
  )
}

export default SearchBar
