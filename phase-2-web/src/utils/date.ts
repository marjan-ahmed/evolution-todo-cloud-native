import { format, isAfter, isBefore, isToday, isTomorrow, parseISO } from 'date-fns';

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';

  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Check if a date is today
 */
export function isDateToday(dateString: string | undefined): boolean {
  if (!dateString) return false;

  try {
    const date = parseISO(dateString);
    return isToday(date);
  } catch (error) {
    console.error('Error checking if date is today:', error);
    return false;
  }
}

/**
 * Check if a date is tomorrow
 */
export function isDateTomorrow(dateString: string | undefined): boolean {
  if (!dateString) return false;

  try {
    const date = parseISO(dateString);
    return isTomorrow(date);
  } catch (error) {
    console.error('Error checking if date is tomorrow:', error);
    return false;
  }
}

/**
 * Check if a date is in the past
 */
export function isDatePast(dateString: string | undefined): boolean {
  if (!dateString) return false;

  try {
    const date = parseISO(dateString);
    const now = new Date();
    return isBefore(date, now);
  } catch (error) {
    console.error('Error checking if date is past:', error);
    return false;
  }
}

/**
 * Check if a date is approaching (within 24 hours)
 */
export function isDateApproaching(dateString: string | undefined): boolean {
  if (!dateString) return false;

  try {
    const date = parseISO(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if date is within the next 24 hours
    return (isAfter(date, now) && isBefore(date, tomorrow)) || isToday(date);
  } catch (error) {
    console.error('Error checking if date is approaching:', error);
    return false;
  }
}

/**
 * Validate if a date string is a valid ISO date
 */
export function isValidDateString(dateString: string): boolean {
  if (!dateString) return false;

  try {
    const date = parseISO(dateString);
    return !isNaN(date.getTime()); // Check if date is valid
  } catch (error) {
    return false;
  }
}