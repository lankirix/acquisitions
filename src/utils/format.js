export const formatValidationError = error => {
  if (!error || !error.errors) {
    return 'Validation failed';
  }

  if (Array.isArray(error.errors)) {
    return error.errors.map(e => e.message).join(', ');
  }

  // Handle Zod errors (has issues array)
  if (error.issues) {
    return error.issues.map(i => i.message).join(', ');
  }

  return JSON.stringify(error);
};
