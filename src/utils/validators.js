
export const validate = (rules, input) => rules.map(func => func(input)).filter(result => result !== true)

export const validateBatch = (rules, inputs) => Object.keys(rules).map(key => validate(rules[key], inputs[key])).reduce((acc, val) => acc + val.length, 0) === 0

export const required = () => value => !!value || 'Required field'

export const requiredEach = () => values => values.map(item => required()(item)).filter(item => item !== true).length === 0 || 'Required field'

export const numeric = () => value => /^\d+$/.test(value) || 'Numeric field'

export const email = () => value => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) || 'Email address'

export const password = () => value => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value) || 'Password'

export const minLen = len => value => value.length >= len || `Length: ${len}`

export const specialChar = () => value => /\W/.test(value) || 'Missing special characters'

export const uppercase = () => value => /[A-Z]/.test(value) || 'Missing uppercase characters'

export const lowercase = () => value => /[a-z]/.test(value) || 'Missing lowercase characters'

export const numbers = () => value => /[0-9]/.test(value) || 'Missing numbers'

export const minVal = min => value => value >= min || `Minimum value: ${min}`

export const maxVal = max => value => value <= max || `Maximum value: ${max}`

export const format = (regex, message) => value => regex.test(value) || `Invalid format: ${message}`
