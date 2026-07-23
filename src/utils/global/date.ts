/**
 * Formats a date string to 
 * @param date The date to format
 * @returns {string} The formatted date
 */
export function formatDate(date: string): string {
    const splittedDate = date.split('-');
  
    return `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
}

/**
 * Determines if a date is today 
 * @param date The date string
 * @returns {boolean} Boolean if date is today
 */
export function isToday(date: string | null): boolean {
    if (!date) return false;
    const today = new Date();
    
  return `${('0' + today.getDate()).slice(-2)}-${('0' + (today.getMonth() + 1)).slice(-2)}-${today.getFullYear()}` === date;
}
