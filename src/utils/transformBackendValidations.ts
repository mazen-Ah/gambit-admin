export const transformBackendValidations = (errors: any) => {
  if (!errors || typeof errors !== 'object') return errors;

  const transformed: any = {};

  Object.keys(errors).forEach(key => {
    const value = errors[key];

    if (key.includes('.')) {
      const parts = key.split('.');
      let current = transformed;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }

      current[parts[parts.length - 1]] = value;
    } else {
      transformed[key] = value;
    }
  });

  return transformed;
};