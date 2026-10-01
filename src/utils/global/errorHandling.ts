/**
 * Gets the error message corresponding to the provided error code from the error record
 * @param errorRecord Error record containing error codes and their corresponding messages
 * @param errorCode Error code for which the message needs to be retrieved
 * @returns The error message corresponding to the provided error code, or a default unknown error message if the code is not found
 */
export function getErrorMessage(errorCode: string | undefined): string {
  if (!errorCode) {
    return 'general.errors.unknown';
  }

  return errorMessages[errorCode] || 'general.errors.unknown';
}

export const errorMessages: Record<string, string> = {
  email_address_missing: 'general.errors.emailAddressMissing',
  email_address_invalid: 'general.errors.emailAddressInvalid',
  email_exists: 'general.errors.emailExists',
  invalid_credentials: 'general.errors.invalidCredentials',
  user_already_exists: 'general.errors.userAlreadyExists',
  user_not_found: 'general.errors.userNotFound',
  password_missing: 'general.errors.passwordMissing',
  weak_password: 'general.errors.weakPassword',
  recipe_name_missing: 'general.errors.recipeNameMissing',
  recipe_category_missing: 'general.errors.recipeCategoryMissing',
  recipe_duration_missing: 'general.errors.recipeDurationMissing',
  recipe_portions_missing: 'general.errors.recipePortionsMissing',
  recipe_rating_missing: 'general.errors.recipeRatingMissing',
  recipe_ingredients_missing: 'general.errors.recipeIngredientsMissing',
  recipe_instructions_missing: 'general.errors.recipeInstructionsMissing',
  unknown: 'general.errors.unknown'
};
