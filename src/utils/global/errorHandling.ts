export type ErrorCode =
  | 'offline'
  | 'network'
  | 'sessionExpired'
  | 'permissionDenied'
  | 'notFound'
  | 'rateLimited'
  | 'invalidCredentials'
  | 'emailExists'
  | 'emailNotConfirmed'
  | 'emailAddressInvalid'
  | 'weakPassword'
  | 'fileTooLarge'
  | 'invalidFileType'
  | 'unknown';

/**
 * Error of a failed action, shown as what failed (the action) and why (the code)
 */
export interface ActionError {
  action: string;
  code: ErrorCode;
}

/**
 * Error with a known cause, thrown by the app itself
 */
export class AppError extends Error {
  code: ErrorCode;
  original: unknown;

  constructor(code: ErrorCode, original?: unknown) {
    super(code);
    this.name = 'AppError';
    this.code = code;
    this.original = original;
  }
}

const codes: Record<string, ErrorCode> = {
  invalid_credentials: 'invalidCredentials',
  email_exists: 'emailExists',
  user_already_exists: 'emailExists',
  email_not_confirmed: 'emailNotConfirmed',
  email_address_invalid: 'emailAddressInvalid',
  weak_password: 'weakPassword',
  over_request_rate_limit: 'rateLimited',
  over_email_send_rate_limit: 'rateLimited',
  session_not_found: 'sessionExpired',
  session_expired: 'sessionExpired',
  refresh_token_not_found: 'sessionExpired',
  bad_jwt: 'sessionExpired',
  no_authorization: 'sessionExpired',
  invalid_mime_type: 'invalidFileType',
  PGRST116: 'notFound',
  PGRST301: 'sessionExpired',
  PGRST302: 'sessionExpired',
  '42501': 'permissionDenied'
};

const networkNames = ['AuthRetryableFetchError', 'FunctionsFetchError', 'FunctionsRelayError'];

const statuses: Record<number, ErrorCode> = {
  401: 'sessionExpired',
  403: 'permissionDenied',
  404: 'notFound',
  413: 'fileTooLarge',
  415: 'invalidFileType',
  429: 'rateLimited'
};

/**
 * Get the HTTP status of a Supabase error, which each Supabase client stores differently
 * @param error Error to read
 * @returns The status, if any
 */
function getStatus(error: Record<string, unknown>): number | undefined {
  const context = error.context as { status?: unknown } | undefined;
  const status = Number(error.status ?? error.statusCode ?? context?.status);

  return Number.isInteger(status) && status > 0 ? status : undefined;
}

/**
 * Translate any error, such as a Supabase or network error, to an error code the app can explain
 * @param error Error to translate
 * @returns {AppError} The error with its code
 */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (!navigator.onLine) return new AppError('offline', error);
  if (!error || typeof error !== 'object') return new AppError('unknown', error);

  const details = error as Record<string, unknown>;
  const code = codes[String(details.code ?? details.error ?? '')];
  if (code) return new AppError(code, error);

  if (networkNames.includes(String(details.name))) return new AppError('network', error);

  const status = getStatus(details);
  if (status && statuses[status]) return new AppError(statuses[status], error);

  const message = String(details.message ?? '');

  if (/failed to fetch|networkerror|load failed|network request failed/i.test(message)) {
    return new AppError('network', error);
  }

  if (/maximum allowed size|too large/i.test(message)) return new AppError('fileTooLarge', error);
  if (/mime type/i.test(message)) return new AppError('invalidFileType', error);

  return new AppError('unknown', error);
}

/**
 * Log an error with the action it came from, so failures can be traced in the console
 * @param action Action that failed
 * @param error Original error
 */
export function logError(action: string, error: unknown): void {
  console.error(`[${action}]`, error);
}

/**
 * Log an error and turn it into an action error the UI can show
 * @param action Action that failed
 * @param error Original error
 * @returns {ActionError} What failed and why
 */
export function toActionError(action: string, error: unknown): ActionError {
  logError(action, error);

  return { action, code: toAppError(error).code };
}
