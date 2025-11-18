
export const isoDate = value => (value || new Date()).toISOString().replace(/\.\d+/, '')
