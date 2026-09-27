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
