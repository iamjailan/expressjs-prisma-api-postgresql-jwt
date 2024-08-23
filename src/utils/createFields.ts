export const createPrismaSelect = (arr: string[]): Record<string, any> => {
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
        if (i === keys.length - 1) {
          current[keys[i]] = true;
        } else {
          if (!current[keys[i]]) {
            current[keys[i]] = { select: {} };
          }
          current = current[keys[i]].select;
        }
      }
    }
  }

  return result;
};
