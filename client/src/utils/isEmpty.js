const isEmpty = (value) =>
  value == undefined || // Check if value is `undefined` or `null`
  value == null || // Check if value is `null`
  (Array.isArray(value) && value.length === 0) || // Check if value is an empty array
  (typeof value === "object" && Object.keys(value).length === 0) || // Check if value is an empty object
  (typeof value === "string" && value.trim().length === 0); // Check if value is an empty string

export default isEmpty;
