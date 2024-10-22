import DOMPurify from 'isomorphic-dompurify'

const HTMLParser = ({ wrapperClassName, className, content, el = 'div' }) => {
  const Component = el

  return (
    <div className={wrapperClassName}>
      <Component
        className={className}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content, { ADD_TAGS: ['iframe'] }) }}
      />
      <p className="clear-both" />
    </div>
  )
}

export default HTMLParser
