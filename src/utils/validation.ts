
import { actions } from "astro:actions";

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

export const validationRules: Record<string, ValidationRule> = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    required: true,
    pattern: /^(\+34|0034|34)?[6789]\d{8}$/
  },
  message: {
    required: false,
    minLength: 10,
    maxLength: 1000
  }
};

export const errorMessages: Record<string, Record<string, string>> = {
  name: {
    required: 'El nombre es obligatorio',
    minLength: 'El nombre debe tener al menos 2 caracteres',
    maxLength: 'El nombre no puede exceder 100 caracteres',
    pattern: 'El nombre solo puede contener letras y espacios'
  },
  email: {
    required: 'El email es obligatorio',
    pattern: 'Por favor, introduce un email válido'
  },
  phone: {
    required: 'El teléfono es obligatorio',
    pattern: 'Por favor, introduce un teléfono válido (ej: +34 600 000 000)'
  },
  message: {
    required: 'El mensaje es obligatorio',
    minLength: 'El mensaje debe tener al menos 10 caracteres',
    maxLength: 'El mensaje no puede exceder 1000 caracteres'
  }
};

export function validateField(field: string, value: string): ValidationError | null {
  const rules = validationRules[field];
  const messages = errorMessages[field];

  if (!rules || !messages) return null;

  const isValueEmpty = !value || value.trim() === '';

  // Helper to create error object
  const createError = (type: ValidationError['type']): ValidationError => ({
    field,
    message: messages[type],
    type
  });

  if (rules.required && isValueEmpty) {
    return createError('required');
  }

  if (isValueEmpty) return null;

  if (rules.minLength && value.length < rules.minLength) {
    return createError('minLength');
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return createError('maxLength');
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return createError('pattern');
  }

  return null;
}


export const setupFormValidation = () => {
  const form = document.getElementById("contact-form") as HTMLFormElement;
  if (!form) return;

  const fieldNames = Object.keys(validationRules);

  // Cache DOM elements
  const fields = fieldNames.map((name) => {
    const input = document.getElementById(`input-${name}`) as HTMLInputElement | HTMLTextAreaElement;
    const errorElement = document.getElementById(`error-${name}`);
    return { name, input, errorElement };
  }).filter((f): f is { name: string, input: HTMLInputElement | HTMLTextAreaElement, errorElement: HTMLElement } =>
    !!f.input && !!f.errorElement
  );

  const validateInput = (field: typeof fields[0]) => {
    const error = validateField(field.name, field.input.value);
    if (error) {
      field.errorElement.textContent = error.message;
      field.input.classList.add("form-input-error");
      field.input.setAttribute("aria-invalid", "true");
      return false;
    }
    field.errorElement.textContent = "";
    field.input.classList.remove("form-input-error");
    field.input.setAttribute("aria-invalid", "false");
    return true;
  };

  // Attach listeners
  fields.forEach((field) => {
    const { input, errorElement } = field;
    const runValidation = () => validateInput(field);

    input.addEventListener("blur", runValidation);
    input.addEventListener("input", () => {
      if (errorElement.textContent) runValidation();
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let isValid = true;
    let firstInvalidInput: HTMLElement | null = null;

    fields.forEach(field => {
      const valid = validateInput(field);
      if (!valid) {
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = field.input;
      }
    });

    if (!isValid && firstInvalidInput) {
      (firstInvalidInput as HTMLElement).focus();
      return;
    }

    // Handle submission
    const submitButton = form.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    const formMessage = document.getElementById("form-message");

    if (submitButton) submitButton.disabled = true;
    if (formMessage) formMessage.classList.add("hidden");

    try {
      const formData = new FormData(form);
      const { error } = await actions.sendMail(formData);

      if (error) {
        throw new Error(error.message);
      }

      // Success
      form.reset();
      // Clear success checkmarks or error states from UI
      fields.forEach(({ input }) => {
        input.classList.remove("form-input-error");
        input.setAttribute("aria-invalid", "false");
      });

      if (formMessage) {
        formMessage.textContent =
          "¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.";
        formMessage.className =
          "text-green-400 text-center font-medium mt-4 block";
      }
    } catch (err: any) {
      if (formMessage) {
        formMessage.textContent =
          "Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.";
        formMessage.className =
          "text-red-400 text-center font-medium mt-4 block";
      }
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
};