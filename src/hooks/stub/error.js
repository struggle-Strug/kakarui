import { useEffect, useState } from 'react'

const errorMapping = {
  403: {
    error_code: 'E40301',
    message: 'Forbidden',
    description: 'Required permission for the resource are not exist.',
  },
  404: {
    error_code: 'E40401',
    message: 'Not Found',
    description: 'Resource not exist.',
  },
  500: {
    error_code: 'E50004',
    message: 'Validation Error',
    description: '{0} is empty.',
  },
  // add somethings....
}

const defaultError = {
  error_code: 'E50001',
  message: 'Internal Server Error',
  description: 'An unknown error occurred.',
}

/*
 // -- file: apiStub --
  if (điều kiện lỗi) {
    return Promise.reject({ statusCode: 500 })
  }

   // -- file: fetch data --
    const [moduleData, setModuleData] = useState(null)
    const errorData = useCommonErrorHandler(moduleData)

    moduleConfigApiStub.getModule().then(setModuleData).catch(setModuleData)

*/

export const useStubErrorHandler = (apiResponse) => {
  const [errorData, setErrorData] = useState(null)

  useEffect(() => {
    const statusCode = apiResponse?.status_code || apiResponse?.statusCode
    const isError = apiResponse?.error || statusCode >= 400

    if (isError) {
      const errorInfo = errorMapping[statusCode] || defaultError

      if (apiResponse?.error_code) {
        setErrorData({
          status_code: statusCode,
          error: true,
          error_code: errorInfo.error_code,
          message: errorInfo.message,
          description: errorInfo.description,
        })
      } else {
        setErrorData({
          statusCode,
          message: errorInfo.message,
        })
      }
    } else {
      setErrorData(null)
    }
  }, [apiResponse])

  return errorData
}
