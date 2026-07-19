/**
 * Gets the error message corresponding to the provided error code from the error record
 * @param errorRecord Error record containing error codes and their corresponding messages
 * @param errorCode Error code for which the message needs to be retrieved
 * @returns The error message corresponding to the provided error code, or a default unknown error message if the code is not found
 */
export function getErrorMessage(
  errorCode: string | undefined
): string {
  if (!errorCode) {
    return 'errors.unknown';
  }

  return errorMessages[errorCode] || 'errors.unknown';
}

export const errorMessages: Record<string, string> = {
  email_address_missing: 'errors.emailAddressMissing',
  email_address_invalid: 'errors.emailAddressInvalid',
  email_exists: 'errors.emailExists',
  invalid_credentials: 'errors.invalidCredentials',
  user_already_exists: 'errors.userAlreadyExists',
  user_not_found: 'errors.userNotFound',
  password_missing: 'errors.passwordMissing',
  weak_password: 'errors.weakPassword',
  recipe_name_missing: 'errors.recipeNameMissing',
  recipe_category_missing: 'errors.recipeCategoryMissing',
  recipe_duration_missing: 'errors.recipeDurationMissing',
  recipe_portions_missing: 'errors.recipePortionsMissing',
  recipe_rating_missing: 'errors.recipeRatingMissing',
  recipe_ingredients_missing: 'errors.recipeIngredientsMissing',
  recipe_instructions_missing: 'errors.recipeInstructionsMissing',
  unsaved_changes: 'errors.unsavedChanges',
  unknown: 'errors.unknown',
};
