import { MouseEvent } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IMediaItem } from '../types/Interfaces';

export const searchFilterLogic = (props: any) => {
  const { searchInput, listOfData, keys, dropdownValue, dropdownKey } = props;
  const regex = /^[a-zA-Z0-9\s.\u0600-\u06FF-]+$/;
  if (!regex.test(searchInput)) {
    return [];
  }

  return listOfData?.filter((item: any) =>
    keys.some((key: any, index: number) => {
      const nestedKeys = key.split('.'); // Split nested key by dot
      let value = item;
      for (const nestedKey of nestedKeys) {
        value = value?.[nestedKey];
        if (value === undefined) {
          return false; // Stop iteration if nested key not found
        }
      }
      const result =
        value?.toString().toLowerCase().includes(searchInput.toLowerCase()) && (!dropdownValue || item?.[dropdownKey]?.some((category: any) => category?.id === dropdownValue));
      return result;
    })
  );
};

export const buildFormData = (formData: FormData, data: any, parentKey: string) => {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach((key) => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    });
  } else {
    const value = data == null ? '' : data;

    formData.append(parentKey, value);
  }
};

export const handleSorting = (prop: any) => {
  const { setState, list, value, startTransition } = prop;
  const originalList = [...list];
  if (value !== 'none') {
    const sortedList = originalList.sort((a: any, b: any) => {
      if (value === 'is_active') return b[`${value}`] - a[`${value}`];
      return a[`${value}`] - b[`${value}`];
    });
    startTransition(() => {
      setState(sortedList);
    });
  }
};

//Table row selection
export const handleBulkSelection = (selectedItems: string[], setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>, id: string) => {
  if (selectedItems && selectedItems?.includes(id)) {
    setSelectedItems && setSelectedItems((prev) => prev?.filter((item) => item !== id));
  } else {
    setSelectedItems && setSelectedItems((prev) => [...prev, id]);
  }
};

export const scrollToError = (error: boolean, ref: React.RefObject<HTMLDivElement>, errorMsg?: string) => {
  if (error) {
    ref?.current?.scrollIntoView({ behavior: 'smooth' });
    toast.error(errorMsg || `Please fill all required fields`);
  }
};

export const getFilterQuery = (filters: { [key: string]: string | null }) => {
  const query: string[] = [];

  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      query.push(`${key}=${filters[key]}`);
    }
  });

  return query.join('&');
};
export const hasPermission = (permissions: string[]) => {
  const userPermissions = JSON.parse(localStorage.getItem('user_permissions') as string);
  const hasPermissions = permissions?.some((permission: string) => userPermissions?.includes(permission));
  return hasPermissions;
};

export const hasAllPermission = (permissions: string[]) => {
  const userPermissions = JSON.parse(localStorage.getItem('user_permissions') as string);
  const hasPermissions = permissions?.every((permission: string) => userPermissions?.includes(permission));
  return hasPermissions;
};

export function navigateRoute(e: MouseEvent<HTMLDivElement, any>, path: string, navigate: NavigateFunction) {
  const contentContainer = document.querySelector('.layout_content');
  contentContainer?.scrollTo({ top: 0, behavior: 'smooth' });
  e.stopPropagation();
  navigate(path);
}

export function getMedia(media: IMediaItem[] | undefined, collection_name: string): IMediaItem | undefined {
  if (!media) return undefined;
  return media.find((item) => item.collection_name === collection_name);
}

export function getMediaArray(media: IMediaItem[] | undefined, collection_name: string): IMediaItem[] {
  if (!media) return [];
  return media.filter((item) => item.collection_name === collection_name);
}

export function removeEmpty(data: any, except?: string[]) {
  if (data && typeof data === 'object') {
    Object.keys(data).forEach((key) => {
      if ((except && except.includes(key)) || key.includes('image')) return;
      if (data[key] && typeof data[key] === 'object') {
        removeEmpty(data[key], except);
      } if (!data[key] && data[key] !== 0 && data[key] !== false) {
        delete data[key];
      }
    });
  }
  return data;
}

export function createFileList(files: File[]): FileList {
  const dataTransfer = new DataTransfer();
  files.forEach(file => {
    dataTransfer.items.add(file);
  });
  return dataTransfer.files;
}

export function convertFilesToBase64(files: FileList) {
  return new Promise((resolve, reject) => {
    const filePromises = Array.from(files).map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file as Blob);
      });
    });

    Promise.all(filePromises)
      .then((base64Array) => resolve(base64Array))
      .catch((error) => reject(error));
  });
};

export function orderData(data: any) {
  if (data) {
    return data.sort((a: any, b: any) => {
      return Number(a.order) < Number(b.order) ? -1 : 1
    })
  }
}

export function findFirstAccordionWithError(errors: any, sections: any[]): { sectionIndex: number; subSectionIndex?: number } {
  if (!errors?.sections || !sections) return { sectionIndex: -1 };

  for (let i = 0; i < sections.length; i++) {
    const sectionErrors = errors.sections[i];
    if (sectionErrors && typeof sectionErrors === 'object') {
      // Check if this section has any errors (excluding sub_sections)
      const hasDirectErrors = Object.keys(sectionErrors).some(key =>
        key !== 'sub_sections' && sectionErrors[key]
      );

      if (hasDirectErrors) {
        return { sectionIndex: i };
      }

      // Check sub_sections for errors
      if (sectionErrors.sub_sections && Array.isArray(sectionErrors.sub_sections)) {
        for (let j = 0; j < sectionErrors.sub_sections.length; j++) {
          const subSectionError = sectionErrors.sub_sections[j];
          if (subSectionError && typeof subSectionError === 'object' && Object.keys(subSectionError).length > 0) {
            return { sectionIndex: i, subSectionIndex: j };
          }
        }
      }
    }
  }

  return { sectionIndex: -1 };
}

