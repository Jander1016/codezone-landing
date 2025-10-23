/**
 * Input sanitization utilities for security (XSS prevention)
 * Following OWASP guidelines for input sanitization
 */

/**
 * Sanitizes user input by escaping HTML entities to prevent XSS attacks
 * @param input - The user input string to sanitize
 * @returns Sanitized string with HTML entities escaped
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitizes all fields in a form data object
 * @param data - Object containing form field values
 * @returns Object with all string values sanitized
 */
export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
  const sanitized = { ...data };
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key]) as any;
    }
  }
  
  return sanitized;
}

/**
 * Rate limiter class for preventing spam submissions
 * Tracks submission attempts per identifier (e.g., IP address or session)
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  /**
   * Checks if a submission is allowed based on rate limiting rules
   * @param key - Unique identifier for the submitter (e.g., IP or session ID)
   * @param maxAttempts - Maximum number of attempts allowed
   * @param windowMs - Time window in milliseconds
   * @returns true if submission is allowed, false if rate limit exceeded
   */
  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Filter out attempts outside the time window
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }

  /**
   * Clears all rate limiting data for a specific key
   * @param key - Unique identifier to clear
   */
  clear(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Clears all rate limiting data
   */
  clearAll(): void {
    this.attempts.clear();
  }
}
