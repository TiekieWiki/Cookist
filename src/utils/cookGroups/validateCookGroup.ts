import type { CookGroup } from '../types/cookgroup';

export function validateCookGroup(cookGroup: CookGroup): string {
  const members = cookGroup.members.filter((member) => member.email !== '');
  const checkEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (cookGroup.name === '') {
    return 'addCookGroupPage.errors.name';
  } else if (members.length === 0) {
    return 'addCookGroupPage.errors.members';
  } else if (members.map((member) => checkEmail.test(member.email)).includes(false)) {
    return 'addCookGroupPage.errors.invalidEmail';
  } else {
    return '';
  }
}
