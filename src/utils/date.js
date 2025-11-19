
/**
 * Convert a date to ISO date format without milliseconds and return it as
 * a string. Converts the supplied parameter or the current date if no
 * parameter is given.
 * @param {Date?} value - Optional date to convert.
 * @return {string} The converted date.
 */
export const isoDate = value => (value || new Date()).toISOString().replace(/\.\d+/, '')
