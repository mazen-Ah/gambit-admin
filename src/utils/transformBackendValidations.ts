export const transformBackendValidations = (errors: any) => {
  if (!errors || typeof errors !== 'object') return errors;

  const transformed: any = {};

  Object.keys(errors).forEach(key => {
    const value = errors[key];

    if (key.includes('.')) {
      const parts = key.split('.');
      let current = transformed;

      for (let i = 0; i < parts.length - 1; i++) {
        let part = parts[i];
        const nextPart = parts[i + 1];
        
        // Normalize backend field names to match form structure
        if (part === 'subsections') {
          part = 'sub_sections';
        }
        
        // Check if next part is a numeric index (array element)
        const nextIsNumeric = nextPart && /^\d+$/.test(nextPart);
        
        if (nextIsNumeric) {
          // Next part is numeric, so current part should be an array
          const index = parseInt(nextPart, 10);
          
          // Ensure current part exists as an array
          if (!Array.isArray(current[part])) {
            current[part] = [];
          }
          
          // Ensure array is large enough
          while (current[part].length <= index) {
            current[part].push(null);
          }
          
          // Initialize array element if needed
          if (!current[part][index]) {
            current[part][index] = {};
          }
          
          // Move to the array element and skip processing the numeric index
          current = current[part][index];
          i++; // Skip the numeric index part since we already processed it
        } else {
          // Regular object property
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
      }

      // Handle the last part (field name)
      if (parts.length > 0) {
        let lastPart = parts[parts.length - 1];
        
        // Normalize backend field names
        if (lastPart === 'subsections') {
          lastPart = 'sub_sections';
        }
        
        // Only set if last part is not numeric (numeric parts were handled in loop)
        if (!/^\d+$/.test(lastPart)) {
          current[lastPart] = value;
        }
      }
    } else {
      // Normalize single key
      const normalizedKey = key === 'subsections' ? 'sub_sections' : key;
      transformed[normalizedKey] = value;
    }
  });

  return transformed;
};