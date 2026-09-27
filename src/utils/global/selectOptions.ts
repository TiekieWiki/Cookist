import type { SelectFieldProps } from '@/utils/types/form';

/**
 * Converts the values of an enum to options for a select field
 * @param values The enum, or another object with string values
 * @returns {SelectFieldProps['items']} An option for every value, with the value as label
 */
export function toSelectOptions(values: Record<string, string>): SelectFieldProps['items'] {
  return Object.values(values).map((value) => ({
    value: value.toLowerCase(),
    label: value.toLowerCase()
  }));
}
