import dynamic from 'next/dynamic'
import { forwardRef } from 'react'
import 'react-quill/dist/quill.snow.css'

import { cn } from '@/utils/helper/functions'

// const DynamicReactQuill = dynamic(() => import('react-quill'), { ssr: false })

const DynamicReactQuill = dynamic(
  async () => {
    const ReactQuill = await import('react-quill')
    const { Quill } = ReactQuill.default

    const Block = Quill.import('blots/block')
    Block.tagName = 'div'
    Quill.register(Block)

    return ReactQuill
  },
  { ssr: false }
)

const getModules = (video) => ({
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', video && 'video'].filter(Boolean),
    ['clean'],
  ],
})

const FORMATS = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
  'code-block',
]

const STRING_EMPTY = '<div><br></div>'

const RichEditor = (
  { initialValue, onChange, value, quillClassName, video = false, disabled = false },
  ref
) => {
  const handleOnChange = (text) => {
    if (text === STRING_EMPTY) {
      onChange('')
      return
    }
    onChange(text)
  }

  return (
    <DynamicReactQuill
      ref={ref}
      theme="snow"
      value={value}
      className={cn(quillClassName, { disabled })}
      defaultValue={initialValue}
      onChange={handleOnChange}
      modules={getModules(video)}
      formats={FORMATS}
      readOnly={disabled}
    />
  )
}

export default forwardRef(RichEditor)
