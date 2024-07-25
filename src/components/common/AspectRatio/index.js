/**
 * This component creates a figure with an aspect ratio based on the provided ratio prop.
 * It uses padding-bottom to achieve the desired aspect ratio.
 *
 * @param {number} ratio - The desired aspect ratio (width / height).
 * @param {ReactNode} children - The content to be displayed within the aspect ratio container.
 * @param {string} maxWidth - The maximum width of the aspect ratio container. Defaults to '100%'.
 *
 * @returns {ReactElement} A figure element with the specified aspect ratio.
 */

const AspectRatio = ({ ratio, children, maxWidth = '100%' }) => {
  const paddingBottom = `${(1 / ratio) * 100}%`

  return (
    <figure className="relative w-full" style={{ width: maxWidth }}>
      <div className="relative h-0 w-full" style={{ paddingBottom }}>
        <div className="absolute inset-0 h-full w-full">
          <div className="relative h-full w-full overflow-hidden">{children}</div>
        </div>
      </div>
    </figure>
  )
}

export default AspectRatio
