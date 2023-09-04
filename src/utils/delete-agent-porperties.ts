export function deleteKeys(obj: object, keys: string[]) {
  return keys.forEach((key) => delete obj[key]);
}
