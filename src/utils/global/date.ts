import i18n from '@/i18n';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const EU_DATE = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;

/**
 * Strips the time from a date
 * @param date The date to strip
 * @returns {Date} The date at local midnight
 */
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Parses a database date (ISO) or a `DD-MM-YYYY` string
 * @param date The date to parse
 * @returns {Date | null} The date at local midnight, or null when unparsable
 */
function parseDate(date: string | null): Date | null {
  if (!date) return null;

  const isoDate = date.match(ISO_DATE);
  const euDate = date.match(EU_DATE);

  let parsed: Date;

  if (isoDate) parsed = new Date(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3]));
  else if (euDate) parsed = new Date(Number(euDate[3]), Number(euDate[2]) - 1, Number(euDate[1]));
  else parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return null;

  return startOfDay(parsed);
}

/**
 * Counts the whole calendar months between two dates
 * @param from The earliest date
 * @param to The latest date
 * @returns {number} The amount of whole months in between
 */
function monthsBetween(from: Date, to: Date): number {
  const months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());

  return to.getDate() < from.getDate() ? months - 1 : months;
}

/**
 * Formats a date string to a relative description
 * @param date The date to format
 * @returns {string} The formatted date
 */
export function formatDateAgo(date: string | null): string {
  const dateToCompare = parseDate(date);

  if (!dateToCompare) return '';

  const today = startOfDay(new Date());

  const diffDays = Math.round((today.getTime() - dateToCompare.getTime()) / MS_PER_DAY);
  const diffMonths = monthsBetween(dateToCompare, today);

  if (diffDays <= 0) return i18n.global.t('recipePage.today');
  else if (diffDays === 1) return i18n.global.t('recipePage.yesterday');
  else if (diffDays < 7)
    return `${diffDays} ${i18n.global.t('recipePage.daysAgo', { count: diffDays })}`;
  else if (diffMonths < 1)
    return `${Math.floor(diffDays / 7)} ${i18n.global.t('recipePage.weeksAgo', { count: Math.floor(diffDays / 7) })}`;
  else if (diffMonths < 12)
    return `${diffMonths} ${i18n.global.t('recipePage.monthsAgo', { count: diffMonths })}`;
  else
    return `${Math.floor(diffMonths / 12)} ${i18n.global.t('recipePage.yearsAgo', { count: Math.floor(diffMonths / 12) })}`;
}

/**
 * Determines if a date is today
 * @param date The date string
 * @returns {boolean} Boolean if date is today
 */
export function isToday(date: string | null): boolean {
  const parsed = parseDate(date);

  if (!parsed) return false;

  return parsed.getTime() === startOfDay(new Date()).getTime();
}
