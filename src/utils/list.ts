/**
 * Add an input row to the list of ingredients or instructions
 * @param list List of ingredients or instructions
 * @param index Index of the current ingredient or instruction
 */
export function addInputRow(list: Object[] | string[], index: number) {
  if (index === list.length - 1 && list[index] !== '') {
    list.push('');
  }
}

/**
 * Delete an input row from the list of ingredients or instructions
 * @param list List of ingredients or instructions
 * @param index Index of the current ingredient or instruction
 */
export function deleteRow(list: Object[] | string[], index: number) {
  if (list.length > 1) {
    list.splice(index, 1);
  }
}
