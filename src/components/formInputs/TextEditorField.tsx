import React, { useRef, useCallback, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useFormikContext, useField } from 'formik';
import { useTranslation } from 'react-i18next';
import { ITextEditorFieldProps } from '../../types/Interfaces';
import { TOptions } from '../../types/types';
import CheckboxesSkeleton from '../loaders/CheckboxesSkeleton';

export const TextEditorField: React.FC<ITextEditorFieldProps> = ({ variables = [], variablesLoading = false, ...props }) => {
  const { setFieldValue } = useFormikContext<any>();
  const [field] = useField(props);
  const editorRef = useRef<any>(null);
  const { t } = useTranslation();

  // Your existing variable handling methods remain the same...
  const createVariableSpan = (variableValue: string): string => {
    return `<span
      class="variable-token"
      contenteditable="false"
      data-variable="${variableValue}"
    >{{${variableValue}}}</span>`;
  };

  const processVariablesInContent = useCallback(
    (content: string): string => {
      const variablePattern = /\{\{([^}]+)\}\}/g;
      return content.replace(variablePattern, (match, variableValue) => {
        const trimmedValue = variableValue.trim();
        const variableExists = variables.some((v) => v.value === trimmedValue);
        if (variableExists || variables.length === 0) {
          return createVariableSpan(trimmedValue);
        }
        return match;
      });
    },
    [variables]
  );

  const insertVariable = (variable: TOptions): void => {
    if (editorRef.current?.editor && variable.value) {
      const variableSpan = createVariableSpan(variable.value as string);
      editorRef.current.editor.insertContent(variableSpan);
    }
  };

  const handleEditorChange = (content: string) => {
    setFieldValue(field.name, content);
  };

  const handleEditorInit = (_: any, editor: any) => {
    editorRef.current = { editor };

    // Your existing event handlers for variables...
    editor.on('keydown', (e: KeyboardEvent) => {
      const selection = editor.selection;
      const selectedNode = selection.getNode();

      if (selectedNode && (selectedNode.classList?.contains('variable-token') || selectedNode.closest?.('.variable-token'))) {
        if ([37, 38, 39, 40, 27].includes(e.keyCode)) {
          return true;
        }
        e.preventDefault();
        return false;
      }
    });

    editor.on('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.classList?.contains('variable-token')) {
        editor.selection.select(target);
      }
    });

    editor.on('paste', (e: any) => {
      setTimeout(() => {
        const content = editor.getContent();
        const processedContent = processVariablesInContent(content);
        if (processedContent !== content) {
          editor.setContent(processedContent);
        }
      }, 10);
    });
  };

  return (
    <div className="text-editor-container">
      {variablesLoading ? (
        <div className="variables-box" style={{ marginBottom: '10px' }}>
          <div className="variables-header">
            <span className="variables-title">{t('available_variables')}</span>
          </div>
          <CheckboxesSkeleton columns={9} rows={2} withoutTitles />
        </div>
      ) : (
        variables.length > 0 && (
          <div className="variables-box" style={{ marginBottom: '10px' }}>
            <div className="variables-header">
              <span className="variables-title">{t('available_variables')}</span>
            </div>
            <div className="variables-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {variables.map((variable, index) => (
                <button key={index} type="button" onClick={() => insertVariable(variable)} className="variable-button">
                  {variable.label}
                </button>
              ))}
            </div>
          </div>
        )
      )}

      <div className="editor-wrapper">
        <Editor
          tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@7.2.0/tinymce.min.js"
          licenseKey="gpl"
          onInit={handleEditorInit}
          value={field.value || ''}
          onEditorChange={handleEditorChange}
          init={{
            height: 700,
            ui_mode: 'split',
            // Enable only free TinyMCE plugins
            plugins: [
              // Core editing plugins (free)
              'anchor',
              'autolink',
              'charmap',
              'codesample',
              'emoticons',
              'image',
              'link',
              'lists',
              'media',
              'searchreplace',
              'table',
              'visualblocks',
              'wordcount',

              // Layout and formatting (free)
              'code',
              'directionality',
              'fullscreen',
              'help',
              'insertdatetime',
              'nonbreaking',
              'pagebreak',
              'preview',
              'quickbars',
              'save',
              'visualchars',
              'textcolor',

              // Advanced plugins (free)
              'advlist',
              'autoresize'
            ],

            // Comprehensive toolbar configuration (free features only)
            toolbar: [
              // First row - Basic formatting and styles
              'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough forecolor backcolor align',

              // Second row - Advanced formatting
              'subscript superscript removeformat charmap emoticons | fullscreen preview code',

              // Third row - Lists, indentation and media
              'bullist numlist outdent indent | table link image media codesample | insertdatetime',

              // Fourth row - Advanced tools
              'searchreplace'
            ].join(' | '),

            // Enhanced menubar with all options
            menubar: 'file edit view insert format tools table help',

            // Custom menu configurations (free features only)
            menu: {
              file: {
                title: 'File',
                items: 'newdocument | preview | print'
              },
              edit: {
                title: 'Edit',
                items: 'undo redo | cut copy paste | selectall | searchreplace'
              },
              view: {
                title: 'View',
                items: 'code | visualchars visualblocks | preview fullscreen'
              },
              insert: {
                title: 'Insert',
                items: 'image link media codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor | insertdatetime'
              },
              format: {
                title: 'Format',
                items: 'bold italic underline strikethrough superscript subscript | blocks fontfamily fontsize align | removeformat'
              },
              tools: {
                title: 'Tools',
                items: 'code wordcount'
              },
              table: {
                title: 'Table',
                items: 'inserttable | cell row column | tableprops deletetable'
              },
              help: {
                title: 'Help',
                items: 'help'
              }
            },

            // Enhanced configurations (free features only)
            contextmenu: 'link image table',
            quickbars_selection_toolbar: 'bold italic | h2 h3 blockquote',
            quickbars_insert_toolbar: 'image table media codesample',

            // Advanced features
            autoresize_bottom_margin: 16,
            autoresize_overflow_padding: 1,
            max_height: 1000,
            min_height: 700,

            // Image and media settings
            image_advtab: true,
            image_uploadtab: true,
            image_caption: true,
            image_description: false,
            image_dimensions: false,
            image_title: true,

            // Link settings
            link_context_toolbar: true,
            link_assume_external_targets: true,
            target_list: [
              { title: 'None', value: '' },
              { title: 'Same page', value: '_self' },
              { title: 'New page', value: '_blank' },
              { title: 'Parent frame', value: '_parent' },
              { title: 'Full window', value: '_top' }
            ],

            // Table enhancements
            table_use_colgroups: true,
            table_header_type: 'sectionCells',
            table_sizing_mode: 'responsive',

            // Code sample languages
            codesample_languages: [
              { text: 'HTML/XML', value: 'markup' },
              { text: 'JavaScript', value: 'javascript' },
              { text: 'CSS', value: 'css' },
              { text: 'PHP', value: 'php' },
              { text: 'Ruby', value: 'ruby' },
              { text: 'Python', value: 'python' },
              { text: 'Java', value: 'java' },
              { text: 'C', value: 'c' },
              { text: 'C#', value: 'csharp' },
              { text: 'C++', value: 'cpp' },
              { text: 'SQL', value: 'sql' },
              { text: 'JSON', value: 'json' },
              { text: 'TypeScript', value: 'typescript' },
              { text: 'React JSX', value: 'jsx' }
            ],

            // Advanced paste settings (TinyMCE 7.0 compatible)
            paste_data_images: true,
            paste_webkit_styles: 'all',
            paste_merge_formats: true,

            // Accessibility
            a11y_advanced_options: true,

            // Custom font options
            font_family_formats:
              'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',

            font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
            color_map: [
              '#000000',
              'Black',
              '#404041',
              'Gray',
              '#111827',
              'Slate',
              '#1d4ed8',
              'Primary Blue',
              '#0f9d58',
              'Emerald',
              '#f59e0b',
              'Amber',
              '#d93025',
              'Carmine Red',
              '#6d28d9',
              'Royal Purple',
              '#ec4899',
              'Magenta',
              '#fbbf24',
              'Sunset',
              '#ffffff',
              'White'
            ],

            // Content filtering
            valid_elements: '*[*]',
            extended_valid_elements: '*[*]',

            setup: (editor: any) => {
              editor.on('init', () => {
                editor.setContent(field?.value || '');
              });

              editor.on('change', () => {
                setFieldValue(field?.name, editor.getContent());
              });
            }
          }}
        />
      </div>
    </div>
  );
};