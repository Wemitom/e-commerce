export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 *
 * @param bool - Three state bool
 * @param stringTrue - String returned on true
 * @param stringFalse - String returned on false
 * @param stringNull - String return if bool is null
 * @returns Either stringTrue, stringFalse or stringNull
 */
export const threeStateBool = (
  bool: boolean | null,
  stringTrue: string,
  stringFalse: string,
  stringNull: string
) =>
  typeof bool === 'boolean' ? (bool ? stringTrue : stringFalse) : stringNull;
