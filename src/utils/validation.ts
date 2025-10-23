/**
 * Form validation utilities with Spanish error messages
 * Provides validation rules and functions for contact form
 */

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  type: 'required' | 'pattern' | 'minLength' | 'maxLength';
}

/**
 * Validation rules for contact form fields
 */
export const validationRules: Record<string, ValidationRule> = {
  nombre: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  telefono: {
    required: true,
    pattern: /^(\+34|0034|34)?[6789]\d{8}$/
  },
  mensaje: {
    required: true,
    minLength: 10,
    maxLength: 1000
  }
};

/**
 * Error messages in Spanish for each field and validation type
 */
export const errorMessages: Record<string, Record<string, string>> = {
  nombre: {
    required: 'El nombre es obligatorio',
    minLength: 'El nombre debe tener al menos 2 caracteres',
    maxLength: 'El nombre no puede exceder 100 caracteres',
    pattern: 'El nombre solo puede contener letras y espacios'
  },
  email: {
    required: 'El email es obligatorio',
    pattern: 'Por favor, introduce un email válido'
  },
  telefono: {
    required: 'El teléfono es obligatorio',
    pattern: 'Por favor, introduce un teléfono válido (ej: +34 600 000 000)'
  },
  mensaje: {
    required: 'El mensaje es obligatorio',
    minLength: 'El mensaje debe tener al menos 10 caracteres',
    maxLength: 'El mensaje no puede exceder 1000 caracteres'
  }
};

/**
 * Validates a single field value against its validation rules
 * @param field - Field name
 * @param value - Field value to validate
 * @returns ValidationError if validation fails, null if valid
 */
export function validateField(field: string, value: string): ValidationError | null {
  const rules = validationRules[field];
  const messages = errorMessages[field];
  
  if (!rules || !messages) {
    return null;
  }

  // Required validation
  if (rules.required && (!value || value.trim() === '')) {
    return {
      field,
      message: messages.required,
      type: 'required'
    };
  }

  // Skip other validations if field is empty and not required
  if (!value || value.trim() === '') {
    return null;
  }

  // Min length validation
  if (rules.minLength && value.length < rules.minLength) {
    return {
      field,
      message: messages.minLength,
      type: 'minLength'
    };
  }

  // Max length validation
  if (rules.maxLength && value.length > rules.maxLength) {
    return {
      field,
      message: messages.maxLength,
      type: 'maxLength'
    };
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    return {
      field,
      message: messages.pattern,
      type: 'pattern'
    };
  }

  return null;
}

/**
 * Validates all fields in a form data object
 * @param formData - Object containing form field values
 * @returns Array of validation errors, empty if all valid
 */
export function validateForm(formData: Record<string, string>): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const field in formData) {
    const error = validateField(field, formData[field]);
    if (error) {
      errors.push(error);
    }
  }

  return errors;
}

/**
 * Checks if a form is valid (no validation errors)
 * @param formData - Object containing form field values
 * @returns true if form is valid, false otherwise
 */
export function isFormValid(formData: Record<string, string>): boolean {
  return validateForm(formData).length === 0;
}
