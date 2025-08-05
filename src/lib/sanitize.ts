/**
 * HTML entity encoding for security
 * Prevents XSS attacks by encoding HTML special characters
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Component for safely rendering user-generated text content
 * Note: This is a utility function, use directly in components with dangerouslySetInnerHTML
 */