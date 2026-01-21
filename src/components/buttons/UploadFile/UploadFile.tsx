import { useState, useRef } from 'react';
import { axiosInstance } from '../../../config/axiosConfig';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify

export default function UploadFile({
  endpoint,
  children,
  customClass,
  onUploadSuccess,
  onUploadError,
  acceptedFileTypes = '*/*'
}: {
  endpoint: string;
  children?: any;
  customClass?: string;
  onUploadSuccess?: (response: any) => void;
  onUploadError?: (error: any) => void;
  acceptedFileTypes?: string;
}) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await uploadFile(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  async function uploadFile(file: File) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('spec_file', file);

      const response = await axiosInstance.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(t('file_uploaded_successfully'));
      onUploadSuccess?.(response.data);
    } catch (error) {
      toast.error(t('file_upload_failed'));
      onUploadError?.(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept={acceptedFileTypes} style={{ display: 'none' }} />

      <Button customClass={customClass || ''} onClick={handleButtonClick} loading={loading} type="button" text={children || t('upload_file')} />
    </>
  );
}
