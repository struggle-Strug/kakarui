import NextJSProgress from 'nextjs-progressbar'

const Progressbar = () => {
  return (
    <NextJSProgress
      color="var(--white)"
      startPosition={0.3}
      stopDelayMs={200}
      showOnShallow
      height={2}
    />
  )
}

export default Progressbar
