import { Fragment, useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IFormUpload } from '../../types/Interfaces';
import { useTranslation } from 'react-i18next';
import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useField, ErrorMessage, getIn } from 'formik';
import { deleteIcon, fileIcon, uploadIcon } from '../../config/variables';
import { IMAGE_SIZE_LIMIT } from '../../utils/constants';

const ItemType = 'IMAGE';

const FormGalleryUpload = (props: IFormUpload) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <FormGalleryUploadContent {...props} />
    </DndProvider>
  );
};

const FormGalleryUploadContent = ({ errors, formik, name, label, touched, disabled }: IFormUpload) => {
  const [error, setError] = useState<string>();
  const { t } = useTranslation();
  const [field, meta, helpers] = useField({ name: name });
  
  // Get error from Formik if not passed as prop
  const fieldError = errors || (meta.touched && meta.error ? meta.error : '');
  const fieldTouched = touched !== undefined ? touched : meta.touched;
  
  // Apply error styling when there's an error
  const hasError = (fieldError || meta.error) && (fieldTouched || meta.touched);
  const filesFormat = useMemo(() => {
    return [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
      'image/svg+xml'
    ];
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError('');

      let newFiles = acceptedFiles.filter((newFile) => {
        return filesFormat.includes(newFile.type) && newFile.size <= IMAGE_SIZE_LIMIT * 1024 * 1024;
      });

      if (newFiles?.length < acceptedFiles.length) {
        setError(t("some_files_are_invalid"));
        return;
      }

      newFiles = acceptedFiles.filter((newFile) => {
        return !(field.value || []).some((existingFile: File) => existingFile.name === newFile.name);
      });

      const updatedFiles = [...(field.value || []), ...newFiles];

      helpers.setValue(updatedFiles as any);
      formik.setFieldValue(`${name}`, updatedFiles);
    },
    [filesFormat, formik, name, field.value, helpers, t]
  );

  const moveImage = (fromIndex: number, toIndex: number) => {
    const updatedList = [...field.value];
    const [movedImage] = updatedList.splice(fromIndex, 1);
    updatedList.splice(toIndex, 0, movedImage);
    helpers.setValue(updatedList as any);
  };

  const findCard = useCallback(
    (item: File) => {
      const currFile = field.value?.find((ele: File) => JSON.stringify(item) === JSON.stringify(ele));
      return {
        item,
        index: field?.value?.indexOf(currFile)
      };
    },
    [field?.value]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true
  });

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {label && (
        <div className="header undefined" style={{ marginBottom: '1rem' }}>
          <h5 className="title">{label}</h5>
        </div>
      )}
      <div
        className={`drag-image-container gallery multiple ${field.value?.length > 0 ? 'hasFile' : ''} ${field.value?.length > 0 && 'images-added build-form'} ${hasError && 'drag-error-container'} ${disabled ? 'disabled default-cursor' : ''}`}
      >
        {field.value?.length > 0 && (
          <div className="images-wrapper">
            {field.value?.map((file: File, index: number) => {
              return (
                <DraggableImage
                  key={file.name}
                  file={file}
                  index={index}
                  removeImage={() => {
                    const updatedList = [...field.value];
                    updatedList.splice(index, 1);
                    helpers.setValue(updatedList as any);
                  }}
                  findCard={findCard}
                  moveImage={moveImage}
                  disabled={disabled}
                />
              );
            })}
          </div>
        )}
        {!disabled ? (
          <div className="drag-wrapper" {...getRootProps()}>
            <input {...getInputProps()} />
            {field?.value?.length > 0 ? (
              <div className="uploadIcon">
                {uploadIcon}
                <div className="tooltip-box">{<p className="desc">{t('upload')}</p>}</div>
              </div>
            ) : (
              <Fragment>
                <p className="types">JPG, PNG, JPEG, WebP, SVG</p>
                <span className="types">{t('max_size', {size: IMAGE_SIZE_LIMIT})}</span>
              </Fragment>
            )}
          </div>
        ) : (
          disabled &&
          !field?.value?.length && (
            <div className="drag-wrapper">
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {fileIcon}
                <p>{t('no_file_uploaded')}</p>
              </div>
            </div>
          )
        )}
      </div>
      <p className="drag-error builder">
        {error || (formik && name ? <ErrorMessage name={name} /> : (fieldError && fieldTouched ? fieldError : ''))}
      </p>
    </div>
  );
};

export default FormGalleryUpload;

const DraggableImage = ({
  file,
  index,
  removeImage,
  findCard,
  moveImage,
  disabled
}: {
  file: File | { url: string };
  index: number;
  removeImage?: () => void;
  findCard: any;
  moveImage: any;
  disabled?: boolean;
}) => {
  const originalIndex = findCard(file).index;

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemType,
      item: { file, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      }),
      end: (item, monitor) => {
        const { file: droppedFile, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          const currIndex = findCard(droppedFile).index;
          moveImage(currIndex, originalIndex);
        }
      }
    }),
    [file, originalIndex, moveImage]
  );

  const [, drop] = useDrop(
    () => ({
      accept: ItemType,
      hover: (item: any) => {
        if (JSON.stringify(item?.file) !== JSON.stringify(file)) {
          const { index: overIndex } = findCard(file);
          const { index: fromIndex } = findCard(item?.file);
          moveImage(fromIndex, overIndex);
        }
      }
    }),
    [findCard, moveImage]
  );

  let fileURL = '';
  let keyValue = '';

  if (typeof file === 'string') {
    fileURL = file;
    keyValue = file;
  } else if (typeof file === 'object' && file !== null && 'url' in file) {
    fileURL = file.url;
    keyValue = file.url;
  } else {
    fileURL = URL.createObjectURL(file as File);
    keyValue = (file as File).name;
  }

  return (
    <div
      ref={disabled ? undefined : (node) => drag(drop(node))}
      key={keyValue}
      className={`img-container ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <img alt={`img-${index}`} src={fileURL} />
      {removeImage && !disabled && (
        <div className="remove-icon" onClick={removeImage}>
          {deleteIcon}
        </div>
      )}
    </div>
  );
};
