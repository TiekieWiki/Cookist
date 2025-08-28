import type { CookGroup } from '../types/cookgroup';

/**
 Sorts an array of cook groups, prioritizing personal groups first, then sorting by name alphabetically.
 * @param {Array} cookGroups Cook group array
 * @returns {Array} The sorted array of cook groups.
 */
export function sortCookGroups(cookGroups: CookGroup[]): CookGroup[] {
  return cookGroups.sort((a, b) => {
    if (a.personal && !b.personal) return -1;
    if (!a.personal && b.personal) return 1;
    return a.name.localeCompare(b.name);
  });
}
