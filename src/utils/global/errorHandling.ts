import i18n from '@/i18n';

export function getErrorMessage(
  errorRecord: Record<string, string>,
  errorCode: string | undefined
): string {
  if (!errorCode) {
    return i18n.global.t('loginPage.errors.unknown');
  }

  return errorRecord[errorCode] || i18n.global.t('loginPage.errors.unknown');
}

export const passwordLoginErrorMessages: Record<string, string> = {
  email_address_missing: i18n.global.t('loginPage.errors.emailAddressMissing'),
  email_address_invalid: i18n.global.t('loginPage.errors.emailAddressInvalid'),
  email_exists: i18n.global.t('loginPage.errors.emailExists'),
  invalid_credentials: i18n.global.t('loginPage.errors.invalidCredentials'),
  user_already_exists: i18n.global.t('loginPage.errors.userAlreadyExists'),
  user_not_found: i18n.global.t('loginPage.errors.userNotFound'),
  password_missing: i18n.global.t('loginPage.errors.passwordMissing'),
  weak_password: i18n.global.t('loginPage.errors.weakPassword')
};
