import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IFormUpload } from '../../types/Interfaces';
import { useTranslation } from 'react-i18next';
import { deleteIcon, editIcon, fileIcon } from '../../config/variables';
import { ErrorMessage, getIn, useFormikContext } from 'formik';
import { convertFilesToBase64, createFileList } from '../../utils/HelperFunctions';
import Button from '../buttons/Button';
import ExportExcel from '../buttons/ExportExcel/ExportExcel';
import { FILE_SIZE_LIMIT, IMAGE_SIZE_LIMIT, VIDEO_SIZE_LIMIT } from '../../utils/constants';

const FormUpload = ({ video, value, customTypes, name, fileName, label, file, disabled }: IFormUpload) => {
  const [error, setError] = useState<string>();
  const formik = useFormikContext();
  const [innerShownFile, setInnerShownFile] = useState<any>(formik && name ? getIn(formik.values, name) : value || null);
  const { t } = useTranslation();
  const [singleFileType, setSingleFileType] = useState<string>('');
  const filesFormat = video
    ? ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/quicktime', 'video/x-msvideo', 'video/mkv']
    : file
    ? ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    : ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];

  const errors = formik && name ? getIn(formik.errors, name) : '';
  const touched = formik && name ? getIn(formik.touched, name) : '';
    
  useEffect(() => {
    if (value) setInnerShownFile(value);
  }, [value]);

  useEffect(() => {
    async function setImage() {
      if ((formik && name) || value) {
        let file = value || getIn(formik.values, name);
        if (file && file instanceof File) {
          file = await convertFilesToBase64(createFileList([file]));
          setInnerShownFile(file[0]);
        } else {
          setInnerShownFile(file);
        }
      }
    }

    setImage();
  }, [value, formik?.values && getIn(formik.values, name)]);

  useEffect(() => {
    if (errors && touched) {
      setError(errors);
    }
  }, [errors]);

  const sizeLimit = video ? VIDEO_SIZE_LIMIT : file ? FILE_SIZE_LIMIT : IMAGE_SIZE_LIMIT

  const onDrop = useCallback(async (acceptedFiles: any) => {
    if (!filesFormat.includes(acceptedFiles[0].type)) {
      setError(t('file_type_mismatch'));
    } else if (acceptedFiles[0].size > sizeLimit * 1024 * 1024) {
      setError(t('size_limit', {size: sizeLimit}));
    } else {
      const acceptedTypes = acceptedFiles.filter((file: any) => filesFormat.includes(file.type));
      let files = await convertFilesToBase64(acceptedTypes);

      setInnerShownFile((files as [{}])[0]);
      setSingleFileType(acceptedTypes[0].type);
      setError('');
      formik?.setFieldValue(name, acceptedTypes[0]);
    }
  }, [filesFormat]);

  function formatFileName(name: string | undefined) {
    if (!name) return '';
    const maxLength = 10;
    const fileType = name.substring(name?.lastIndexOf('.'));
    const baseName = name.substring(0, name?.lastIndexOf('.'));

    if (baseName.length > maxLength) {
      return baseName.substring(0, 10) + '...' + fileType;
    }
    return name;
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop
  });

  const handleDelete = () => {
    setInnerShownFile('');
    setSingleFileType('');
    setError('');
    formik.setFieldValue(`${name}`, null);
  };

  const fileNameStr = useMemo(() => {
    let nameStr = value || getIn(formik?.values, name);
    if (innerShownFile instanceof File) nameStr = innerShownFile?.name;

    if (typeof nameStr === 'string') {
      if (nameStr?.length > 15) {
        return formatFileName(nameStr?.split('/')?.pop());
      } else {
        return nameStr;
      }
    } else {
      return fileName;
    }
  }, [innerShownFile, fileName]);

  function downloadFile(data: any, fileName: string) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', (fileName || 'PDF') + '.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // window.URL.revokeObjectURL(url);
  }

  return (
    <>
      {label && (
        <div className="header undefined" style={{ marginBottom: '1rem' }}>
          <h5 className="title">{label}</h5>
        </div>
      )}
      <div
        className={`drag-image-container ${file && 'hasFile'} ${innerShownFile && 'images-added build-form'} ${errors && touched && 'drag-error-container'} ${disabled ? 'disabled default-cursor' : 'clickable'}`}
      >
        {innerShownFile ? (
          <Fragment>
            <div className="images-wrapper">
              {!video && !file ? (
                <div className="img-container ">
                  <img alt={'img'} src={innerShownFile} />
                </div>
              ) : video ? (
                <div className="img-container ">
                  <video controls width="100%" height="auto">
                    <source src={innerShownFile} type={singleFileType} />
                    {t('videoNotSupported')}
                  </video>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: disabled ? '.6' : '' }}>
                    {fileIcon}
                    <p>{fileNameStr ? formatFileName(fileNameStr) : t('fileUploaded')}</p>
                  </div>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    {typeof innerShownFile == 'string' && !innerShownFile.includes('data:') && (
                      <ExportExcel
                        downloadFileCustomFun={downloadFile}
                        customClass="small"
                        endpoint="/admin/download-file"
                        data={{ url: innerShownFile || '' }}
                        fileName="file"
                        post
                      >
                        {t("download")}
                      </ExportExcel>
                    )}
                    <Button
                      text={t('view')}
                      onClick={() => {
                        window.open(innerShownFile, '_blank');
                      }}
                      type="button"
                      customClass="small"
                    />
                  </div>
                </div>
              )}
            </div>
            {!disabled && (
              <Fragment>
                <div className={`edit-icon`} {...getRootProps()}>
                  <input {...getInputProps()} />
                  {editIcon}
                </div>
                <div className={`delete-icon`} onClick={handleDelete} style={{ cursor: 'pointer' }}>
                  {deleteIcon}
                </div>
              </Fragment>
            )}
          </Fragment>
        ) : disabled ? (
          <div className="drag-wrapper">
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: disabled ? '.6' : '' }}>
              {fileIcon}
              <p>{t('no_file_uploaded')}</p>
            </div>
          </div>
        ) : (
          <div {...getRootProps()} className="drag-wrapper clickable">
            <input {...getInputProps()} />

            <p className="fileName">{fileName ? formatFileName(fileName) : t('drag')}</p>

            <p className="types">{customTypes || (video ? "MP4, WebM, OGG, AVI, MOV, MKV" : file ? "JPG, PNG, JPEG, WebP, SVG, PDF, DOC, DOCX" : "JPG, PNG, JPEG, WebP, SVG")}</p>
            <span className="types">{t('max_size', {size: sizeLimit})}</span>
          </div>
        )}
      </div>
      <p className="drag-error builder">{error || (formik && name ? <ErrorMessage name={name} /> : '')}</p>
    </>
  );
};
export default FormUpload;