export function findFirstErrorInputField(errors: any, sectionIndex: number, subSectionIndex?: number): string | null {
  if (!errors?.sections?.[sectionIndex]) return null;

  const sectionErrors = errors.sections[sectionIndex];
  let targetErrors = sectionErrors;
  let fieldPrefix = `sections[${sectionIndex}]`;

  // If we have a sub-section error, target that instead
  if (subSectionIndex !== undefined && sectionErrors.sub_sections?.[subSectionIndex]) {
    targetErrors = sectionErrors.sub_sections[subSectionIndex];
    fieldPrefix = `sections[${sectionIndex}].sub_sections[${subSectionIndex}]`;
  }

  // Common field order priority for better UX
  const fieldPriority = ['name', 'type', 'content.title.en', 'content.title.ar', 'content.subtitle.en', 'content.subtitle.ar', 'content.description.en', 'content.description.ar', 'image_desktop', 'image_mobile', 'icon', 'images', 'video_desktop', 'video_poster_desktop', 'video_mobile', 'video_poster_mobile', 'button_type', 'button_text.en', 'button_text.ar', 'button_data', 'model_data'];

  // First, check priority fields
  for (const field of fieldPriority) {
    if (getNestedError(targetErrors, field)) {
      return `${fieldPrefix}.${field}`;
    }
  }

  // If no priority field has error, find first error field
  const firstErrorField = findFirstErrorField(targetErrors);
  if (firstErrorField) {
    return `${fieldPrefix}.${firstErrorField}`;
  }

  return null;
}

function getNestedError(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function findFirstErrorField(obj: any, prefix: string = ''): string | null {
  if (!obj || typeof obj !== 'object') return null;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const currentPath = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      if (typeof value === 'string' && value.length > 0) {
        // This is an error message
        return currentPath;
      } else if (typeof value === 'object' && value !== null) {
        // Recursively check nested objects
        const nestedError = findFirstErrorField(value, currentPath);
        if (nestedError) return nestedError;
      }
    }
  }

  return null;
}

export function scrollToAccordionError(
  error: boolean,
  ref: React.RefObject<HTMLDivElement>,
  errors: any,
  sections: any[],
  setExpanded: React.Dispatch<React.SetStateAction<number>>,
  setSubSectionExpanded?: (sectionIndex: number, subSectionIndex: number) => void,
  errorMsg?: string
) {
  if (error) {
    const errorInfo = findFirstAccordionWithError(errors, sections);

    if (errorInfo.sectionIndex !== -1) {
      // Open the main section accordion
      setExpanded(errorInfo.sectionIndex);

      // If there's a sub-section error, also open that sub-section
      if (errorInfo.subSectionIndex !== undefined && setSubSectionExpanded) {
        setSubSectionExpanded(errorInfo.sectionIndex, errorInfo.subSectionIndex);
      }

      // Find the first error input field
      const firstErrorField = findFirstErrorInputField(errors, errorInfo.sectionIndex, errorInfo.subSectionIndex);

      // Wait for accordions to open, then scroll to the error field
      // Use requestAnimationFrame and timeout for better timing
      const scrollToError = () => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            let targetElement: Element | null = null;

            if (firstErrorField) {
              // Try to find the input field with error
              const fieldSelectors = [
                `[name="${firstErrorField}"]`,
                `[name="${firstErrorField.replace(/\[(\d+)\]/g, '.$1')}"]`,
                `.field-${firstErrorField.replace(/[[\].]/g, '-')}`,
                `#field-${firstErrorField.replace(/[[\].]/g, '-')}`
              ];

              for (const selector of fieldSelectors) {
                targetElement = document.querySelector(selector);
                if (targetElement) break;
              }
            }

            // If we can't find the specific field, fall back to accordion
            if (!targetElement) {
              if (errorInfo.subSectionIndex !== undefined) {
                targetElement = document.querySelector(`[data-sub-accordion-index="${errorInfo.sectionIndex}-${errorInfo.subSectionIndex}"]`);
              }
              if (!targetElement) {
                targetElement = document.querySelector(`[data-accordion-index="${errorInfo.sectionIndex}"]`);
              }
            }

            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

              // If it's an input field, also focus it after a small delay
              if (targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA') {
                setTimeout(() => {
                  (targetElement as HTMLInputElement | HTMLTextAreaElement).focus();
                }, 300);
              }
            } else {
              // Final fallback to form ref
              ref?.current?.scrollIntoView({ behavior: 'smooth' });
            }
          }, 200); // Additional buffer for accordion animations
        });
      };

      // Wait for main accordion to open
      setTimeout(() => {
        if (errorInfo.subSectionIndex !== undefined) {
          // If sub-section, wait a bit more for nested accordion
          setTimeout(scrollToError, 400);
        } else {
          // If main section only, scroll sooner
          setTimeout(scrollToError, 200);
        }
      }, 300);
    } else {
      ref?.current?.scrollIntoView({ behavior: 'smooth' });
    }

    toast.error(errorMsg || `Please fill all required fields`);
  }
}
