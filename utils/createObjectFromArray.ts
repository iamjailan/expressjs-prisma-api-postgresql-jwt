export default (
  arr: string[],
  value: boolean | "string" | "asc" | "desc" = true
): Record<string, any> => {
  let result = {};

  for (let key of arr) {
    if (
      /^[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*$/.test(key) &&
      !key.startsWith("__proto__") &&
      !key.startsWith("prototype")
    ) {
      let keys = key.split(".");
      let current = result;

      for (let i = 0; i < keys.length; i++) {
        if (!current[keys[i]]) {
          if (i === keys.length - 1) {
            current[keys[i]] = value;
          } else {
            current[keys[i]] = {};
          }
        }
        current = current[keys[i]];
      }
    }
  }

  return result;
};
