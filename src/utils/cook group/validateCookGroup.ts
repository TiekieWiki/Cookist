import type { CookGroup } from '../types/cookgroup';

/**
 * Validates the cook group data
 * @param cookGroup The cook group to validate
 * @returns {string} Validation error message or empty string if valid
 */
export function validateCookGroup(cookGroup: CookGroup): string {
  const invitees = cookGroup.invitees.filter((invitee) => invitee !== '');
  const checkEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (cookGroup.name === '') {
    return 'editCookGroupPage.errors.name';
  } else if (invitees.map((invitee) => checkEmail.test(invitee)).includes(false)) {
    return 'editCookGroupPage.errors.invalidEmail';
  } else {
    return '';
  }
}
