import type { CookGroup } from '../types/cookgroup';

export function validateCookGroup(cookGroup: CookGroup): string {
  const invitees = cookGroup.invitees.filter((invitee) => invitee !== '');
  const checkEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (cookGroup.name === '') {
    return 'addCookGroupPage.errors.name';
  } else if (invitees.length === 0) {
    return 'addCookGroupPage.errors.invitees';
  } else if (invitees.map((invitee) => checkEmail.test(invitee)).includes(false)) {
    return 'addCookGroupPage.errors.invalidEmail';
  } else {
    return '';
  }
}
