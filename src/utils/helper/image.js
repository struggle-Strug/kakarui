export function getURL(file) {
  return new Promise((resolve, reject) => {
    try {
      URL.revokeObjectURL(file)
      const url = URL.createObjectURL(file)
      resolve(url)
    } catch (error) {
      reject(error)
    }
  })
}

async function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })
}

export async function getURLOrBase64(file, isURLResponse = false) {
  if (isURLResponse) {
    try {
      return getURL(file)
    } catch {
      return getBase64(file)
    }
  }

  return getBase64(file)
}

export const getUrlFromUploadResponse = async (response, file) => {
  const { uploaded, url: link } = response || {}
  const url = uploaded ? link : await getURLOrBase64(file, true)
  return url
}

export function imageSize(file) {
  if (file) {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    const promise = new Promise((resolve, reject) => {
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight })
        URL.revokeObjectURL(objectUrl)
      }
      img.onerror = reject
    })
    img.src = objectUrl
    return promise
  }
  return undefined
}

export const checkAspectRatio = (file, desiredAspectRatio) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const image = new Image()
      image.src = event.target.result

      image.onload = () => {
        const { width, height } = image || {}
        const aspectRatio = width / height

        // Compare the calculated aspect ratio with the desired aspect ratio
        if (Math.abs(aspectRatio - desiredAspectRatio) > 0.01) {
          // The aspect ratio is approximately equal to the desired aspect ratio
          resolve(false)
        } else {
          // The aspect ratio does not match the desired aspect ratio
          resolve(true)
        }
      }
    }

    reader.onerror = () => {
      reject(new Error('Error reading the image file.'))
    }

    reader.readAsDataURL(file)
  })
}

export function base64ToImageUrl(base64String) {
  try {
    const byteCharacters = atob(base64String)
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i += 1) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'image/png' })

    return URL.createObjectURL(blob)
  } catch {
    return ''
  }
}
