/**
 * Yup EN Locale
 */
const mixed = {
  default: ({ label }) => `${label ? `${label} is not valid` : 'Invalid input'}`,
  required: ({ label }) => `${label ? `${label} is required` : 'Input is required'}`,
  oneOf: ({ label, values }) =>
    `${
      label
        ? `${label} must be one of the following: ${values}`
        : `Invalid input. Must be one of the following: ${values}`
    }`,
  notOneOf: ({ label, values }) =>
    `${
      label
        ? `${label} cannot be any of the following: ${values}`
        : `Invalid input. Cannot be any of the following: ${values}`
    }`,
  defined: ({ label }) => `${label ? `${label} is required` : 'Input is required'}`,
}

const string = {
  length: ({ label, length }) =>
    `${
      label
        ? `${label} must be ${length} characters long`
        : `Invalid input. Must be ${length} characters long`
    }`,
  min: ({ label, min }) =>
    `${
      label
        ? `${label} must be at least ${min} characters long`
        : `Invalid input. Must be at least ${min} characters long`
    }`,
  max: ({ label, max }) =>
    `${
      label
        ? `${label} must be at most ${max} characters long`
        : `Invalid input. Must be at most ${max} characters long`
    }`,
  matches: ({ label, regex }) =>
    `${
      label
        ? `${label} must match the following pattern: ${regex}`
        : `Invalid input. Must match the following pattern: ${regex}`
    }`,
  email: ({ label }) =>
    `${label ? `${label} must be a valid email address` : 'Invalid email address'}`,
  url: ({ label }) => `${label ? `${label} must be a valid URL` : 'Invalid URL'}`,
  uuid: ({ label }) => `${label ? `${label} must be a valid UUID` : 'Invalid UUID'}`,
  trim: ({ label }) =>
    `${
      label
        ? `${label} must not have leading or trailing whitespace`
        : 'Invalid input. Cannot have leading or trailing whitespace'
    }`,
  lowercase: ({ label }) =>
    `${label ? `${label} must be in lowercase` : 'Invalid input. Must be in lowercase'}`,
  uppercase: ({ label }) =>
    `${label ? `${label} must be in uppercase` : 'Invalid input. Must be in uppercase'}`,
}

const number = {
  min: ({ label, min }) =>
    `${label ? `${label} must be at least ${min}` : `Invalid input. Must be at least ${min}`}`,
  max: ({ label, max }) =>
    `${label ? `${label} must be at most ${max}` : `Invalid input. Must be at most ${max}`}`,
  lessThan: ({ label, less }) =>
    `${label ? `${label} must be less than ${less}` : `Invalid input. Must be less than ${less}`}`,
  moreThan: ({ label, more }) =>
    `${label ? `${label} must be more than ${more}` : `Invalid input. Must be more than ${more}`}`,
  notEqual: ({ label, notEqual }) =>
    `${
      label
        ? `${label} must not be equal to ${notEqual}`
        : `Invalid input. Must not be equal to ${notEqual}`
    }`,
  positive: ({ label }) =>
    `${label ? `${label} must be a positive number` : 'Invalid input. Must be a positive number'}`,
  negative: ({ label }) =>
    `${label ? `${label} must be a negative number` : 'Invalid input. Must be a negative number'}`,
  integer: ({ label }) =>
    `${label ? `${label} must be an integer` : 'Invalid input. Must be an integer'}`,
}

const date = {
  min: ({ label, min }) =>
    `${label ? `${label} must be after ${min}` : `Invalid input. Must be after ${min}`}`,
  max: ({ label, max }) =>
    `${label ? `${label} must be before ${max}` : `Invalid input. Must be before ${max}`}`,
}

const object = {
  noUnknown: ({ label, unknown }) =>
    `${
      label ? `${label} cannot contain unknown keys` : 'Invalid input. Cannot contain unknown keys'
    }${unknown ? `: ${unknown}` : ''}`,
}

const array = {
  min: ({ label, min }) =>
    `${
      label
        ? `${label} must have at least ${min} items`
        : `Invalid input. Must have at least ${min} items`
    }`,
  max: ({ label, max }) =>
    `${
      label
        ? `${label} must have at most ${max} items`
        : `Invalid input. Must have at most ${max} items`
    }`,
}

export const suggestive = { mixed, string, number, date, object, array }
