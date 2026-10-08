import { nextTick } from 'vue';

/**
 * Focus a form field by id, after the DOM has updated. The id can belong to the field itself or to
 * the element around it, such as the label of a select or a list of inputs.
 * @param id Id of the field or the element around it
 */
export async function focusField(id: string): Promise<void> {
  await nextTick();

  const element = document.getElementById(id);
  const field = element?.matches('input, select, textarea')
    ? element
    : element?.querySelector<HTMLElement>('input, select, textarea');

  field?.focus();
}
