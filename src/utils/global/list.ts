/**
 * Add an input row to the list of ingredients or instructions
 * @param list List of ingredients or instructions
 * @param index Index of the current ingredient or instruction
 */
export function addInputRow(
  list: (object | string)[],
  index: number,
  emptyObject: object | string
): void {
  if (index === list.length - 1 && list[index] !== '') {
    list.push(emptyObject);
  }
}

/**
 * Move an item of a list to another position
 * @param list List to move the item in
 * @param from Current index of the item
 * @param to Index to move the item to
 */
export function moveItem<T>(list: T[], from: number, to: number): void {
  const [item] = list.splice(from, 1);
  list.splice(to, 0, item);
}

/**
 * Delete an input row from the list of ingredients or instructions
 * @param list List of ingredients or instructions
 * @param index Index of the current ingredient or instruction
 */
export function deleteRow(
  list: object[] | string[],
  index: number,
  empty: boolean | undefined
): void {
  if (list.length > 1 || empty) {
    list.splice(index, 1);
  }
}
