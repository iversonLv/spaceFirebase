export const checkObj = (obj) => {
  if (typeof(obj) === 'object' && obj !== null ) {
    return Object.values(obj).find(i => !i) === '' || Object.values(obj).filter(i => Array.isArray(i) && !i.length).length > 0
  }
  if (!obj) {
    return true
  }
}