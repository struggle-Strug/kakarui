import Head from 'next/head'

const HeadNext = ({ title, description, url, image, render }) => {
  return (
    <Head>
      <title>{title}</title>

      {description && <meta name="description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      {render?.()}
    </Head>
  )
}

export default HeadNext
